/* eslint-disable @next/next/no-img-element */
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Compressor from "compressorjs";

const cropImage = (
  thumbnailSize: number,
  imageEl: HTMLImageElement,
  crop: Crop,
  quality: number,
  setCroppedImage: Dispatch<SetStateAction<Blob | null>>
) => {
  const canvas = document.createElement("canvas");
  canvas.width = thumbnailSize;
  canvas.height = thumbnailSize;

  const ctx = canvas.getContext("2d");
  if (ctx === null || window === undefined || imageEl === null) return;

  const scaleX = imageEl.naturalWidth / imageEl.width;
  const scaleY = imageEl.naturalHeight / imageEl.height;

  const pixelRatio = window.devicePixelRatio;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    imageEl,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  canvas.toBlob(
    (newImage) => {
      if (newImage === null) return;
      setCroppedImage(newImage);

      // compress image
      // new Compressor(newImage, {
      //   quality,
      //   success: (compressedImage) => {
      //     setCroppedImage(compressedImage);
      //   },
      // });
    },
    "image/jpeg",
    quality
  );
};

export default function ImageCropper({
  image,
  quality = 0.8,
  isOpen,
  setIsOpen,
  size,
  setCroppedImage,
  isCircle = false,
  imageClassName,
  className,
}: {
  image: File | Blob | null;
  quality?: number;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  size: number;
  setCroppedImage: Dispatch<SetStateAction<Blob | null>>;
  isCircle: boolean;
  imageClassName?: string;
  className?: string;
}) {
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>({
    x: 0,
    y: 0,
    height: size,
    width: size,
    unit: "px",
  });

  const onCrop = () => {
    if (loadedImage !== null) {
      cropImage(size, loadedImage, crop, quality, setCroppedImage);
      setIsOpen(false);
    }
  };

  // center crop cursor to center
  useEffect(() => {
    if (loadedImage !== null) {
      setCrop({
        x: loadedImage.width / 2 - size / 2,
        y: loadedImage.height / 2 - size / 2,
        width: size,
        height: size,
        unit: "px",
      });
    }
  }, [loadedImage, size]);

  if (!isOpen || image === null) return null;

  return (
    <div
      className={
        className ||
        "w-screen h-screen fixed top-0 left-0 bg-primary flex flex-col items-center justify-center z-50 overflow-scroll"
      }
    >
      <div
        className={
          imageClassName || "w-full h-full md:w-1/2 md:h-1/2 overflow-scroll"
        }
      >
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          aspect={1}
          minWidth={size}
          keepSelection={true}
          circularCrop={isCircle}
        >
          <img
            src={image !== null ? URL.createObjectURL(image) : ""}
            onLoad={(e) => setLoadedImage(e.currentTarget)}
            alt="Image to crop"
            className="object-contain"
          />
        </ReactCrop>
      </div>
      <div className="p-4 flex flex-col items-center">
        <button className="primary" onClick={onCrop}>
          crop
        </button>
        <button className="secondary" onClick={() => setIsOpen(false)}>
          cancel
        </button>
      </div>
    </div>
  );
}
