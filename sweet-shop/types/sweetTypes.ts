import { Category } from "./categoryTypes";

export interface Sweet {
  id: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: string;
  category?: Category; // optional if populated via Prisma `include`
}
