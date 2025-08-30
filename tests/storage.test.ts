import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Product } from "../src/types/product";
import { STORAGE_KEY, loadProducts, saveProducts, clearProducts } from "../src/lib/storage";

function setupLocalStorageMock() {
  const store = new Map<string, string>();
  const localStorageMock = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => { store.set(k, String(v)); },
    removeItem: (k: string) => { store.delete(k); },
    clear: () => { store.clear(); },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size; }
  };
  Object.defineProperty(globalThis, "localStorage", {
    value: localStorageMock, configurable: true
  });
}

beforeEach(() => {
  setupLocalStorageMock();
});

describe("storage I/O", () => {
  it("空ストレージは loadProducts() が [] を返す", () => {
    expect(loadProducts()).toEqual([]);
  });

  it("save → load のラウンドトリップが成立する", () => {
    const items: Product[] = [
      { id: "1", name: "A", price: 100, createdAt: "2025-08-01T00:00:00.000Z" }
    ];
    saveProducts(items);
    expect(loadProducts()).toEqual(items);
  });

  it("壊れた JSON が入っていても [] で復旧（例外は投げない）", () => {
    localStorage.setItem(STORAGE_KEY, "{not-json");
    expect(loadProducts()).toEqual([]);
  });

  it("配列でない JSON は [] を返す", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: "x" }));
    expect(loadProducts()).toEqual([]);
  });

  it("要素の型が不正ならフィルタされて [] になる", () => {
    const broken = [{ id: "x", name: "X", price: "free", createdAt: "2025-08-01T00:00:00.000Z" }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(broken));
    expect(loadProducts()).toEqual([]);
  });

  it("保存失敗しても例外を投げず console.warn する", () => {
    const spy = vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    saveProducts([{ id: "1", name: "A", price: 100, createdAt: "2025-08-01T00:00:00.000Z" }]);
    expect(warn).toHaveBeenCalledOnce();
    spy.mockRestore();
    warn.mockRestore();
  });

  it("clearProducts() は保存済みデータを消す", () => {
    saveProducts([{ id: "1", name: "A", price: 100, createdAt: "2025-08-01T00:00:00.000Z" }]);
    clearProducts();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(loadProducts()).toEqual([]);
  });
});
