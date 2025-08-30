// src/pages/CatalogPage.tsx
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import NearestFinder from "../components/NearestFinder";
import { useCatalog } from "../state/useCatalog";

export default function CatalogPage() {
  const { products, add, remove, clear } = useCatalog();

  return (
    <main style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: 12 }}>Catalog</h1>

      <section style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, margin: "8px 0" }}>新規登録</h2>
        <ProductForm
          onAdd={async (name, price) => {
            const res = add({ name, price });
            return res.ok ? { ok: true } : { ok: false, error: res.error };
          }}
        />
      </section>

      <section style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, margin: "8px 0" }}>
          一覧 <button onClick={clear}>全削除</button>
        </h2>
        <ProductList products={products} onDelete={remove} />
      </section>

      <section>
        <h2 style={{ fontSize: 18, margin: "8px 0" }}>近似検索</h2>
        <NearestFinder products={products} />
      </section>
    </main>
  );
}
