'use client'
import { useState, useEffect } from 'react';
import DocList from "@/components/DocList";
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextLink, setNextLink] = useState(null);
  const [previousLink, setPreviousLink] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('limit')) {
      setLimit(parseInt(searchParams.get('limit')));
    }
  }, [searchParams])

  const fetchUrl = `${process.env.NEXT_PUBLIC_API_DOMAIN_ROOT}/${process.env.NEXT_PUBLIC_API_VERSION}/search`;

  const handleSearch = async (url, page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${url}/${searchQuery}?limit=${limit}&start=${(page - 1) * limit}`);
      const data = await response.json();
      // console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch search results");
      }
      setCurrentPage(page);
      setTotalPages(Math.ceil(data?.data?.totalSize / limit));
      setLastSearchQuery(searchQuery);
      updateResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (link, page) => {
    setLoading(true);
    try {
      const response = await fetch(`${fetchUrl}/next?nextlink=${encodeURIComponent(link)}`);
      const data = await response.json();
      updateResults(data);
      setCurrentPage(page);
      setTotalPages(Math.ceil(data?.data?.totalSize / limit));
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  function updateResults(data) {
    setResults(data?.data?.results || []);
    setNextLink(data?.data?._links.next || null);
    setPreviousLink(data?.data?._links.prev || null);  
    setError(null);
  }

  // function updatePaginatedResults(event) {
  //   if (searchQuery.trim() !== "") {
  //     handleSearch(fetchUrl, 1);
  //   } else {
  //     handleSubmit(event);
  //   }
  // }

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      handleSearch(fetchUrl, 1);
    } else if (searchQuery.trim() === "") {
      setResults([]);
      setNextLink(null);
      setPreviousLink(null);
      setCurrentPage(1);
      setTotalPages(0);
      setLastSearchQuery("");
      setError(null);
    }
  }, [limit]);

  function handleSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      alert("Please enter a search query.");
      return;
    }
    handleSearch(fetchUrl, 1);
  }

  return (
    <main className="container">
      <h1>Search Confluence Docs</h1>
      <div style={{ marginBottom: "20px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for docs..."
              style={{ padding: "8px", fontSize: "16px" }}
              />
            <button style={{ width: 'auto' }} type="submit">Search</button>
          </div>
          <div>
            <label htmlFor="limit">Results per page:</label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                // updatePaginatedResults(e);
              }}
            >
              {[5, 10, 25, 50, 100].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>
      {error && <p>Error: {error.message}</p>}
      {results.length === 0 && !error && <p>No results found. Try searching for something else.</p>}
      {results.length > 0 && (
        <>
          <DocList isLoading={loading} results={results} />
          <div className="pagination">
            {(nextLink || previousLink) && (
              <button onClick={() => handlePageChange(previousLink, currentPage - 1)} disabled={!previousLink}>Previous</button>
            )}
            <span>Page {currentPage} of {totalPages}</span>
            {(nextLink || previousLink) && (
              <button onClick={() => handlePageChange(nextLink, currentPage + 1)} disabled={!nextLink}>Next</button>
            )}
          </div>
        </>
      )}
    </main>
  );
}
