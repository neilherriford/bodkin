import Node, {bstInsert, rebalance} from './RbNode.js';
import * as TYPE from './RbNodeType.js';
import {defaultComparer} from '../Comparer';
import {flatten, getRoot, build, prettyPrint} from './RbNodeUtils';

describe('Node', () => {
  test('Should not detach the root', () => {
    const foo = new Node('foo');
    const bar = foo.setLeft(new Node('bar'));

    const detached = foo.detach();
    expect(detached).toEqual(foo);
  });

  test('Should detach node', () => {
    const foo = new Node('foo');
    const bar = foo.setLeft(new Node('bar'));
    const baz = bar.setRight(new Node('baz'));

    const detached = bar.detach();
    expect(detached).toEqual(foo);
    expect(detached.left).toBeNull();
    expect(bar.right).toEqual(baz);
    expect(bar.parent).toBeNull();
  });

  test('Should throw when detaching and the tree is in an invalid state', () => {
    const root = new Node('root');
    const invalidNode = new Node('invalidNode');
    invalidNode.parent = root;

    expect(() => invalidNode.detach()).toThrow();
  });

  test('Should not allow a replacement if null', () => {
    const root = new Node('root');
    const foo = root.setLeft(new Node('foo'));
    const bar = root.setRight(new Node('bar'));

    expect(() => root.replace(null, new Node('baz'))).toThrow();
  });

  test('Should allow replacting the existing node with a null value', () => {
    const root = new Node('root');
    const foo = root.setLeft(new Node('foo'));
    const bar = root.setRight(new Node('bar'));

    root.replace(foo, null);
    const actual = flatten(root);
    const expected = [
              root,
      undefined,  bar
    ];

    expect(actual).toEqual(expected);
  });

  test('Should replace left leaf', () => {
    const root = new Node('root');
    const foo = root.setLeft(new Node('foo'));
    const bar = root.setRight(new Node('bar'));
    const replcement = new Node('replacement');

    root.replace(foo, replcement);
    const actual = flatten(root);
    const expected = [
              root,
      replcement,  bar
    ];

    expect(actual).toEqual(expected);
    expect(replcement.parent).toEqual(root);
  });

  test('Should replace right leaf', () => {
    const root = new Node('root');
    const foo = root.setLeft(new Node('foo'));
    const bar = root.setRight(new Node('bar'));
    const replcement = new Node('replacement');

    root.replace(bar, replcement);
    const actual = flatten(root);
    const expected = [
         root,
      foo,  replcement
    ];

    expect(actual).toEqual(expected);
    expect(replcement.parent).toEqual(root);
  });

  test('Should throw when replacing and the tree is in an invalid state', () => {
    const root = new Node('root');
    const foo = new Node('foo');
    foo.parent = root;
    const bar = root.setRight(new Node('bar'));
    const replcement = new Node('replacement');

    expect(() => root.replace(foo, replcement)).toThrow();
  });

  test('Should not allow a left rotation without a right child', () => {
    const foo = new Node('foo');
    const bar = foo.setLeft(new Node('bar'));

    expect(() => foo.rotateLeft()).toThrow();
  });

  /*
                Root
          ┌──────┴──────┐
         Foo           Bar
      ┌───┴───┐     ┌───┴───┐
      Baz    Qux  Corge   Fred
   */
  test('Should rotate the root left', () => {
    const root = new Node('root');
    const foo = root.setLeft(new Node('foo'));
    const bar = root.setRight(new Node('bar'));
    const baz = foo.setLeft(new Node('baz'));
    const qux = foo.setRight(new Node('qux'));
    const corge = bar.setLeft(new Node('corge'));
    const fred = bar.setRight(new Node('fred'));
    const newRoot = root.rotateLeft();
    let actual = flatten(newRoot);
    let u = undefined;

    expect(actual).toEqual([
                     bar,
            root,            fred,
        foo,     corge,    u,    u,
      baz, qux,  u, u,   u, u,  u, u,
    ]);
  });

  /*
                Root
          ┌──────┴──────┐
         Foo           Bar
      ┌───┴───┐     ┌───┴───┐
      Baz    Qux  Corge   Fred
   */
  test('Should rotate leaf left', () => {
    const root = new Node('root');
    const foo = root.setLeft(new Node('foo'));
    const bar = root.setRight(new Node('bar'));
    const baz = foo.setLeft(new Node('baz'));
    const qux = foo.setRight(new Node('qux'));
    const corge = bar.setLeft(new Node('corge'));
    const fred = bar.setRight(new Node('fred'));
    const newRoot = bar.rotateLeft();
    let u = undefined;
    const actual = flatten(root);
    const expected = [
                     root,
            foo,                fred,
        baz,     qux,      bar,       u,
       u, u,     u, u,   corge, u,   u, u
    ];

    expect(actual).toEqual(expected);
  });

  test('Should not allow a right rotation without a left child', () => {
    const foo = new Node('foo');
    const bar = foo.setRight(new Node('bar'));

    expect(() => foo.rotateRight()).toThrow();
  });

  /*
                Root
          ┌──────┴──────┐
         Foo           Bar
      ┌───┴───┐     ┌───┴───┐
      Baz    Qux  Corge   Fred
   */
  test('Should rotate the root right', () => {
    const root = new Node('root');
    const foo = root.setLeft(new Node('foo'));
    const bar = root.setRight(new Node('bar'));
    const baz = foo.setLeft(new Node('baz'));
    const qux = foo.setRight(new Node('qux'));
    const corge = bar.setLeft(new Node('corge'));
    const fred = bar.setRight(new Node('fred'));
    const newRoot = root.rotateRight();
    let actual = flatten(newRoot);
    let u = undefined;
    const expected = [
                   foo,
            baz,           root,
         u,     u,    qux,        bar,
        u,u,   u,u,  u,  u,  corge, fred,
    ];
    expect(actual).toEqual(expected);
  });

  /*
                Root
          ┌──────┴──────┐
         Foo           Bar
      ┌───┴───┐     ┌───┴───┐
      Baz    Qux  Corge   Fred
   */
  test('Should rotate a leaf right', () => {
    const root = new Node('root');
    const foo = root.setLeft(new Node('foo'));
    const bar = root.setRight(new Node('bar'));
    const baz = foo.setLeft(new Node('baz'));
    const qux = foo.setRight(new Node('qux'));
    const corge = bar.setLeft(new Node('corge'));
    const fred = bar.setRight(new Node('fred'));
    const newRoot = bar.rotateRight();
    let actual = flatten(root);
    let u = undefined;
    const expected = [
                  root,
          foo,          corge,
       baz, qux,      u,     bar,
       u,u, u,u,     u,u,   u, fred
    ];
    expect(actual).toEqual(expected);
  });
});

