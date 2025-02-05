import Order from '../../../../domain/checkout/entity/order';
import OrderItem from '../../../../domain/checkout/entity/order_item';
import OrderRepositoryInterface from '../../../../domain/checkout/repository/order-repository.interface';
import OrderItemModel from './order-item.model';
import OrderModel from './order.model';

export default class OrderRepository implements OrderRepositoryInterface {
  async update(entity: Order): Promise<void> {
    await OrderModel.sequelize.transaction(async (t) => {
      await OrderModel.update(
        {
          total: entity.total(),
          customer_id: entity.customerId
        },
        {
          where: {
            id: entity.id
          },
          transaction: t
        }
      );

      await OrderItemModel.destroy({
        where: {
          order_id: entity.id
        },
        transaction: t
      });

      const items = entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id
      }));
      await OrderItemModel.bulkCreate(items, { transaction: t });
    });
  }
  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: ['items']
    });
    return new Order(
      orderModel.id,
      orderModel.customer_id,
      orderModel.items.map((item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity))
    );
  }
  async findAll(): Promise<Order[]> {
    let ordersModel = [];
    ordersModel = await OrderModel.findAll({
      include: ['items']
    });
    const Orders = ordersModel.map((orderModel) => {
      return new Order(
        orderModel.id,
        orderModel.customer_id,
        orderModel.items.map((item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity))
      );
    });
    return Orders;
  }
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity
        }))
      },
      {
        include: [{ model: OrderItemModel }]
      }
    );
  }
}
