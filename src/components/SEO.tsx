import Head from "next/head";
import Script from "next/script";

const SITE_ADDRESS = "https://dogukan.dev";
const SITE_NAME = "Doğukan Öksüz";
const IMAGE_URL_PREFIX = "";

interface ISEOProps {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  url?: string;
  tags?: string[];
  published?: Date | null;
  children?: React.ReactNode;
}

const DEFAULTS = {
  title: "Doğukan Öksüz - dogukan.dev",
  description:
    "Merhaba, ben Doğukan Öksüz. Websitemde sizlere yazılım dünyasından ve linuxtan bahsettiğim yazılar yayınlıyorum. Ayrıca web developer olarak çalıştığımdan referanslarımı da inceleyebilirsiniz. ",
  image: "/favicon/twitter.jpg",
  tags: "yazılım, php, java, c++, laravel, html, css, web developer, python, yapay zeka",
};

const arrayToString = (array: string[]) => {
  return array.join(", ");
};

const generateJSONLD = (props: ISEOProps) => {
  const def = {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_ADDRESS,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_ADDRESS}/search?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const items: any[] = [def];

  // It means it's a blog post
  if (props.description && props.published) {
    items.push({
      "@context": "http://schema.org",
      "@type": "Article",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": SITE_ADDRESS + props.url,
      },
      headline: props.title ? props.title + " - " + SITE_NAME : DEFAULTS.title,
      description: props.description || DEFAULTS.description,
      image: props.image ? IMAGE_URL_PREFIX + props.image : DEFAULTS.image,
      author: {
        "@type": "Person",
        name: "Doğukan Öksüz",
      },
      datePublished: props.published?.toISOString(),
    });

    items.push({
      "@context": "http://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: SITE_NAME,
          item: SITE_ADDRESS,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: props.title,
          item: SITE_ADDRESS + props.url,
        },
      ],
    });
  }

  return JSON.stringify(items);
};

export default function SEO(props: ISEOProps) {
  return (
    <Head>
      {/* Title fields */}
      <title key="title">
        {props.title ? props.title + " - " + SITE_NAME : DEFAULTS.title}
      </title>
      <meta
        itemProp="name"
        content={props.title ? props.title + " - " + SITE_NAME : DEFAULTS.title}
      />
      <meta
        property="og:title"
        content={props.title ? props.title + " - " + SITE_NAME : DEFAULTS.title}
      />

      {/* Description fields */}
      <meta
        name="description"
        content={props.description || DEFAULTS.description}
      />
      <meta
        property="og:description"
        content={props.description || DEFAULTS.description}
      />
      <meta
        name="twitter:description"
        property="og:description"
        content={props.description || DEFAULTS.description}
      />
      <meta
        itemProp="description"
        content={props.description || DEFAULTS.description}
      />

      {/* Twitter fields */}
      <meta
        name="twitter:text:title"
        content={props.title ? props.title + " - " + SITE_NAME : DEFAULTS.title}
      />
      <meta
        name="twitter:title"
        content={props.title ? props.title + " - " + SITE_NAME : DEFAULTS.title}
      />
      <meta
        name="twitter:url"
        content={props.url ? SITE_ADDRESS + props.url : SITE_ADDRESS}
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:image"
        content={props.image ? IMAGE_URL_PREFIX + props.image : DEFAULTS.image}
      />
      <meta name="twitter:domain" content="dogukan.dev" />
      <meta name="twitter:site" content="@lildivergent" />
      <meta name="twitter:creator" content="@lildivergent" />

      {/* Open Graph fields */}
      <meta
        property="og:url"
        content={props.url ? SITE_ADDRESS + props.url : SITE_ADDRESS}
      />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />

      {/* Keywords */}
      <meta
        name="keywords"
        content={props.tags ? arrayToString(props.tags) : DEFAULTS.tags}
      />

      {/* Images */}
      <meta
        property="og:image"
        content={props.image ? IMAGE_URL_PREFIX + props.image : DEFAULTS.image}
      />
      <meta
        itemProp="image"
        content={props.image ? IMAGE_URL_PREFIX + props.image : DEFAULTS.image}
      />
      <link
        rel="image"
        type="image/jpeg"
        href={props.image ? IMAGE_URL_PREFIX + props.image : DEFAULTS.image}
      />
      {props.children}

      <Script
        strategy="afterInteractive"
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-L4T60990DG"
      ></Script>
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-L4T60990DG');
      `,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateJSONLD(props) }}
        key="jsonld"
      />
    </Head>
  );
}
