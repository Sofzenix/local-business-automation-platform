// import { Schema, model } from "mongoose";
// import mongoose from "mongoose";

// const menuSchema = new Schema(
//   {
//     businessId: {
//       type: Schema.Types.ObjectId,
//       ref: "Business",
//       required: false
//     },

//     itemName: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     price: {
//       type: Number,
//       required: true
//     },

//     category: {
//       type: String,
//       enum: ["breakfast", "lunch", "dinner"],
//       required: true
//     },

//     isAvailable: {
//       type: Boolean,
//       default: false
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// export default mongoose.model("Menu", menuSchema);

import { Schema, model } from "mongoose";

const menuSchema = new Schema(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true
    },

    itemName: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true
    },

    category: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true
    },

    isAvailable: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default model("Menu", menuSchema);
