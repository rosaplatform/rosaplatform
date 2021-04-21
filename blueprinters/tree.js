"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * Each resource item is inserted into a tree. TODO: describe layout.
 *
 * @param  {type} data        list of lists representing sheet data.
 * @return {type} Array       the structured data.
 */
var _default = function _default(data) {
  var tree = {
    key: '_root',
    children: {}
  };
  data.forEach(function (path) {
    var root = path[0];

    if (!tree.children[root]) {
      tree.children[root] = {
        key: root,
        children: {}
      };
    }

    var depth = 1;
    var parentNode = tree.children[root];

    while (depth < path.length) {
      var node = path[depth];

      if (!parentNode.children[node]) {
        parentNode.children[node] = {
          key: node,
          children: {}
        };
      }

      parentNode = parentNode.children[node];
      depth++;
    }
  });
  return tree;
};

exports["default"] = _default;