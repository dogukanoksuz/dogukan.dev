import { type NextPageContext } from "next";
import Error from "~/components/Error";

interface IErrorPageProps {
    statusCode: string;
}

function ErrorPage({ statusCode }: IErrorPageProps) {
  return (
    <Error statusCode={statusCode} />
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
