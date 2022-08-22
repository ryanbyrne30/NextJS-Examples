import ImageCropper from "@/components/image-upload/ImageCropper";
import ImageUploader from "@/components/image-upload/ImageUploader";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImagesUploadPage() {
  const [image, setImage] = useState<File | Blob | null>(null);
  const [croppedImage, setCroppedImage] = useState<File | Blob | null>(null);
  const [modalState, setModalState] = useState(false);
  const size = 150;

  useEffect(() => {
    if (image !== null) setModalState(true);
    else {
      setCroppedImage(null);
      setModalState(false);
    }
  }, [image]);

  return (
    <div>
      <ImageUploader image={image} setImage={setImage} />
      <ImageCropper
        image={image}
        quality={0.8}
        isOpen={modalState}
        setIsOpen={setModalState}
        size={size}
        setCroppedImage={setCroppedImage}
        isCircle={true}
      />
      <div
        className={`rounded-full overflow-hidden ${
          croppedImage === null && "hidden"
        }`}
        style={{ width: size, height: size }}
      >
        <a
          href={croppedImage !== null ? URL.createObjectURL(croppedImage) : ""}
          download
        >
          <Image
            src={croppedImage !== null ? URL.createObjectURL(croppedImage) : ""}
            alt="Cropped image"
            height={size}
            width={size}
            layout="responsive"
          />
        </a>
      </div>
    </div>
  );
}
