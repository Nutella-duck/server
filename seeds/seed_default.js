exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user")
    .del()
    .then(function () {
      return Promise.all([
        knex("user")
          .insert([
            {userName: "nut", password: "qwer"},
            {userName: "ella", password: "asdf"}
          ])
          .then((project) => {
            return knex("project").insert([
              { projectName: "pj1", userId: 1, apiKey: 111 },
              { projectName: "pj2", userId: 2, apiKey: 222 },
              { projectName: "pj3", userId: 1, apiKey: 333 },
            ])
          })
          .then((project) => {
            return knex("run").insert([
              { runName: "r1", projectId: 1 },
              { runName: "r2", projectId: 1 },
              { runName: "r3", projectId: 1 },
              { runName: "r4", projectId: 2 },
            ]);
          })
          .then((run) => {
            return knex("step").insert([
              { stepNumber: 1, runId: 1, indicator: JSON.stringify({ accuracy: 0.5136481523513794 }), system: JSON.stringify({"cpu":1299,"memory":1354,"net":[2635694080,13737709568,12500757,11846263,0,195216,0,0],"disk":[6991346,3750823,287206056448,154126327808,7477913,2625694]})  },
              { stepNumber: 2, runId: 1, indicator: JSON.stringify({ accuracy: 0.6917036771774292 }), system: JSON.stringify({"cpu":2424,"memory":1355,"net":[2635698176,13737712640,12500780,11846286,0,195216,0,0],"disk":[6991347,3750826,287206318592,154126340096,7477914,2625694]}) },
              { stepNumber: 3, runId: 1, indicator: JSON.stringify({ accuracy: 0.7838888764381409 }), system: JSON.stringify({"cpu":0,"memory":1355,"net":[2635701248,13737715712,12500802,11846308,0,195216,0,0],"disk":[6991349,3750832,287206842880,154126372864,7477914,2625694]})  },
              { stepNumber: 4, runId: 1, indicator: JSON.stringify({ accuracy: 0.8411852121353149 }), system: JSON.stringify({"cpu":0,"memory":1355,"net":[2635704320,13737718784,12500824,11846331,0,195216,0,0],"disk":[6991350,3750834,287207105024,154126381056,7477915,2625694]})  },

              
              { stepNumber: 1, runId: 2, indicator: JSON.stringify({ accuracy: 0.5136481523513794 }), system: JSON.stringify({"cpu":1299,"memory":1354,"net":[2635694080,13737709568,12500757,11846263,0,195216,0,0],"disk":[6991346,3750823,287206056448,154126327808,7477913,2625694]})  },
              { stepNumber: 2, runId: 2, indicator: JSON.stringify({ accuracy: 0.6917036771774292 }), system: JSON.stringify({"cpu":2424,"memory":1355,"net":[2635698176,13737712640,12500780,11846286,0,195216,0,0],"disk":[6991347,3750826,287206318592,154126340096,7477914,2625694]}) },
              { stepNumber: 3, runId: 2, indicator: JSON.stringify({ accuracy: 0.7838888764381409 }), system: JSON.stringify({"cpu":0,"memory":1355,"net":[2635701248,13737715712,12500802,11846308,0,195216,0,0],"disk":[6991349,3750832,287206842880,154126372864,7477914,2625694]})  },
              { stepNumber: 4, runId: 2, indicator: JSON.stringify({ accuracy: 0.8411852121353149 }), system: JSON.stringify({"cpu":0,"memory":1355,"net":[2635704320,13737718784,12500824,11846331,0,195216,0,0],"disk":[6991350,3750834,287207105024,154126381056,7477915,2625694]})  },
            ]);
          })
          .then((hpoProject) => {
            return knex("hpoProject").insert([
              { hpoName: "hpo1", apiKey: "asdf", createBy: "Nutella", state: "Finished" },
              { hpoName: "hpo2", apiKey: "qwer", createBy: "Coder", state: "Finished" },              
            ]);
          })
          .then((hpoConfig) => {
            return knex("hpoConfig").insert([
              { hpoProjectId: 1, method: 2, config: JSON.stringify({"epoch": {"scope": [1, 10]}, "learning_rate": {"value": [0.1, 0.05, 0.01]}}), bestParameter: JSON.stringify({"epoch": 1, "learning_rate": 0.05}) },
              { hpoProjectId: 2, method: 2, config: JSON.stringify({"units": {"scope":[64,1024]}, "dropout1": {"scope":[0.25, 0.75]},
               "optimizer": {"value":['rmsprop', 'adadelta', 'adam']}, "batch_size": {"value":[128, 512]}}) },
            ]);
          })
          .then((hpoRun) => {
            return knex("hpoRun").insert([
              { hpoProjectId: 1, target: JSON.stringify({"eval_loss" : "3.8"}) , runName: "hr1-001", config: JSON.stringify({"method": "tpe", "epoch": 1, "learning_rate": 0.1}) },
              { hpoProjectId: 1, target: JSON.stringify({"eval_loss" : "2.8"}) , runName: "hr1-002", config: JSON.stringify({"method": "tpe", "epoch": 1, "learning_rate": 0.05}) },
              { hpoProjectId: 1, target: JSON.stringify({"eval_loss" : "4.8"}) , runName: "hr1-003", config: JSON.stringify({"method": "tpe", "epoch": 1, "learning_rate": 0.01}) },
              { hpoProjectId: 1, target: JSON.stringify({"eval_loss" : "3.2"}) , runName: "hr1-004", config: JSON.stringify({"method": "tpe", "epoch": 10, "learning_rate": 0.1}) },
              { hpoProjectId: 1, target: JSON.stringify({"eval_loss" : "4.1"}) , runName: "hr1-005", config: JSON.stringify({"method": "tpe", "epoch": 10, "learning_rate": 0.05}) },
              { hpoProjectId: 1, target: JSON.stringify({"eval_loss" : "3.0"}) , runName: "hr1-006", config: JSON.stringify({"method": "tpe", "epoch": 10, "learning_rate": 0.01}) },
            ]);
          })
          .then((parameterImportance) => {
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
