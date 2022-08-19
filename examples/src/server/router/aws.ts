import { createRouter } from "./context";
import S3 from "aws-sdk/clients/s3";
import { AWS_BUCKET_NAME, AWS_REGION } from "./env";
import { z } from "zod";

const s3 = new S3({ region: AWS_REGION });

export const awsRouter = createRouter().query("presignedPostUrl", {
  input: z.object({
    filename: z.string(),
  }),
  async resolve({ input }) {
    return await s3.createPresignedPost({
      Bucket: AWS_BUCKET_NAME,
      Fields: {
        key: `public/${input.filename}`,
      },
    });
  },
});
