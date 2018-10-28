/**
 * Check if node is artboard
 *
 * @param {Object} node
 * @returns
 */
function isArtboard(node) {
  return node.constructor.name === "Artboard"
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
