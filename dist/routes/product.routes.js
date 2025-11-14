"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const multer_middlewares_1 = require("../middlewares/multer.middlewares");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Protected routes - require authentication
router.post("/create", auth_middleware_1.verifyToken, auth_middleware_1.requireAdminOrModerator, (0, multer_middlewares_1.getUploadMiddleware)('product').array("pictures", 10), product_controller_1.productController.createProduct);
router.patch("/update/:id", auth_middleware_1.verifyToken, auth_middleware_1.requireAdminOrModerator, (0, multer_middlewares_1.getUploadMiddleware)('product').array("pictures", 10), product_controller_1.productController.updateProduct);
router.delete("/delete/:id", auth_middleware_1.verifyToken, auth_middleware_1.requireAdminOrModerator, product_controller_1.productController.deleteProduct);
// Public routes
router.get("/all-products", product_controller_1.productController.getAllProducts);
router.get("/get/:id", product_controller_1.productController.getProductById);
exports.productRouter = router;
