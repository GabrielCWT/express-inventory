const { body, validationResult } = require('express-validator');
const Category = require('../models/category');
const Item = require('../models/item');

const asyncHandler = require('express-async-handler');

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}, 'name').exec();

  res.render('list_layout', {
    title: 'Category List',
    header: 'Categories',
    list_arr: allCategories,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [currentCategory, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);

  if (currentCategory === null) {
    const err = new Error('No such category');
    err.status = 404;
    return next(err);
  }

  res.render('list_layout', {
    title: currentCategory.name,
    category: currentCategory,
    list_arr: allItemsInCategory,
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render('category_form', {
    title: 'Create Category',
  });
});

exports.category_create_post = [
  body('name')
    .trim()
    .isAlpha()
    .withMessage('Needs to use letters only')
    .escape()
    .custom(async (name) => {
      const category = await Category.exists({ name });
      if (category) {
        throw new Error('Category already exists');
      }
    }),
  asyncHandler(async (req, res, next) => {
    errors = validationResult(req);
    const newCategory = new Category({ name: req.body.name });
    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Create Category',
        category: newCategory,
        errors: errors.array(),
      });
    } else {
      await newCategory.save();
      res.redirect(newCategory.url);
    }
  }),
];

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const currentCategory = await Category.findById(req.params.id);
  res.render('category_form', {
    title: 'Create Category',
    category: currentCategory,
  });
});

exports.category_update_post = [
  body('name')
    .trim()
    .isAlpha()
    .withMessage('Needs to use letters only')
    .escape()
    .custom(async (name) => {
      const category = await Category.exists({ name });
      if (category) {
        throw new Error('Category already exists');
      }
    }),
  asyncHandler(async (req, res, next) => {
    errors = validationResult(req);
    const newCategory = new Category({ name: req.body.name });
    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Create Category',
        category: newCategory,
        errors: errors.array(),
      });
    } else {
      const currentCategory = await Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
      });
      res.redirect(currentCategory.url);
    }
  }),
];
