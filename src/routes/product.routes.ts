import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { upload } from "../middlewares/multer.middlewares";

const router = Router();

router.get("/all-products", productController.getAllProducts);
router.post(
  "/create",
  upload.array("pictures", 10),
  productController.createProduct
);

export const productRouter = router;
