const { Artboard, Color } = require("scenegraph")
const commands = require("commands")
const dialog = require("../lib/dialogs.js")

function wrapSelection(selection, documentRoot) {
  if (selection.items.length <= 0) {
    dialog.alert(
      "Wrap Around Selection 🤘",
      "You need to select at least one layer."
    )
    return
  } else if (selection.hasArtboards) {
    dialog.alert(
      "Wrap Around Selection 🤘",
      "Artbord can't be created around another artboard. Please de-select artboard."
    )
    return
  }
  commands.group()
  const group = selection.items[0]
  const properties = {
    width: group.globalBounds.width,
    height: group.globalBounds.height,
    y: group.globalBounds.y,
    x: group.globalBounds.x
  }

  commands.ungroup()
  const artboard = new Artboard()
  artboard.width = properties.width
  artboard.height = properties.height
  artboard.name = "Artboard"
  artboard.fill = new Color("#ffffff")

  documentRoot.addChild(artboard, 0)
  artboard.moveInParentCoordinates(properties.x, properties.y)
}
module.exports = wrapSelection
