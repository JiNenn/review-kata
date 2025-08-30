// tests/price.test.ts
import { describe, it, expect } from "vitest";
import type { Product } from "../src/types/product";
import { findNearest } from "../src/lib/price";

describe("findNearest", () => {
  it("空配列なら null を返す", () => {
    expect(findNearest([], 1000)).toBeNull();
  });

  it("最も近い価格の商品を返す（ユニーク最小差）", () => {
    const items: Product[] = [
      { id: "a", name: "A", price: 800, createdAt: "2025-08-01T00:00:00.000Z" },
      { id: "b", name: "B", price: 1200, createdAt: "2025-08-01T00:00:00.000Z" },
      { id: "c", name: "C", price: 1800, createdAt: "2025-08-01T00:00:00.000Z" }
    ];
    // target=1300 → 差は B:100, A:500, C:500 → B
    const r = findNearest(items, 1300);
    expect(r?.id).toBe("b");
  });

  it("同差の場合は低い価格を優先する", () => {
    const items: Product[] = [
      { id: "a", name: "A", price: 1000, createdAt: "2025-08-01T00:00:00.000Z" },
      { id: "b", name: "B", price: 1300, createdAt: "2025-08-01T00:00:00.000Z" }
    ];
    // target=1150 → 差は A:150, B:150 → 低価格 A を選ぶ
    const r = findNearest(items, 1150);
    expect(r?.id).toBe("a");
  });

  it("価格まで同じなら createdAt が古い方を選ぶ（ISO 8601 の昇順）", () => {
    const items: Product[] = [
      { id: "old", name: "Old", price: 1000, createdAt: "2025-08-01T00:00:00.000Z" },
      { id: "new", name: "New", price: 1000, createdAt: "2025-08-02T00:00:00.000Z" }
    ];
    // target=1000 → 価格差は両方0 → createdAt が古い "old"
    const r = findNearest(items, 1000);
    expect(r?.id).toBe("old");
  });
});
