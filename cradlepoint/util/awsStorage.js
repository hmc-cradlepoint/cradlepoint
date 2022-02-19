import aws from 'aws-sdk';

export function uploadUrl(key) {
    aws.config.update({
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
      region: process.env.REGION,
      signatureVersion: 'v4',
    });
  
  
    const s3 = new aws.S3();
    try {
        const post = s3.createPresignedPost({
            Bucket: process.env.BUCKET_NAME,
            Fields: {
              key: key,
            },
            Expires: 60, // seconds
            Conditions: [
              ['content-length-range', 0, 1048576], // up to 1 MB
            ],
          });
        return post
    }
    catch(err) {
        return err
    }
}

export function downloadUrl(key) {
    aws.config.update({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        region: process.env.REGION,
        signatureVersion: 'v4',
    });


    const s3 = new aws.S3();
    try {
        const post = s3.getSignedUrl('getObject', {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Expires: 1800,
        })
        return post
    }
    catch(err) {
        return err
    }
}