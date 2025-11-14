import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { getUploadMiddleware } from "../middlewares/multer.middlewares";
import { verifyToken, requireAdmin, requireAdminOrModerator } from "../middlewares/auth.middleware";

const router = Router();

// Protected routes - require authentication
router.post(
  "/create",
  verifyToken,
  requireAdminOrModerator,
  getUploadMiddleware('product').array("pictures", 10),
  productController.createProduct
);
router.patch(
  "/update/:id",
  verifyToken,
  requireAdminOrModerator,
  getUploadMiddleware('product').array("pictures", 10),
  productController.updateProduct
);
router.delete("/delete/:id", verifyToken, requireAdminOrModerator, productController.deleteProduct);

// Public routes
router.get("/all-products", productController.getAllProducts);
router.get("/get/:id", productController.getProductById);

export const productRouter = router;
