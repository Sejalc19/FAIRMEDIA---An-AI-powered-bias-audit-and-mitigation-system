# Fairness Frontend

React-based frontend for the AI Fairness and Bias Detection system.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

Builds the app for production to the `build` folder.

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx              # Main application component
│   ├── index.js             # Entry point
│   ├── api/
│   │   └── api_client.js    # API communication layer
│   ├── components/          # Reusable components
│   └── utils/               # Utility functions
├── package.json
└── README.md
```

## Environment Variables

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:8000
```
