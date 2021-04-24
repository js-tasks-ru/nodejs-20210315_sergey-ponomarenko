const mongoose = require('mongoose');
const Product = require('../models/Product');

const converter = (product) => {
  return {
    id: product.id,
    title: product.title,
    images: product.images,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    description: product.description,
  };
};

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategory = ctx.query;
  if (!subcategory) {
    return next();
  }
  const products = await Product.find({subcategory: subcategory});
  ctx.body = {
    products: products.map(converter),
  };
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = {
    products: products.map(converter),
  };
};

module.exports.productById = async function productById(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
    ctx.throw(400, 'Invalid id');
  }

  const product = await Product.findById(ctx.params.id);

  if (!product) {
    ctx.throw(404, 'Product not found!');
  }
  ctx.body = {
    product: converter(product),
  };
};

