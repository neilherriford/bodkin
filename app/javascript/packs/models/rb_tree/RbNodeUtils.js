import * as TYPE from './RbNodeType';

export const getRoot = (node) => {
  if(node === null) return null;
  let current = node;
  while(true) {
    if(current.parent === null) return current;
    current = current.parent;
  }
};

export const flatten = (root) => {
  const result = [];
  let maxDepth = Number.NEGATIVE_INFINITY;

  const pancake = (node, index, depth) => {
    if(node === null) return;
    maxDepth = Math.max(depth, maxDepth);

    result[index] = node;
    const leftIndex = (index * 2) + 1;
    const rightIndex = (index * 2) + 2;

    pancake(node.left, leftIndex, depth + 1);
    pancake(node.right, rightIndex, depth + 1);
  };
  pancake(root, 0, 1);
  result.length = Math.pow(2, maxDepth) - 1;
  return result;
};

export const build = (...nodes) => {
  const leftIndex = (index) => (index * 2) + 1;
  const rightIndex = (index) => (index * 2) + 2;

  for(let index = 0; index < nodes.length; ++index) {
    let current = nodes[index];
    let leftChild = nodes[leftIndex(index)];
    let rightChild = nodes[rightIndex(index)];

    if(leftChild) current.setLeft(leftChild);
    if(rightChild) current.setRight(rightChild);
  }
};

const prettyPrinter = (flattened, widths) => {
  let depth = 0;
  let result = '';
  while(true) {
    let start = (1 << depth) - 1;
    let end = (1 << (depth + 1)) - 1;
    if(start >= flattened.length) break;
    let st = '';
    for(let i = start; i < end; ++i) {
      let value;
      if(flattened[i] === undefined) {
        value = `u⚫️`;
      } else {
        const decorator = flattened[i].type === TYPE.RED ? '🔴' : '⚫️';
        value = `${flattened[i].value}${decorator}`;
      }
      let totalWidth = widths[i];
      const leftWidth = widths[(i * 2) + 1];
      const rightWidth = widths[(i * 2) + 2];
      const halfValueWidth  = Math.floor(value.length / 2);
      let leftPad;

      if(halfValueWidth < leftWidth) {
        leftPad = leftWidth - halfValueWidth;
      } else if(halfValueWidth < rightWidth) {
        leftPad = leftWidth + halfValueWidth;
      } else {
        leftPad = Math.floor((totalWidth - value.length) / 2);
      }

      st += `${''.padStart(leftPad, '.')}${value}`.padEnd(totalWidth, '.');
    }
    result += st;
    result += '\n';
    ++depth;
  }

  return result;
};

const calculateWidths = (node, id, buffer) => {
  if(buffer[id]) return buffer[id];
  if(node === undefined) {
    buffer[id] = 3;
    return buffer[id];
  }

  if(node.left === null && node.right === null) {
    buffer[id] = `${node.value}`.length + 2;
    return buffer[id];
  }
  let length = 0;
  const leftId = (id * 2) + 1;
  const rightId = (id * 2) + 2;

  if(node.left) length += calculateWidths(node.left, leftId, buffer);
  if(node.right) length += calculateWidths(node.right, rightId, buffer);
  buffer[id] = Math.max(length, `${node.value}`.length + 3);
  return buffer[id];
};

export const prettyPrint = (flattenedNodes) => {
  const widths = [];
  calculateWidths(flattenedNodes[0], 0, widths);
  return prettyPrinter(flattenedNodes, widths);
};
