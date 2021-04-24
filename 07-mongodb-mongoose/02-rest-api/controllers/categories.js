const Category = require('../models/Category');
module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  ctx.body = {
    categories: categories.map((category) => {
      return {
        id: category.id,
        title: category.title,
        subcategories: category.subcategories.map((subcategory) => ({
          id: subcategory.id,
          title: subcategory.title,
        })),
      };
    }),
  };
};
