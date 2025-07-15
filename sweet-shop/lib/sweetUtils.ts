import { AddSweetType } from "@/types/sweetApiTypes";

export const addSweets = ({
  name,
  category,
  price,
  quantity,
}: AddSweetType) => {
  // adding new sweets..!
  return { name, category, price, quantity };
};
