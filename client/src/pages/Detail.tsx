import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { typeColors, daysLeft } from "../lib";
import type { Competition } from "../lib";

export default function Detail() {
  const { id } = useParams();
  const [c, setC] = useState<Competition | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/competitions/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data: Competition) => setC(data))
      .catch(() => setError("We could not find that competition."));
  }, [id]);

  if (error) return <p className="warn">{error}</p>;
  if (!c) return <p className="sub">Loading...</p>;

  const color = typeColors[c.type] ?? "#94A3B8";
  const left = c.deadline ? daysLeft(c.deadline) : null;
  const ages =
    c.minAge != null && c.maxAge != null ? `${c.minAge} to ${c.maxAge}`
    : c.maxAge != null ? `Up to ${c.maxAge}`
    : c.minAge != null ? `${c.minAge} and above`
    : "No age limit listed";

  return (
    <div>
      <Link to="/">&lt; Back</Link>
      <div className="box">
        <h2>{c.name}</h2>
        <p className="muted">by {c.organizer}</p>
        <div className="chips">
          <span className="chip" style={{ color, borderColor: color }}>{c.type}</span>
          {left !== null && (
            <span className={left <= 14 ? "chip amber" : "chip green"}>{left} days left</span>
          )}
        </div>
        <a className="btn" href={c.officialUrl} target="_blank" rel="noopener noreferrer">
          Apply now
        </a>
      </div>
      <div className="box">
        <div className="lrow"><span>Deadline</span><span>{c.deadline ?? "Not set"}</span></div>
        <div className="lrow"><span>Ages</span><span>{ages}</span></div>
        <div className="lrow"><span>Cost</span><span>{c.cost ?? "To check"}</span></div>
        <div className="lrow"><span>Prize</span><span>{c.prize ?? "Not listed"}</span></div>
        <div className="lrow"><span>Last checked</span><span>{c.lastChecked}</span></div>
      </div>
    </div>
  );
}