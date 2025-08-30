// src/components/NearestFinder.tsx
import { useState } from "react";
import type { Product } from "../types/product";
import { findNearest } from "../lib/price";

export default function NearestFinder(props: { products: readonly Product[] }) {
  const [q, setQ] = useState("");
  const n = Number(q);
  const valid = Number.isFinite(n) && Number.isInteger(n) && n >= 0;
  const best = valid ? findNearest(props.products, n) : null;

  return (
    <div>
      <input
        aria-label="価格(円)"
        placeholder="価格(円)"
        inputMode="numeric"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ marginRight: 8 }}
      />
      {valid ? (
        best ? (
          <span>
            最も近い: <strong>{best.name}</strong>（{best.price.toLocaleString()} 円）
          </span>
        ) : (
          <span style={{ color: "#666" }}>一致なし（未登録）</span>
        )
      ) : (
        <span style={{ color: "#666" }}>0以上の整数を入力</span>
      )}
    </div>
  );
}
