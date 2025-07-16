export interface Where {
  name: { contains?: string };
  category: { name?: { contains?: string } };
  price?: {
    gte?: number;
    lte?: number;
  };
  quantity?: {
    gte?: number;
  };
}
