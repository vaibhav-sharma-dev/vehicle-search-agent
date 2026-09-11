import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

const examples = [
  "Show SUVs under 15 lakh",
  "Diesel automatic cars below 80k km",
  "Cheapest electric cars",
];

const formatPrice = (price) => `₹${Number(price).toFixed(2)} lakh`;

function VehicleCard({ vehicle }) {
  return (
    <article className="vehicle-card">
      <div className="vehicle-card__heading">
        <div>
          <p className="vehicle-card__eyebrow">{vehicle.year} · {vehicle.bodyType}</p>
          <h2>{vehicle.brand} {vehicle.model}</h2>
          <p>{vehicle.variant}</p>
        </div>
        <strong>{formatPrice(vehicle.priceLakh)}</strong>
      </div>

      <dl className="vehicle-details">
        <div><dt>Fuel</dt><dd>{vehicle.fuelType}</dd></div>
        <div><dt>Gearbox</dt><dd>{vehicle.transmission}</dd></div>
        <div><dt>Driven</dt><dd>{vehicle.kilometersDriven.toLocaleString("en-IN")} km</dd></div>
        <div><dt>Mileage</dt><dd>{vehicle.mileageKmpl ? `${vehicle.mileageKmpl} kmpl` : "Electric"}</dd></div>
      </dl>
    </article>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async (event) => {
    event?.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/vehicles/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: cleanQuery }),
      });
      const body = await response.json();

      if (!response.ok) throw new Error(body.message || "Search failed");

      setVehicles(body.data);
      setSearched(true);
    } catch (requestError) {
      setError(requestError.message || "Could not connect to the search service.");
      setVehicles([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const selectExample = (example) => {
    setQuery(example);
    setError("");
  };

  return (
    <main className="page-shell">
      <section className="search-panel">
        <p className="brand">Vehicle Finder</p>
        <h1>Find a car in plain English.</h1>
        <p className="subtitle">Tell us the body type, budget, fuel, gearbox, or kilometres you have in mind.</p>

        <form onSubmit={search} className="search-form">
          <label htmlFor="vehicle-query" className="sr-only">Search vehicles</label>
          <input
            id="vehicle-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. Show SUVs under 15 lakh"
            maxLength={500}
            autoComplete="off"
          />
          <button type="submit" disabled={!query.trim() || loading}>
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        <div className="examples" aria-label="Example searches">
          {examples.map((example) => (
            <button key={example} type="button" onClick={() => selectExample(example)}>
              {example}
            </button>
          ))}
        </div>
      </section>

      <section className="results" aria-live="polite" aria-busy={loading}>
        {error && <p className="status status--error">{error}</p>}
        {!error && searched && (
          <p className="result-count">
            {vehicles.length} {vehicles.length === 1 ? "vehicle" : "vehicles"} found
          </p>
        )}
        {!error && searched && vehicles.length === 0 && (
          <p className="status">No matches. Try a wider budget or fewer filters.</p>
        )}
        <div className="result-grid">
          {vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
        </div>
      </section>
    </main>
  );
}
