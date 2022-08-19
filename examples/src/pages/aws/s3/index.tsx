import { trpc } from "@/utils/trpc";
import { PresignedPost } from "aws-sdk/clients/s3";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";

function UploadedImage({ url, imageKey }: { url: string; imageKey: string }) {
  const deleteImageMutation = trpc.useMutation(["aws.deleteObject"]);

  const deleteImage = () => {
    deleteImageMutation.mutate({ key: imageKey });
  };

  if (deleteImageMutation.isSuccess) window.location.replace("");

  return (
    <div className="rounded p-1 relative">
      <Image
        src={url}
        alt={imageKey}
        width={250}
        height={250}
        layout="fixed"
        objectFit="cover"
        className={`text-center rounded`}
      />
      <div className="opacity-0 hover:opacity-100 absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        <button onClick={deleteImage} className="cursor-pointer bg-rose-500">
          delete
        </button>
      </div>
    </div>
  );
}

function Uploader() {
  const minSize = 100;
  const maxSize = 5 * 1000000;
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const presignedUrlQuery = trpc.useQuery(
    ["aws.presignedPostUrl", { filename: file?.name || "" }],
    { enabled: false }
  );

  const getFileOrFail = () => {
    if (file === null) throw new Error("File does not exist");
    return file;
  };

  const checkFileSize = (file: File) => {
    if (file.size < minSize || file.size > maxSize)
      alert(
        `Invalid file size. Must be in range [${(minSize / 1000000).toFixed(
          3
        )}MB-${(maxSize / 1000000).toFixed(3)}MB]: ${(
          file.size / 1000000
        ).toFixed(5)}MB`
      );
  };

  const getPresignedUrl = async () => {
    const { data } = await presignedUrlQuery.refetch();
    if (data === undefined) {
      throw Error("Could not retrieve presigned POST url");
    }
    return data;
  };

  const createPayload = (fields: PresignedPost.Fields, file: File) => {
    const formData = new FormData();
    Object.entries(fields).forEach(([k, v]) => formData.append(k, v || ""));
    formData.append("file", file);
    return formData;
  };

  const uploadFile = async (file: File) => {
    const { url, fields } = await getPresignedUrl();
    const payload = createPayload(fields, file);

    return await fetch(url, {
      method: "POST",
      body: payload,
    });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const file = getFileOrFail();
    checkFileSize(file);
    const response = await uploadFile(file);

    if (response.status === 204) {
      alert("Upload success");
      window.location.replace("");
    } else {
      alert("Something went wrong...");
      console.log(response);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center p-8">
      <div className={`border-2 ${file === null && "hidden"}`}>
        {file !== null && (
          <Image
            src={URL.createObjectURL(file)}
            alt="placeholder-for-image"
            width={250}
            height={250}
            layout="fixed"
            objectFit="contain"
            className={`text-center`}
          />
        )}
      </div>
      <div className="m-4 flex flex-row items-center justify-between">
        <input
          type="file"
          accept="image/jpg,image/png,image/jpeg,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <AiFillCloseSquare
          className={`text-xl fill-rose-500 ${file === null && "hidden"}`}
          onClick={() => setFile(null)}
        />
      </div>
      <button
        className={`primary ${file === null && "hidden"} ${
          status === "loading" && "animate-bounce"
        }`}
      >
        {status === "loading" ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}

export default function S3HomePage() {
  const listObjectsQuery = trpc.useQuery(["aws.listObjects"]);

  return (
    <div className="flex flex-col items-center">
      <span className="text-center link">
        <Link href="/aws/s3/tutorial">tutorial</Link>
      </span>
      <h1 className="text-center font-bold text-2xl">
        Upload images to AWS S3
      </h1>
      <Uploader />

      <h3 className="text-xl text-center font-bold p-4">Uploaded photos</h3>
      <ul className="grid grid-cols-1 md:grid-cols-3 justify-items-center">
        {listObjectsQuery.data?.map((image) => (
          <li key={image.key}>
            <UploadedImage imageKey={image.key} url={image.url} />
          </li>
        ))}
      </ul>
    </div>
  );
}
