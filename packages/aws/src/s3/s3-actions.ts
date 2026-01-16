import {
  DeleteObjectCommandOutput,
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { getS3Bucket, getS3Client } from './s3-client';

export async function uploadFiles(
  files: Array<{ file: File; key: string }>,
  disableCacheControl?: boolean,
): Promise<PutObjectCommandOutput[]> {
  const s3Client = getS3Client();

  const results: Promise<PutObjectCommandOutput>[] = [];

  for (let index = 0; index < files.length; index++) {
    const currentFile = files[index];
    const fileData = Buffer.from(await currentFile.file.arrayBuffer());

    results.push(
      s3Client.putObject({
        Key: currentFile.key,
        Bucket: getS3Bucket(),
        Body: fileData,
        ContentType: currentFile.file.type,
        ContentDisposition: currentFile.file.name,
        ...(disableCacheControl && {
          CacheControl: 'no-store, no-cache, must-revalidate',
        }),
      }),
    );
  }

  return Promise.all(results);
}

export async function getFiles(
  keys: string[],
): Promise<GetObjectCommandOutput[]> {
  const s3Client = getS3Client();
  const bucket = getS3Bucket();

  const results: Promise<GetObjectCommandOutput>[] = keys.map((key) => {
    return s3Client.getObject({ Bucket: bucket, Key: key });
  });

  return Promise.all(results);
}

export async function getSignedPublicAccessUrls(
  keys: Array<{ key: string; downloadName?: string }>,
  expiresIn: number = 300,
) {
  const s3Client = getS3Client();
  const bucket = getS3Bucket();
  const results: Promise<string>[] = [];

  keys.forEach((key) => {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key.key,
      ResponseContentDisposition: key.downloadName
        ? `attachment; filename=${encodeURIComponent(key.downloadName)}`
        : undefined,
    });

    results.push(getSignedUrl(s3Client, command, { expiresIn }));
  });

  return Promise.all(results);
}

export async function deleteFiles(
  keys: string[],
): Promise<DeleteObjectCommandOutput[]> {
  const s3Client = getS3Client();
  const bucket = getS3Bucket();

  const results: Promise<DeleteObjectCommandOutput>[] = [];

  keys.forEach((key) =>
    results.push(s3Client.deleteObject({ Bucket: bucket, Key: key })),
  );

  return Promise.all(results);
}
