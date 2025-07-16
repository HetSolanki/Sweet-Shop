"use server";

export const fetchAllSweets = async () => {
  const res = await fetch("http://localhost:3000/api/sweets");
  const result = await res.json();
  return result;
};

export const purchaseSweet = async (sweetId: string, quantity: string) => {
  const res = await fetch("http://localhost:3000/api/sweets/purchase", {
    method: "POST",
    body: JSON.stringify({ sweetId, quantity }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await res.json();
  return result;
};
