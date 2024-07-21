const express = require('express')
const app = express()
const port = 6969
const nodemailer = require("nodemailer");
require('dotenv').config()

//utilities
const fetch = require('node-fetch')
const fs = require('fs')
const db = require('./data/makeDB.js')
const sendEmail = require('./sendEmail.js')
const imageProcessing = require('./imageProcessing.js')
const fileCleanup = require('./fileCleanup.js')




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/gates', (req, res) => {
    const {enteringOrLeaving} = req.query 
    const stmt = db.prepare("SELECT * FROM images WHERE cameras_city_id LIKE '74707723-013b-4bf1-9a8b-c209dbf71984'");
    let allImages = stmt.all()
    let allImagesPaths = allImages.map(image => image.filepath)
    allImagesPaths = allImagesPaths.slice(0,15)
    sendEmail(allImagesPaths, req.query?.enteringOrLeaving ? req.query?.enteringOrLeaving : 'around', 'gates')
    console.log("/gates ran")
    // const url = result
    res.send("gates ran")

})

app.get('/dekalb', (req, res) => {
    console.log(req.query)
    const stmt = db.prepare("SELECT * FROM images WHERE cameras_city_id LIKE '068461e2-c62f-4ce4-adac-5f9efe92af1d'");
    let allImages = stmt.all()
    let allImagesPaths = allImages.map(image => image.filepath)
    allImagesPaths = allImagesPaths.slice(0,10)
    sendEmail(allImagesPaths, req.query?.enteringOrLeaving ? req.query?.enteringOrLeaving : 'around', 'dekalb')
    console.log("/dekalb ran")
    // const url = result
    res.send("dekalb ran")

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Make a db with a cameras table and an images table
// Start server
//
// Continuously get images from camera X every 2s
// For each image:
//  1. Make an entry in a database with the image, image final path, camera that took it, and at what time
//  2. Save it to images/cameraX/timestamp (make directory if none exists) (name each folder NameWithNoSpacesAndAtReplacing_id)
//  3. If the camera has more than 60 images (two minutes), trigger a deletion of the oldest image(s)
// 
// When a user sends a GET request to /simpleGet
// Wait 20 seconds, then email them the most recent 10 photos
//
//
//
//
//