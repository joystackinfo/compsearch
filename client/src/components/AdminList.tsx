import { useEffect, useState } from "react";
import { getToken } from "../lib";
import type { Competition } from "../lib";

type Props = { refresh: number; onEdit: (c: Competition) => void };

const verified = (c: Competition) => !!c.checked && Object.values(c.checked).every(Boolean);

export default function AdminList({ refresh, onEdit }: Props) {
  const [list, setList] = useState<Competition[]>([]);
  const [msg, setMsg] = useState("");
  const [n, setN] = useState(0);

  useEffect(() => {fetch("/api/admin/competitions", 
    { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => {
        if (!res.ok) throw new Error("bad");
        return res.json();
      })
      .then((data: Competition[]) => setList(data))
      .catch(() => setMsg("Could not load the list"));
  }, [refresh, n]);

  async function remove(c: Competition) {
    if (!window.confirm(`Delete ${c.name}?`)) return;
    const res = await fetch(`/api/admin/competitions/${c._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (res.ok) {
      setMsg(`Deleted: ${c.name}`);
      setN(n + 1);
    } else {
      setMsg("Could not delete");
    }
  }

  return (
    <div className="box wideform">
      <h2>All competitions ({list.length})</h2>
      {msg && <p className="muted">{msg}</p>}
      {list.map((c) => (
        <div className="info">
          <span>
            {c.name}
            <small className="muted"> | {c.deadline ?? "no deadline"} </small>
            {!verified(c) && <span className="chip amber">To check</span>}
          </span>
          <span className="btns">
            <button className="b" onClick={() => onEdit(c)}>Edit</button>
            <button className="b" onClick={() => remove(c)}>Delete</button>
          </span>
        </div>
      ))}
    </div>
  );
}