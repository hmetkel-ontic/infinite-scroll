import React from "react";
import axios from "axios";

export default function useSearchBooks(query, pageNumber) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [books, setBooks] = React.useState([]);
  const [hasMore, setHasMore] = React.useState(false);

  React.useEffect(() => setBooks([]), [query]);

  React.useEffect(() => {
    setIsLoading(true);
    setError(null);

    let cancel;

    axios({
      method: "get",
      url: "http://openlibrary.org/search.json",
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setBooks((prevBooks) => [
          ...new Set([
            ...prevBooks,
            ...res.data.docs.map((book) => book.title),
          ]),
        ]);
        setHasMore(res.data.docs.length > 0);
        console.log(res);
        setIsLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(err.message);
        setIsLoading(false);
      });

    return () => cancel();
  }, [query, pageNumber]);

  return { isLoading, error, books, hasMore };
}
