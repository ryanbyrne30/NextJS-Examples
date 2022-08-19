import { createRouter } from "./context";
import S3 from "aws-sdk/clients/s3";
import { AWS_BUCKET_NAME, AWS_REGION } from "./env";
import { z } from "zod";

const s3 = new S3({ region: AWS_REGION });

export const awsRouter = createRouter()
  .query("presignedPostUrl", {
    input: z.object({
      filename: z.string(),
    }),
    async resolve({ input }) {
      return await s3.createPresignedPost({
        Bucket: AWS_BUCKET_NAME,
        Fields: {
          key: `public/${input.filename}`,
        },
        Conditions: [["content-length-range", 100, 5000000]],
      });
    },
  })
  .query("listObjects", {
    async resolve() {
      const prefix = "public/";
      const data = await s3
        .listObjects({
          Bucket: AWS_BUCKET_NAME,
          MaxKeys: 10,
          Prefix: prefix,
        })
        .promise();
      // filter only image files
      const images = data.Contents?.filter((c) => {
        const key = c.Key;
        const extension = key?.split(".")[1];
        if (key === undefined || extension === undefined) return false;
        return ["png", "jpg", "jpeg", "webp"].includes(extension);
      });
      return images?.map((image) => ({
        url: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${image.Key}`,
        key: image.Key || "",
      }));
    },
  })
  .mutation("deleteObject", {
    input: z.object({
      key: z.string(),
    }),
    async resolve({ input }) {
      return await s3
        .deleteObject({
          Bucket: AWS_BUCKET_NAME,
          Key: input.key,
        })
        .promise();
    },
  });
