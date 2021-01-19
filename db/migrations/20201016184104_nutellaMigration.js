exports.up = function (knex) {
  return knex.schema
    .createTableIfNotExists("project", (table) => {
      table.increments("projectId").primary();
      table.string("userId");
      table.string("projectName").notNullable();
      table.text("description");
      table.integer("privacy");
      table.string("apiKey");
      table.string("createdBy");
      table.foreign("userId").references("user.userId");
      table.timestamps(true, true);
    })
    .createTableIfNotExists("run", (table) => {
      table.increments("runId").primary();
      table.integer("projectId").unsigned().notNullable();
      table.string("runName").notNullable();
      table.string("state");
      table.integer("runTime");
      table.foreign("projectId").references("project.projectId");
      table.timestamps(true, true);
    })
    .createTableIfNotExists("step", (table) => {
      table.increments("stepId").primary();
      table.integer("runId").unsigned().notNullable();
      table.integer("stepNumber");
      table.string("indicator");
      table.string("system");
      table.foreign("runId").references("run.runId");
    });
};

exports.down = function (knex) {};
