import type { GetServerSideProps } from "next";
import generateRssFeed from "~/utils/rss";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  const feedContent = await generateRssFeed(`https://${req.headers.host as string}`);

  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate"); // 24 hours
  res.writeHead(200, { "Content-Type": "application/xml" });
  res.end(feedContent);

  return {
    props: {},
  };
};

export default function Rss() {
  return undefined;
}
