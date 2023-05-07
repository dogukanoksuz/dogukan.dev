import { useEffect, useState } from "react";
import SEO from "./SEO";

export interface IErrorProps {
  statusCode: string;
}

export default function Error(props: IErrorProps) {
  const [title, setTitle] = useState("404 - Sayfa bulunamadı");
  const [description, setDescription] = useState(
    "Aradığınız sayfa bulunamadı, bu URL'in bulunması gerektiğinden eminseniz iletişime geçin."
  );

  useEffect(() => {
    if (props.statusCode === "404") {
      document.title = title;
    }

    if (props.statusCode === "500") {
      setTitle("500 - Sunucu hatası");
      document.title = "500 - Sunucu hatası";
      setDescription("Sunucu hatası oluştu, daha sonra tekrar deneyin.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.statusCode]);

  return (
    <div className="flex h-96 flex-col items-center justify-center py-64">
      <SEO title={title}>
        <meta name="robots" content="noindex" />
        <meta name="description" content={description} />
      </SEO>
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center text-gray-800 dark:text-gray-100">
        <h1 className="text-6xl font-bold">{title}</h1>
        <p className="mt-3 text-2xl">{description}</p>
      </main>
    </div>
  );
}
