const OrdersService = {
    getAllOrders(knex) {
      return knex.select('*').from('orders')
    },
  
    insertOrder(knex, newOrder) {
      return knex
        .insert(newOrder)
        .into('orders')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getOrderId(knex, userId, timestamp) {
      return knex
        .from('orders')
        .select('*')
        .where('user_id', userId)
        .andWhere('date_created', timestamp)
        .first()
    },

    insertOrderItems(knex, newOrderItems) {
      return knex
        .insert(newOrderItems)
        .into('order_items')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    deleteOrder(knex, id) {
      return knex('orders')
        .where({ id })
        .delete()
    },
  
    updateOrder(knex, id, newOrderFields) {
      return knex('orders')
        .where({ id })
        .update(newOrderFields)
    },
  }
  
  module.exports = OrdersService




// orderServices: 

  // 1. createOrder (
  //   //inser query for inserting in orderTable with userID and timestamp
  // )

  // 2. getOrderID(
  //   //select query for getting orderId of current userID
  // )

  // 3. inserOrderItem(){
  //   //imsert query for adding productID and quantity to the orderItem table for this orderIF
  // }

  // 4. updateQty(){
  //   //upadte qty query
  // }

  // 5. deleteProduct(){
  //   //delete from orderItem table for productId
  // }