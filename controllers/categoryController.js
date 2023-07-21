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
