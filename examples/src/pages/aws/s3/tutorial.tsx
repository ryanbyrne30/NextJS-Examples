import CodeBlock from "@/components/CodeBlock";
import Link from "next/link";

export default function S3Tutorial() {
  return (
    <div>
      <section>
        <h2>Note to Developers</h2>
        <p>
          It is important to always test your work on multiple browsers and
          devices. This is mainly advertised for making sure you have a great
          user experience, but ALSO it helps in the debugging process.
        </p>
        <p>
          In my experience debugging this AWS connection I have found that
          Firefox has returned CORS issues leading me down the wrong path. After
          testing on Brave I received an error associated with the payload data.
          This made debugging much faster.
        </p>
        <p>So always test on multiple browsers!</p>
      </section>
      <section>
        <h2>Overview</h2>
        <p>
          The web server will have access to S3 using an IAM user. This means
          the web server should have its own IAM user associated with it along
          with only the required permissions it needs for the S3 bucket. This
          permissions the IAM user will need are
        </p>
        <ul className="list">
          <li>ListObject</li>
          <li>GetObject</li>
          <li>PutObject</li>
          <li>DeleteObject</li>
        </ul>
        <p>
          The server will handle deleting and fetching all the files from S3,
          but the client will be in charge of uploading and fetching individual
          files.
        </p>
        <p>
          To allow the client the ability to upload images on behalf of the web
          server, AWS S3 allows for{" "}
          <span className="link">
            <Link
              href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html"
              className="link"
            >
              pre-signed urls
            </Link>
          </span>
          . These urls are generated using the IAM user account associated with
          the web server. This means that if the user account does not have
          DeleteObject permissions, neither do the pre-signed urls.
        </p>
        <p>
          <span className="link">POST policies</span> also exist for pre-signed
          urls allowing you to set permissions for POST requests sent with a
          pre-signed url.
        </p>
        <p>
          <span className="link">
            <Link href="https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html">
              AWS JavaScript SDK API Reference
            </Link>
          </span>
        </p>
      </section>
      <section>
        <h2>Create an S3 Bucket</h2>
        <div className="block">
          <p>
            In order to allow users from a website to uploading, delete and view
            images or files on an S3 bucket, you must configure it to have the
            proper permissions.
          </p>
          <section>
            <h3>Allow Public Read Access for S3</h3>
            <p>
              To allow public read access to the S3 bucket, we will need to
              disable <i>Block public access</i> in the <i>Permissions</i> tab.
              We will also need to modify the <i>Bucket policy</i> to only allow
              read access on a specified resource. In this case we have a folder
              named &apos;public&apos; that we want to allow access to.
            </p>
            <CodeBlock
              code={`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Allow read access to public folder",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::MY_BUCKET_NAME/public/\*"
    }
  ]
}
`}
            />
          </section>
          <section>
            <h3>Configuring CORS</h3>
            <p>
              A problem clients may encounter when attempting to upload data to
              the S3 bucket are CORS errors. You can configure CORS in the{" "}
              <i>Permissions</i> tab as follows
            </p>
            <CodeBlock
              code={`[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "POST"
    ],
    "AllowedOrigins": [
      "https://mywebsite.com" // or "*" for testing
    ],
    "ExposeHeaders": [
      "ETag"
    ]
  }
]`}
            />
          </section>
        </div>
      </section>

      <section>
        <h2>Authorization with IAM</h2>
        <section>
          <h3>Create an IAM Policy</h3>
          <p>
            Start by creating an IAM policy specific for your web server. In
            this case we only need to create a policy that allows the following
            actions on the S3 bucket we created earlier.
          </p>
          <ul className="list">
            <li>ListObject</li>
            <li>GetObject</li>
            <li>PutObject</li>
            <li>DeleteObject</li>
          </ul>
        </section>
        <section>
          <h3>Create an IAM User Group</h3>
          <p>
            Next create a user group and attach the IAM policy to the group.
          </p>
        </section>
        <section>
          <h3>Create an IAM User</h3>
          <p>
            Finally create an IAM User and add it to the User Group. It will
            inherit the permissions you set earlier and will be used by the web
            server to interact with AWS.
          </p>
          <p>
            Since we will likely only be using this account for the web server
            we can check the box <i>Access key - Programmatic access</i> under{" "}
            <i>Access Type</i>.
          </p>
          <p>
            For more information, check out these{" "}
            <span className="link">
              <Link href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console">
                instructions
              </Link>
            </span>
            .
          </p>
        </section>
      </section>

      <section>
        <h2>Web Server</h2>
        <p>
          For this backend we are using{" "}
          <span className="link">
            <Link href="https://trpc.io/">tRPC</Link>
          </span>
          , but this will work for all JavaScript backends.
        </p>
        <section>
          <h3>Install the AWS JavaScript SDK</h3>
          <CodeBlock code={`yarn add aws-sdk`} />
        </section>
        <section>
          <h3>Configure S3 Object</h3>
          <p>
            Create an S3 object where you want to run code that connects with
            S3.
          </p>
          <CodeBlock
            code={`import S3 from "aws-sdk/clients/s3";
import { AWS_BUCKET_NAME, AWS_REGION } from "./env";

const s3 = new S3({ region: AWS_REGION });
`}
          />
        </section>
        <section>
          <h3>Generating Pre-Signed POST Urls</h3>
          <p>
            We will want to generate a pre-signed POST url that the user can
            upload files with to the <i>public</i> folder in our bucket. We can
            do this with the following.
          </p>
          <CodeBlock
            code={`await s3.createPresignedPost({
  Bucket: AWS_BUCKET_NAME,
  Fields: {
    key: \`public/\${filename}\`,
  },
  Conditions: [["content-length-range", 100, 1000000]], // only allow from 0.1MB to 1MB
});`}
          />
        </section>

        <section>
          <h3>Fetching List of Files</h3>
          <p>
            Since Pre-Signed URLs do not support ListObject, we will need to
            fetch the urls of the files server-side.
          </p>
          <CodeBlock
            code={`function fetchFiles = () => {
  const data = await s3
    .listObjects({
      Bucket: AWS_BUCKET_NAME,
      MaxKeys: 10,        // max objects returned
      Prefix: "public/",  // folder with read access
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
    url: \`https://\${AWS_BUCKET_NAME}.s3.\${AWS_REGION}.amazonaws.com/\${image.Key}\`,
    key: image.Key || "",
  }));
}
`}
          />
        </section>

        <section>
          <h3>Deleting a File</h3>
          <p>
            We can also more tightly control deletion by handling it server-side
          </p>
          <CodeBlock
            code={`function deleteFile = (key: string) => {
  return await s3
    .deleteObject({
      Bucket: AWS_BUCKET_NAME,
      Key: input.key,
    })
    .promise();
}`}
          />
        </section>
      </section>

      <section>
        <h2>Client Side</h2>
        <section>
          <h3>Fetching Images</h3>
          <p>
            The first thing we will likely want to do is fetch all the images
            from S3. We can do that by calling our backend function. In this
            case we setup a tRPC router that handles this query.
          </p>
          <CodeBlock
            code={`function Images() {
  const listObjectsQuery = trpc.useQuery(["aws.listObjects"]);
  
  return (
    <ul>
      {listObjectsQuery.data?.map((image) => (
        <li key={image.key}>
          <img src={image.url} />
        </li>
      ))}
    </ul>
  )
}`}
          />
        </section>

        <section>
          <h3>Deleting Images</h3>
          <p>
            Deleting images is similar to fetching images, we just call our
            backend.
          </p>
          <CodeBlock
            code={`function DeleteButton({ imageKey }: { imageKey: string}) {
  const deleteImageMutation = trpc.useMutation(["aws.deleteObject"]);
  
  const deleteImage = () => {
    deleteImageMutation.mutate({ key: imageKey });
  };

  return (
    <button onClick={deleteImage}>
      delete
    </button>
  )
}`}
          />
        </section>

        <section>
          <h3>Uploading Images</h3>
          <p>
            Here is where things get a little more complex. In order to upload
            an image from the client, the client first needs to request a
            pre-signed POST url from our backend. Then the client will need to
            send a request to our S3 bucket using the pre-signed url.
          </p>
          <p>First let&apos;s request that pre-signed POST url</p>
          <CodeBlock
            code={`
const [file, setFile] = useState<File | null>(null);
            
const presignedUrlQuery = trpc.useQuery(
  ["aws.presignedPostUrl", { filename: file?.name || "" }],
  { enabled: false }
);

const getPresignedUrl = async () => {
  const { data } = await presignedUrlQuery.refetch();
  if (data === undefined) {
    alert("Could not retrieve presigned POST url");
    return;
  }
  return data;
}`}
          />
          <p>
            Then we need to create the payload that the client will send to the
            S3 bucket.
          </p>
          <p className="text-rose-500 font-bold">
            NOTE: AWS ignores any form data after the input &apos;file&apos;.
            Therefore the &apos;file&apos; data MUST be the LAST piece of data
            in the form data. If it comes before you will receive a CORS error
            or other errors depending on the browser.
          </p>
          <CodeBlock
            code={`const createPayload = (fields: PresignedPost.Fields, file: File) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([k, v]) => formData.append(k, v || ""));
  formData.append("file", file); // the file MUST be the LAST item appended
  return formData;
}`}
          />
          <p>Finally we send the request!</p>
          <CodeBlock
            code={`const uploadFile = (file: File) => {
  const { url, fields } = await getPresignedUrl();
  const payload = createPayload(fields, file)
  return await fetch(url, {
    method: "POST",
    body: formData,
  });
}`}
          />
        </section>
      </section>
      <section>
        <h2>Conclusion</h2>
        <p>
          The rest is up to you in how you want to implement this into your
          project. This entire project is available on{" "}
          <span className="link">
            <Link href="https://github.com/ryanbyrne30/NextJS-Examples/tree/main/examples">
              GitHub
            </Link>
          </span>{" "}
          as a reference. Good luck and happy coding!
        </p>
      </section>
    </div>
  );
}
