import { Schema, model, models, type InferSchemaType } from "mongoose";

/** User account — FRS §8.2 (auth wiring comes in the next step) */
const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    businessName: { type: String },
    abn: { type: String },
    businessAddress: { type: String },
    logoUrl: { type: String },
    // Invoice / payment details (shown on generated invoices & quotes)
    paymentTerms: { type: String, default: "14 days" },
    bankBsb: { type: String },
    bankAccount: { type: String },
    plan: { type: String, enum: ["free", "pro", "business"], default: "free" },
    role: { type: String, enum: ["owner", "admin", "member", "viewer"], default: "owner" },
    emailVerified: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "suspended", "deleted"], default: "active" },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof UserSchema>;

export const UserModel = models.User || model("User", UserSchema);
