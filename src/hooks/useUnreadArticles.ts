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
      .then((data) => {
        setArticles(data);
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
