import CodeBlock from "@/components/CodeBlock";
import Link from "next/link";

export default function ImageCompressionTutorialPage() {
  return (
    <div>
      <section>
        <h2>Client-Side Image Compression Overview</h2>
        <section>
          <h4>Pros</h4>
          <ul className="list">
            <li>Offloads computation to client&apos;s device</li>
            <li>Helps for clients with lower bandwidth</li>
            <li>
              User can choose different ways of compressing image with cropping
              and/or quality compression
            </li>
          </ul>
        </section>
        <section>
          <h4>Cons</h4>
          <ul className="list">
            <li>Server needs to check users input anyway</li>
            <li>Debugging has single source of failure (the server)</li>
            <li>Less stress on clients</li>
          </ul>
        </section>
      </section>
      <section>
        <h2>CompressorJS</h2>
        <p>
          Image compression is made easy using React&apos;s{" "}
          <span className="link">
            <Link href="https://www.npmjs.com/package/compressorjs">
              CompressorJS
            </Link>
          </span>{" "}
          component. There are a few different configurations, but to keep it
          simple you can just pass in the quality of the resulting image and it
          will handle the hard work for you!
        </p>
        <CodeBlock
          code={`import Compressor from "compressorjs";

function compressImage(image: File|Blob) {
  return new Compressor(file, {
    quality: compression / 100,
    success: (result) => {
      return result;
    },
  });
}`}
        />
      </section>
    </div>
  );
}
