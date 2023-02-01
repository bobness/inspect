import { useEffect, useState } from "react";
import { getUnreadNews } from "../store/news";
import { Summary } from "../types";

interface Props {
  showFavorites: boolean;
}

const useUnreadArticles = ({ showFavorites }: Props) => {
  const [articles, setArticles] = useState<Summary[] | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState(false);

  const refresh = (showFavorites: boolean) => {
    setLoading(true);
    getUnreadNews(showFavorites)
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
    refresh(showFavorites);
  }, [showFavorites]);

  return {
    articles,
    error,
    loading,
    refresh,
  };
};

export default useUnreadArticles;
