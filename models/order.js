
import mongoose from"mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        quantity: Number,
        price: Number
      }
    ],
    totalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered"],
      default: "pending"
    },
       paymentMethod: {
type: String,
      required: true
       },
      paymentStatus: {
        type: String,
      required: true
      },

      paymentInfo:{
        paymentId:{
        type: Number,
      required: true
      }}
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
