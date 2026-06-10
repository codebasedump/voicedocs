import { Schema, model, models, type InferSchemaType } from "mongoose";

/** Client / contact — FRS §8.6 */
const ClientSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    abn: { type: String },
    defaultPaymentTerms: { type: String, default: "14 days" },
    tags: { type: [String], default: [] },
    notes: { type: String },
    totalDocuments: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ClientDoc = InferSchemaType<typeof ClientSchema>;

export const ClientModel = models.Client || model("Client", ClientSchema);
