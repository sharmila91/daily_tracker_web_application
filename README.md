# Daily Tracker

A modern, responsive web application for tracking daily workouts and medicine intake. Built with React, Vite, and Tailwind CSS, with data stored locally in your browser.

![Daily Tracker](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.4-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-8.0.4-646cff.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2.2-38bdf8.svg)

## ✨ Features

### 🏋️ Workout Tracker
- **Monthly Calendar View**: Interactive calendar to mark workout days
- **Visual Feedback**: Green highlighting for completed workouts
- **Today Indicator**: Blue ring highlights the current day
- **Month Navigation**: Easy navigation between months
- **Yearly Statistics**: Bar chart showing workout frequency across all months
- **Performance Metrics**: Total workouts, monthly average, and best month

### 💊 Medicine Tracker
- **Daily Checklist**: Track 3 medicines daily (Fish Oil, Multivitamin, Vitamin B Complex)
- **Progress Bar**: Visual completion rate for each day
- **Date Navigation**: View and update past or future days
- **Status Indicators**: Clear visual feedback for taken/not taken medicines
- **Completion Celebration**: Special message when all medicines are taken

### 💾 Data Management
- **Local Storage**: All data stored in browser (no server required)
- **Export Data**: Download backup as JSON file
- **Import Data**: Restore from backup file
- **Privacy**: Data stays on your device only

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. **Clone or download this repository**

2. **Navigate to the project directory**
   ```bash
   cd daily-tracker-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The app should now be running!

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## 📦 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## 🌐 Deploying to GitHub Pages

### Step 1: Update Configuration

1. Open `package.json`
2. Update the `homepage` field with your GitHub username and repository name:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
   ```

3. Open `vite.config.js`
4. Update the `base` field to match your repository name:
   ```javascript
   base: '/YOUR_REPO_NAME/'
   ```

### Step 2: Create GitHub Repository

1. Go to GitHub and create a new repository (e.g., `daily-tracker`)
2. Initialize git in your project (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. Add remote and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy

```bash
npm run deploy
```

This will:
1. Build your app
2. Create a `gh-pages` branch
3. Deploy the build to GitHub Pages

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select `gh-pages` branch
4. Click **Save**

Your app will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

## 📱 Usage Guide

### Workout Tracking

1. **Mark a Workout Day**
   - Navigate to the "Workout Calendar" tab
   - Click on any day to mark it as a workout day (turns green)
   - Click again to unmark

2. **View Statistics**
   - Switch to "Workout Stats" tab
   - See yearly overview with bar chart
   - View total workouts, average per month, and best month
   - Navigate between years using arrow buttons

### Medicine Tracking

1. **Daily Checklist**
   - Go to "Medicine Tracker" tab
   - Click on any medicine checkbox to mark as taken
   - Progress bar shows completion percentage
   - Navigate to different days using arrow buttons

2. **View Past Days**
   - Use "Prev" and "Next" buttons to navigate
   - Click "Go to Today" to return to current day

### Data Backup

1. **Export Data**
   - Click "Export Data" button in the header
   - JSON file downloads automatically
   - Save this file as backup

2. **Import Data**
   - Click "Import Data" button
   - Select your backup JSON file
   - Data will be restored and page will reload

## 🗂️ Project Structure

```
daily-tracker-app/
├── src/
│   ├── components/
│   │   ├── WorkoutTracker/
│   │   │   ├── MonthlyCalendar.jsx    # Monthly calendar component
│   │   │   └── YearlyChart.jsx        # Yearly statistics chart
│   │   └── MedicineTracker/
│   │       └── DailyChecklist.jsx     # Medicine checklist component
│   ├── hooks/
│   │   └── useLocalStorage.js         # Custom hooks for data management
│   ├── utils/
│   │   └── dateHelpers.js             # Date utility functions
│   ├── App.jsx                        # Main app component
│   ├── main.jsx                       # App entry point
│   └── index.css                      # Global styles
├── public/                            # Static assets
├── package.json                       # Dependencies and scripts
├── vite.config.js                     # Vite configuration
├── tailwind.config.js                 # Tailwind CSS configuration
└── README.md                          # This file
```

## 💾 Data Storage

### How It Works

- Data is stored in browser's `localStorage`
- Each device/browser has separate storage
- Data persists after closing browser
- Clearing browser data will delete stored information

### Data Structure

**Workouts:**
```json
{
  "2026-04": [1, 5, 10, 15, 20],
  "2026-03": [2, 4, 6, 8, 10]
}
```

**Medicines:**
```json
{
  "2026-04-13": {
    "fish-oil": true,
    "multivitamin": false,
    "vitamin-b-complex": true
  }
}
```

## 🔮 Future Enhancements

- [ ] Database integration for cross-device sync
- [ ] User authentication
- [ ] Customizable medicine list
- [ ] Workout types and categories
- [ ] Reminders and notifications
- [ ] Weekly/monthly reports
- [ ] Dark mode toggle
- [ ] Mobile app version
- [ ] Social sharing features
- [ ] Goal setting and achievements

## 🛡️ Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ for personal health tracking

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for blazing fast build tool
- Tailwind CSS for utility-first styling
- Chart.js for beautiful charts
- date-fns for date manipulation

---

**Happy Tracking! 🎯**
