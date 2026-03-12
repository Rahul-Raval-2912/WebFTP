# 🚀 QUICK DEMO CHEAT SHEET

## Before Demo
```bash
./setup.sh
```

## Start Application

### Terminal 1 (Backend)
```bash
npm start
```
→ http://localhost:3000

### Terminal 2 (Frontend)
```bash
npm run frontend
```
→ http://localhost:8080

## Test FTP Server Credentials

**Public Test Server:**
- Host: `ftp.dlptest.com`
- Port: `21`
- Username: `dlpuser`
- Password: `rNrKYTX9g7z3RgJRmxWuGHbeu`

## Demo Flow (7 mins)

1. **Intro** (30s) - Explain what it is
2. **Start** (1m) - Show both terminals starting
3. **Connect** (1m) - Login to FTP server
4. **Features** (3-4m):
   - Browse folders
   - Upload file
   - Create folder
   - Download file
   - Rename/Delete
   - Hidden files toggle
   - Back/Forward navigation
5. **Tech** (1m) - Architecture overview
6. **Disconnect** (30s) - Clean logout

## Keyboard Shortcuts
- `Alt + ←` - Go Back
- `Alt + →` - Go Forward

## Key Selling Points
✅ Browser-based (no installation)
✅ TypeScript + Node.js
✅ Full FTP operations
✅ Session management
✅ Responsive UI
✅ Keyboard shortcuts

## If Something Breaks
```bash
# Kill ports
lsof -i :3000 && kill -9 <PID>
lsof -i :8080 && kill -9 <PID>

# Rebuild
npm run build:frontend
```

## Project Structure
```
WebFTP/
├── server/          # Backend API
├── src/
│   ├── js/          # Frontend controllers
│   ├── services/    # API services
│   ├── css/         # Styles
│   └── index.html   # Main page
└── package.json     # Dependencies
```

## Tech Stack
- **Frontend:** AngularJS, TypeScript, CSS
- **Backend:** Node.js, Express, basic-ftp
- **Features:** Sessions, File streaming, REST API
