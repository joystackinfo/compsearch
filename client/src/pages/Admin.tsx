import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, clearToken } from "../lib";
import type { Competition } from "../lib";
import AddForm from "../components/AddForm";
import AdminList from "../components/AdminList";

export default function Admin() {
  const nav = useNavigate();
  const [ok, setOk] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [editing, setEditing] = useState<Competition | null>(null);

  useEffect(() => {
    fetch("/api/admin/check", { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => {
        if (!res.ok) throw new Error("no");
        setOk(true);
      })
      .catch(() => nav("/login"));
  }, [nav]);

  if (!ok) return <p className="sub">Checking...</p>;

  return (
    <div>
      <h2>Admin</h2>
      <button
        className="b"
        onClick={() => {
          clearToken();
          nav("/login");
        }}
      >
        Log out
      </button>
      <AddForm
        editing={editing}
        onCancel={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          setRefresh((r) => r + 1);
        }}
      />
      <AdminList
        refresh={refresh}
        onEdit={(c) => {
          setEditing(c);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}