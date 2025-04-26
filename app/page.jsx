'use client'
import { useState } from 'react';
import DocList from "@/components/DocList";
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextLink, setNextLink] = useState(null);
  const [previousLink, setPreviousLink] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const searchParams = useSearchParams();
  const limit = searchParams.get('limit') || 10;

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

  return (
    <main className="container">
      <h1>Search Confluence Docs</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for docs..."
        />
        <button onClick={() => handleSearch(fetchUrl, 1)}>Search</button>
      </div>
      {loading && !error && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {results.length === 0 && !loading && !error && <p>No results found. Try searching for something else.</p>}
      {results.length > 0 && (
        <>
          <DocList results={results} limit={limit} />
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
