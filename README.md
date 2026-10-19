# 🚆 RailDrop (A Swiggy Concept)

RailDrop is an open-source prototype built to solve the problem of train food delivery failures during train delays. 

## 💡 The Problem
When a train is delayed, food delivery apps (like Swiggy/Zomato) often fail or cancel orders because they follow the original schedule. Passengers are left hungry, especially those without cash or local knowledge.

*Inspired by a real-life incident: Traveling from Canada to India, I faced this exact issue when my train was delayed by 2 hours, I had no cash, and food apps refused to deliver.*

## 🛠️ The Solution
Inspired by how Blinkit dynamically extends delivery during rain, RailDrop introduces a **Dynamic Time-Window Sync**.
1. User enters their PNR.
2. The app fetches the live train status and shows the extended ETA.
3. The user selects a delivery station, picks food, and pays.
4. Food is delivered directly to their Coach and Seat, with OTP verification.

## 💻 Tech Stack
- React + Vite
- Tailwind CSS (for Swiggy-style UI)
- Mock Data (For demonstration purposes only)

## 📱 Key Features
- **Live Train Status:** Shows scheduled vs. estimated time (ETA) with a live clock.
- **Dynamic Delivery Window:** Order is not cancelled if the train is late.
- **Station & Restaurant Picker:** Displays real-time restaurants available at upcoming stops.
- **Cart & Billing:** Calculates GST and delivery fees dynamically.
- **Payment Simulation:** Processing spinner to simulate a real payment gateway.
- **Live Order Tracking:** Timeline (Preparing -> Out for Delivery) with a secure Delivery OTP.

## 🚀 How to Run Locally
1. Clone the repository: `git clone https://github.com/kirtiv-CANADA/raildrop.git`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open `http://localhost:5173` in your browser.

## ⚠️ Disclaimer
This is an independent prototype created for educational and hackathon purposes. It is not affiliated with, endorsed by, or connected to Swiggy. All train, PNR, and restaurant data used here is sample data.
