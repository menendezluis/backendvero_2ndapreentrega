import { Router } from "express";
import mongoose from "mongoose";
import { __dirname } from "../utils.js";
import * as dotenv from "dotenv";
import { paginate } from "mongoose-paginate-v2";

import Products from "../dao/dbManagers/productManager.js";
import ProductModel from "../dao/models/product.js"; 
import productsModel from "../dao/models/product.js";
//import Products from "../dao/models/product.js";


const router=Router();

const products=new Products();

// Obtener todos los productos
router.get('/all', async (req, res) => {
  try {
    const allProducts = await products.getAll();
    res.render('product',{products:allProducts});
  } catch (error) {
    res.status(500).json({
        message:"Error al buscar los productos",
        error:error
    });
  }
});

//NUEVO METODO GET
router.get("/", async (req, res) => {
  const { limit, page, filter, sort } = req.query;
  const defaultLimit = 10;
  const defaultPage = 1;
  
  // Parsea el valor de la página a un número entero
  const currentPage = parseInt(page, 10) || defaultPage;
  
  try {
    let response = await products.getAll();
    
    // Resolución de los filtros por categoría
    if (filter) {
      response = await products.getByCategory(filter);
    }
    
    // Resolución de la ordenación
    if (sort === 'asc' || sort === 'desc') {
      response.sort((a, b) => {
        return sort === 'asc' ? a.price - b.price : b.price - a.price;
      });
    }

    const startIndex = (currentPage - 1) * (limit ? +limit : defaultLimit);
    const endIndex = startIndex + (limit ? +limit : defaultLimit);
  
    const paginatedResponse = response.slice(startIndex, endIndex);

    const totalPages = Math.ceil(response.length / (limit ? +limit : defaultLimit));
   
    res.render('product', {
      products: paginatedResponse,
      pagination: {
        status: 'success',
        totalPages: totalPages,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        nextPage: endIndex < response.length ? currentPage + 1 : null,
        page: currentPage,
        hasPrevPage: currentPage > 1,
        hasNextPage: endIndex < response.length,
        prevLink: currentPage > 1 ? `/api/products?page=${currentPage - 1}` : null,
        nextLink: endIndex < response.length ? `/api/products?page=${currentPage + 1}` : null
      }
    });

  } catch (err) {
    res.status(500).json({
      message: "Error al obtener los productos",
      error: err
    });
  }
});


 
  //mostrar el detalle de un producto 
  // router.get('/detail/:productId', async (req, res) => {
  //   const productId = req.params.productId;
  
  //   try {
  //      // consulta a la base de datos para obtener los detalles del producto por su ID
  //     const productDetails = await products.getById(productId);
  
  //     if (!productDetails) {
  //       return res.status(404).json({ error: 'Producto no encontrado' });
  //     }
  
  //     res.render('productdetail', { product: productDetails }); 
  //   } catch (error) {
  //     res.status(500).json({ error: 'Error al obtener los detalles del producto' });
  //   }
  // });
  


  // Obtener un producto por ID
  router.get('/:productId', async (req, res) => {
    const  productId  = req.params.productId;
    try {
      const productById = await products.getById(productId);
      res.render('productdetail', { product: productById }); 
    } catch (error) {
      res.status(500).json({
        message: "Error al buscar el producto por id",
        error: error
      });
    }
  });
  
  
  // Crear un nuevo producto
  router.post('/', async (req, res) => {
    const productData = req.body;
    try {
      const newProduct = await products.save(productData);
      
      res.json({message:"Producto creado",data:newProduct});
    } catch (error) {
        res.status(500).json({
            message:"Error al crear el producto",
            error:error
        });
    }
  });
  
  // Actualizar un producto por ID
  router.put('/:productId', async (req, res) => {
    const { productId } = req.params;
    const updateData = req.body;
    try {
      const updatedProduct = await products.update(productId, updateData);
      res.json({message:"Producto actualizado",data:updatedProduct});
    } catch (error) {
        res.status(500).json({
            message:"Error al actualizar el producto",
            error:error
        });
    }
  });
  
  // Eliminar un producto por ID
  router.delete('/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
      const productDeleted= await products.delete(productId);
      res.json({message:"Producto eliminado",data:productDeleted});
    } catch (error) {
        res.status(500).json({
            message:"Error al eliminar el producto",
            error:error
        });
    }
  });
  
  export default router;