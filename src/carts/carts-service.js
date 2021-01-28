const CartsService = {
    getAllProducts(knex) {
      return knex.select('*').from('african_clothings_products')
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
        .from('african_clothings_products')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteProduct(knex, id) {
      return knex('african_clothings_products')
        .where({ id })
        .delete()
    },
  
    updateProduct(knex, id, newProductFields) {
      return knex('african_clothings_products')
        .where({ id })
        .update(newProductFields)
    },
  }
  
  module.exports = CartsService