import { describe, it, expect } from "vitest";
import type { Product } from "../src/types/product";
import { reducer, createProduct } from "../src/state/useCatalog";

describe("useCatalog reducer", () => {
  it("load: 外部配列から状態へロードする（参照は別物）", () => {
    const items: Product[] = [
      { id: "1", name: "A", price: 100, createdAt: "2025-08-01T00:00:00.000Z" }
    ];
    const prev: Product[] = [];
    const next = reducer(prev, { type: "load", items });
    expect(next).toEqual(items);
    expect(next).not.toBe(items);
  });

  it("add: 末尾に追加する（不変更新）", () => {
    const prev: Product[] = [
      { id: "1", name: "A", price: 100, createdAt: "2025-08-01T00:00:00.000Z" }
    ];
    const item: Product = { id: "2", name: "B", price: 200, createdAt: "2025-08-02T00:00:00.000Z" };
    const next = reducer(prev, { type: "add", item });
    expect(next).toHaveLength(2);
    expect(next[1]).toEqual(item);
    expect(next).not.toBe(prev);
  });

  it("remove: 指定IDを削除する（不変更新）", () => {
    const prev: Product[] = [
      { id: "1", name: "A", price: 100, createdAt: "2025-08-01T00:00:00.000Z" },
      { id: "2", name: "B", price: 200, createdAt: "2025-08-02T00:00:00.000Z" }
    ];
    const next = reducer(prev, { type: "remove", id: "1" });
    expect(next).toHaveLength(1);
    expect(next[0].id).toBe("2");
    expect(next).not.toBe(prev);
  });

  it("clear: 空配列を返す", () => {
    const prev: Product[] = [
      { id: "1", name: "A", price: 100, createdAt: "2025-08-01T00:00:00.000Z" }
    ];
    const next = reducer(prev, { type: "clear" });
    expect(next).toEqual([]);
    expect(next).not.toBe(prev);
  });
});

describe("createProduct", () => {
  it("入力から Product を生成し、id と createdAt を付与する", () => {
    const p = createProduct({ name: "X", price: 123 });
    expect(p.name).toBe("X");
    expect(p.price).toBe(123);
    expect(typeof p.id).toBe("string");
    expect(p.createdAt).toMatch(/^20\d{2}-\d{2}-\d{2}T/);
  });
});
