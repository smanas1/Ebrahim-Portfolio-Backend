"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const Product_1 = require("../models/Product");
const getAllProducts = async (req, res) => {
    try {
        const products = await Product_1.Product.find();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
};
exports.productController = {
    getAllProducts,
};
