// src/components/ProductForm.tsx
import { useState } from "react";

export default function ProductForm(props: {
  onAdd: (name: string, price: number) => Promise<{ ok: true } | { ok: false; error: string }> | ({ ok: true } | { ok: false; error: string });
}) {
  const [name, setName] = useState("");
  const [priceText, setPriceText] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const price = Number(priceText);
        if (!Number.isFinite(price) || !Number.isInteger(price) || price < 0) {
          setMsg("価格は0以上の整数で");
          return;
        }
        const res = await props.onAdd(name.trim(), price);
        if ("ok" in res && res.ok) {
          setName("");
          setPriceText("");
          setMsg("登録しました");
        } else {
          setMsg(res.error ?? "入力エラー");
        }
      }}
    >
      <input
        aria-label="商品名"
        placeholder="商品名"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <input
        aria-label="価格(円)"
        placeholder="価格(円)"
        inputMode="numeric"
        value={priceText}
        onChange={(e) => setPriceText(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <button type="submit">登録</button>
      {msg && <span style={{ marginLeft: 8, color: "#666" }}>{msg}</span>}
    </form>
  );
}
