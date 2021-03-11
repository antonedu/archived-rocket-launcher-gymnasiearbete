const functionJSON = require('./JSONfunctions.js');
const fs = require("fs");
const path = require('path');

function changeInstallationdir() {
  let settings = functionJSON.parseSettings();
  settings.installationdirs[document.querySelector("#launchers .launcher").value] = document.querySelector("#launchers .installationdir").value;
  fs.writeFile(
    // process.resourcesPath + '\\app' + '\\databases\\settings.json'
    path.join(__dirname, '/databases/settings.json')
    , JSON.stringify(settings), err => {
    if (err) return console.log(err);
  })
}
