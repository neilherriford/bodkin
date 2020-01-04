import * as COMPARE_RESULT from '../Comparer';
import {flatten, build, getRoot, prettyPrint} from './RbNodeUtils';
import * as TYPE from './RbNodeType';

/**
 * Internal class class representing a red black binary node.  To be used
 * internally by the exported RbTree
 */
export default class Node {
  /**
   * @param   value The node's value
   * @param   type  The node's color
   */
  constructor(value, type = TYPE.RED) {
    this.parent = null;
    this.left = null;
    this.right = null;
    this.type = type;
    this.value = value;
  }

  /**
   * Creates a parent-child relationship on the left side with the provided
   * node.
   * @param {Node} node the new left child.
   */
  setLeft(node) {
    this.left = node;
    if(node === null) return;
    node.parent = this;
    return node;
  }

  /**
   * Creates a parent-child relationship on the right side with the provided
   * node.
   * @param {Node} node the new right child.
   */
  setRight(node) {
    this.right = node;
    if(node === null) return;
    node.parent = this;
    return node;
  }

  /**
   * Removes the current node from the tree, and cleans up it's parent
   * associations.  Detaching the node includes all of it's children.
   * @return {Node} the parent of the detached node.
   */
  detach() {
    if(this.parent === null) return this;
    const parent = this.parent;

    if(this.parent.left === this) {
      this.parent.left = null;
      this.parent = null;
    } else if(this.parent.right === this) {
      this.parent.right = null;
      this.parent = null;
    } else {
      throw 'Invalid operation -- malformed graph';
    }

    return parent;
  }

  /**
   * Replaces the old node with the provided new node, including resetting the
   * parent child relationships depending on which side the oldNode was
   * associated with.
   * @param  {Node} oldNode The node to be replaced
   * @param  {Node} newNode The new node to replace
   * @return {Node}         The node that was replaced.
   */
  replace(oldNode, newNode) {
    if(oldNode === null) throw 'Invalid operation -- old node is null';
    if(oldNode === this.left) {
      this.left.detach();
      this.setLeft(newNode);
      return oldNode;
    }
    if(oldNode === this.right) {
      this.right.detach();
      this.setRight(newNode);
      return oldNode;
    }

    throw 'Invalid operation -- malformed graph';
  }

  /**
   * Preforms a left rotation of this node, returning the new root of the
   * subtree. For example, A.rotateLeft() would transform the tree like so:
   *
   *        A                   C
   *    ┌───┴───┐           ┌───┴───┐
   *    B       C           A       G
   *  ┌─┴─┐   ┌─┴─┐       ┌─┴─┐
   *  D   E   F   G       B   F
   *                    ┌─┴─┐
   *                    D   E
   *
   * @return {node} The new root of this subtree
   */
  rotateLeft() {
    if(this.right === null) throw 'Invalid operation - missing right child';

    const newRoot = this.right;
    if(this.parent) {
      this.parent.replace(this, newRoot);
    } else {
      newRoot.parent = null;
    }
    this.setRight(newRoot.left);
    newRoot.setLeft(this);

    return newRoot;
  }

  /**
   * Preforms a right rotation of this node, returning the new root of the
   * subtree. For example, A.rotateRight() would transform the tree like so:
   *
   *        A                 B
   *    ┌───┴───┐         ┌───┴───┐
   *    B       C         D       A
   *  ┌─┴─┐   ┌─┴─┐             ┌─┴─┐
   *  D   E   F   G             E   C
   *                              ┌─┴─┐
   *                              F   G
   *
   * @return {node} The new root of this subtree
   */
  rotateRight() {
    if(this.left === null) throw 'Invalid operation -- missing left child';
    const newRoot = this.left;

    if(this.parent) {
      this.parent.replace(this, newRoot);
    } else {
      newRoot.parent = null;
    }

    this.setLeft(newRoot.right);
    newRoot.setRight(this);

    return newRoot;
  }
}

const isRed = (node) => node && node.type === TYPE.RED;
const isBlack = (node) => node === null || node.type === TYPE.BLACK;
const isLeftChild = (node) => node && node.parent && node === node.parent.left;
const isRightChild = (node) => node && node.parent && node === node.parent.right;

