# FocusTime Tracker Chrome Extension

A Chrome Extension built with React that tracks how much time you spend on each website. It aggregates usage by domain and category, shows daily/weekly/monthly reports with comparative charts, and includes Pomodoro integration with notifications/reminders to promote focused work sessions.

## Features

- 🕒 **Web Time Tracking**
  - Automatically tracks time spent on each domain
  - Categorizes websites (Work, Social, Entertainment, etc.)
  - Ignores background tabs and idle time

- 📊 **Reports Dashboard**
  - Daily, weekly, and monthly views
  - Pie charts for category distribution
  - Bar charts for domain usage
  - Comparison with prior periods

- ⏱️ **Pomodoro Timer**
  - Configurable work and break intervals
  - Session tracking
  - Desktop notifications
  - Auto-start options

- ⚙️ **Customization**
  - Dark/light theme
  - Custom category mappings
  - Domain exclusions
  - Pomodoro settings

## Development Setup

1. **Prerequisites**
   - Node.js (v16 or later)
   - npm or yarn
   - Chrome browser

2. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/chrome-time-tracker.git
   cd chrome-time-tracker

   # Install dependencies
   npm install
   # or
   yarn install
   ```

3. **Development**
   ```bash
   # Start the development server
   npm run dev
   # or
   yarn dev
   ```

4. **Load the Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` directory

## Building for Production

```bash
# Build the extension
npm run build
# or
yarn build
```

The built extension will be in the `dist` directory.

## Project Structure

```
chrome-time-tracker/
├── src/
│   ├── background/     # Background service worker
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── pages/         # Page components
│   ├── types/         # TypeScript types
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── public/            # Static assets
├── manifest.json      # Extension manifest
└── package.json       # Project configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
# FocusTime_Tracker
