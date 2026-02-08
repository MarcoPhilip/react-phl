// Import useState to manage form inputs
import { useState } from "react";

// PlayerForm is responsible for collecting player info
// onAddPlayer is passed from the parent and handles saving the player
export default function PlayerForm({ onAddPlayer }) {

  // Store the player's name
  const [name, setName] = useState("");

  // Store the player's position
  const [position, setPosition] = useState("PG");

  // Store the jersey number
  const [number, setNumber] = useState("");

  // Runs when the form is submitted
  function handleSubmit(e) {
    // Prevent page refresh
    e.preventDefault();

    // Build a clean player object
    const payload = {
      name: name.trim(),
      position,
      number: Number(number) || 0,
    };

    // Validate required field
    if (!payload.name) return;

    // Send player data to parent component
    onAddPlayer(payload);

    // Reset the form
    setName("");
    setPosition("PG");
    setNumber("");
  }

  // Render the player form
  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Player name"
      />

      <select
        value={position}
        onChange={(e) => setPosition(e.target.value)}
      >
        <option value="PG">PG</option>
        <option value="SG">SG</option>
        <option value="SF">SF</option>
        <option value="PF">PF</option>
        <option value="C">C</option>
      </select>

      <input
        type="number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="Jersey #"
        min="0"
        max="99"
      />

      <button type="submit">Add Player</button>
    </form>
  );
}