const auntOf = (node) => {
  const grandParent = grandParentOf(node);
  if(grandParent === null) return null;

  return grandParent.left === node.parent
    ? grandParent.right
    : grandParent.left;
};

const grandParentOf = (node) => {
  if(node === null) return null;

  const parent = node.parent;
  if(parent === null) return null;

  return parent.parent;
};

/**
 * Performs a binary search tree insertion given a root, value and a comparison
 * function.  Equal values are placed on the left side.
 * @param  {Node} root    [description]
 * @param  value   The value to insert.  May not be unique within the tree.
 * @param  compare The comparison function
 * @return {Node}  The newly created leaf node.
 */
export const bstInsert = (root, value, compare) => {
  let current = root;
  const leaf = new Node(value, TYPE.RED);

  if(root === null) return leaf;

  while(true) {
    switch(compare(leaf.value, current.value)) {
      case COMPARE_RESULT.LESS_THAN:
      case COMPARE_RESULT.EQ:
        if(current.left === null) {
          current.setLeft(leaf);
          return leaf;
        }
        current = current.left;
        break;
      case COMPARE_RESULT.GREATER_THAN:
        if(current.right === null) {
          current.setRight(leaf);
          return leaf;
        }
        current = current.right;
        break;
      default:
        throw 'Invalid comparison result';
    }
  }
};

const LEFT_LEFT = Symbol('LEFT_LEFT');
const LEFT_RIGHT = Symbol('LEFT_RIGHT');
const RIGHT_LEFT = Symbol('RIGHT_LEFT');
const RIGHT_RIGHT = Symbol('RIGHT_RIGHT');
const INVALID = Symbol('INVALID');

/**
 * Returns a symbol describing the lineage from the node to it's grandparent.
 *                            A
 *              ┌────────────┴────────────┐
 *              B                         C
 *      ┌──────┴──────┐            ┌──────┴──────┐
 *      D             E            F             G
 * LEFT_LEFT     LEFT_RIGHT   RIGHT_LEFT    RIGHT_RIGHT
 *
 * @param  {Node} node        The deepest node
 * @param  {Node} parent      The middle node
 * @param  {Node} grandParent The highest node
 * @return {Symbol}           Returns either LEFT_LEFT, RIGHT_LEFT, LEFT_RIGHT
 *                            RIGHT_RIGHT as depicted above, or INVALID if the
 *                            any of the provided three nodes are not related
 */
const describeLineage = (node, parent, grandParent) => {
  if(node === null
    || parent === null
    || grandParent === null
    || node.parent !== parent
    || parent.parent !== grandParent) {
    return INVALD;
  }

  if(isLeftChild(parent)) {
    return isLeftChild(node)
      ? LEFT_LEFT
      : LEFT_RIGHT;
  } else {
    return isLeftChild(node)
      ? RIGHT_LEFT
      : RIGHT_RIGHT;
  }
};

/**
 * Given two nodes, trades the type between them.  Used when rebalancing the
 * tree.
 * @param  {Node} left  The left node
 * @param  {Node} right The right node
 */
const swapType = (left, right) => {
  const buffer = left.type;
  left.type = right.type;
  right.type = buffer;
};

/**
 * Rebalances the tree when the given node is in the left-left position.
 *
 *           G⬛️                         P⬛️
 *     ┌─────┴─────┐               ┌─────┴─────┐
 *     P🟥        A⬛️             🅝🟥        G🟥
 *  ┌──┴───┐     ┌┴┐       ➡️     ┌┴┐       ┌──┴───┐
 *  🅝🟥   3     4 5              1 2       3      A⬛️
 * ┌┴┐                                            ┌┴┐
 * 1 2                                            4 5
 *
 * @param  {Node} parent      The parent of the node being rebalanced
 * @param  {Node} grandParent The grandparent of the node being rebalanced
 */
const rebalanceLeftLeft = (parent, grandParent) => {
  grandParent.rotateRight();
  swapType(parent, grandParent);
};

