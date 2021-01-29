const UsersProductsService = {
    getAllUsersProducts(knex) {
      return knex.select('*').from('user_products')
    },


    getProductsOfUsers(knex, user_id) {
      return knex
        .from('user_products')
        .select('*')
        .where('user_id', user_id)
      
    },
  
    insertUsersProducts(knex, newUsersProducts) {
      return knex
        .insert(newUsersProducts)
        .into('user_products')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('user_products')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteUsersProducts(knex, id) {
      return knex('user_products')
        .where({ id })
        .delete()
    },
  
    updateUsersProducts(knex, id, newUsersProductsFields) {
      return knex('user_products')
        .where({ id })
        .update(newUsersProductsFields)
    },
  }
  
  module.exports = UsersProductsService