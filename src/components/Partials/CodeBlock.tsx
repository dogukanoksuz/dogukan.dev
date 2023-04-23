import Gist from "react-gist";

interface ICodeBlockProps {
  id: string;
}

export default function CodeBlock(props: ICodeBlockProps) {
  return <Gist {...props} />;
}
