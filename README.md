# African Clothing API

Used in conjunction with the African clothing app, this API provides the functionality for getting products, adding products into cart, deleting products not needed in the cart, and ordering products.

You can also view the live site or visit the frontend repo.

This API is not open for public use at this time, but is CORS compatible. The API will respond with a JSON object.

# Endpoints

##  /products
| Route                   | Request        |Body             |Result                      |
|   ----------            |  ----------    |--------------   | --------                   |
| products                | GET            |                 |return all product          |
| products/:product_id    | GET            |                 |return product with that ID |


##  /users
| Route             | Request        |Body                      |Result                      |
|   ----------      |  ----------    |--------------            | --------                   |
| users             | GET            |                          |return all users            |
| users             | POST           |name, email,password      |registers user              |
| users/:user_id    | GET            |                          |return user with that ID    |


##  /user_product
| Route                     | Request        |Body             |Result                            |
|   ----------              |  ----------    |--------------   | --------                         |
| user_products             | GET            |                 |return all product                |
| /user_products/:user_id   | GET            |                 |return user product with that ID  |
| /user_products/:user_id   | DELETE         |                 |delete user product with that ID  |

## Status codes


## Tech Stack

Javascript
React
Node.js
Postgres
HTML
CSS




