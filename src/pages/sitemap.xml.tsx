import { Readable } from "stream";
import type { GetServerSideProps } from "next";
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
    url: `/page/${page.slug}`,
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


  const categories: SitemapItemBase[] = (
    await prisma.categories.findMany({
      select: { slug: true },
    })
  ).map((page) => ({
    url: `/category/${page.slug}`,
    changefreq: EnumChangefreq.WEEKLY,
    priority: 0.5,
  }));


  const tags: SitemapItemBase[] = (
    await prisma.tags.findMany({
      select: { slug: true },
    })
  ).map((page) => ({
    url: `/tag/${page.slug}`,
    changefreq: EnumChangefreq.WEEKLY,
    priority: 0.3,
  }));

  const items: SitemapItemBase[] = [
    {
      url: `/`,
      changefreq: EnumChangefreq.DAILY,
      priority: 1,
      // Don't know why this library missing this field
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      lastmod: Date.now(),
    },
    ...pages,
    ...posts,
    ...categories,
    ...tags,
  ];

  const sitemapStream = new SitemapStream({
    hostname: `https://${req.headers.host as string}`,
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
