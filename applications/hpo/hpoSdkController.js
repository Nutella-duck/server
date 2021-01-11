const knex = require("../../db/knex");
const { JsonWebTokenError } = require("jsonwebtoken");

let hpoSdkController = {};

const getStepNumber = async (runId) => {
  return knex
    .max("stepNumber as stepNumber")
    .from("step")
    .where({ runId: runId });
};

hpoSdkController.log = async (req, res) => {
  let runId = req.body['run_id'];
  let metrics = req.body['metrics'];
  let systems = req.body['system_info']
  
  metrics = JSON.stringify(metrics);
  systems = JSON.stringify(systems);
    
  let stepNumber = await getStepNumber(runId);
  stepNumber = stepNumber[0].stepNumber + 1;

  return knex
    .insert({ runId: runId, stepNumber: stepNumber, indicator: metrics, system: systems})
    .into("step")
    .then((result) => {
      res.end("log Success");
    });
};

const getProjectId = async (id) => {
  return knex.select("projectId").from("project").where({ apiKey: id });
};

const getHpoProjectIdFromKey = async (id) => {
  return knex.select("hpoProjectId").from("hpoProject").where({ apiKey: id });
};

const creatRunModel = async (name, projectId) => {
  return knex
    .insert({ runName: name, projectId: projectId, state: 'completed', createdBy: '이해인' })
    .from("run")
    .then((result) => {
      return result;
    });
};

hpoSdkController.init = async (req, res) => {
  let { id, name } = req.query;

  let projectId = await getProjectId(id);

  try {
    if (projectId.length == 0) {
      res.status(401).end("관련된 프로젝트가 없습니다.");
    }

    projectId = projectId[0].projectId;

    const runId = await creatRunModel(name, projectId);

    let result = {};
    result["runId"] = runId[0];
    result["projectId"] = projectId;

    res.json(result);
  } catch (e) {
    res.status(401).end(e);
  }
};

const getHpoProjectId = async (hpoName) => {
  return knex
    .select("hpoProjectId")
    .from("hpoProject")
    .where({ hpoName: hpoName })
    .then((result) => {
      return result;
    })
    .catch(function (err) {
      console.error(err);
    });
};

const hpoConfigSave = async (method, config, bestResult, bestHp, hpoProjectId) => {
  delete bestResult.status;

  return knex
    .update({
      method: JSON.stringify(method),
      config: JSON.stringify(config),
      bestParameter: JSON.stringify(bestHp),
      bestResult: JSON.stringify(bestResult),
    })
    .from("hpoConfig")
    .where({ hpoProjectId: hpoProjectId })
    .then((result) => {
      return result;
    });
};

const trialResultSave = async (target, config, id) => {
  return knex
    .insert({ target: target, config: config, hpoProjectId: id })
    .into("hpoRun");
};

const hpoRunSave = async (trialResult, trialHp, importances, hpoProjectId) => {
  let resultList = [];
  for (key in trialResult) {
    delete trialResult[key].status;
    resultList.push(trialResult[key]);
  }

  let list = [];
  let listName = [];

  for (key in trialHp) {
    list.push(trialHp[key]);
    listName.push(key);
  }

  for (let i = 0; i < list[0].length; i++) {
    let jsonVal = {};
    for (let j = 0; j < list.length; j++) {
      let key = listName[j];
      jsonVal[key] = list[j][i];
    }

    trialResultSave(
      JSON.stringify(resultList[i]),
      JSON.stringify(jsonVal),
      hpoProjectId
    );
  }

  // importance 저장
  parameter = Object.keys(resultList[0])[0]
  for (let i = 0; i< importances.length; i++){
    configParameter = listName[i];
    importance = importances[i];
    importanceSave(parameter, configParameter, importance, hpoProjectId);
  }
};

const importanceSave = async (parameter, configParameter, importance, id) => {
  return knex
    .insert({parameter: parameter, configParameter: configParameter,
    importance: importance, hpoProjectId: id})
    .into("parameterImportance");
};

hpoSdkController.hpo = async (req, res) => {
  let hpoProjectKey = req.body['hpo_project_key'];
  let method = req.body['method'];
  let config = req.body['config'];
  let bestResult = req.body['best_result'];
  let bestHp = req.body['best_hp'];
  let trialResult = req.body['trial_result'];
  let trialHp = req.body['trial_hp'];
  let importances = req.body['importances']

  try {
    let hpoProjectId = await getHpoProjectIdFromKey(hpoProjectKey);

    if (hpoProjectId.length == 0) {
      res.status(401).end("관련된 프로젝트가 없습니다.");
    }

    hpoProjectId = hpoProjectId[0].hpoProjectId;

    await hpoConfigSave(method, config, bestResult, bestHp, hpoProjectId);

    await hpoRunSave(trialResult, trialHp, importances, hpoProjectId);
  } catch (e) {
    res.status(401).end(e);
  }

  res.end("test");
};

hpoSdkController.getHpo = async (req, res) => {
  let { id, name } = req.query;

  let hpoProjectId = await getHpoProjectIdFromKey(id);

  try {
    if (hpoProjectId.length == 0){
      res.status(401).end("관련된 HPO 프로젝트가 없습니다.");
    }

    hpoProjectId = hpoProjectId[0].hpoProjectId;

    knex
      .select("hpoProjectId", "method", "config")
      .from("hpoConfig")
      .where({ hpoProjectId: hpoProjectId })
      .then((result) => {
        res.json(result);
      })
  } catch (e) {
    res.status(401).end(3);
  }
};

module.exports = hpoSdkController;
