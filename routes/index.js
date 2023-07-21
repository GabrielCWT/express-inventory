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
router.get('/categories/create', categoryController.category_create_get);
router.post('/categories/create', categoryController.category_create_post);
router.get('/categories/:id', categoryController.category_detail);
// TODO router.get('/categories/:id/update', categoryController.category_update_get);
// TODO router.post('/categories/:id/update', categoryController.category_update_post);
// TODO router.get('/categories/:id/delete', categoryController.category_delete_get);
// TODO router.post('/categories/:id/delete', categoryController.category_delete_post);

/* Items routing */
router.get('/items', itemController.item_list);
// TODO router.get('/items/create', itemController.item_create_get);
// TODO router.post('/items/create', itemController.item_create_post);
router.get('/items/:id', itemController.item_detail);
// TODO router.get('/items/:id/update', itemController.item_update_get);
// TODO router.post('/items/:id/update', itemController.item_update_post);
// TODO router.get('/items/:id/delete', itemController.item_delete_get);
// TODO router.post('/items/:id/delete', itemController.item_delete_post);

module.exports = router;
