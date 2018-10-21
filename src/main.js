const dialog = require("../lib/dialogs.js")
const wrapSelection = require("./wrapSelection.js")
const sortArtboards = require("./sortArtboards.js")

function notImplemented() {
  dialog.alert("Boo! 👻", "Not Implemented")
}

module.exports = {
  commands: {
    wrapSelection: wrapSelection,
    sortAZ: sortArtboards.sortAZ,
    sortZA: sortArtboards.sortZA,
    notImplemented: notImplemented
  }
}
