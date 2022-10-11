const AWS = require('aws-sdk');

class StorageService {
  constructor() {
    this._s3 = new AWS.S3();
  }

  writeFile(file, meta) {
    const parameter = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: +new Date() + meta.filename,
      Body: file._data,
      ContentType: meta.headers['content-type'],
    };

    return new Promise((resolve, reject) => {
      this._s3.upload(parameter, (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(data.Location);
      })
    })
  }
}

module.exports = StorageService;
