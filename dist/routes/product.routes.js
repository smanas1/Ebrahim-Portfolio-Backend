"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const router = (0, express_1.Router)();
router.get("/all-products", product_controller_1.productController.getAllProducts);
exports.productRouter = router;
