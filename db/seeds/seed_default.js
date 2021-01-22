const { JsonWebTokenError } = require("jsonwebtoken");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user")
    .del()
    .then(function () {
      return Promise.all([
        knex("user")
          .insert([
            {userId: "songmi11", nickname: "song", password: "12345", email: "ss@gmail.com", company: "Soma", location: "Incheon", introduction: "hi"},
            {userId: "haein11", nickname: "hae", password: "56789", email: "hh@gmail.com", company: "Soma", location: "Seoul", introduction: "hello"}
          ])
          .then(() => {
            return knex("project").insert([
              { userId: "songmi11", projectName: "pj1", description: "test", privacy: 1, apiKey: "111" },
              { userId: "songmi11", projectName: "pj2", description: "test", privacy: 0, apiKey: "222" },
              { userId: "haein11", projectName: "pj3", description: "test", privacy: 0, apiKey: "333" },
            ])
          })
          .then(() => {
            return knex("run").insert([
              { runName: "r1", projectId: 1, state: "Finished" },
              { runName: "r2", projectId: 1, state: "Finished" },
              { runName: "r3", projectId: 1, state: "Finished" },
              { runName: "r4", projectId: 2, state: "Crashed" },
              { runName: "r5", projectId: 3, state: "Finished" },
              { runName: "r6", projectId: 3, state: "Finished" },
            ]);
          })
          .then(() => {
            return knex("step").insert([
              { stepNumber: 1, runId: 1, indicator: JSON.stringify({ accuracy: 0.5136481523513794 }), system: JSON.stringify({"cpu":1299,"memory":1354}) },
              { stepNumber: 2, runId: 1, indicator: JSON.stringify({ accuracy: 0.6917036771774292 }), system: JSON.stringify({"cpu":2424,"memory":1355}) },
              { stepNumber: 3, runId: 1, indicator: JSON.stringify({ accuracy: 0.7838888764381409 }), system: JSON.stringify({"cpu":0,"memory":1355}) },
              { stepNumber: 4, runId: 1, indicator: JSON.stringify({ accuracy: 0.8411852121353149 }), system: JSON.stringify({"cpu":0,"memory":1355}) },
              
              { stepNumber: 1, runId: 2, indicator: JSON.stringify({ accuracy: 0.5136481523513794 }), system: JSON.stringify({"cpu":1299,"memory":1354}) },
              { stepNumber: 2, runId: 2, indicator: JSON.stringify({ accuracy: 0.6917036771774292 }), system: JSON.stringify({"cpu":2424,"memory":1355}) },
              { stepNumber: 3, runId: 2, indicator: JSON.stringify({ accuracy: 0.7838888764381409 }), system: JSON.stringify({"cpu":0,"memory":1355}) },
              { stepNumber: 4, runId: 2, indicator: JSON.stringify({ accuracy: 0.8411852121353149 }), system: JSON.stringify({"cpu":0,"memory":1355}) },
              
              { stepNumber: 1, runId: 5, indicator: JSON.stringify({ accuracy: 0.5136481523513794 }), system: JSON.stringify({"cpu":1299,"memory":1354}) },
              { stepNumber: 2, runId: 5, indicator: JSON.stringify({ accuracy: 0.6917036771774292 }), system: JSON.stringify({"cpu":2424,"memory":1355}) },
              { stepNumber: 3, runId: 5, indicator: JSON.stringify({ accuracy: 0.7838888764381409 }), system: JSON.stringify({"cpu":0,"memory":1355}) },
              { stepNumber: 4, runId: 5, indicator: JSON.stringify({ accuracy: 0.8411852121353149 }), system: JSON.stringify({"cpu":0,"memory":1355}) },
            ]);
          })
          .then(() => {
            return knex("hpoProject").insert([
              { userId: "songmi11", hpoName: "hpo1", description: "test", apiKey: "asdf", state: "Finished" },
              { userId: "haein11", hpoName: "hpo2", description: "test", apiKey: "qwer", state: "Finished" }, 
              { userId: "haein11", hpoName: "hpo3", description: "test", apiKey: "zxcv", state: "Finished" },              
            ]);
          })
          .then(() => {
            return knex("hpoConfig").insert([ //bestResult 없음
              { hpoProjectId: 1, method: 2, 
                config: JSON.stringify({"epoch": {"scope": [1, 10]}, "learning_rate": {"value": [0.1, 0.05, 0.01]}}),
                bestParameter: JSON.stringify({"epoch": 1, "learning_rate": 0.05}),
                bestResult: JSON.stringify({"loss": 1.8}) },
              { hpoProjectId: 2, method: 2, 
                config: JSON.stringify({"units": {"scope":[64,1024]}, "dropout1": {"scope":[0.25, 0.75]},
               "optimizer": {"value":['rmsprop', 'adadelta', 'adam']}, "batch_size": {"value":[128, 512]}}),
                bestParameter: JSON.stringify({"units": 64, "dropout1": 0.25, "optimizer": "adam", "batch_size": 128}),
                bestResult: JSON.stringify({"loss": 3.1}) },
            ]);
          })
          .then(() => {
            return knex("hpoRun").insert([ //time 없음
              { hpoProjectId: 1, target: JSON.stringify({"eval_loss" : "3.8"}) , runName: "hr1-001", config: JSON.stringify({"method": "tpe", "epoch": 1, "learning_rate": 0.1}) },
              { hpoProjectId: 1, target: JSON.stringify({"eval_loss" : "2.8"}) , runName: "hr1-002", config: JSON.stringify({"method": "tpe", "epoch": 1, "learning_rate": 0.05}) },
              { hpoProjectId: 1, target: JSON.stringify({"eval_loss" : "4.8"}) , runName: "hr1-003", config: JSON.stringify({"method": "tpe", "epoch": 1, "learning_rate": 0.01}) },
              { hpoProjectId: 1, target: JSON.stringify({"eval_loss" : "3.2"}) , runName: "hr1-004", config: JSON.stringify({"method": "tpe", "epoch": 10, "learning_rate": 0.1}) },
              { hpoProjectId: 1, target: JSON.stringify({"eval_loss" : "4.1"}) , runName: "hr1-005", config: JSON.stringify({"method": "tpe", "epoch": 10, "learning_rate": 0.05}) },
              { hpoProjectId: 1, target: JSON.stringify({"eval_loss" : "3.0"}) , runName: "hr1-006", config: JSON.stringify({"method": "tpe", "epoch": 10, "learning_rate": 0.01}) },
            ]);
          })
          .then(() => {
            return knex("parameterImportance").insert([
              { hpoProjectId: 1, parameter: "eval_loss", configParameter: "epoch", importance: "10", correlation: "9"},
              { hpoProjectId: 1, parameter: "eval_loss", configParameter: "learning_rate", importance: "8", correlation: "7"},
              { hpoProjectId: 1, parameter: "accuracy", configParameter: "epoch", importance: "5", correlation: "3"},
              { hpoProjectId: 1, parameter: "accuracy", configParameter: "learning_rate", importance: "7", correlation: "4"},
            ]);
          })
          .then(() => {
            console.log("Seeding complete!");
          })
          .catch((error) => {
            console.log(`Error seeding data: ${error}`);
          }),
      ]);
    });
};
