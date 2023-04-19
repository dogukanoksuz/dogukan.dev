import { type NextPage } from "next";
import SummaryList from "~/components/Content/SummaryList";
import Jumbotron from "~/components/Partials/Jumbotron";
import Loading from "~/pages/loading";

import { api } from "~/utils/api";
import Error from "../components/Error";
import AnimatedLayout from "~/components/AnimatedLayout";

const Home: NextPage = () => {
  const { status, data } = api.post.read.useQuery({
    page: 1,
    per_page: 5,
  });

  if (status === "loading") {
    return (
      <AnimatedLayout>
        <Jumbotron />
        <Loading />
      </AnimatedLayout>
    );
  }

  if (status === "error") {
    return <Error statusCode="500" />;
  }

  return (
    <AnimatedLayout>
      <Jumbotron />
      <SummaryList articles={data} />
    </AnimatedLayout>
  );
};

export default Home;
