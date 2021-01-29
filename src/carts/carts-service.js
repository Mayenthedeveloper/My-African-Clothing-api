const CartsService = {
    getAllProducts(knex) {
      return knex.select('*').from('carts')
    },
  
    insertCart(knex, newCart) {
      return knex
        .insert(newCart)
        .into('carts')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('carts')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteProduct(knex, id) {
      return knex('carts')
        .where({ id })
        .delete()
    },
  
    updateProduct(knex, id, newProductFields) {
      return knex('carts')
        .where({ id })
        .update(newProductFields)
    },
  }
  
  module.exports = CartsService