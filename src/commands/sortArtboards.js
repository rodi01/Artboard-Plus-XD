import commands from "commands"
import arraySort from "array-sort"
import { artboards } from "../helpers/utils.js"
import dialog from "../lib/dialog"

function sort(selection, artboards, reverse = false) {
  // No artboards check
  if (artboards.length <= 0) {
    dialog.alert(
      "Sort Artboards",
      "You haven't selected any artboards"
    )
    return
  }

  artboards.forEach(node => {
    selection.items = node
    commands.bringToFront()
  })
  selection.items = artboards

}

function sortByXYCoords(aSceneNode, bSceneNode, compareYFirst = true) {
  console.log(aSceneNode, bSceneNode);
  const [primary, secondary] = compareYFirst ? ['y', 'x'] : ['x', 'y'];
  const comparePrimary = aSceneNode.globalBounds[primary] - bSceneNode.globalBounds[primary]
  if (comparePrimary == 0) // if both artboards are aligned in the primary dimension
    return aSceneNode.globalBounds[secondary] - bSceneNode.globalBounds[secondary] // compareSecondary
  else
    return comparePrimary
}

function sortAlphabetical(selection, reverse = false) {
  const sortedArtboards = arraySort(artboards(selection.items), "name", { reverse: reverse })
  sort(selection, sortedArtboards)
}

function sortCoordinates(selection, reverse = true) {
  const sortedArtboards = arraySort(artboards(selection.items), (a, b) => sortByXYCoords(a, b, reverse), { reverse: true })
  sort(selection, sortedArtboards)
}

export function sortAZ(selection, documentRoot) { sortAlphabetical(selection, true) }
export function sortZA(selection, documentRoot) { sortAlphabetical(selection, false) }
export function sortXY(selection, documentRoot) { sortCoordinates(selection, true) }
export function sortYX(selection, documentRoot) { sortCoordinates(selection, false) }
// maybe we need an xy rtl version too?
