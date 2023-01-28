import { useEffect, useState } from "react";
import { getUnreadNews } from "../store/news";
import { Summary } from "../types";

const useUnreadArticles = () => {
  const [articles, setArticles] = useState<Summary[] | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    console.log("*** in useUnreadArticles::refresh()");
    setLoading(true);
    getUnreadNews()
      .then((response) => {
        if (response.data) {
          console.log(
            "*** in useUnreadArticles::refresh() -- got data: ",
            response.data.length
          );
          setArticles(response.data);
        } else {
          console.log(
            "*** in useUnreadArticles::refresh() -- no data! ",
            response
          );
        }
      })
      .catch((err) => {
        console.log("*** in useUnreadArticles::refresh() -- catch err: ", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    articles,
    error,
    loading,
    refresh,
  };
};

export default useUnreadArticles;
