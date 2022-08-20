import Image from "next/image";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import Compressor from "compressorjs";
import Slider from "@/components/Slider";
import Link from "next/link";

function ImageContainer({ file }: { file: File | Blob | null }) {
  return (
    <div className="p-4 w-fit">
      {file !== null && (
        <div className={`border-2 flex flex-col items-center`}>
          <Image
            src={URL.createObjectURL(file)}
            alt="placeholder-for-image"
            width={250}
            height={250}
            layout="fixed"
            objectFit="contain"
            className={`text-center`}
          />
          <span>{(file.size / 1000000).toFixed(3)} MB</span>
        </div>
      )}
    </div>
  );
}

function Uploader({
  file,
  setFile,
  setCompressedFile,
}: {
  file: File | Blob | null;
  setFile: Dispatch<SetStateAction<File | Blob | null>>;
  setCompressedFile: Dispatch<SetStateAction<File | Blob | null>>;
}) {
  const [compression, setCompression] = useState(80);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (file === null) return;
    new Compressor(file, {
      quality: compression / 100,
      success: (result) => {
        setCompressedFile(result);
      },
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center">
      <ImageContainer file={file} />
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
      <Slider value={compression} setValue={setCompression} suffix="%" />
      <button className={`primary ${file === null && "hidden"}`}>
        Compress
      </button>
    </form>
  );
}

export default function ImagesPage() {
  const [file, setFile] = useState<File | Blob | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | Blob | null>(
    null
  );

  useEffect(() => {
    if (file === null) setCompressedFile(null);
  }, [file]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center">Image compression</h1>
      <div className="p-8">
        <h2 className="text-center">Original image</h2>
        <Uploader
          file={file}
          setFile={setFile}
          setCompressedFile={setCompressedFile}
        />
      </div>
      <div className="p-8 flex flex-col items-center">
        <h2 className="text-center">Compressed image</h2>
        <ImageContainer file={compressedFile} />
        {compressedFile !== null && (
          <a
            download={`compressed_file.${compressedFile.type}`}
            href={
              compressedFile !== null ? URL.createObjectURL(compressedFile) : ""
            }
          >
            <button className="primary">download</button>
          </a>
        )}
      </div>
    </div>
  );
}
