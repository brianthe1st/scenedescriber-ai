# SceneDescriber AI

SceneDescriber AI is a modern web application that leverages the power of Gemini AI to provide detailed, scene-by-scene descriptions of uploaded videos.

## 🚀 Features

- **Video Upload**: Drag-and-drop or manual file selection.
- **AI Analysis**: Detailed breakdown of scenes, settings, objects, and mood.
- **Markdown Support**: Clean, formatted output for easy reading.
- **Responsive UI**: Built with React, Tailwind CSS, and Framer Motion.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

## 📦 Installation

1. **Clone the repository** (or download the source code):
   ```bash
   git clone <your-repo-url>
   cd scene-describer-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## ⚙️ Configuration

The application requires a Google Gemini API key to function.

1. Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```

2. Add your Gemini API key to the `.env` file:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   *Note: You can get an API key for free at [aistudio.google.com](https://aistudio.google.com/).*

## 💻 Local Development

To start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or the port specified in your terminal).

## 🏗️ Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be in the `dist/` folder, which can be served by any static web server.

## 🌐 Hosting

### Vercel / Netlify (Recommended)
1. Connect your GitHub repository to Vercel or Netlify.
2. Set the **Build Command** to `npm run build`.
3. Set the **Output Directory** to `dist`.
4. Add your `GEMINI_API_KEY` as an **Environment Variable** in the hosting provider's dashboard.

### Manual Hosting
You can serve the `dist` folder using any static hosting service (like GitHub Pages, AWS S3, or a simple Nginx server).

## 🔒 Privacy & Security
- Videos are processed via the Google Gemini API.
- No video data is stored permanently on the server in this implementation.
- API keys should always be kept secret and never committed to version control.

## 📄 License
This project is licensed under the Apache-2.0 License.
