import { Schema, model, models, type InferSchemaType } from "mongoose";

/** Generated document (invoice, care note, quote, etc.) — FRS §8.4 */
const DocumentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    type: { type: String, required: true, index: true }, // invoice | quote | ndis | ...
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Viewed", "Paid", "Submitted", "Shared"],
      default: "Draft",
      index: true,
    },
    // Template-specific structured payload returned by the AI
    data: { type: Schema.Types.Mixed },
    transcript: { type: String },
    durationSec: { type: Number },
    clientId: { type: Schema.Types.ObjectId, ref: "Client" },
    clientName: { type: String },
    totalAmount: { type: Number },
    currency: { type: String, default: "AUD" },
    pdfUrl: { type: String },
    generatedByAI: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type DocumentDoc = InferSchemaType<typeof DocumentSchema>;

export const DocumentModel =
  models.Document || model("Document", DocumentSchema);
