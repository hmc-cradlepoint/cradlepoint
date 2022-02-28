import aws from 'aws-sdk';

export default async function handler(req, res) {
  aws.config.update({
    accessKeyId: `${process.env.ACCESS_KEY}`,
    secretAccessKey: `${process.env.SECRET_KEY}`,
    region: `${process.env.REGION}`,
    signatureVersion: 'v4',
  });


  const s3 = new aws.S3();
  const post = await s3.getSignedUrl('getObject', {
    Bucket: process.env.BUCKET_NAME,
    Key: req.query.key,
    Expires: 1800,
   })

  res.status(200).json(post);
}
