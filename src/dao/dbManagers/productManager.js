import productsModel from '../models/product.js';

export default class Products {
  async getAll() {
    return await productsModel.find({}).lean();
  }

  async getById(id) {
    return await productsModel.findById(id);
  }

  async getByCategory(filter) {
    console.log(filter)
    //RESOLVER QUE FILTRE 
    const productByCategory = await productsModel.aggregate([
      { $match: { category: filter } },
      { $group: { _id: "$name", products: { $push: "$$ROOT" } } }
    ]);
    return productByCategory;
    
  }

  async save(data) {
    const newProduct = await productsModel.create(data);
    return newProduct;
  }

  async update(id, data) {
    const updatedProduct = await productsModel.findByIdAndUpdate(id, data, { new: true });
    return updatedProduct;
  }

  async delete(id) {
    const deletedProduct = await productsModel.findByIdAndDelete(id);
    return deletedProduct;
  }
}
