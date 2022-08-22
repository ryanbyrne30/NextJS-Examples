import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { AiFillCloseSquare } from "react-icons/ai";

export default function ImageUploader({
  setImage,
}: {
  image: File | Blob | null;
  setImage: Dispatch<SetStateAction<File | Blob | null>>;
}) {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.files?.[0] || null;
    setImage(input);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-center">
        <input type="file" accept="image/*" onChange={onChange} />
        <AiFillCloseSquare className="text-xl" onClick={() => setImage(null)} />
      </div>
    </div>
  );
}
