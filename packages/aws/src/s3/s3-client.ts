import { S3 } from "@aws-sdk/client-s3";

let s3Client: S3;
let s3Bucket: string;

export function getS3Client(): S3 {
  if (!s3Client) {
    if (!process.env.AWS_ACCESS_KEY_ID)
      throw new Error("AWS_ACCESS_KEY_ID not found in env");

    if (!process.env.AWS_SECRET_ACCESS_KEY)
      throw new Error("AWS_SECRET_ACCESS_KEY not found in env");

    if (!process.env.AWS_REGION) throw new Error("AWS_REGION not found in env");

    s3Client = new S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });
  }

  return s3Client;
}

export function getS3Bucket() {
  if (!s3Bucket) {
    if (!process.env.AWS_S3_BUCKET_NAME)
      throw new Error("AWS_S3_BUCKET_NAME not found in env");

    s3Bucket = process.env.AWS_S3_BUCKET_NAME;
  }

  return s3Bucket;
}
