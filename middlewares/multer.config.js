const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
	'image/jpeg': 'jpeg',
	'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, 'public/images/products');
    },
    filename: (req, file, callback)=>{
        let name = Math.floor(Math.random() * Math.floor(15258652325)).toString();
        name += Math.floor(Math.random() * Math.floor(85674652325)).toString();	
        name += Math.floor(Math.random() * Math.floor(864578652325)).toString();
        name += Math.floor(Math.random() * Math.floor(3645258652325)).toString();
        name += Date.now()+".";

        const extension = MIME_TYPES[file.mimetype];

        name += extension;

        callback(null, name);
    }
})

module.exports = multer({storage}).single('image');