/**
 * Rebalances the tree when the given node is in the right-right position.
 *
 *        G⬛️                          P⬛️
 *  ┌─────┴─────┐                ┌─────┴─────┐
 *  A⬛️         P🟥             G🟥         🅝🟥
 * ┌┴┐       ┌──┴───┐     ➡️  ┌──┴───┐      ┌┴┐
 * 1 2       3      🅝🟥      A⬛️    3      4 5
 *                 ┌┴┐       ┌┴┐
 *                 4 5       1 2
 *
 * @param  {Node} parent      The parent of the node being rebalanced
 * @param  {Node} grandParent The grandparent of the node being rebalanced
 */
const rebalanceRightRight = (parent, grandParent) => {
  grandParent.rotateLeft();
  swapType(parent, grandParent);
};

/**
 * Rebalances the tree when the Aunt is red
 *           G⬛️                          G🟥
 *     ┌─────┴─────┐                ┌─────┴─────┐
 *     P🟥        A🟥               P⬛        A⬛️
 *  ┌──┴───┐     ┌┴┐       ➡️    ┌──┴───┐     ┌┴┐
 *  🅝🟥   3     4 5             🅝🟥   3     4 5
 * ┌┴┐                          ┌┴┐
 * 1 2                          1 2
 *
 * @param  {Node} parent      The parent of the node being rebalanced
 * @param  {Node} aunt        The aunt of the node being rebalanced
 * @param  {Node} grandParent The grandparent of the node being rebalanced
 */
const rebalanceRedAunt = (node, aunt, grandParent) => {
  aunt.type = TYPE.BLACK;
  node.parent.type = TYPE.BLACK;

  grandParent.type = TYPE.RED;
  rebalance(grandParent);
};

/**
 * Rebalances the the tree when the aunt is black, based on the lineage from the
 * node under rebalancing to the parent and the grandparent.  Tries to resolve
 * the tree into either the LEFT_LEFT or RIGHT_RIGHT solutions via a tree
 * rotation, and then repair from the equivilent position.
 *
 * E.g LEFT_RIGHT:
 * First rotate the parent left:
*
 *          G⬛️                             G⬛️
 *    ┌─────┴─────┐                   ┌─────┴─────┐
 *    P🟥        A⬛️                 🅝🟥        A⬛️
 * ┌──┴───┐     ┌┴┐       ➡️      ┌──┴───┐      ┌┴┐
 * 1      🅝🟥  4 5               P🟥    3       4 5
 *       ┌┴┐                     ┌┴┐
 *       2 3                     1 2
 *
 * Now we're in the shape of the base case of the LEFT_LEFT solution, execept
 * the parent and node positions are swapped, so the call's arguments must also
 * be swapped.
 *
 * @param  {Node} node        The node under rebalancng
 * @param  {Node} parent      The parent of the node
 * @param  {Node} grandParent The the grandparent of the node
 */
const rebalanceBlackAunt = (node, parent, grandParent) => {
  switch(describeLineage(node, parent, grandParent)) {
    case LEFT_LEFT:
      rebalanceLeftLeft(parent, grandParent);
    break;
    case LEFT_RIGHT:
      parent.rotateLeft();
      rebalanceLeftLeft(node, grandParent);
    break;
    case RIGHT_LEFT:
      parent.rotateRight();
      rebalanceRightRight(node, grandParent);
    break;
    case RIGHT_RIGHT:
      rebalanceRightRight(parent, grandParent);
    break;
    case INVALID:
      throw 'Invalid lineage';
    break;
  }
};

/**
 * Rebalances the tree starting from the given node.  Once a value is inserted
 * into the tree, it may no longer be balanced, or in violation of the
 * predicates of a Red Black tree:
 *   1. The root is black
 *   2. All leaves (NIL) are black.
 *   3. If a node is red, then both its children are black.
 *   4. Every path from a given node to any of its descendant NIL nodes contains
 *   the same number of black nodes.
 * This method ensures that the tree is balanced (left leaning), and the above
 * rules are upheld.
 * @param  {Node} node The node to begin rebalancing
 */
export const rebalance = (node) => {
  if(node.parent === null && node.type === TYPE.RED) {
    node.type = TYPE.BLACK;
    return;
  }

  if(isRed(node.parent)) {
    const aunt = auntOf(node);
    const parent = node.parent;
    const grandParent = grandParentOf(node);

    if(isRed(aunt)) {
      rebalanceRedAunt(node, aunt, grandParent);
    } else {
      rebalanceBlackAunt(node, parent, grandParent);
    }
  }
};
