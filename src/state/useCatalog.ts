import { useEffect, useReducer, useCallback } from "react";
import type { Product } from "../types/product";
import { loadProducts, saveProducts, clearProducts } from "../lib/storage";
import { safeParseProductInput } from "../lib/validators";
import type { ProductInput } from "../lib/validators";

type State = ReadonlyArray<Product>;
type Action =
  | { type: "load"; items: ReadonlyArray<Product> }
  | { type: "add"; item: Product }
  | { type: "remove"; id: string }
  | { type: "clear" };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "load":
      return [...action.items];
    case "add":
      return [...state, action.item];
    case "remove":
      return state.filter(p => p.id !== action.id);
    case "clear":
      return [];
  }
}

export function createProduct(input: ProductInput): Product {
  const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const createdAt = new Date().toISOString();
  return { id, name: input.name, price: input.price, createdAt };
}

export function useCatalog() {
  const [products, dispatch] = useReducer(reducer, [], () => loadProducts());

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  const add = useCallback((input: unknown) => {
    const res = safeParseProductInput(input);
    if (!res.success) return { ok: false as const, error: "invalid input" };
    const item = createProduct(res.data);
    dispatch({ type: "add", item });
    return { ok: true as const, value: item };
  }, []);

  const remove = useCallback((id: string) => {
    dispatch({ type: "remove", id });
  }, []);

  const clear = useCallback(() => {
    clearProducts();
    dispatch({ type: "clear" });
  }, []);

  return { products, add, remove, clear } as const;
}
