import React from "react";
import { useSearchBooks } from "./hooks";

function App() {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  const { isLoading, error, books, hasMore } = useSearchBooks(query, page);

  const observer = React.useRef(null);

  const lastBookElementRef = React.useCallback(
    (node) => {
      if (isLoading) return;

      const observerHandler = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore) {
            console.log(entry.target, "visible");
            // last element comes into viewport
            setPage((prevPageNumber) => prevPageNumber + 1);
          }
        });
      };

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(observerHandler); // with default options only the intersection container is device viewport

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const handleSearch = (event) => {
    setQuery(event.target.value);
    setPage(1);
  };

  return (
    <>
      <input type="text" value={query} onChange={handleSearch} />

      {books.map((book, index) => (
        <p
          ref={index + 1 === books.length ? lastBookElementRef : null}
          style={{ marginBottom: "8px", padding: "4px" }}
        >
          {book}
        </p>
      ))}

      {error && (
        <p style={{ padding: "4px", backgroundColor: "#f00", color: "#fff" }}>
          {error}
        </p>
      )}
      {isLoading && <p>Loading...</p>}
    </>
  );
}

export default App;
