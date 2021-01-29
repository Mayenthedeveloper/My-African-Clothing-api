const OrdersService = {
    getAllOrders(knex) {
      return knex.select('*').from('orders')
    },
  
    insertOrder(knex, newProduct) {
      return knex
        .insert(newProduct)
        .into('orders')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('orders')
        .select('*')
        .where('id', id)
        .first()
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