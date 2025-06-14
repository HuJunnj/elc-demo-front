import React, { useEffect, useState } from 'react';
import { View, Text, Button, Input } from '@tarojs/components';
import { getProducts, createOrder, Product, OrderResult } from '../../services/api';

const IndexPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<string>('1');
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((e) =>{
        console.log(e)
        setError('加载商品失败')
      });
  }, []);

  const handleOrder = async () => {
    if (!selectedProductId) {
      setError('请选择商品');
      return;
    }
    const qty = parseInt(quantity, 10);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(qty) || qty <= 0) {
      setError('请输入有效购买数量');
      return;
    }
    setError(null);
    try {
      const result = await createOrder(selectedProductId, qty);
      setOrderResult(result);
    } catch (err: any) {
      setError(err.message || '下单失败');
      setOrderResult(null);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>商品列表</Text>
      {products.map((product) => (
        <View key={product.id} style={{ marginTop: 3, borderBottom: '1px solid #eee', paddingBottom: 3 }}>
          <Text style={{ fontSize: 20 }}>{product.name} - ￥{product.price} - 库存：{product.stock}</Text>
          <Button
            size='mini'
            type={selectedProductId === product.id ? 'primary' : 'default'}
            onClick={() => setSelectedProductId(product.id)}
            style={{ marginTop: 6 }}
          >
            {selectedProductId === product.id ? '已选择' : '选择'}
          </Button>
        </View>
      ))}

      {selectedProductId && (
        <View style={{ marginTop: 20 }}>
          <Text>购买数量：</Text>
          <Input
            type='number'
            value={quantity}
            onInput={(e) => setQuantity(e.detail.value)}
            style={{ border: '1px solid #ccc', padding: 6, width: 100 }}
          />
          <Button type='primary' onClick={handleOrder} style={{ marginLeft: 10 }}>
            下单
          </Button>
        </View>
      )}

      {error && (
        <Text style={{ color: 'red', marginTop: 20 }}>{error}</Text>
      )}

      {orderResult && (
        <View style={{ marginTop: 20 }}>
          <Text>订单成功！</Text>
          <Text>订单ID：{orderResult.orderId}</Text>
          <Text>总价：￥{orderResult.totalPrice}</Text>
        </View>
      )}
    </View>
  );
};

export default IndexPage;
