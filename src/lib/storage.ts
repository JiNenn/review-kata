// src/lib/storage.ts
import type { Product } from "../types/product";

export const STORAGE_KEY = "catalog:v1" ;

function isProductLike(x: unknown): x is Product {
  // 基本文法: typeof, オブジェクト/配列の判定, 数値の有限性
  const o = (x && typeof x === "object") ? (x as Record<string, unknown>) : null;
  return !!o
    && typeof o.id === "string"
    && typeof o.name === "string"
    && typeof o.price === "number"
    && Number.isFinite(o.price as number)
    && typeof o.createdAt === "string";
}

export function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    // 型っぽい要素だけ通す
    return data.filter(isProductLike);
  } catch {
    // 例: JSON.parse 失敗やアクセス不可時
    return [];
  }
}

export function saveProducts(products: readonly Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn("saveProducts failed", e);
  }
}

export function clearProducts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("clearProducts failed", e);
  }
}
