import Link from "next/link";

export default function ImagesPage() {
  return (
    <ul>
      <li className="link">
        <Link href="/images/compression">Client-side image compression</Link>
      </li>
      <li className="link">
        <Link href="/images/cropping">Cropping an image</Link>
      </li>
    </ul>
  );
}
