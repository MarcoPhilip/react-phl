import { useState } from "react";

// EditTeamForm edits an existing team
// initialTeam provides the current values to pre-fill the form
// onSave sends the updated fields back to the parent
// onCancel exits edit mode without saving
export default function EditTeamForm({ initialTeam, onSave, onCancel }) {
  // Store editable values in local state so typing doesn’t instantly update the app state
  const [name, setName] = useState(initialTeam.name);
  const [city, setCity] = useState(initialTeam.city);
  const [color, setColor] = useState(initialTeam.color);

  function handleSubmit(e) {
    // Prevent page refresh
    e.preventDefault();

    // Build clean update payload
    const updates = {
      name: name.trim(),
      city: city.trim(),
      color: color.trim() || "N/A",
    };

    // Validate required fields
    if (!updates.name || !updates.city) return;

    // Send updates to parent
    onSave(updates);
  }

  return (
    <form onSubmit={handleSubmit} className="form-row">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Team name" />
      <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
      <input value={color} onChange={(e) => setColor(e.target.value)} placeholder="Color" />

      <button className="btn" type="submit">Save</button>
      <button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}