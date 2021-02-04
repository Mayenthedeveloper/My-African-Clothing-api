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
  
    getById(knex, user_id) {
      console.log(user_id)
      return knex
        .raw(` 
        select user_products.id, products.id as product_id, category, image, size, price, brand, description, products.name 
        from user_products, users, products
        where user_products.product_id = products.id 
        and user_products.user_id = users.id
        and users.id = ${user_id}
        `)
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