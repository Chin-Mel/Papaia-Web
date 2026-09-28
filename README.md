# Papaia Web Frontend

The web frontend of the **Papaia System**. It is a single-page application that connects to a separately hosted REST API.

> **Note:** This repository contains the frontend only. The backend API is hosted separately and is not included here.

---

## Tech Stack

| Tool             | Purpose                           |
| ---------------- | --------------------------------- |
| **React**        | UI library                        |
| **Vite**         | Development server and build tool |
| **Tailwind CSS** | Styling                           |
| **ESLint**       | Code linting                      |
| **Vercel**       | Hosting                           |

---

## Project Structure

```text
├── public/             # Static assets
├── src/                # Application source code
├── .env                # Environment variables (API base URL)
├── SafeHTML.jsx        # Component for safely rendering HTML
├── eslint.config.js    # ESLint configuration
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind configuration
├── vercel.json         # Vercel deployment settings
└── vite.config.js      # Vite configuration
```

---

## Configuration

The application reads the backend API address from a single environment variable in `.env`:

```env
VITE_API_BASE_URL=https://papaiaapi.onrender.com/api
```

> **Important:** If the backend URL changes, update the `VITE_API_BASE_URL` value accordingly.

---

## Installation and Usage

The Papaia Web Frontend is built with **React, Vite, and Tailwind CSS** and connects to a separately hosted REST API.

### Requirements

- Node.js 20 LTS or newer
- npm 10 or newer
- Modern web browser
- Internet connection

### Quick Start

After obtaining the project source code, open a terminal in the project folder and run:

```bash
npm install
npm run dev
```

Open the local URL provided by Vite in your browser.

The backend API is configured through the `.env` file:

```env
VITE_API_BASE_URL=https://papaiaapi.onrender.com/api
```

### Production Build

To create a production build:

```bash
npm run build
```

The generated files are placed in the `dist/` folder.

### Documentation

For complete installation, configuration, deployment, verification, and troubleshooting procedures, refer to:

**`Installation_Guide_Web_Frontend.docx`**

The complete guide is included in the `manuals` folder of the submitted CD/DVD.

---

## Author

**Chin-Mel**
