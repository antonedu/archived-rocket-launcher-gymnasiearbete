const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

let sql = {};

// Function to make db connection shorter in each function.
function databaseConnection() {
  return new sqlite3.Database(
    // path.join(__dirname, '/databases/library.db')
    `${__dirname}/databases/library.db`
    , (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the library database.');
  });
}

// Skapar användarens Game Library databas om den inte redan existerar.
sql.createLibrary = () => {
  let db = databaseConnection();
  // name - the name of the game being inserted
  // launcher - the launcher that the game is installed from
  // launcherid - the games unique identifier for it's own launcher
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS gamelibrary(name TEXT NOT NULL,launcher TEXT,launcherid,UNIQUE(launcher,launcherid))`,
      console.log("creating table")).close();
  })
}

// Lägger till spel i användarens Game Library
sql.addToLibrary = (arr) => {
  let db = databaseConnection();
  db.serialize(() => {
    db.run(`
      INSERT OR IGNORE INTO gamelibrary(name,launcher,launcherid)
      VALUES (?,?,?)
      `, arr, console.log("inserting into table")).close();
  })
}

// test kommando för att kolla alla spel i Game Library.
sql.consoleLibrary = () => {
  let db = databaseConnection();
  db.serialize(() => {
    db.each(`SELECT name, launcher, launcherid FROM gamelibrary ORDER BY name`, (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(rows)
    }).close();
  })
}

sql.loadLibrary = () => {
  let db = databaseConnection();
  document.getElementById("library-wrapper").innerHTML = "";
  db.serialize(() => {
    db.each(`SELECT name, rowid FROM gamelibrary ORDER BY name`, (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      document.getElementById("library-wrapper").innerHTML += `<button id="game-card" type="button" onclick="game.start()" data-rowid="${rows.rowid}">${rows.name}</button>`;
    }).close();
  })
}

// sql get to get one row from one column.
sql.getByRowid = (arrayWithWhatToGetAndRowid, functionOnTheGottenValue) => {
  let db = databaseConnection();
  let sql = `SELECT ${arrayWithWhatToGetAndRowid[0]} FROM gamelibrary WHERE rowid = ${arrayWithWhatToGetAndRowid[1]}`
  db.serialize(() => {
    db.get(sql, (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      // console.log(row[arrayWithWhatToGetAndRowid[0]])
      functionOnTheGottenValue(row);
    })
  }).close();
}

// Removes all data from gamelibrary along with the table, mostly used in testing
// could maybe be used for user troubleshooting.
sql.deleteLibrary = () => {
  let db = databaseConnection();

  db.serialize(() => {
    db.run(`DELETE FROM gamelibrary`).close();
  })
}

// test kommando taget från sqlitetutorial
sql.test = () => {
  let db = databaseConnection();
  db.serialize(() => {
    // Queries scheduled here will be serialized.
    db.run('CREATE TABLE IF NOT EXISTS greetings(message text)')
      .run(`INSERT INTO greetings(message)
          VALUES('Hi'),
                ('Hello'),
                ('Welcome')`)
      .each(`SELECT message FROM greetings`, (err, row) => {
        if (err) {
          throw err;
        }
        console.log(row.message);
      })
      .run(`DROP TABLE greetings`).run(`DROP TABLE greetings`).close();
  });
}
module.exports = sql;
