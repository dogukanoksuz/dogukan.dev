import { Readable } from "stream";
import { GetServerSideProps } from "next";
import { SitemapStream, streamToPromise, EnumChangefreq } from "sitemap";
import { prisma } from "~/server/db";

export default function Sitemap() {
  return undefined;
}

export type SitemapItemBase = {
  url: string;
  priority?: number;
  changefreq?: EnumChangefreq;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  const pages: SitemapItemBase[] = (
    await prisma.pages.findMany({
      select: { slug: true },
    })
  ).map((page) => ({
    url: `/${page.slug}`,
    changefreq: EnumChangefreq.MONTHLY,
    priority: 0.2,
  }));

  const posts: SitemapItemBase[] = (
    await prisma.posts.findMany({
      where: { created_at: { not: null } },
      select: { slug: true, created_at: true },
      orderBy: { created_at: "desc" },
    })
  ).map((post) => ({
    url: `/${post.slug}`,
    changefreq: EnumChangefreq.WEEKLY,
    lastmod: post.created_at,
    priority: 0.8,
  }));

  const items: SitemapItemBase[] = [
    {
      url: `/`,
      changefreq: EnumChangefreq.DAILY,
      priority: 1,
      // @ts-ignore
      lastmod: Date.now(),
    },
    ...pages,
    ...posts,
  ];

  const sitemapStream = new SitemapStream({
    hostname: `https://${req.headers.host}`,
  });
  const xmlString = await streamToPromise(
    Readable.from(items).pipe(sitemapStream)
  ).then((data) => data.toString());
  res.writeHead(200, { "Content-Type": "application/xml" });
  res.end(xmlString);

  return {
    props: {},
  };
};
