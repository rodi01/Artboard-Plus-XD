import React, { Component } from "react"
import isNumber from "is-number"
import { DEFAULT_SPACEX, DEFAULT_SPACEY } from "../helpers/Constants"
import storageHelper from "../helpers/storage.js"
import "./styles.scss"
import dh from "../helpers/debug.js"

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      spaceX: "",
      spaceY: "",
      spaceXError: "",
      spaceYError: "",
      disableButton: false
    }
    this.errorMessageText = "Only positive numbers are allowed"
    this.onInputChange = this.onInputChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.enterFunction = this.enterFunction.bind(this)
  }

  async componentDidMount() {
    const spX = await storageHelper.get("spaceX", DEFAULT_SPACEX)
    const spY = await storageHelper.get("spaceY", DEFAULT_SPACEY)
    this.setState({ spaceX: spX, spaceY: spY })
    document.addEventListener("keydown", this.enterFunction, false)
  }

  onInputChange(e) {
    if (!isNumber(e.target.value) || e.target.value < 0) {
      if (e.target.id === "spaceXInput") this.setState({ spaceXError: "show" })
      if (e.target.id === "spaceYInput") this.setState({ spaceYError: "show" })
      this.setState({ disableButton: true })
    } else {
      if (e.target.id === "spaceXInput") this.setState({ spaceXError: "" })
      if (e.target.id === "spaceYInput") this.setState({ spaceYError: "" })
      this.setState({ disableButton: false })
    }

    if (e.target.id === "spaceXInput") {
      this.setState({ spaceX: e.target.value })
    } else {
      this.setState({ spaceY: e.target.value })
    }
  }

  async onSubmit(e) {
    e.preventDefault()
    await storageHelper.set("spaceX", String(this.state.spaceX))
    await storageHelper.set("spaceY", String(this.state.spaceY))
    document.removeEventListener("keydown", this.enterFunction, false)
    this.props.dialog.close()
  }

  onCancel(e) {
    this.props.dialog.close()
  }

  enterFunction(e) {
    if (e.keyCode === 13) {
      // Enter is pressed
      e.preventDefault()
      this.onSubmit(e)
    }
  }

  render() {
    return (
      <form style={{ width: 300 }}>
        <h1>Settings</h1>
        <hr />
        <h2>Set space between artboards</h2>
        <div className="inputWrapper">
          <label>Horizontal Space:</label>
          <input
            type="text"
            id="spaceXInput"
            value={this.state.spaceX}
            onChange={this.onInputChange}
          />
          <div className={`errorMessage ${this.state.spaceXError}`}>
            {this.errorMessageText}
          </div>
        </div>
        <div className="inputWrapper">
          <label>Vertical Space:</label>
          <input
            type="text"
            id="spaceYInput"
            value={this.state.spaceY}
            onChange={this.onInputChange}
          />
          <div className={`errorMessage ${this.state.spaceXError}`}>
            {this.errorMessageText}
          </div>
        </div>

        <footer>
          <button type="submit" uxp-variant="secondary" onClick={this.onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            uxp-variant="cta"
            disabled={this.state.disableButton}
            onClick={this.onSubmit}
          >
            Save
          </button>
        </footer>
      </form>
    )
  }
}

export default Settings
