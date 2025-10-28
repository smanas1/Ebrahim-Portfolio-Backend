import { Request, Response } from "express";
import { Product } from "../models/Product";
import cloudinary from "../configs/cloudinary";

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      category,
      brandName,
      productName,
      productDetails,
      moq,
      costOfGoods,
      sampleCost,
      shipToUsa,
      asin,
    } = req.body;

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one product picture is required" });
    }

    const pictureUrls = files.map((file) => (file as any).path);

    const product = new Product({
      category,
      brandName,
      productName,
      productDetails,
      moq,
      costOfGoods,
      sampleCost,
      shipToUsa,
      asin,
      pictures: pictureUrls,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating product",
      error,
    });
  }
};
export const productController = {
  getAllProducts,
  createProduct,
};
