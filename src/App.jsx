import React, { useEffect, useState } from "react";
import L from "leaflet"; // Import Leaflet for the map
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [robots, setRobots] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket("ws://localhost:8000/ws");

      socket.onopen = () => {
        console.log("WebSocket connection established.");
        setConnectionStatus("Connected");
        setReconnectAttempts(0); // Reset reconnect attempts
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setRobots(data);
      };

      socket.onclose = () => {
        console.warn("WebSocket connection closed. Reconnecting...");
        setConnectionStatus("Reconnecting...");
        setReconnectAttempts((prev) => prev + 1);

        if (reconnectAttempts < 5) {
          setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
        } else {
          setConnectionStatus("Error: Max reconnect attempts reached");
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus("Error");
      };
    };

    connectWebSocket();

    return () => {
      setConnectionStatus("Disconnected");
      console.log("Cleaning up WebSocket connection.");
    };
  }, [reconnectAttempts]);

  const handleRobotStatus = (robot) => {
    if (robot.battery < 20) return "#ff4757"; // Bright Red for low battery
    return robot.online ? "#2ed573" : "#dfe4ea"; // Green for online, Gray for offline
  };

  return (
    <div
      style={{
        backgroundColor: "#111",
        color: "#fff",
        height: "100vh",
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        justifyContent: "center", // Horizontally center the content
        alignItems: "flex-start", // Keep the content at the top vertically
      }}
    >
      <div style={{ padding: "30px", width: "100%", maxWidth: "1200px", textAlign: "center" }}>
        <h1 style={{ color: "#f1f2f6", fontSize: "2.5rem", marginBottom: "10px" }}>
          Robot Fleet Monitoring Dashboard
        </h1>
        <h2 style={{ color: "#b2bec3", fontSize: "1.2rem", marginBottom: "40px" }}>
          Status: {connectionStatus}
        </h2>

        {/* Map view */}
        <div style={{ margin: "20px 0", borderRadius: "15px", overflow: "hidden" }}>
          <MapContainer
            center={[51.505, -0.09]} // Initial map center
            zoom={13}
            style={{
              height: "500px",
              width: "100%",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {robots.map((robot) => (
              <Marker
                key={robot.id}
                position={[robot.location[0], robot.location[1]]}
                icon={
                  new L.Icon({
                    iconUrl: `https://www.flaticon.com/svg/static/icons/svg/147/147144.svg`,
                    iconSize: [35, 35],
                    iconColor: handleRobotStatus(robot),
                  })
                }
              >
                <Popup>
                  <strong>ID:</strong> {robot.id} <br />
                  <strong>Status:</strong> {robot.online ? "Online" : "Offline"} <br />
                  <strong>Battery:</strong> {robot.battery}% <br />
                  <strong>Last Updated:</strong> {robot.last_updated}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Robot Data List */}
        <div style={{ marginTop: "40px" }}>
          <h3 style={{ color: "#f1f2f6", fontSize: "1.8rem", marginBottom: "30px" }}>Robot Fleet Status</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
            {robots.map((robot) => (
              <div
                key={robot.id}
                style={{
                  backgroundColor: handleRobotStatus(robot),
                  color: "#fff",
                  padding: "20px",
                  width: "320px",
                  marginBottom: "15px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
                }}
              >
                <strong>ID:</strong> {robot.id} <br />
                <strong>Status:</strong> {robot.online ? "Online" : "Offline"} <br />
                <strong>Battery:</strong> {robot.battery}% <br />
                <strong>CPU:</strong> {robot.cpu}% <br />
                <strong>RAM:</strong> {robot.ram}MB <br />
                <strong>Last Updated:</strong> {robot.last_updated}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
