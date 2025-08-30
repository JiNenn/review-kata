import type { Product } from "../types/product";

/** p が best より“良い”なら true */
function isPreferred(p: Product, best: Product, target: number): boolean {
  const dP = Math.abs(p.price - target);
  const dB = Math.abs(best.price - target);
  if (dP !== dB) return dP < dB;                 // 1) 差が小さい
  if (p.price !== best.price) return p.price < best.price; // 2) 低価格優先
  return p.createdAt < best.createdAt;           // 3) 古い方
}

export function findNearest(
  products: readonly Product[],
  target: number
): Product | null {
  if (products.length === 0) return null;
  let best = products[0];

  // .slice(1) は読みやすいが配列生成を伴う。for ループは最速/最少メモリ。
  for (let i = 1; i < products.length; i++) {
    const p = products[i];
    if (isPreferred(p, best, target)) best = p;
  }
  return best;
}
