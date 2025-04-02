// Deploy documentation to GitHub Pages
// Note: This is a simplified script for demonstration purposes

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create docs directory if it doesn't exist
const docsDir = path.join(__dirname, '..', 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// Generate simple documentation page
const docContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Atomic Habits Tracker Documentation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1 { color: #5046e5; }
    h2 { color: #6366f1; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
    code {
      background-color: #f3f4f6;
      padding: 2px 4px;
      border-radius: 4px;
      font-family: monospace;
    }
    pre {
      background-color: #f3f4f6;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
    }
    .container { 
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    main { flex: 1; }
    footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 14px; }
    a { color: #5046e5; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Atomic Habits Tracker Documentation</h1>
      <p>A comprehensive habit tracking application inspired by James Clear's "Atomic Habits"</p>
    </header>
    
    <main>
      <h2>Getting Started</h2>
      <p>To get started with Atomic Habits Tracker, follow these steps:</p>
      <pre><code>git clone https://github.com/yourusername/atomic-habits-tracker.git
cd atomic-habits-tracker
npm install
npm run dev</code></pre>
      
      <h2>Features</h2>
      <ul>
        <li><strong>Habit Tracking:</strong> Create, track, and manage daily habits</li>
        <li><strong>Habit Loop:</strong> Visualize the four components of habit formation</li>
        <li><strong>Gamification:</strong> Earn points, compete on leaderboards, and unlock achievements</li>
        <li><strong>Analytics:</strong> View detailed habit analytics with progress charts</li>
        <li><strong>Theme Customization:</strong> Choose between light and dark themes, select accent colors</li>
      </ul>
      
      <h2>API Reference</h2>
      <p>The application provides RESTful API endpoints:</p>
      <ul>
        <li><code>/api/user</code> - User authentication and profile management</li>
        <li><code>/api/habits</code> - CRUD operations for habits</li>
        <li><code>/api/habits/:id/complete</code> - Mark habits as complete</li>
        <li><code>/api/leaderboard</code> - Get community leaderboard data</li>
        <li><code>/api/analytics/weekly</code> - Get weekly analytics data</li>
      </ul>
    </main>
    
    <footer>
      <p>Built with ❤️ | <a href="https://github.com/yourusername/atomic-habits-tracker">GitHub Repository</a></p>
    </footer>
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(docsDir, 'index.html'), docContent);
console.log('✅ Generated documentation page');

// For demonstration - in a real scenario you would use GitHub Actions workflow
console.log(`
To deploy to GitHub Pages:

1. Push your code to GitHub:
   git push origin main

2. Enable GitHub Pages in your repository settings:
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Select 'main' branch and '/docs' folder as source
   - Click Save

Your documentation will be available at:
https://yourusername.github.io/atomic-habits-tracker/
`);