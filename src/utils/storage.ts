
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 Client for Cloudflare R2
const getR2Client = () => {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;

    if (!accountId || !accessKeyId || !secretAccessKey) {
        console.error("Cloudflare R2 credentials missing");
        return null;
    }

    return new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
};

export async function uploadToStorage(file: File, folder: string, filename?: string): Promise<string | null> {
    const client = getR2Client();
    const bucketName = process.env.CLOUDFLARE_BUCKET_NAME;
    const publicUrl = process.env.CLOUDFLARE_PUBLIC_URL; // e.g. https://cdn.orivomart.com

    if (!client || !bucketName) {
        console.error("R2 Client or Bucket Name missing");
        return null; // Fail gracefully or fallback
    }

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize
        const safeName = filename || `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const key = `${folder}/${safeName}`;

        await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: buffer,
            ContentType: file.type,
            ACL: 'public-read', // R2 doesn't always strictly support ACLs the same way, but often harmless or needed depending on bucket settings
        }));

        // Return the Public URL
        return `${publicUrl}/${key}`;

    } catch (error) {
        console.error("R2 Upload Error:", error);
        return null;
    }
}
