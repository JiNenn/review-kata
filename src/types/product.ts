// src/types/product.ts

/**
 * 基本データモデル。createdAt は ISO 8601（UTC推奨）。
 * NOTE: ランタイム検証は zod 側（後続PR）で行う。
 */
export type Product = {
  id: string;
  name: string;
  price: number;      // 非負想定（整数を推奨だがここでは丸めない）
  createdAt: string;  // ISO 8601, e.g. "2025-08-01T00:00:00.000Z"
};
