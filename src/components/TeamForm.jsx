// Import React's useState hook so we can store form input values
import { useState } from "react";

// TeamForm is a reusable component for creating new teams
// onAddTeam is passed in from the parent (App) and handles saving the team
export default function TeamForm({ onAddTeam }) {

  // Store the current value of the team name input
  const [name, setName] = useState("");

  // Store the current value of the city input
  const [city, setCity] = useState("");

  // Store the optional team color input
  const [color, setColor] = useState("");

  // Runs when the form is submitted
  function handleSubmit(e) {

    // Prevent the browser from refreshing the page
    e.preventDefault();

    // Build a clean team object from the input values
    // trim() removes extra spaces
    // If color is empty, default to "N/A"
    const payload = {
      name: name.trim(),
      city: city.trim(),
      color: color.trim() || "N/A",
    };

    // Validate required fields
    // If name or city is missing, stop here
    if (!payload.name || !payload.city) return;

    // Send the team data up to the parent component
    // The parent decides how to store it (LocalStorage, DB, etc.)
    onAddTeam(payload);

    // Clear all input fields after successful submission
    setName("");
    setCity("");
    setColor("");
  }

  // Render the form UI
  return (
    // When the form is submitted, handleSubmit runs
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
    >

      {/* Team Name input (controlled input) */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Team name"
      />

      {/* City input (controlled input) */}
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City"
      />

      {/* Optional team color input */}
      <input
        value={color}
        onChange={(e) => setColor(e.target.value)}
        placeholder="Color (optional)"
      />

      {/* Submit button */}
      <button type="submit">Add Team</button>
    </form>
  );
}