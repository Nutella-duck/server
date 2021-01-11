exports.up = function (knex) {
  return knex.schema.createTableIfNotExists("user", (table) => {
    table.increments("userId").primary();
    table.string("userName");
    table.unique(["userName"]);
    table.string("password");
  });
};

exports.down = function (knex) {};
