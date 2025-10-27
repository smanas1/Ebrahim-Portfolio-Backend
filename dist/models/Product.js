"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.Product = (0, mongoose_1.model)("Product", productSchema);
