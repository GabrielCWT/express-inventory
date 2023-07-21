const Item = require('../models/item');

const asyncHandler = require('express-async-handler');

exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}, 'name').exec();

  res.render('item_list', {
    title: 'Item List',
    item_list: allItems,
  });
});
