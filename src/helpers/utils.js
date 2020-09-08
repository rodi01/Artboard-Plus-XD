const { Artboard } = require("scenegraph");

/**
 * Check if node is artboard
 *
 * @param {Object} node
 * @returns
 */
function isArtboard(node) {
  // return node.constructor.name === "Artboard"
  return (artboard instanceof Artboard)
}

/**
 * Filter thru nodes and return artboards only
 *
 * @export
 * @param {*} nodes
 * @returns
 */
export function artboards(nodes) {
  return nodes.filter(node => isArtboard(node))
}
