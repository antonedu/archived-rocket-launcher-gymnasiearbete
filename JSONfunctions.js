const path = require('path');
const fs = require("fs");
var functionJSON = {}

// Parses settings.JSON into a javascript object.
functionJSON.parseSettings = () => {
  var settings = fs.readFileSync(
    // process.resourcesPath + '\\app' + '\\databases\\settings.json'
    path.join(__dirname, '/databases/settings.json')
    , 'utf8');
  return JSON.parse(settings)
}

// function to normalize launcher/game paths based on OS
functionJSON.normalizeLauncherPaths = (dirpath) => {
  if (process.platform === "win32") {
    return path.win32.normalize(dirpath);
  } else {
    return path.normalize(dirpath);
  }
}

module.exports = functionJSON;
