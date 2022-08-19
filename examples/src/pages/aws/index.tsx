import Link from "next/link";

const links = [
  {
    label: "Learn how to upload files to S3 buckets",
    href: "s3",
  },
];

export default function AwsHomePage() {
  return (
    <div>
      <h1 className="text-center">All about AWS integration</h1>
      <ul className="flex flex-col items-center p-8">
        {links.map((l) => (
          <li className="text-left text-tertiary underline" key={l.href}>
            <Link href={`/aws/${l.href}`}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
