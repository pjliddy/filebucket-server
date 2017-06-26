'use strict'

const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const fs = require('fs')

const crypto = require('crypto')
const path = require('path')

const randomBytesPromise = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (error, buffer) => {
      if (error) {
        reject(error)
      } else {
        resolve(buffer.toString('hex'))
      }
    })
  })
}

const s3Upload = (options) => {
  // const today = new Date().toISOString().split('T')[0]
  const ext = path.extname(options.originalname)

  const stream = fs.createReadStream(options.path)

  console.log(`attachment; filename="${options.name}${ext}"`)

  const params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${options.awsName}${ext}`,
    Body: stream,
    ContentType: options.mimetype,
    // ResponseContentDisposition: `attachment; filename="${options.name}"`
  }

  return new Promise((resolve, reject) => {
    s3.upload(params, function (error, data) {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

const awsUpload = function (options) {
  return randomBytesPromise()
    .then((buffer) => {
      options.awsName = buffer
      return options
    })
    .then(s3Upload)
    .catch(console.error)
}

module.exports = awsUpload
