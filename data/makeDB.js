const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs')

// create or open the db
const db = new Database(path.join(__dirname, '/database.db'));
db.exec("PRAGMA foreign_keys = ON;");

// if the table doesnt already exist on startup, make it
const makeTable = `
  CREATE TABLE IF NOT EXISTS cameras (
    city_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    area TEXT NOT NULL,
    lat REAL NOT NULL,
    long REAL NOT NULL,
    folder_name TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cameras_city_id TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    filepath TEXT NOT NULL,
    FOREIGN KEY(cameras_city_id) REFERENCES cameras(city_id)
  )
`;

let dbExecResult = db.exec(makeTable);

let checkCamerasStmt = db.prepare('SELECT * FROM CAMERAS')
let allCameras = checkCamerasStmt.all()
// console.log(allCameras.length)
if (allCameras.length === 0) {
  const allCameras = require('./allCameras.json')
  const insert = db.prepare('INSERT INTO cameras (city_id, name, image_url, area, lat, long, folder_name) VALUES (?, ?, ?, ?, ?, ?, ?)');
  
  const insertManyCameras = db.transaction((cameras) => {
    // console.log("IN MANY CAMERAS")
    for (const camera of cameras) {
      // console.log(camera)
      let {id, name, latitude, longitude, area, imageUrl} = camera
      let folder_name = `./images/${id}`
      let result = insert.run(id, name, imageUrl, area, latitude, longitude, folder_name)
      fs.mkdirSync(folder_name)
      // console.log(result)
  };
  });
  insertManyCameras(allCameras);
}


module.exports = db;