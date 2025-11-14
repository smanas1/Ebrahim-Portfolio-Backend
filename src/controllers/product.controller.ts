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

const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
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

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
      existingPictures, // This will hold the existing pictures to keep
    } = req.body;

    const files = req.files as Express.Multer.File[];

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Store old pictures to potentially delete them from Cloudinary
    const oldPictures = [...(product.pictures || [])];
    
    // Initialize pictures array with existing pictures
    let updatedPictures = [...(product.pictures || [])];

    // If existingPictures was sent from frontend, use it to filter existing pictures
    if (existingPictures) {
      try {
        const existingPicturesArray = JSON.parse(existingPictures);
        updatedPictures = updatedPictures.filter(picture => existingPicturesArray.includes(picture));
      } catch (e) {
        console.log('Could not parse existingPictures, proceeding with all existing pictures');
      }
    }

    // Add new images if any were uploaded
    if (files && files.length > 0) {
      const newPictureUrls = files.map((file) => (file as any).path);
      updatedPictures = [...updatedPictures, ...newPictureUrls];
    }

    // Determine which pictures were removed (in old but not in updated)
    const picturesToDelete = oldPictures.filter(pic => !updatedPictures.includes(pic));

    // Delete removed pictures from Cloudinary
    if (picturesToDelete.length > 0) {
      for (const pictureUrl of picturesToDelete) {
        try {
          // Extract public ID from the Cloudinary URL
          const urlParts = pictureUrl.split('/');
          const publicIdWithExt = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExt.split('.')[0]; // Remove file extension
          
          // Delete image from Cloudinary
          await cloudinary.uploader.destroy(publicId);
        } catch (deleteErr) {
          console.error('Error deleting image from Cloudinary:', deleteErr);
          // Continue with product update even if image deletion fails
        }
      }
    }

    product.pictures = updatedPictures;
    product.category = category;
    product.brandName = brandName;
    product.productName = productName;
    product.productDetails = productDetails;
    product.moq = moq;
    product.costOfGoods = costOfGoods;
    product.sampleCost = sampleCost;
    product.shipToUsa = shipToUsa;
    product.asin = asin;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating product",
      error,
    });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find the product to get image URLs before deletion
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images from Cloudinary if they exist
    if (product.pictures && product.pictures.length > 0) {
      for (const pictureUrl of product.pictures) {
        try {
          // Extract public ID from the Cloudinary URL
          // Assuming Cloudinary URLs follow the format: https://res.cloudinary.com/.../upload/.../public_id.ext
          const urlParts = pictureUrl.split('/');
          const publicIdWithExt = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExt.split('.')[0]; // Remove file extension
          
          // Delete image from Cloudinary
          await cloudinary.uploader.destroy(publicId);
        } catch (deleteErr) {
          console.error('Error deleting image from Cloudinary:', deleteErr);
          // Continue with product deletion even if image deletion fails
        }
      }
    }

    // Now delete the product document from database
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product and associated images deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

export const productController = {
  getAllProducts,
  createProduct,
  updateProduct,
  getProductById,
  deleteProduct,
};
