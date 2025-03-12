import React from "react";
import { useLocation, Link } from "react-router-dom";

const SearchResultsPage = () => {
  const location = useLocation();
  const { results } = location.state || { results: [] };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>Результаты поиска</h2>
      {results.length === 0 ? (
        <p>Ничего не найдено</p>
      ) : (
        <ul>
          {results.map((ad) => (
            <li key={ad.id} style={{ marginBottom: "10px" }}>
              <Link to={`/ads/${ad.id}/`}>
                <h4>{ad.title}</h4>
                <p>{ad.category} / {ad.subcategory}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResultsPage;
