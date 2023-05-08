import { Feed } from "feed";
import { prisma } from "~/server/db";
import { Excerpt } from "./excerpt";
 
export default async function generateRssFeed(siteURL: string) {
  const posts = await prisma.posts.findMany({
    orderBy: { created_at: "desc" },
  });
  const date = new Date();
  const author = {
    name: "Doğukan Öksüz",
    email: "me@dogukan.dev",
    link: "https://twitter.com/lildivergent",
  };
  
  const feed = new Feed({
    title: "Doğukan Öksüz",
    description: "Merhaba, ben Doğukan Öksüz. Websitemde sizlere yazılım dünyasından ve linuxtan bahsettiğim yazılar yayınlıyorum. Ayrıca web developer olarak çalıştığımdan referanslarımı da inceleyebilirsiniz.",
    id: siteURL,
    link: siteURL,
    image: `${siteURL}/favicon/favicon.png`,
    favicon: `${siteURL}/favicon/favicon.png`,
    copyright: `All rights reserved ${date.getFullYear()}, Doğukan Öksüz`,
    updated: date, // today's date
    generator: "Next.js 13",
    feedLinks: {
      rss2: `${siteURL}/rss/feed.xml`,  // xml format
      json: `${siteURL}/rss/feed.json`,// json fromat
    },
    author,
  });
  
  posts.forEach((post) => {
    const url = `${siteURL}/${post.slug}`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: Excerpt(post.content),
      content: post.content,
      author: [author],
      contributor: [author],
      date: post.created_at as Date,
    });
  });

  return feed.rss2();
}