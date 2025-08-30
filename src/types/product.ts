// src/types/product.ts
export type PriceYen = number;
/**
 * 基本データモデル。createdAt は ISO 8601（UTC推奨）。
 * NOTE: ランタイム検証は zod 側（後続PR）で行う。
 */

export type Product = {
  id: string;
  name: string;
  price: PriceYen;
  createdAt: string;
};

export type ProductInput = Pick<Product, "name" | "price">;
