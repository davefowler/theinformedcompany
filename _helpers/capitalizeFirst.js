/**
 * capitalizeFirst.js
 * http://git.io/vUJU2
 */

module.exports = function (str) {
  if (str && typeof str === "string") {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}
