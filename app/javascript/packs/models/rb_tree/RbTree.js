import defaultComparer from '../Comparer';
import Node, {bstInsert, repair} from './RbNode';
import {getRoot} from './RbNodeUtils';

/**
 * Balanced Binary search tree
 */
export default class RedBlackTree {
  constructor(comparer = Comparer.DEFAULT) {
    this.compare = comparer;
    this.root = null;
  }

  /**
   * Adds a value to the tree.  May not be unique.
   * @param  value The value to insert
   */
  insert(value) {
    const leaf = bstInsert(this.root, value, this.compare);
    repair(leaf);
    this.root = getRoot(leaf);
  }
}
