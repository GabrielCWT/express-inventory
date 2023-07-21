#! /usr/bin/env node

console.log('This script populates categories and items into the DB');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require('./models/category');
const Item = require('./models/item');

const categories = [];
const items = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
  await createCategories();
  await createItems();
  mongoose.connection.close();
}

async function categoryCreate(index, name) {
  const category = new Category({ name });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(
  index,
  name,
  description,
  category,
  price,
  number_in_stock
) {
  const item = new Item({
    name,
    description,
    category,
    price,
    number_in_stock,
  });
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log('Adding categories');
  await Promise.all([
    categoryCreate(0, 'Food'),
    categoryCreate(1, 'Furniture'),
    categoryCreate(2, 'Drinks'),
  ]);
}

async function createItems() {
  console.log('Adding items');
  await Promise.all([
    itemCreate(0, 'Beef 500g', '500g of wagyu beef', categories[0], 30, 23),
    itemCreate(1, 'Pork Chop', 'Seasoned pork chop', categories[0], 12.3, 12),
    itemCreate(2, 'Fusili Pasta', '250g box of pasta', categories[0], 24.5, 1),
    itemCreate(
      3,
      '4 Seater Sofa',
      'Comfortable 4 seater sofa which can recline',
      categories[1],
      340,
      2
    ),
    itemCreate(
      4,
      '6 Seater Sofa',
      'Comfortable 6 seater sofa which can recline',
      categories[1],
      700,
      3
    ),
    itemCreate(
      5,
      'Adjustable table',
      'Table whose height can be adjusted with just a press of a button',
      categories[1],
      400,
      5
    ),
    itemCreate(
      6,
      '100 Plus',
      'A sports drink which hydrates and provides you with electrolytes after exercise',
      categories[2],
      1.5,
      102
    ),
    itemCreate(
      7,
      'Coke Zero',
      'A sparkling delight which contains no sugar',
      categories[2],
      1.5,
      200
    ),
  ]);
}
