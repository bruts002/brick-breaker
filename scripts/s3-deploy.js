const S3 = require('aws-sdk/clients/s3')
const path = require("path");
const fs = require('fs');
const paths = require('../config/paths')
const exec = require('child_process').exec

// TODO: make async
// TODO: use TypeScript

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(name => {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      callback(filePath, stat);
    } else if (stat.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}

function uploadDir({
  dir,
  baseBucketPath,
  bucketName
}) {
  
  baseBucketPath.slice(-1) !== '/' && (baseBucketPath += '/')

  const s3 = new S3()

  function buildBucketPath(filePath) {
    return `${baseBucketPath}${filePath.substring(dir.length+1)}`
  }

  walkSync(dir, filePath => {
    const bucketPath = buildBucketPath(filePath)
    const params = {
      Bucket: bucketName,
      Key: bucketPath,
      ContentType: 'text/html',
      Body: fs.readFileSync(filePath)
    };
    s3.putObject(params, err => {
        if (err) {
            console.error(err)
        } else {
            console.log(`Successfully uploaded ${bucketPath}`);
        }
    });

  });
};

function getCurrentBranchName() {
  return new Promise((resolve,reject) => {
    exec(`git branch | grep \\* | cut -d ' ' -f2`, (_err, stdout) => {
      if (stdout) resolve(stdout.replace(/[\r\n]/g, ''))
      else reject(new Error('Unable to determine current branch'))
    })
  })
}

const bucketName = 'brick-breaker-staging'
getCurrentBranchName().then(baseBucketPath => {
  uploadDir({
    dir: paths.appBuild,
    baseBucketPath,
    bucketName
  })
  console.log(`See deployment: https://s3.us-east-2.amazonaws.com/${bucketName}/${baseBucketPath}/index.html`)
})
