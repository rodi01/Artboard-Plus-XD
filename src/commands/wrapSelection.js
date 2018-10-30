import { Artboard, Color } from "scenegraph"
import commands from "commands"
import dialog from "../lib/dialog"

export default function(selection, documentRoot) {
  if (selection.items.length <= 0) {
    dialog.alert(
      "Create Artboard Around Selection",
      "You need to select at least one layer."
    )
    return
  } else if (selection.hasArtboards) {
    dialog.alert(
      "Create Artboard Around Selection",
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
