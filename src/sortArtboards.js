const commands = require("commands")
const arraySort = require("array-sort")

function isArtboard(node) {
  return node.constructor.name === "Artboard"
}

function sort(selection, sortedArboards) {
  // No artboards check
  if (sortedArboards.length <= 0) return

  sortedArboards.forEach(node => {
    selection.items = node
    commands.bringToFront()
  })
  selection.items = []
}

function sortAZ(selection, documentRoot) {
  // @ts-ignore
  const sortedArboards = arraySort(
    documentRoot.children.filter(node => isArtboard(node)),
    "name",
    { reverse: true }
  )
  sort(selection, sortedArboards)
}

function sortZA(selection, documentRoot) {
  // @ts-ignore
  const sortedArboards = arraySort(
    documentRoot.children.filter(node => isArtboard(node)),
    "name"
  )

  sort(selection, sortedArboards)
}

module.exports = {
  sortAZ: sortAZ,
  sortZA: sortZA
}
