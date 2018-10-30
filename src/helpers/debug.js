/*
 * Copyright (c) 2018. by Pablo Klaschka
 */

export default class debugHelper {
  static shouldDebug() {
    return process.env.NODE_ENV === "development"
  }

  /**
   * Logs elements to console
   * @param {*} objects Logged objects
   */
  static log(...objects) {
    if (debugHelper.shouldDebug()) {
      objects.unshift("Artboard Plus: ")
      const args = Array.prototype.slice.call(
        objects.map(
          value => (value instanceof Object ? JSON.stringify(value) : value)
        )
      )
      console.log.apply(console, args)
    }
  }
}
