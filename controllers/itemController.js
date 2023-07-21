const Item = require('../models/item');

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
