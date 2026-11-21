import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { getToken, typeColors } from "../lib";
import type { Competition } from "../lib";

const empty = {
  name: "", organizer: "", type: "essay", officialUrl: "",
  deadline: "", deadlineTime: "", deadlineTimezone: "UTC", resultDate: "",
  minAge: "", maxAge: "", ageCountedOn: "", minGrade: "", maxGrade: "",
  cost: "", prize: "Not listed",
};
type Fields = typeof empty;
const numeric = ["minAge", "maxAge", "minGrade", "maxGrade"];
const required = ["name", "organizer", "officialUrl"];
const noChecks = { theme: false, dates: false, eligibility: false, cost: false };
type CheckKey = keyof typeof noChecks;

function toFields(c: Competition): Fields {
  return {
    name: c.name, organizer: c.organizer, type: c.type, officialUrl: c.officialUrl,
    deadline: c.deadline ?? "", deadlineTime: c.deadlineTime ?? "",
    deadlineTimezone: c.deadlineTimezone ?? "UTC", resultDate: c.resultDate ?? "",
    minAge: c.minAge?.toString() ?? "", maxAge: c.maxAge?.toString() ?? "",
    ageCountedOn: c.ageCountedOn ?? "",
    minGrade: c.minGrade?.toString() ?? "", maxGrade: c.maxGrade?.toString() ?? "",
    cost: c.cost ?? "", prize: c.prize ?? "Not listed",
  };
}

type Props = { editing: Competition | null; onSaved: () => void; onCancel: () => void };

export default function AddForm({ editing, onSaved, onCancel }: Props) {
  const [f, setF] = useState<Fields>(empty);
  const [checked, setChecked] = useState(noChecks);
  const [msg, setMsg] = useState("");
  const [bad, setBad] = useState(false);
  const allTicked = Object.values(checked).every(Boolean);

  useEffect(() => {
    setF(editing ? toFields(editing) : empty);
    setChecked(noChecks);
  }, [editing]);

  function inp(name: keyof Fields, label: string, type = "text") {
    return (
      <div>
        <label htmlFor={name}>{label}</label>
        <input id={name} type={type} value={f[name]} onChange={(e) => setF({ ...f, [name]: e.target.value })} />
      </div>
    );
  }

  function tick(key: CheckKey) {
    return (
      <label className="tick">
        <input type="checkbox" checked={checked[key]} onChange={(e) => setChecked({ ...checked, [key]: e.target.checked })} />
        I checked this on the official page
      </label>
    );
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    setBad(false);
    const payload: Record<string, unknown> = { checked };
    for (const key of Object.keys(f) as (keyof Fields)[]) {
      const v = f[key].trim();
      if (key === "deadlineTimezone" && !f.deadlineTime) {
        if (editing) payload[key] = null;
        continue;
      }
      if (v === "") {
        if (editing) payload[key] = required.includes(key) ? "" : null;
        continue;
      }
      payload[key] = numeric.includes(key) ? Number(v) : v;
    }
    try {
      const res = await fetch(
        editing ? `/api/admin/competitions/${editing._id}` : "/api/admin/competitions",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBad(true);
        setMsg(data.error ?? "Could not save");
        return;
      }
      setMsg(`Saved: ${data.name}`);
      onSaved();
    } catch {
      setBad(true);
      setMsg("Could not reach the server");
    }
  }

  return (
    <form className="box form wideform" onSubmit={submit}>
      <h2>{editing ? `Edit: ${editing.name}` : "Add a competition"}</h2>
      {msg && <p className={bad ? "warn" : "msg"}>{msg}</p>}

      <fieldset>
        <legend>Basics</legend>
        <div className="fgrid">
          {inp("name", "Name")}
          {inp("organizer", "Organizer")}
          <div>
            <label htmlFor="type">Type</label>
            <select id="type" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
              {Object.keys(typeColors).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {inp("officialUrl", "Official page link")}
        </div>
        {tick("theme")}
      </fieldset>

      <fieldset>
        <legend>Dates</legend>
        <div className="fgrid">
          {inp("deadline", "Last day to apply", "date")}
          {inp("deadlineTime", "Deadline time (optional)", "time")}
          <div>
            <label htmlFor="tz">Timezone</label>
            <select id="tz" value={f.deadlineTimezone} onChange={(e) => setF({ ...f, deadlineTimezone: e.target.value })}>
              {["UTC", "WAT", "ET", "PT"].map((z) => <option key={z}>{z}</option>)}
            </select>
          </div>
          {inp("resultDate", "Result date (optional)", "date")}
        </div>
        {tick("dates")}
      </fieldset>

      <fieldset>
        <legend>Who can enter</legend>
        <div className="fgrid">
          {inp("minAge", "Youngest age", "number")}
          {inp("maxAge", "Oldest age", "number")}
          {inp("ageCountedOn", "Age counted on (date)", "date")}
          <span />
          {inp("minGrade", "Lowest grade (SS1 = 10)", "number")}
          {inp("maxGrade", "Highest grade (SS3 = 12)", "number")}
        </div>
        {tick("eligibility")}
      </fieldset>

      <fieldset>
        <legend>Cost and prize</legend>
        <div className="fgrid">
          {inp("cost", "Cost")}
          {inp("prize", "Prize (may say Not listed)")}
        </div>
        {tick("cost")}
      </fieldset>

      <div className="btns">
        <button className="btn" type="submit" disabled={!allTicked}>
          {editing ? "Save changes" : "Save competition"}
        </button>
        {editing && <button type="button" className="b" onClick={onCancel}>Cancel edit</button>}
      </div>
      {!allTicked && <p className="muted">Tick all four boxes to save.</p>}
    </form>
  );
}