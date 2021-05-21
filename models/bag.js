const Pool = require("pg").Pool;
const pool = new Pool({
  user: "macbook",
  host: "localhost",
  database: "bag",
  password: "",
  port: 5433,
});

const insertItem = (request, response) => {
  pool.query(
    "INSERT INTO selection VALUES ('loc@gmail.com', 'tra xanh', '1')",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const searchItemByEmail = (request, response) => {
  pool.query(
    "SELECT productName FROM selection WHERE email = 'loc@gmail.com'",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createTable = (request, response) => {
  pool.query(
    "CREATE TABLE [IF NOT EXISTS] selection (email VARCHAR(30), productName VARCHAR(30), number VARCHAR(30))",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const removeItemByEmail = (request, response) => {
  pool.query(
    "DELETE FROM selection WHERE email = 'loc@gmail.com'",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const updateItemByEmail = (request, response) => {
  pool.query(
    "UPDATE selection SET number = 3 WHERE email = 'loc@gmail.com'",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const Bag = class {
  constructor(email, products) {
    this.email = email;
    this.products = products;
  }
  save() {
    try {
      createTable().then((error, results) => {
        if (error) {
          console.log(error);
        } else {
          this.products.forEach((item) => {
            insertItem(this.email, item.nameProduct, item.number).then(
              (res, err) => {}
            );
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
};

module.exports.Bag = Bag;
