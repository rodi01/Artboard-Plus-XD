import commands from "commands"
import arraySort from "array-sort"
import { artboards } from "../helpers/utils.js"
import dialog from "../lib/dialog"

function sort(selection, sortedArboards) {
  // No artboards check
  if (sortedArboards.length <= 0) {
    dialog.alert(
      "Sort Artboards",
      "You don't have artboard(s) in your document."
    )
    return
  }

  sortedArboards.forEach(node => {
    selection.items = node
    commands.bringToFront()
  })
  selection.items = []
}

export function sortAZ(selection, documentRoot) {
  // @ts-ignore
  const sortedArboards = arraySort(artboards(documentRoot.children), "name", {
    reverse: true
  })
  sort(selection, sortedArboards)
}

export function sortZA(selection, documentRoot) {
  // @ts-ignore
  const sortedArboards = arraySort(artboards(documentRoot.children), "name")

  sort(selection, sortedArboards)
}
