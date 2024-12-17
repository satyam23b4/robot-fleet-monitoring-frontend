import React, { useEffect, useState } from "react";

const LogsDisplay = () => {
  const [logs, setLogs] = useState("");

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch("http://localhost:8000/api/logs");
        const data = await response.text();
        setLogs(data); // Update state with logs
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    }

    fetchLogs();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        padding: "10px",
        maxHeight: "300px",
        overflowY: "scroll",
      }}
    >
      <pre style={{ whiteSpace: "pre-wrap" }}>{logs || "Loading logs..."}</pre>
    </div>
  );
};

export default LogsDisplay;
