const fs = require('fs')
const dir = './images/';
const db = require('./data/makeDB.js')

setInterval(() => {
    let getAllImages = db.prepare('SELECT * FROM images')
    let allImages = getAllImages.all()
    let imagesToRemove = []
    allImages.forEach(image => {
        //if an image is more than a minute old
        if (image.timestamp + 60000 < Date.now()) {
            //add it to the images to delete arr
            imagesToRemove.push(image)
        }
    })
    
    const batchDeleteImages = db.transaction((images) => {
        let date = Date.now()
        const deleteStmt = db.prepare(`DELETE FROM images WHERE id = ?`)
        for (const image of images) {
            deleteStmt.run(image.id)
            fs.unlink(image.filepath, (err) => console.log(`Error deleting image: ${image.filepath}\n${err}`))
        }
    })
    
    batchDeleteImages(imagesToRemove)

}, 60000)
