exports.up = function (knex) {
  return knex.schema.createTableIfNotExists("user", (table) => {
    table.string("userId").primary().notNullable();
    table.string("nickName").notNullable();
    table.unique(["userId"]);
    table.string("password").notNullable();
    table.string("tokens");
  });
};

exports.down = function (knex) {};
