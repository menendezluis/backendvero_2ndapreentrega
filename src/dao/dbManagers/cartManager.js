import cartModel from "../models/cart.js";

export default class Carts {
  //obtener todos los carritos
  async getAll() {
    return await cartModel.find({}).lean();
  }
  //obtener un carrito
  async getOne(id) {
    let result = await cartModel.findById(id).lean();
    return result;
  }

  //obtener carrito por id
  async getById(id) {
    return await cartModel.findById(id);
  }

  //crear carrito
  async save(data) {
    const newCart = await cartModel.create(data);
    return newCart;
  }
  //actualizar carrito
  async update(id, data) {
    const updatedCart = await cartModel.findByIdAndUpdate(id, {
      products: data,
    });
    return updatedCart;
  }

  //eliminar carrito
  async delete(id) {
    const deletedCart = await cartModel.findByIdAndDelete(id);
    return deletedCart;
  }

  //Eliminar del carrito el producto seleccionado
  async removeFromCart(cid, pid) {
    let cart = await cartModel.findOne({ _id: cid });
    const result = await cartModel.updateOne(
      { _id: cid },
      { $pull: { products: { _id: pid } } }
    );
    return result;
  }

  //encontrar un producto en el carrito por id
  async isProductInCart(cid, pid) {
    console.log(cid);
    let productInCart = await cartModel.findOne({
      _id: cid,
      "products._id": pid,
    });
    console.log(productInCart);
    return productInCart;
  }

  // incrementar la cantidad de un producto en el carrito**
  async incrementProductQuantity(cid, pid) {
    const updatedCart = await cartModel.findOneAndUpdate(
      { _id: cid, "products._id": pid },
      { $inc: { "products.$.quantity": 1 } },
      { new: true }
    );

    return updatedCart;
  }

  // agregar un producto al carrito con cantidad 1**
  async addProductToCart(cid, pid) {
    try {
      /* const updatedCart = await cartModel.findOneAndUpdate(
      { _id: cid },
      { $push: { products: { _id:pid, quantity: 1 } } },
      { new: true }
    );

*/
      const cart = await cartModel.findOne({ _id: cid });

      const productIndex = cart.products.findIndex(
        (p) => String(p.product) === pid
      );
      if (productIndex >= 0) {
        cart.products[productIndex].quantity += 1;
      } else {
        const newProduct = { product: pid };
        cart.products.push(newProduct);
      }
      const updatedCart = await cart.save();

      if (!updatedCart) {
        console.log("Carrito no encontrado");
        return null;
      }

      console.log("carrito actualizado", updatedCart);
      return updatedCart;
    } catch (error) {
      console.error("Error aal agregar prodcuto al carrito", error);
      throw error;
    }
  }

  //encontrar un producto en el carrito por id y actualizar la cantidad
  //en varios
  async findProductInCartAndUpdateQuantity(cid, pid, newQuantity) {
    const updatedCart = await cartModel.findOneAndUpdate(
      { _id: cid, "products._id": pid },
      { $set: { "products.$.quantity": newQuantity } },
      { new: true }
    );

    return updatedCart;
  }
}
