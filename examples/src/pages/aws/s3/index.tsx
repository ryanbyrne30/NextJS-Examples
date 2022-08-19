import { trpc } from "@/utils/trpc";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";

export default function S3HomePage() {
  const [file, setFile] = useState<File | null>(null);

  const presignedUrlQuery = trpc.useQuery(
    ["aws.presignedPostUrl", { filename: file?.name || "" }],
    {
      enabled: false,
    }
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (file === null) return;
    const { data } = await presignedUrlQuery.refetch();
    if (data === undefined) {
      alert("Could not retrieve presigned POST url");
      return;
    }
    const { url, fields } = data;
    const formData = new FormData();
    formData.append("file", file);
    Object.entries(fields).forEach(([k, v]) => formData.append(k, v || ""));

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    console.log(response);
  };

  return (
    <div>
      <h1 className="text-center">
        A file uploader to a private S3 bucket using presigned POST urls.
      </h1>
      <form onSubmit={onSubmit} className="flex flex-col items-center p-8">
        <div className={`border-2 ${file === null && "hidden"}`}>
          {file !== null && (
            <Image
              src={URL.createObjectURL(file)}
              alt="placeholder-for-image"
              width={300}
              height={300}
              layout="fixed"
              objectFit="contain"
              className={`text-center`}
            />
          )}
        </div>
        <div className="m-4 flex flex-row items-center justify-between">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <AiFillCloseSquare
            className={`text-xl fill-rose-500 ${file === null && "hidden"}`}
            onClick={() => setFile(null)}
          />
        </div>
        <button className={`primary ${file === null && "hidden"}`}>
          Upload
        </button>
      </form>
    </div>
  );
}
