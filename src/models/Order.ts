import mongoose, { Schema, model, Types } from 'mongoose';

const OrderSchema = new Schema(
  {
    table: { type: String, required: false }, // Optional for dine-in orders
    items: [
      {
        _id: { type: Types.ObjectId, ref: 'MenuItem', required: true }, // Refers to MenuItem model
        name: { type: String, required: true }, // Item name
        quantity: { type: Number, required: true }, // Item quantity
        size: { type: String, required: false }, // Optional size of item
        topping: [
          {
            name: { type: String, required: true }, // Name of the topping
            price: { type: Number, required: true }, // Price of the topping
            quantity: { type: Number, required: true }, // Quantity of the topping
          },
        ],
        price: { type: Number, required: true }, // Price of the item
      },
    ],
    status: { type: String, enum: ['pending', 'completed', 'paid'], default: 'pending', required: true }, // Order status
    typeOrder: {
      type: String,
      enum: ['dine-in', 'take-away', 'delivery'],
      required: true,
    }, // Type of order
    customerInfo: {
      name: { type: String, required: false }, // Customer name
      phone: { type: String, required: false }, // Customer phone number
      address: { type: String, required: false }, // Delivery address
    },
    totalAmount: { type: Number, required: true }, // Total amount of the order
    notes: { type: String, required: false }, // Optional notes
  },
  {
    timestamps: true,
  }
);

// Export the model or use the existing one if already defined
export const Order = mongoose.models.Order || model('Order', OrderSchema);
