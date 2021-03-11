const {
  execFile
} = require('child_process');
const sql = require('./sqliteDatabaseRequests');
const fs = require("fs");
const https = require('https');
const {
  shell
} = require('electron');
const functionJSON = require('./JSONfunctions.js');
var settings = functionJSON.parseSettings();
const launchCodes = {
  launchers: ["steam", "battlenet", "origin", "epicgames", "uplay", "microsoftstore", "bethesda", "nonlauncher"],
  steam: {
    apifunction: 'https://api.steampowered.com/ISteamApps/GetAppList/v2/',
    startfunctionstart: "steam://rungameid/",
    startfunctionend: null,
    startframework: "browser"
  },
  battlenet: {
    apifunction: null,
    startfunctionstart: null,
    startfunctionend: null,
    startframework: "browser"
  },
  origin: {
    apifunction: null,
    startfunctionstart: null,
    startfunctionend: null,
    startframework: "browser"
  },
  epicgames: {
    apifunction: null,
    startfunctionstart: null,
    startfunctionend: null,
    startframework: "browser"
  },
  uplay: {
    apifunction: null,
    startfunctionstart: null,
    startfunctionend: null,
    startframework: "browser"
  },
  microsoftstore: {
    apifunction: null,
    startfunctionstart: null,
    startfunctionend: null,
    startframework: "browser"
  },
  bethesda: {
    apifunction: null,
    startfunctionstart: null,
    startfunctionend: null,
    startframework: "browser"
  },
  nonlauncher: {
    apifunction: null,
    startfunctionstart: null,
    startfunctionend: null,
    startframework: "browser"
  }
}
// https api request.
function makeAPIcall(url, returnedData) {

}
let gameFunctions = {}

gameFunctions.test = () => {
  // test funktion.
  console.log("this is a test")
}

// Function to add all installed games from all launchers the user has added installation paths to.
gameFunctions.addInstalledGamesToLibrary = () => {
  for (var i = 0; i < launchCodes.launchers.length; i++) {
    if (settings.installationdirs[launchCodes.launchers[i]] != null &&
      typeof settings.installationdirs[settings.launchers[i]] == "string" &&
      fs.existsSync(functionJSON.normalizeLauncherPaths(settings.installationdirs[launchCodes.launchers[i]]))
    ) {
      let launcher = launchCodes.launchers[i];
      // Makes an api request to to current launchers apifunction and makes it launchergamebase
      https.get(launchCodes[launchCodes.launchers[i]].apifunction, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        resp.on('end', () => {
          // steam specific response
          console.log(JSON.parse(data).applist.apps[0]);
          let steamapi = JSON.parse(data).applist.apps;
          fs.readdir(functionJSON.normalizeLauncherPaths(settings.installationdirs.steam + "\\steamapps"), {withFileTypes:true}, (err, files) => {
            files.forEach(async file => {
              if (file.name.endsWith(".acf")) {
                let appid = file.name.replace("appmanifest_","").replace(".acf","");
                if (!isNaN(parseFloat(appid)) && appid !== "228980") {
                  console.log("Searching for new game")
                  let currentgame = await new Promise((resolve, reject) => {
                    resolve(steamapi.filter(a => a.appid === parseInt(appid))[0])
                  }).catch(e => reject(e));
                  console.log("appid:" + currentgame.appid + ", name:" + currentgame.name)
                  let name = currentgame.name;
                  let launcherid = appid;
                  sql.addToLibrary([name, launcher, launcherid]);
                }
              }
            })
          })
          console.log("end")
          // end of steam specific response
        });

      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    }

  }
}

// Function for starting games when clicking start in the elctron app
gameFunctions.start = () => {
    sql.getByRowid(["launcher, launcherid",event.target.dataset.rowid],(sqlGetData) => {
      let gamestartcode = launchCodes[sqlGetData.launcher].startfunctionstart + sqlGetData.launcherid + launchCodes[sqlGetData.launcher].startfunctionend;
      if (launchCodes[sqlGetData.launcher].startframework === "browser") {
        // startar funktion om launchern använder browser URLs för att starta spel.
        shell.openExternal(gamestartcode)
      } else if (launchCodes[sqlGetData.launcher].startframework === "exe") {
        // startar funktion om launchern använder exe filer för att starta spel.
        let child_process_obj = execFile(gamestartcode, function(err, data) {
          if (err) {
            console.error(err);
            return;
          }
          console.log(data.toString())
          // Returnar processens ID kommer behövas om programmet ska kunna stänga ner spel.
          return child_process_obj.pid;
        })
      } else {
        console.log("Can't start that program")
      }
    })
  }

module.exports = gameFunctions;