describe('BST Insert', () => {
  test('should insert into empty tree', () => {
    let root = null;
    const leaf = bstInsert(root, 10, defaultComparer);

    expect(leaf.value).toEqual(10);
  });

  test('should insert smaller values', () => {
    let root = new Node(100);
    const leaf1 = bstInsert(root, 10, defaultComparer);
    const leaf2 = bstInsert(root, 1, defaultComparer);
    const u = undefined;
    const expected = [
           root,
        leaf1,   u,
      leaf2, u, u,u
    ];

    expect(expected).toEqual(flatten(root));
  });

  test('should insert larger values', () => {
    let root = new Node(1);
    const leaf1 = bstInsert(root, 10, defaultComparer);
    const leaf2 = bstInsert(root, 100, defaultComparer);
    const u = undefined;

    const expected = [
         root,
       u,   leaf1,
      u,u, u, leaf2,
    ];

    expect(expected).toEqual(flatten(root));
  });

  test('should insert equal values', () => {
    let root = new Node(10);
    const leaf = bstInsert(root, 10, defaultComparer);

    expect(root.left.value).toEqual(10);
  });
});

describe('Rebalance', () => {
  test('Should repair new tree', () => {
    const root = new Node(10, TYPE.RED);
    rebalance(root);
    expect(root.type).toEqual(TYPE.BLACK);
  });

  test('Should repair red aunt', () => {
    const grandParent = new Node('grandParent', TYPE.BLACK);
    const aunt = new Node('aunt', TYPE.RED);
    const parent = new Node('parent', TYPE.RED);
    const leaf = new Node('leaf', TYPE.RED);
    const u = undefined;

    build(
        grandParent,
       parent,   aunt,
      leaf, u,   u, u
    );

    rebalance(leaf);
    const expected = [
        grandParent,
       parent,   aunt,
      leaf, u,   u, u
    ];

    expect(expected).toEqual(flatten(grandParent));
    expect(grandParent.type).toEqual(TYPE.BLACK);
    expect(aunt.type).toEqual(TYPE.BLACK);
    expect(parent.type).toEqual(TYPE.BLACK);
    expect(leaf.type).toEqual(TYPE.RED);
  });

  test('Should repair black aunt (LL)', () => {
    const grandParent = new Node('grandParent', TYPE.BLACK);
    const aunt = new Node('aunt', TYPE.BLACK);
    const parent = new Node('parent', TYPE.RED);
    const leaf = new Node('leaf', TYPE.RED);
    const u = undefined;

    build(
        grandParent,
       parent,   aunt,
      leaf, u,   u, u
    );
    rebalance(leaf);
    const expected = [
          parent,
       leaf,  grandParent,
       u, u,  u,     aunt
    ];

    expect(expected).toEqual(flatten(getRoot(leaf)));
    expect(parent.type).toEqual(TYPE.BLACK);
    expect(leaf.type).toEqual(TYPE.RED);
    expect(grandParent.type).toEqual(TYPE.RED);
    expect(aunt.type).toEqual(TYPE.BLACK);
  });

  test('Should repair black aunt (LR)', () => {
    const grandParent = new Node('grandParent', TYPE.BLACK);
    const aunt = new Node('aunt', TYPE.BLACK);
    const parent = new Node('parent', TYPE.RED);
    const leaf = new Node('leaf', TYPE.RED);
    const u = undefined;

    build(
        grandParent,
       parent,   aunt,
       u, leaf,  u, u
    );
    rebalance(leaf);
    const expected = [
             leaf,
       parent,  grandParent,
       u,   u,  u,     aunt
    ];

    expect(expected).toEqual(flatten(getRoot(leaf)));
    expect(leaf.type).toEqual(TYPE.BLACK);
    expect(parent.type).toEqual(TYPE.RED);
    expect(grandParent.type).toEqual(TYPE.RED);
    expect(aunt.type).toEqual(TYPE.BLACK);
  });

  test('Should repair black aunt (RL)', () => {
    const grandParent = new Node('grandParent', TYPE.BLACK);
    const aunt = new Node('aunt', TYPE.BLACK);
    const parent = new Node('parent', TYPE.RED);
    const leaf = new Node('leaf', TYPE.RED);
    const u = undefined;

    build(
        grandParent,
       aunt,   parent,
       u, u,  leaf, u
    );
    rebalance(leaf);
    const expected = [
             leaf,
       grandParent,  parent,
       aunt,     u,  u,   u
    ];

    expect(expected).toEqual(flatten(getRoot(leaf)));
    expect(leaf.type).toEqual(TYPE.BLACK);
    expect(parent.type).toEqual(TYPE.RED);
    expect(grandParent.type).toEqual(TYPE.RED);
    expect(aunt.type).toEqual(TYPE.BLACK);
  });

  test('Should repair black aunt (RR)', () => {
    const grandParent = new Node('grandParent', TYPE.BLACK);
    const aunt = new Node('aunt', TYPE.BLACK);
    const parent = new Node('parent', TYPE.RED);
    const leaf = new Node('leaf', TYPE.RED);
    const u = undefined;

    build(
        grandParent,
       aunt,   parent,
       u, u,   u, leaf
    );
    rebalance(leaf);
    const expected = [
             parent,
       grandParent,  leaf,
       aunt,     u,  u,   u
    ];

    expect(expected).toEqual(flatten(getRoot(leaf)));
    expect(leaf.type).toEqual(TYPE.RED);
    expect(parent.type).toEqual(TYPE.BLACK);
    expect(grandParent.type).toEqual(TYPE.RED);
    expect(aunt.type).toEqual(TYPE.BLACK);
  });
});
