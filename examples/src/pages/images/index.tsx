import Image from "next/image";
import { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";

export default function ImagesPage() {
  const [file, setFile] = useState<File | null>(null);

  const onSubmit = () => {
    return;
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
      <button className={`primary ${file === null && "hidden"}`}>Upload</button>
    </form>
  );
}
