const { AppDataSource } = require('./dataSource');

const getProductAmount = async (whereQuery) => {
  const product = await AppDataSource.query(
    `SELECT * FROM products WHERE product_category_id
    ${whereQuery}`
  );
  return product.length;
};

const getTotalCategoryId = async () => {
  const ID = await AppDataSource.query(`SELECT id FROM product_categories`);

  return ID;
};
const getCategoryNameById = async (categoryId) => {
  const name = await AppDataSource.query(
    `select product_categories.category_name FROM product_categories
    WHERE product_categories.id=${categoryId}`
  );

  return name;
};
const getRandomSellerId = async () => {
  const sellers = await AppDataSource.query(
    `SELECT id FROM sellers ORDER BY rand() LIMIT 3;`
  );
  return sellers;
};

const getSellerNameById = async (sellerId) => {
  const name = await AppDataSource.query(
    `select name FROM sellers
    WHERE sellers.id=${sellerId}`
  );

  return name;
};

const getProducts = async (
  joinQuery = '',
  whereQuery = '',
  orderingQuery = '',
  limitOffsetQuery = ''
) => {
  let query = `SELECT 
  products.id AS productId,
  products.name AS productName,
  products.images AS productImg,
  products.price AS originalPrice,
  products.discount_rate AS discountRate,
  products.price * (products.discount_rate / 100) AS discountAmount,
  products.price - (products.price * (products.discount_rate / 100)) AS totalPrice,
  (
    SELECT COUNT(reviews.product_id)
    FROM reviews
    WHERE reviews.product_id = products.id
) AS reviewNumber,
  IFNULL((
    SELECT IFNULL(SUM(reviews.rating), 0) / IFNULL(COUNT(reviews.product_id), 1)
    FROM reviews
    WHERE reviews.product_id = products.id), 0) AS rating
   FROM products
   ${joinQuery}
   WHERE 1=1
   ${whereQuery}
   ${orderingQuery}
   ${limitOffsetQuery}
   `;

  const products = await AppDataSource.query(query);
  return products;
};

module.exports = {
  getProductAmount,
  getTotalCategoryId,
  getRandomSellerId,
  getCategoryNameById,
  getSellerNameById,
  getProducts,
};
