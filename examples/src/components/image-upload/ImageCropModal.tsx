import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function ImageCropModal({
  image,
  isOpen,
  setIsOpen,
  setCroppedImage,
}: {
  image: File | Blob | null;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setCroppedImage: Dispatch<SetStateAction<Blob | null>>;
}) {
  const thumbnailSize = 150;
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>({
    x: 0,
    y: 0,
    height: thumbnailSize,
    width: thumbnailSize,
    unit: "px",
  });

  const cropImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = thumbnailSize;
    canvas.height = thumbnailSize;

    const ctx = canvas.getContext("2d");
    if (ctx === null || window === undefined || loadedImage === null) return;

    const scaleX = loadedImage.naturalWidth / loadedImage.width;
    const scaleY = loadedImage.naturalHeight / loadedImage.height;

    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      loadedImage,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob((newImage) => setCroppedImage(newImage), "image/jpg", 0.5);
    setIsOpen(false);
  };

  useEffect(() => {
    if (loadedImage !== null) {
      setCrop({
        x: loadedImage.width / 2 - thumbnailSize / 2,
        y: loadedImage.height / 2 - thumbnailSize / 2,
        width: thumbnailSize,
        height: thumbnailSize,
        unit: "px",
      });
    }
  }, [loadedImage]);

  if (!isOpen || image === null) return null;

  return (
    <div className="fixed bg-primary z-50 top-0 left-0 w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-1/3 h-1/3">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          aspect={1}
          minWidth={thumbnailSize}
          keepSelection={true}
          circularCrop={true}
        >
          <img
            src={URL.createObjectURL(image)}
            onLoad={(e) => setLoadedImage(e.currentTarget)}
          />
        </ReactCrop>
      </div>
      <button className="primary" onClick={cropImage}>
        confirm
      </button>
    </div>
  );
}
