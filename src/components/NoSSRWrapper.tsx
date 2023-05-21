import dynamic from "next/dynamic";

interface IProps {
  children: React.ReactNode;
}

const NoSSR: React.FC<IProps> = ({ children }) => <>{children}</>;
export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
});
