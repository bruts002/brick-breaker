const S3 = require('aws-sdk/clients/s3')
const exec = require('child_process').exec

// TODO: remove branches with no activity in a month

const s3 = new S3()

const bucketName = 'brick-breaker-staging'

function getActiveDeployments() {
  return new Promise((resolve, reject) => {
    s3.listObjectsV2({
      Bucket: bucketName,
      Prefix: 'feature'
    }, (err, data) => {
      if(err) {
        reject(err)
      } else {
        const deployedFeatures = data.Contents
          .filter(({ Key }) => /^feature\/.*\/index\.html$/.test(Key))
          .map(({ Key }) => Key.slice(8, -11)) // trim 'feature/' and '/index.html'
        resolve(deployedFeatures)
      }
    })
  })
}

function getActiveBranches() {
  return new Promise((resolve,reject) => {
    exec(`git branch -r | grep feature | sed 's/origin\\/feature\\///'`, (err, stdout) => {
      if (err) reject(new Error('Unable to determine branches that should be deployed'))
      else resolve(stdout.split(/[\r\n]/g).map(branch => branch.trim()).filter(branch => branch))
    })
  })
}

function getFileContent(branches) {
// TODO: make a better webpage than that!
  if (branches.length) {
    return `
<html>
<h1>Deployed Feature Branches</h1>
<ul>
  ${branches.map(branch => `<li><a href="./${branch}/index.html">${branch}</a></li>`)}
</ul>
  `
  } else {
    return `
<html>
<h2>No deployed feature branches at this time</h2>
  `
  }
}

Promise.all([getActiveBranches(), getActiveDeployments()]).then(([activeBranches, activeDeployments]) => {
  const objectsToDelete = activeDeployments.filter(branch => activeBranches.indexOf(branch) === -1)
  if (objectsToDelete.length) {
    s3.deleteObjects({
      Bucket: bucketName,
      Delete: {
        Quiet: false,
        Objects: objectsToDelete.map(Key => ({ Key }))
      }
    })
  }
  const activeDeployedBranches = activeDeployments.filter(branch => activeBranches.indexOf(branch) !== -1)
  const fileContent = getFileContent(activeDeployedBranches)
  const params = {
    Bucket: bucketName,
    Key: 'feature/index.html',
    ContentType: 'text/html',
    Body: fileContent
  }
  s3.putObject(params, err => {
    if (err) console.error(err)
    else console.log(`Successfully uploaded feature/index.html`)
  })
})
