import { FormEvent } from "react";

export default function S3HomePage() {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div>
      A file uploader to a private S3 bucket using presigned POST urls.
      <form onSubmit={onSubmit}>
        <input type="file" />
        <button className="primary">Upload</button>
      </form>
    </div>
  );
}
