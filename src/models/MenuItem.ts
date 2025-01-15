import mongoose, { Schema, model, Types } from 'mongoose';


const MenuItemSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String },
    description: { type: String, required: true },
    category: { type: Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: Types.ObjectId, ref: 'Subcategory' },
    price: { type: Number, required: true },
    pricePerSize: [
        {
            size: { type: String, required: true },
            price: { type: Number, required: true },
        },
    ],
    image: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    isBestSeller: { type: Boolean, default: false },
    toppings: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
        },
    ],
}, { timestamps: true });


export const MenuItem = mongoose.models.MenuItem || model('MenuItem', MenuItemSchema);
