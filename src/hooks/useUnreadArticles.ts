import { useEffect, useState } from "react";
import { getUnreadNews } from "../store/news";
import { Summary } from "../types";

const useUnreadArticles = () => {
  const [articles, setArticles] = useState<Summary[] | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    setLoading(true);
    getUnreadNews()
      .then((response) => {
        if (response.data) {
          setArticles(response.data);
        } else {
          throw new Error(
            "Response does not contain data: " + response.toString()
          );
        }
      })
      .catch((err) => {
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
