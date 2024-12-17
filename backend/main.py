from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse, PlainTextResponse
import json, asyncio
from datetime import datetime
import random

app = FastAPI()

# Load robot data from fake_robot_data.json
with open("fake_robot_data.json", "r") as file:
    raw_robot_data = json.load(file)

# Function to normalize robot data keys for frontend compatibility
def normalize_robot_data(raw_data):
    normalized = []
    for robot in raw_data:
        normalized.append({
            "id": robot.get("Robot ID"),
            "online": robot.get("Online/Offline"),
            "battery": robot.get("Battery Percentage"),
            "cpu": robot.get("CPU Usage"),
            "ram": robot.get("RAM Consumption"),
            "location": robot.get("Location Coordinates"),
            "last_updated": robot.get("Last Updated")
        })
    return normalized

# Function to update timestamps and simulate changes in the robot data
def update_robot_data(data):
    for robot in data:
        # Update the last updated timestamp
        robot["last_updated"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Simulate a more gradual battery drain (e.g., reduce by 0.5% per update)
        if robot["battery"] > 0:
            robot["battery"] = max(0, robot["battery"] - 0.5)  # Slower drain
        else:
            robot["battery"] = 0  # Ensuring the battery doesn't go negative
        
        # Robot goes offline if battery is below a certain threshold (e.g., 5%)
        robot["online"] = True if robot["battery"] > 5 else False
        
    return data


robots = normalize_robot_data(raw_robot_data)

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to the Robot Fleet Monitoring Backend!"}

@app.get("/api/robots")
async def get_robots():
    """REST API to get robot data"""
    global robots
    robots = update_robot_data(robots)
    return JSONResponse(content=robots)

@app.get("/api/logs", response_class=PlainTextResponse)
async def get_logs():
    """Fetch ROS logs"""
    try:
        with open("fake_ros_logs.log", "r") as log_file:
            return log_file.read()
    except FileNotFoundError:
        return PlainTextResponse("Log file not found.", status_code=404)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket for real-time robot data updates"""
    await websocket.accept()
    try:
        while True:
            global robots
            robots = update_robot_data(robots)
            
            # Send only updated robots or robots that have changed state
            updated_robots = [robot for robot in robots if robot['battery'] < 20 or not robot['online']]
            
            if updated_robots:
                await websocket.send_json(updated_robots)
            
            await asyncio.sleep(5)  # Update every 5 seconds
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        print("WebSocket connection closed")

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    """Handle favicon requests"""
    return JSONResponse(content={}, status_code=204)

