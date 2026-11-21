import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../lib";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not log in");
        return;
      }
      setToken(data.token);
      nav(data.role === "admin" ? "/admin" : "/");
    } catch {
      setError("Could not reach the server");
    }
  }

  return (
    <form className="form box" onSubmit={submit}>
      <h2>Log in</h2>
      {error && <p className="warn">{error}</p>}
      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn" type="submit">Log in</button>
    </form>
  );
}