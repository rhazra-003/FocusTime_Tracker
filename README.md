# FocusTime Tracker

**FocusTime Tracker** is a modern Chrome Extension built with React and TypeScript that helps you track your time on websites, visualize your productivity, and stay focused using the Pomodoro technique. It features real-time tracking, customizable categories, a beautiful dashboard, and persistent settings.

---

## Features

- **Automatic Website Time Tracking**  
  Tracks time spent on each website and categorizes them (Work, Social, Entertainment, etc.).

- **Dashboard & Reports**  
  Visualize your productivity with daily, weekly, and monthly charts and summaries.

- **Pomodoro Timer**  
  Built-in Pomodoro timer with customizable durations, auto-start options, and notifications.

- **Custom Categories & Exclusions**  
  Map domains to custom categories and exclude specific sites from tracking.

- **Theme Support**  
  Light and dark mode with persistent theme preference.

- **Settings Sync**  
  All settings are saved and loaded automatically.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) (v8+ recommended)
- [Google Chrome](https://www.google.com/chrome/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rhazra-003/FocusTime_Tracker.git
   cd focustime-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Generate icons (if you change the SVG):**
   ```bash
   npm run generate-icons
   ```

4. **Build the extension:**
   ```bash
   npm run build
   ```

5. **Load the extension in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder in your project

---

## Development

- **Start development server (for React pages):**
  ```bash
  npm run dev
  ```
  > Note: For Chrome Extensions, you still need to build and reload the extension in Chrome to see background/content script changes.

- **Lint and format code:**
  ```bash
  npm run lint
  ```

- **Build for production:**
  ```bash
  npm run build
  ```

---

## Project Structure

```
.
├── public/
│   └── icons/           # SVG and PNG icons
├── src/
│   ├── background/      # Background scripts (time tracking, pomodoro logic)
│   ├── components/      # Reusable React components
│   ├── contexts/        # React context providers (e.g., Theme)
│   ├── pages/           # Main pages: Dashboard, Pomodoro, Settings
│   ├── utils/           # Utility functions (storage, helpers)
│   ├── types/           # TypeScript type definitions
│   └── index.css        # Tailwind CSS entry
├── scripts/             # Build and asset scripts (icon generation, copy assets)
├── dist/                # Build output (after `npm run build`)
├── manifest.json        # Chrome Extension manifest
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
└── package.json
```

---

## Customization

- **Change Pomodoro durations, auto-start, and session settings in the Settings page.**
- **Map websites to categories or exclude them from tracking.**
- **Switch between light and dark mode.**

---

## Contributing

Contributions are welcome! Please open issues or pull requests for bug fixes, features, or improvements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## License

[MIT](LICENSE)

---

## Credits

- Built with [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), and [TypeScript](https://www.typescriptlang.org/).
- Charting by [Recharts](https://recharts.org/).
- Icon generation via [svgexport](https://github.com/shakiba/svgexport) and [sharp](https://sharp.pixelplumbing.com/).

---

**Happy focusing! 🚀**
