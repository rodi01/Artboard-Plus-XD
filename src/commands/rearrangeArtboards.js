/*
 * Based on Roman Nurik's Sketch-ArtboardTricks plugin https://github.com/romannurik/Sketch-ArtboardTricks/
 */
import { DEFAULT_SPACEX, DEFAULT_SPACEY } from "../helpers/Constants"
import storageHelper from "../helpers/storage.js"
import { artboards } from "../helpers/utils.js"
import dialog from "../lib/dialog"
import debugHelper from "../helpers/debug.js"

/**
 * Create an array of obect with artboards and their position
 * @param {SceneNodeList} nodes
 * @returns {Array}
 */
function metaArtboards(nodes) {
  const artB = artboards(nodes)
  return artB.map(artboard => {
    return {
      artboard,
      left: artboard.globalBounds.x,
      top: artboard.globalBounds.y,
      right: artboard.globalBounds.x + artboard.globalBounds.width,
      bottom: artboard.globalBounds.y + artboard.globalBounds.height
    }
  })
}

/**
 * Get the X of the left more artboard and the Y of the top most artboard
 * @param {Array} artboards
 * @returns {Object}
 */
function getOrigin(artboards) {
  const minX = artboards.reduce(
    (prev, current) => (prev.left < current.left ? prev : current),
    1
  )``

  const minY = artboards.reduce(
    (prev, current) => (prev.top < current.top ? prev : current),
    1
  )
  return {
    x: minX.left,
    y: minY.top
  }
}

/**
 * Go thru artbords and rearange them
 * @export
 * @param {Selection} selection
 * @param {SceneNode} documentRoot
 */
export default async function rearrangeArtboards(selection, documentRoot) {
  const nodes = selection.hasArtboards ? selection.items : documentRoot.children
  const allArtboards = metaArtboards(nodes)
  if (allArtboards.length <= 0) {
    dialog.alert(
      "Rearrange Artboards into Grid",
      "You don't have artboard(s) in your document."
    )
    return
  }

  // Settings
  const spaceX = await storageHelper.get("spaceX", DEFAULT_SPACEX)
  const spaceY = await storageHelper.get("spaceY", DEFAULT_SPACEY)
  const origin = getOrigin(allArtboards)

  let rowStarterArtboards = []
  allArtboards.forEach(ab => {
    let leftMostInRow = true
    allArtboards.forEach(ab2 => {
      if (ab === ab2) return

      if (ab2.left < ab.left) {
        if (ab.top <= ab2.bottom && ab2.top <= ab.bottom) {
          leftMostInRow = false
          return
        }
      }
    })

    if (leftMostInRow) {
      rowStarterArtboards.push(ab)
    }
  })

  // Sort starting artboards
  rowStarterArtboards.sort((a, b) => a.top - b.top)

  // start a list of artboards for each row
  let rows = rowStarterArtboards.map(ab => [ab])
  let rowHeights = rowStarterArtboards.map(ab => ab.bottom - ab.top)
  rowStarterArtboards.forEach((ab, i) => {
    ab.row = i
  })

  // assign all other artboards to a row by
  // computing shortest distance between artboard vertical centers
  allArtboards.filter(ab => !rowStarterArtboards.includes(ab)).forEach(ab => {
    rowStarterArtboards.forEach(abStarter => {
      abStarter._tmpDistance = Math.abs(
        (abStarter.top + abStarter.bottom) / 2 - (ab.top + ab.bottom) / 2
      )
    })

    const curStarterAb = rowStarterArtboards.reduce(
      (prev, current) =>
        prev._tmpDistance < current._tmpDistance ? prev : current
    )
    rows[curStarterAb.row].push(ab)

    // update row height
    rowHeights[curStarterAb.row] = Math.max(
      rowHeights[curStarterAb.row],
      ab.bottom - ab.top
    )
  })

  // sort each row by x position
  rows.forEach(abInRow => {
    abInRow.sort((a, b) => a.left - b.left)
  })

  // finally, arrange everything
  let y = origin.y

  rows.forEach((abInRows, r) => {
    let x = origin.x
    abInRows.forEach((ab, idx) => {
      const localX = x - ab.left
      const localY = y - ab.top
      ab.artboard.moveInParentCoordinates(localX, localY)

      x += ab.artboard.globalBounds.width + Number(spaceX)
    })
    y += rowHeights[r] + Number(spaceY)
  })
}
