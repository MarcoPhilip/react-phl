import { useState } from "react";

// EditPlayerForm edits an existing player
// initialPlayer provides pre-filled values
// onSave sends updates back to parent
// onCancel exits edit mode
export default function EditPlayerForm({ initialPlayer, onSave, onCancel }) {
  const [name, setName] = useState(initialPlayer.name);
  const [position, setPosition] = useState(initialPlayer.position);
  const [number, setNumber] = useState(String(initialPlayer.number));

  function handleSubmit(e) {
    e.preventDefault();

    const updates = {
      name: name.trim(),
      position,
      number: Number(number) || 0,
    };

    if (!updates.name) return;

    onSave(updates);
  }

  return (
    <form onSubmit={handleSubmit} className="form-row">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Player name" />

      <select value={position} onChange={(e) => setPosition(e.target.value)}>
        <option value="PG">PG</option>
        <option value="SG">SG</option>
        <option value="SF">SF</option>
        <option value="PF">PF</option>
        <option value="C">C</option>
      </select>

      <input type="number" min="0" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Jersey #" />

      <button className="btn" type="submit">Save</button>
      <button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}