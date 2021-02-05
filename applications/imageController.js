const knex = require("../db/knex");
const AWS = require('aws-sdk')

let allProjectsController = {};

// 프로젝트 6개씩 정보 반환 (my page에서 프로젝트 카드에 사용)
allProjectsController.uploadImage = async (req, res)=> {
  const file = req.files.file;
  AWS.config.region = 'us-east-2'
  AWS.config.update({
    accessKeyId : process.env.ACCESS_KEY_ID,
    secretAccessKey:process.env.SECRET_ACCESS_KEY
  });
  let s3_params ={
    Bucket: 'haeinabucket',
    Key : '/public-read',
    ContentType:file.mimetype,
    Body:file.data
  }
  let s3obj = new AWS.S3({params:s3_params});
  s3obj.upload()
      .on('httpUploadProgress',function(evt){})
      .send(function (err,data) {
        res.status(200).send(data)
        console.log(data.Location)
        
      })
};
module.exports = allProjectsController;
