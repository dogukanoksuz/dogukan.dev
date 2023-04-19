import { htmlDecode } from "js-htmlencode";

export const Excerpt = (content: string) => {
  return (
    htmlDecode(content)
      .replace(/<[^>]*>?/gm, "")
      .replace(/\\u[\dA-F]{4}/gi, function (match) {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
      })
      .replace(/\&nbsp;/g, "")
      .substring(0, 225) + "..."
  );
};
