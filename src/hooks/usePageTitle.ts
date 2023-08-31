import { instance } from "../store/api";

const usePageTitle = async (url: string) => {
  const isTitleStart = (html: string, i: number) =>
    html.substring(i, i + 6) === "<title";
  const isTitleEnd = (html: string, i: number) =>
    html.substring(i, i + 8) === "</title>";

  const result = await instance.get<string>(url, {
    headers: { "Content-Type": "text/html" },
  });
  const html = result.data;
  let withinTitleTag = false;
  let titleString = "";
  // TODO: verify <html> and then <head> before <title>
  for (var i = 0; i < html.length; i++) {
    if (withinTitleTag) {
      // TODO: skip to the end and get substring until that index?
      if (isTitleEnd(html, i)) {
        return titleString.trim();
      } else {
        titleString += html[i];
        continue;
      }
    } else {
      if (isTitleStart(html, i)) {
        withinTitleTag = true;
        i += html.substring(i).indexOf(">");
        continue;
      }
    }
  }
  return titleString.trim();
};

export default usePageTitle;
