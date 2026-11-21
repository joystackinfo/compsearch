import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { typeColors, daysLeft } from "../lib";
import type { Competition } from "../lib";

export default function Home() {
  const [list, setList] = useState<Competition[]>([]);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
const shown = list.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/competitions?open=true&sort=deadline")
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data: Competition[]) => {
  setList(data);
  setLoaded(true);
})
      .catch(() => setError("Could not load competitions"));
  }, []);

  return (
    <div>
      <h1>
        Comp<span>Search</span>
      </h1>
      <p className="sub">Competitions you can really enter.</p>
      {loaded && !error && list.length === 0 && <p className="sub">No competitions to show yet. Check back soon.</p>}
      <input
  className="search"
  placeholder="Search competitions"
  value={q}
  onChange={(e) => setQ(e.target.value)}
/>
{list.length > 0 && shown.length === 0 && <p className="sub">No competitions match.</p>}
      {error && <p className="warn">{error}</p>}
      <div className="grid">
        {shown.map((c, i) => {
          const color = typeColors[c.type] ?? "#94A3B8";
          const left = c.deadline ? daysLeft(c.deadline) : null;
          return (
            <div className="card" key={c._id} style={{ animationDelay: `${i * 80}ms` }}>
              <Link className="name" to={`/c/${c._id}`}>{c.name}</Link>
              <p>{c.organizer}</p>
              <div className="chips">
                <span className="chip" style={{ color, borderColor: color }}>{c.type}</span>
                {left !== null && (
                  <span className={left <= 14 ? "chip amber" : "chip green"}>{left} days left</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}