# AllAboutCoffee — Cafe Finder & Social Platform

A full-stack MERN application to discover nearby cafes using Google Maps API and connect with people present in the same cafe in real time using Socket.io.

## 🔗 Live Demo
[https://all-about-coffee-d6qa.vercel.app](https://all-about-coffee-d6qa.vercel.app)

## Tech Stack
- **Frontend** — React.js, Tailwind CSS
- **Backend** — Node.js, Express.js
- **Database** — MongoDB
- **Real-time** — Socket.io
- **Maps** — Google Maps API
- **Deployment** — Vercel, Render

## Features
- Location-based cafe discovery using Google Maps API
- Real-time in-cafe chat — connect with people in the same cafe via Socket.io
- User presence tracking per cafe room
- RESTful API for user sessions and cafe data
- Responsive UI for mobile and desktop

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB instance (local or Atlas)
- Google Maps API key

## How It Works
1. User allows location access
2. Google Maps API fetches nearby cafes based on the user's location
3. User selects a cafe and joins its real-time room via Socket.io
4. Users in the same cafe room can chat and see who else is present
