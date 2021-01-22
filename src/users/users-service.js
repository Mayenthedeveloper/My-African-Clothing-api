const UsersService = {
    getAllUsers(knex) {
      return knex.select('*').from('african_clothings_users')
    },
  
    insertUser(knex, newUser) {
      return knex
        .insert(newUser)
        .into('african_clothings_users')
        .returning('*')
        .then(rows => {
           return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('african_clothings_users')
        .select('*')
        .where('id', id)
        .first()
    },

    getByEmail(knex, email) {
        return knex
          .from('african_clothings_users')
          .select('*')
          .where('email', email)
          .first()
      },
  
    deleteUser(knex, id) {
      return knex('african_clothings_users')
        .where({ id })
        .delete()
    },
  
    updateUser(knex, id, newUserFields) {
      return knex('african_clothings_users')
        .where({ id })
        .update(newUserFields)
    },
  }
  
  module.exports = UsersService