import Image from "next/image";
import { useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";

function MyImage({ file }: { file: File | Blob | null }) {
  return (
    <Image
      src={file !== null ? URL.createObjectURL(file) : ""}
      alt="placeholder-for-image"
      width={250}
      height={250}
      layout="fixed"
      objectFit="contain"
      className={`text-center`}
    />
  );
}

function CropImage({ image }: { image: File | Blob | null }) {
  const [crop, setCrop] = useState<Crop>();
  console.log(crop);

  return (
    <ReactCrop
      crop={crop}
      onChange={(c) => setCrop(c)}
      aspect={1}
      minWidth={100}
      keepSelection={true}
      circularCrop={true}
    >
      <MyImage file={image} />
    </ReactCrop>
  );
}

export default function ImagesCroppingPage() {
  const [image, setImage] = useState<File | Blob | null>(null);

  return (
    <div>
      <h3>Upload an image to crop</h3>
      <CropImage image={image} />
      <input
        type="file"
        accept="image/jpg,image/jpeg,image/png,image/webp"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
    </div>
  );
}
