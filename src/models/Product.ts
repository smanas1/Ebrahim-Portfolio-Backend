import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  category: string;
  brandName?: string;
  brandLogo?: string;
  clientName?: string;
  productName: string;
  productPicture?: string;
  productDetails: string;
  moq: string;
  costOfGoods: string;
  sampleCost: string;
  shipToUsa: string;
  asin?: string;
  pictures: string[];
}

const productSchema = new Schema<IProduct>(
  {
    category: { type: String, required: true },
    brandName: { type: String },
    brandLogo: { type: String },
    clientName: { type: String },
    productName: { type: String, required: true },
    productPicture: { type: String },
    productDetails: { type: String, required: true },
    moq: { type: String, required: true },
    costOfGoods: { type: String, required: true },
    sampleCost: { type: String, required: true },
    shipToUsa: { type: String, required: true },
    asin: { type: String, default: "-" },
    pictures: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", productSchema);
