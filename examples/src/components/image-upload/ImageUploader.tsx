import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { AiFillCloseSquare } from "react-icons/ai";

export default function ImageUploader({
  setImage,
}: {
  image: File | Blob | null;
  setImage: Dispatch<SetStateAction<File | Blob | null>>;
}) {
  // const [modalState, setModalState] = useState(false);
  // const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.files?.[0] || null;
    // if (input !== null) setModalState(true);
    // else setModalState(false);
    setImage(input);
  };

  // useEffect(() => {
  //   if (image === null) setCroppedImage(null);
  // }, [image]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-center">
        <input type="file" accept="image/*" onChange={onChange} />
        <AiFillCloseSquare className="text-xl" onClick={() => setImage(null)} />
      </div>
      {/* 
      <ImageCropModal
        image={image}
        isOpen={modalState}
        setIsOpen={setModalState}
        setCroppedImage={setCroppedImage}
      />
      <div className="p-10"></div>
      <a
        href={croppedImage !== null ? URL.createObjectURL(croppedImage) : ""}
        download
      >
        <div className="rounded-full overflow-hidden">
          <Image
            src={croppedImage !== null ? URL.createObjectURL(croppedImage) : ""}
            layout="fixed"
            height={150}
            width={150}
            alt="Cropped image will appear here"
          />
        </div>
      </a> */}
    </div>
  );
}
