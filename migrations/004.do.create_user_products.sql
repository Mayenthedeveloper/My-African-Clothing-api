CREATE TABLE user_products (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
product_id INTEGER REFERENCES products(id) ON DELETE CASCADE

);
