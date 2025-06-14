import {request} from '../utils/request'

const BASE_URL = 'http://localhost:8080'; // 后端接口地址
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface OrderResult {
  orderId: number;
  totalPrice: number;
}

export const getProducts = async (): Promise<Product[]> => {
  const data = await request.get(`${BASE_URL}/products`);
  return data
};

export const createOrder = async (
  productId: number,
  quantity: number
): Promise<OrderResult> => {
  const res = await request.post(
     `${BASE_URL}/orders`,
    { productId, quantity },
  );
  return res;
};
