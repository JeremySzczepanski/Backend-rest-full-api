let express = require('express');
let ProductController = require('../controllers/ProductController');
const guard = require('../middlewares/guard');
const productImageUploader = require('../middlewares/multer.config');
let router = express.Router();

router.get('/', guard, ProductController.list);

router.get('/:id', guard, ProductController.show);

router.post('/', productImageUploader, guard, ProductController.create);

router.put('/:id', productImageUploader, guard, ProductController.update);

router.delete('/:id', guard, ProductController.remove);


module.exports = router;