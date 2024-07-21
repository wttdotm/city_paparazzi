// The biggest problem with this script as it stands rn is that the db is not super tied together with the cleanup


const fs = require('fs')
const db = require('./data/makeDB.js')
const fetch = require('node-fetch')
// Continuously get images from camera X every 2s
// For each image:
//  1. Make an entry in a database with the image, image final path, camera that took it, and at what time
//  2. Save it to images/cameraX/timestamp (make directory if none exists) (name each folder NameWithNoSpacesAndAtReplacing_id)
//  3. If the camera has more than 60 images (two minutes), trigger a deletion of the oldest image(s)

let getAllCameras = db.prepare("SELECT * FROM cameras")
const allCameras = getAllCameras.all()

//this is just so I can test w/my own local camera
const gatesCamera = db.prepare("SELECT * FROM cameras WHERE city_id = '74707723-013b-4bf1-9a8b-c209dbf71984'").get()
const dekalbCamera = db.prepare("SELECT * FROM cameras WHERE city_id = '068461e2-c62f-4ce4-adac-5f9efe92af1d'").get()
// const dekalbCamera = db.prepare("SELECT * FROM cameras WHERE city_id = '068461e2-c62f-4ce4-adac-5f9efe92af1d'").get()
// stop using at some point to test everything
// console.log(allCameras)
let first20Cameras = allCameras.slice(0, 20)

// first20Cameras.push(gatesCamera)
// // allCameras.forEach(camera => {
// first20Cameras.forEach(camera => {
//     fs.mkdirSync(camera.folder_name)
// })

bushwickAveCameras = [gatesCamera, dekalbCamera]
// bushwickAveCameras.forEach(camera => {
//     fs.mkdirSync(camera.folder_name).catch(err => console.log(err))
// })

let keepGettingImages = setInterval(() => {
    let date = Date.now()
    Promise.all(bushwickAveCameras.map(camera => {
        fetch(camera.image_url)
            .then(res => {
                // console.log(camera)
                let filePath = `${camera.folder_name}/${date}.jpg`
                res.body.pipe(fs.createWriteStream(filePath, {recursive : true}))
                // console.log(camera.city_id)
                let insertImageStmt = db.prepare('INSERT INTO images (cameras_city_id, timestamp, filepath) VALUES (?, ?, ?)')
                let insertImageResult = insertImageStmt.run(camera.city_id, date, filePath)
                // console.log(`Inserted image for camera ${camera.city_id}:`, insertImageResult);
                // console.log(insertImageResult)
            })
            .catch(err => console.log(`ERROR: ${err} \nCAMERA: ${camera}`))
    })).then(console.log("\n*********all promises done*********\n"))
}, 2200)



let regularCleanup = setInterval(() => {
    // go through images directory
    // for each specific camera
        // 
    //
})