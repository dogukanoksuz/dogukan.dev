import { type NextPage } from "next";
import SummaryList from "~/components/Content/SummaryList";
import Jumbotron from "~/components/Partials/Jumbotron";
import Loading from "~/components/Loading";

import { api } from "~/utils/api";
import Error from "../components/Error";

const Home: NextPage = () => {
  const { status, data } = api.post.read.useQuery({
    page: 1,
    per_page: 5,
  });

  if (status === "loading") {
    return <>
      <Jumbotron />
      <Loading />
    </>
  }

  if (status === "error") {
    return <Error statusCode="500" />
  }

  return (
    <>
      <Jumbotron />
      <SummaryList articles={data} />
    </>
  );
};

export default Home;
