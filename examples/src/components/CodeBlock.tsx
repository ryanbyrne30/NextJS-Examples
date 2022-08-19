import { CopyBlock, vs2015 } from "react-code-blocks";
export default function CodeBlock({ code }: { code: string }) {
  return (
    <CopyBlock
      text={code}
      language={"typescript"}
      showLineNumbers={false}
      theme={vs2015}
      CodeBlock
    />
  );
}
