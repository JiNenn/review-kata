// src/components/ProductList.tsx
import type { Product } from "../types/product";

export default function ProductList(props: {
  products: readonly Product[];
  onDelete: (id: string) => void;
}) {
  if (props.products.length === 0) {
    return <p style={{ color: "#666" }}>まだ登録がありません</p>;
  }
  const sorted = [...props.products].sort((a, b) => a.price - b.price);
  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left" }}>商品名</th>
          <th style={{ textAlign: "right" }}>価格</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((p) => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td style={{ textAlign: "right" }}>{p.price.toLocaleString()} 円</td>
            <td>
              <button onClick={() => props.onDelete(p.id)}>削除</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
