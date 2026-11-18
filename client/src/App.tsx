import { useEffect, useState } from "react";
import { typeColors, daysLeft } from "./lib";

type Competition = {
  _id: string;
  name: string;
  organizer: string;
  type: string;
  deadline?: string;
};

export default function App() { // eslint-disable-line @typescript-eslint/no-unused-vars
  const [list, setList] = useState<Competition[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/competitions?open=true&sort=deadline") //competitions that are open and sorted by deadline
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data: Competition[]) => setList(data))
      .catch(() => setError("Could not load competitions"));
  }, []);

  return (
    <main className="wrap">
      <h1>
        Comp<span>Search</span>
      </h1>
      <p className="sub">Competitions you can really enter.</p>
      {error && <p className="warn">{error}</p>}
      <div className="grid">
        {list.map((c, i) => {
          const color = typeColors[c.type] ?? "#94A3B8";
          const left = c.deadline ? daysLeft(c.deadline) : null;
          return (
            <div className="card" key={c._id} style={{ animationDelay: `${i * 80}ms` }}>
              <strong>{c.name}</strong>
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
    </main> 
  );

}