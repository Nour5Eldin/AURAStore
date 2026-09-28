require('ts-node').register({ transpileOnly: true });
const mongoose = require('mongoose');
const { categoryRepository } = require('../fashion-store-backend/src/repositories/category.repository');
const { productRepository } = require('../fashion-store-backend/src/repositories/product.repository');

async function test() {
  try {
    await mongoose.connect('mongodb://localhost:27017/fashion-store');
    console.log("Connected to DB");

    console.log("Testing Category Paginate...");
    const catResult = await categoryRepository.paginate({}, { sort: { createdAt: -1 }, page: 1 });
    console.log("Categories returned:", catResult.data.length);

    console.log("Testing Product Paginate...");
    const prodResult = await productRepository.paginate({}, {
      page: 1,
      limit: 20,
      sort: { createdAt: -1 },
      populate: ["categoryId", "subCategoryId"],
    });
    console.log("Products returned:", prodResult.data.length);

  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    mongoose.connection.close();
  }
}
test();
