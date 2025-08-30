// tests/validators.test.ts
import { describe, it, expect } from "vitest";
import {
  productInputSchema,
  productInputCoercedSchema,
  parseProductInput,
  safeParseProductInput,
  safeCoerceProductInput,
  makeProductInputSchemaWithReserved,
} from "../src/lib/validators";

describe("productInputSchema（非coerce）", () => {
  it("trim後の最小長・最大長を満たす name と整数の price なら success", () => {
    const res = productInputSchema.safeParse({ name: "  Apple  ", price: 1200 });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.name).toBe("Apple"); // trimされている
      expect(res.data.price).toBe(1200);
    }
  });

  it("name が空（trim後0文字）なら fail", () => {
    const res = productInputSchema.safeParse({ name: "   ", price: 100 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0]?.path).toEqual(["name"]);
    }
  });

  it("name が51文字なら fail（上限は50）", () => {
    const long = "a".repeat(51);
    const res = productInputSchema.safeParse({ name: long, price: 100 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0]?.path).toEqual(["name"]);
    }
  });

  it("price が負数なら fail（下限は0）", () => {
    const res = productInputSchema.safeParse({ name: "A", price: -1 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0]?.path).toEqual(["price"]);
    }
  });

  it("price が 1_000_001 なら fail（上限は 1_000_000）", () => {
    const res = productInputSchema.safeParse({ name: "A", price: 1_000_001 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0]?.path).toEqual(["price"]);
    }
  });

  it("price が小数なら fail（int必須）", () => {
    const res = productInputSchema.safeParse({ name: "A", price: 12.3 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0]?.path).toEqual(["price"]);
    }
  });

  it('price が文字列 "1200" だと fail（coerce しないため）', () => {
    const res = productInputSchema.safeParse({ name: "A", price: "1200" as unknown });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0]?.path).toEqual(["price"]);
    }
  });
});

describe("productInputCoercedSchema（coerce あり）", () => {
  it('price: "1200" を number に強制変換して success', () => {
    const res = productInputCoercedSchema.safeParse({ name: "A", price: "1200" });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.price).toBe(1200);
    }
  });

  it('price: "12.3" は number にはなるが int 条件で fail', () => {
    const res = productInputCoercedSchema.safeParse({ name: "A", price: "12.3" });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0]?.path).toEqual(["price"]);
    }
  });

  it("境界: 0 と 1_000_000 は success（数値/文字列どちらも）", () => {
    const ok1 = productInputCoercedSchema.safeParse({ name: "A", price: 0 });
    const ok2 = productInputCoercedSchema.safeParse({ name: "A", price: "0" });
    const ok3 = productInputCoercedSchema.safeParse({ name: "A", price: 1_000_000 });
    const ok4 = productInputCoercedSchema.safeParse({ name: "A", price: "1000000" });
    expect(ok1.success && ok2.success && ok3.success && ok4.success).toBe(true);
  });
});

describe("parseProductInput / safeParseProductInput", () => {
  it("parseProductInput は成功時に整形済みデータを返す（例外を用いる）", () => {
    const data = parseProductInput({ name: "  Kiwi ", price: 500 });
    expect(data).toEqual({ name: "Kiwi", price: 500 });
  });

  it("parseProductInput は失敗時に例外を投げる", () => {
    expect(() => parseProductInput({ name: "", price: -1 })).toThrow();
  });

  it("safeParseProductInput は例外を投げず success=false を返す", () => {
    const res = safeParseProductInput({ name: "", price: -1 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(Array.isArray(res.error.issues)).toBe(true);
      expect(res.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("safeCoerceProductInput は '1200' を受け入れて success", () => {
    const res = safeCoerceProductInput({ name: "Mango", price: "1200" });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.price).toBe(1200);
      expect(res.data.name).toBe("Mango");
    }
  });
});

describe("makeProductInputSchemaWithReserved", () => {
  it('予約語 "admin" を name に使うと fail、通常名は success', () => {
    const schema = makeProductInputSchemaWithReserved(["admin", "root"]);
    const ng = schema.safeParse({ name: "admin", price: 1000 });
    const ok = schema.safeParse({ name: "user", price: 1000 });

    expect(ng.success).toBe(false);
    if (!ng.success) {
      // refine で付けたメッセージ
      expect(
        ng.error.issues.some((i) => i.path[0] === "name" && String(i.message).includes("reserved"))
      ).toBe(true);
    }
    expect(ok.success).toBe(true);
  });

  it("予約語リストが Set でも Array でも同じ挙動", () => {
    const s1 = makeProductInputSchemaWithReserved(["x", "y"]);
    const s2 = makeProductInputSchemaWithReserved(new Set(["x", "y"]));

    const ng1 = s1.safeParse({ name: "x", price: 10 });
    const ng2 = s2.safeParse({ name: "y", price: 10 });
    const ok1 = s1.safeParse({ name: "z", price: 10 });
    const ok2 = s2.safeParse({ name: "z", price: 10 });

    expect(ng1.success).toBe(false);
    expect(ng2.success).toBe(false);
    expect(ok1.success).toBe(true);
    expect(ok2.success).toBe(true);
  });
});
