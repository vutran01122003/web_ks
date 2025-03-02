import { S3Client } from '@aws-sdk/client-s3';

const { VITE_APP_ACCESS_KEY_ID, VITE_APP_SECRET_ACCESS_KEY } = import.meta.env;

export const s3Client = new S3Client({
    region: 'ap-southeast-1',
    credentials: {
        accessKeyId: VITE_APP_ACCESS_KEY_ID,
        secretAccessKey: VITE_APP_SECRET_ACCESS_KEY
    }
});
