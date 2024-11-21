'use strict';

const { Product } = require('../models');
const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const productValidationRules = [
  body('image')
    .optional()
    .custom((value) => {
      // Allow image file path or a valid URL
      if (value && !(value.startsWith('http://') || value.startsWith('https://') || value.endsWith('.jpg') || value.endsWith('.png'))) {
        throw new Error('Image must be a valid URL or file path');
      }
      return true;
    }),
  body('name').notEmpty().withMessage('Product name is required'),
  body('product_code').notEmpty().withMessage('Product Id is required'),
  body('productVolume').notEmpty().withMessage('Product volume must be a decimal number'),
  body('price').isDecimal().withMessage('MRP price must be a decimal number'),
  body('adoPrice').isDecimal().withMessage('ADO price must be a decimal number'),
  body('mdPrice').isDecimal().withMessage('MD price must be a decimal number'),
  body('sdPrice').isDecimal().withMessage('SD price must be a decimal number'),
  body('distributorPrice').isDecimal().withMessage('Distributor price must be a decimal number'),
  body('status').isBoolean().withMessage('Activate status must be a boolean'),
];



// Utility function to handle errors
const handleErrors = (res, error, statusCode = 500) => {
  return res.status(statusCode).json({ error: error.message || 'An error occurred' });
};

// Middleware to validate admin role
const validateAdminRole = (req, res, next) => {
  console.log('User role:', req.user.role);

  if (req.user.role_name !== 'Admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};



exports.createProduct = async (req, res) => {
  try {
    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({
      where: { name: req.body.name },
    });
    if (existingProduct) {
      return res.status(400).json({ error: 'Product with this name already exists' });
    }

    // Extract the filename from the uploaded file
    const imageFilename = req.file ? req.file.filename : null;

    // Create the product with the image filename and createdBy field
    const newProduct = await Product.create({
      ...req.body,
      image: imageFilename, // Save only the image filename
      createdBy: req.user.id, // Assuming req.user contains authenticated user data
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the existing product
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Extract the filename from the uploaded file
    const imageFilename = req.file ? req.file.filename : product.image;

    // Update product details, including image if provided
    const updatedProductData = {
      ...req.body,
      image: imageFilename, // Use new image or keep existing one
    };

    await product.update(updatedProductData);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
         isDeleted: false
         } 
    });
    return res.status(200).json(products);
  } catch (error) {
    return handleErrors(res, error);
  }
};

// Get all products
exports.getAllProductsForUser = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
         isDeleted: false,
         status: true
         } 
    });
    return res.status(200).json(products);
  } catch (error) {
    return handleErrors(res, error);
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    // const product = await Product.findByPk(req.params.id);
    // const product = await Product.findByPk({
     const product = await Product.findOne({
       where: { 
        id: req.params.id,
         isDeleted: false,
         }
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (error) {
    return handleErrors(res, error);
  }
};

exports.getProductByIdForUser = async (req, res) => {
  try {
     const product = await Product.findOne({
       where: { 
        id: req.params.id,
         isDeleted: false,
         status: true
         }
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (error) {
    return handleErrors(res, error);
  }
};



// Delete a product
exports.deleteProduct = [
  validateAdminRole, // Ensure only admin can delete a product
  async (req, res) => {
    try {
      const deleted = await Product.destroy({
        where: { id: req.params.id }
      });

      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' });
      }
      // return res.status(204).send();
      return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      return handleErrors(res, error);
    }
  }
];


// //***  Soft delete a product ***//
// exports.deleteProduct = [
//   validateAdminRole, 
//   async (req, res) => {
//     try {
//       const [deleted] = await Product.update(
//         { isDeleted: true },
//         { where: { id: req.params.id } }
//       );

//       if (!deleted) {
//         return res.status(404).json({ error: 'Product not found' });
//       }
//       return res.status(200).json({ message: 'Product soft-deleted successfully' });
//     } catch (error) {
//       return handleErrors(res, error);
//     }
//   }
// ];