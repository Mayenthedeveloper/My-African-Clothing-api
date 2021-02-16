# African Clothing API

Used in conjunction with the African clothing app, this API provides the functionality for getting products, adding products into cart, deleting products not needed in the cart, and ordering products.

You can also view the [live site](https://african-clothing.mayenthedeveloper.vercel.app/) or visit the [frontend repo.](https://github.com/Mayenthedeveloper/African-Clothing-app)

This API is not open for public use at this time. 

# Endpoints

##  /products
| Route                     | Request        |Body             |Result                      |
|   ----------              |  ----------    |--------------   | --------                   |
| /products                 | GET            |                 |return all product          |
| /products/:product_id     | GET            |                 |return product with that ID |


##  /users
| Route               | Request        |Body                      |Result                      |
|   ----------        |  ----------    |--------------            | --------                   |
| /users              | GET            |                          |return all users            |
| /users              | POST           |name, email,password      |register  user              |
| /users/:user_id     | GET            |                          |return user with that ID    |


##  /user_product
| Route                         | Request        |Body             |Result                            |
|   ----------                  |  ----------    |--------------   | --------                         |
| /cart                         | GET            |                 |return all product                |
| /cart/:user_id                | GET            |                 |return user product with that ID  |
| /cart/:product_id             | DELETE         |                 |delete user product with that ID  |


## Status codes
| Code              | Endpoint                        |Request                    |Possible reason                                                  |
|   ----------      |  ----------                     |--------------             | --------                                                        |
| 500               | any                             |   any                     |Server error                                                     |
| 200               | any                             |   GET                     |Data was successfully returned.                                  |
| 201               | any                             |   POST                    |Your POST was successful.                                        |
| 204               | any with an id path param       |   PATCH                   |Your entry was successfully updated.                             |
| 204               | any with an id path param       |   DELETE                  |Your entry was successfully deleted.                             |
| 400               | any                             |   POST                    |A required query param in the body is missing.                   | 
| 404               | any with an id path param       |   GET, DELETE, or PATCH   |An entry with that ID doesn't exist.                             |
| 400               | any with an id path param       |   PATCH                   |You must include at least one of the query params in the body.   |



## Tech Stack

* Javascript
* React
* Node.js
* Postgres
* HTML
* CSS




