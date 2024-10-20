# Real-Time Weather Application

## Overview

The Real-Time Weather Application is a React Native application designed to provide users with current weather forecasts and daily summaries. It connects to a Node.js backend that interfaces with a MongoDB database to store and retrieve weather data. Users can view historical weather summaries, daily forecasts, and receive alerts based on current weather conditions.

## Features

- Fetch and display daily weather summaries.
- Show historical weather data with temperature and wind speed averages.
- Provide detailed forecasts for upcoming days.
- Display alert notifications for severe weather conditions.
- Responsive UI that adjusts to various device screen sizes.

## Technologies Used

- **Frontend:** React Native, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Icons:** Material Community Icons (via Expo)
- **Environment Management:** dotenv for environment variables

## Installation

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB server running or access to a MongoDB Atlas cluster.
- Expo CLI for running the React Native application.

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
   
2. **Install frontend dependencies:**

- Navigate to the frontend directory and install dependencies:

bash
- cd frontend
- npm install

3. **Setup backend:**

- Navigate to the backend directory and install dependencies:

bash
- cd backend
- npm install

4. **Environment Configuration:**

- Create a .env file in the backend directory and add your MongoDB URI:

- MONGO_URI=mongodb://your_mongodb_uri_here

### Start the backend server:

**In the backend directory, run:**

bash
- node server.js
- The server should now be running on http://localhost:5001.

### Start the frontend application:

**In the frontend directory, run:**

bash
- npm start


- This will open a new window in your default browser. Follow the instructions to run the app on an emulator or your device.

## Component Overview
### Frontend Components
- SummaryList.js
- Fetches and displays historical weather summaries from the backend API.
- Uses a FlatList to render individual summary items with temperature and wind speed data.
- Displays a loading indicator while data is being fetched.
- ForecastSummaryScreen.js
- Displays the weather forecast data received from the backend.
- Maps through the forecast data and displays conditions, temperatures, humidity, and wind speed.
- DailySummaryScreen.js
- Shows a detailed daily weather summary.
- Animates the average temperature display.
- Utilizes icons to represent different weather conditions dynamically.
- AlertNotification.js
- Displays alert messages when severe weather conditions are detected.
- Uses a conditional render to show alerts based on the presence of messages.
  
### Backend Functionality
- server.js
- Initializes an Express.js server and connects to MongoDB.
- Defines a schema for storing daily weather summaries.
- Provides a POST endpoint (/summaries) to save daily weather summaries to the database.
- Implements error handling for missing data and MongoDB connection issues.
- API Endpoints
- POST /summaries: Accepts JSON data containing weather summary details and stores it in the MongoDB database.

## MongoDB Schema
### The DailySummary schema includes the following fields:

- avgTemp: Average temperature for the day (Number).
- maxTemp: Maximum temperature for the day (Number).
- minTemp: Minimum temperature for the day (Number).
- avgWindSpeed: Average wind speed for the day (Number).
- avgHumidity: Average humidity for the day (Number).
- dominantCondition: Main weather condition for the day (String).
- date: Date of the summary (String).
  
### Usage
- Launch the application on your device or emulator to view the weather summaries and forecasts.
- Navigate through different screens to explore historical data and current weather conditions.
- Enable alerts to stay informed about severe weather events.
- Future Enhancements
- Implement user authentication to personalize weather data.
- Add charts and visualizations for better data representation.
- Integrate real-time weather updates using WebSockets.
- Expand the API to include additional weather data sources.
  
### Contributing
- Contributions are welcome! Please open an issue or submit a pull request to improve the project.

## License
- This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- Special thanks to the developers of React Native and the libraries used in this project.

### Analysis of the Provided Code

1. **Code Structure**: The code is organized into components that encapsulate different functionalities, making it modular and easier to maintain. Each component has its own responsibilities, such as fetching data, displaying summaries, or showing alerts.

2. **Error Handling**: The frontend components implement error handling, especially in the `SummaryList` component, which alerts users if there's an issue fetching data. This enhances the user experience by providing feedback during errors.

3. **User Experience**: The use of activity indicators while loading data improves the user experience by informing users that data is being fetched. Additionally, visual elements like icons and styled texts provide a better aesthetic and readability.

4. **Backend Connection**: The backend properly connects to MongoDB and handles incoming data with validation. The use of environment variables for sensitive data like the MongoDB URI enhances security and makes it easier to manage configuration settings.

5. **Responsiveness and Styling**: The components are styled with consideration for readability and responsiveness, using flexbox layout properties and dynamic styles based on data.
