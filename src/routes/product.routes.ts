import { Router } from "express";
import { productController } from "../controllers/product.controller";

const router = Router();

router.get("/all-products", productController.getAllProducts);

export const productRouter = router;
