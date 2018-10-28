const reactShim = require("./helpers/react-shim")
const React = require("react")
const ReactDOM = require("react-dom")
const { DEFAULT_SPACEX, DEFAULT_SPACEY } = require("./helpers/Constants")
const wrapSelection = require("./commands/wrapSelection").default
const sortAZ = require("./commands/sortArtboards").sortAZ
const sortZA = require("./commands/sortArtboards").sortZA
const rearrangeArtboards = require("./commands/rearrangeArtboards").default
const Settings = require("./views/settings.jsx").default
const storageHelper = require("../src/helpers/storage").default

// Set default settings
async function setDefaultSettings() {
  await storageHelper.get("spaceX", DEFAULT_SPACEX)
  await storageHelper.get("spaceY", DEFAULT_SPACEY)
}
setDefaultSettings()

let dialog
function showSettings() {
  if (dialog == null) {
    dialog = document.createElement("dialog")
    ReactDOM.render(<Settings dialog={dialog} />, dialog)
  }

  dialog.addEventListener("close", () => {
    dialog = null
  })

  return dialog
}

module.exports = {
  commands: {
    wrapSelection: wrapSelection,
    sortAZ: sortAZ,
    sortZA: sortZA,
    rearrangeArtboards: rearrangeArtboards,
    settings: function() {
      document.appendChild(showSettings()).showModal()
    }
  }
}
