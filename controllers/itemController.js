const Category = require('../models/category');
const Item = require('../models/item');

const { body, validationResult } = require('express-validator');

const asyncHandler = require('express-async-handler');

exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}, 'name').exec();

  res.render('list_layout', {
    title: 'Item List',
    list_arr: allItems,
  });
});

exports.item_detail = asyncHandler(async (req, res, next) => {
  const currentItem = await Item.findById(req.params.id)
    .populate('category')
    .exec();

  if (currentItem === null) {
    const err = new Error('No such item');
    err.status = 404;
    return next(err);
  }

  res.render('item_detail', {
    title: currentItem.name,
    item: currentItem,
  });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec();
  res.render('item_form', {
    title: 'Create Category',
    categories: allCategories,
  });
});

exports.item_create_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Name must not be empty')
    .escape()
    .custom(async (itemName) => {
      const currentItem = await Item.exists({ itemName });
      if (currentItem) {
        throw new Error('Item already exists');
      }
    }),
  body('description')
    .isLength({ min: 1 })
    .withMessage('Description must not be empty')
    .escape(),
  body('category')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category must not be empty')
    .escape()
    .custom(async (categoryName) => {
      const currentCategory = await Category.exists({ categoryName });
      if (currentCategory !== null) {
        throw new Error('Category does not exist');
      }
    }),
  body('price')
    .trim()
    .toFloat()
    .isFloat({ min: 0.01 })
    .withMessage('Price cannot be 0 or lower')
    .escape(),
  body('number').trim().isInt({ min: 0 }),
  asyncHandler(async (req, res, next) => {
    errors = validationResult(req);
    const currentCategory = await Category.findOne({
      name: req.body.category,
    }).exec();
    console.log(currentCategory._id, req.body.category, currentCategory);
    const newItem = new Item({
      name: req.body.name,
      description: req.body.description,
      category: currentCategory._id,
      price: req.body.price,
      number_in_stock: req.body.number,
    });
    if (!errors.isEmpty()) {
      const allCategories = await Category.find().exec();
      res.render('item_form', {
        title: 'Create item',
        item: newItem,
        selectedCategory: currentCategory.name,
        categories: allCategories,
        errors: errors.array(),
      });
    } else {
      await newItem.save();
      res.redirect(newItem.url);
    }
  }),
];

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [currentItem, allCategories] = await Promise.all([
    Item.findById(req.params.id),
    Category.find().exec(),
  ]);
  const currentCategory = await Category.findById(currentItem.category);
  res.render('item_form', {
    title: 'Create Item',
    item: currentItem,
    selectedCategory: currentCategory.name,
    categories: allCategories,
  });
});

exports.item_update_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Name must not be empty')
    .escape(),
  body('description')
    .isLength({ min: 1 })
    .withMessage('Description must not be empty')
    .escape(),
  body('category')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category must not be empty')
    .escape()
    .custom(async (categoryName) => {
      const currentCategory = await Category.exists({ categoryName });
      if (currentCategory !== null) {
        throw new Error('Category does not exist');
      }
    }),
  body('price')
    .trim()
    .toFloat()
    .isFloat({ min: 0.01 })
    .withMessage('Price cannot be 0 or lower')
    .escape(),
  body('number').trim().isInt({ min: 0 }),
  asyncHandler(async (req, res, next) => {
    errors = validationResult(req);
    const currentCategory = await Category.findOne({
      name: req.body.category,
    }).exec();
    const newItem = new Item({
      name: req.body.name,
      description: req.body.description,
      category: currentCategory._id,
      price: req.body.price,
      number_in_stock: req.body.number,
    });
    if (!errors.isEmpty()) {
      const allCategories = await Category.find().exec();
      res.render('item_form', {
        title: 'Create item',
        item: newItem,
        selectedCategory: currentCategory.name,
        categories: allCategories,
        errors: errors.array(),
      });
    } else {
      const currentItem = await Item.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        category: currentCategory._id,
        price: req.body.price,
        number_in_stock: req.body.number,
      });
      res.redirect(currentItem.url);
    }
  }),
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const currentItem = await Item.findById(req.params.id);
  if (currentItem === null) {
    res.redirect('/items');
  }
  res.render('delete_form', {
    title: 'Delete Item',
    item: currentItem.name,
  });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect('/items');
});
