const express = require('express');
const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('homepage', { title: 'Home' });
});

/* Catalog routing */
router.get('/categories', categoryController.category_list);
router.get('/categories/:id', categoryController.category_detail);
// TODO router.get('/categories/create', categoryController.category_create);
// TODO router.get('/categories/:id/update', categoryController.category_update);
// TODO router.get('/categories/:id/delete', categoryController.category_delete);

/* Items routing */
router.get('/items', itemController.item_list);
// TODO router.get('/items/:id', itemController.item_detail);
// TODO router.get('/items/create', itemController.item_create);
// TODO router.get('/items/:id/update', itemController.item_update);
// TODO router.get('/items/:id/delete', itemController.item_delete);

module.exports = router;
