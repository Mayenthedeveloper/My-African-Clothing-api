const ProductsService = {
    getAllProducts(knex) {
      return knex.select('*').from('products')
    },
  
    insertProduct(knex, newProduct) {
      return knex
        .insert(newProduct)
        .into('products')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('products')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteProduct(knex, id) {
      return knex('products')
        .where({ id })
        .delete()
    },
  
    updateProduct(knex, id, newProductFields) {
      return knex('products')
        .where({ id })
        .update(newProductFields)
    },
  }
  
  module.exports = ProductsService



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