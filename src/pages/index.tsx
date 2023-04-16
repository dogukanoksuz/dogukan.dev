import { type NextPage } from "next";
import SummaryList from "~/components/Content/SummaryList";
import Jumbotron from "~/components/Partials/Jumbotron";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.post.read.useQuery({
    page: 1,
  });

  return (
    <>
      <Jumbotron />
      <SummaryList articles={hello.data} />
    </>
  );
};

export default Home;
