import commands from "commands"
import arraySort from "array-sort"
import { artboards } from "../helpers/utils.js"

function sort(selection, sortedArboards) {
  // No artboards check
  if (sortedArboards.length <= 0) return

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
