'use client'
import { useState } from 'react';
import DocList from "@/components/DocList";
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [limit, setLimit] = useState(10); // Default limit

  const searchParams = useSearchParams();
  const limit = searchParams.get('limit');

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/v1/search/${searchQuery}${limit ? `?limit=${limit}` : ''}`);
      const data = await response.json();
      setResults(data.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <button onClick={handleSearch}>Search</button>
      </div>
      {loading && !error && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {results.length === 0 && !loading && !error && <p>No results found. Try searching for something else.</p>}
      {results.length > 0 && <DocList results={results} limit={limit} />}
    </main>
  );
}
