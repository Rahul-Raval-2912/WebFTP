# ✅ PRE-DEMO CHECKLIST

## Night Before Demo

- [ ] Read through DEMO_GUIDE.md completely
- [ ] Read through CHEAT_SHEET.md
- [ ] Practice the demo flow at least once
- [ ] Prepare answers for expected questions
- [ ] Charge laptop fully

## 30 Minutes Before Demo

- [ ] Run `./setup.sh` to ensure everything compiles
- [ ] Test FTP connection with test server
- [ ] Close unnecessary applications
- [ ] Clear browser cache/history
- [ ] Have 2 terminal windows ready
- [ ] Bookmark http://localhost:8080
- [ ] Keep CHEAT_SHEET.md open on second screen/phone

## 5 Minutes Before Demo

- [ ] Terminal 1: `npm start` (Backend running)
- [ ] Terminal 2: `npm run frontend` (Frontend running)
- [ ] Browser: Open http://localhost:8080
- [ ] Verify login page loads correctly
- [ ] Have FTP credentials ready to copy-paste
- [ ] Close all other browser tabs
- [ ] Silence phone notifications

## During Demo - Remember

- [ ] Speak clearly and confidently
- [ ] Explain WHAT you're doing before clicking
- [ ] Show features in logical order
- [ ] Don't rush - take your time
- [ ] If something breaks, stay calm and use backup plan
- [ ] Emphasize the key selling points
- [ ] Make eye contact with sir
- [ ] Be ready to answer questions

## Backup Plan (If Live Demo Fails)

- [ ] Have screenshots ready in README.md
- [ ] Explain the code architecture instead
- [ ] Walk through the codebase in VS Code
- [ ] Explain what WOULD happen in each step

## After Demo

- [ ] Answer any questions confidently
- [ ] Offer to show code if sir is interested
- [ ] Thank sir for their time
- [ ] Be ready for follow-up questions

---

## Emergency Commands

**If ports are busy:**
```bash
# Kill port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill port 8080
lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

**Quick restart:**
```bash
# Terminal 1
npm start

# Terminal 2
npm run frontend
```

---

## Confidence Boosters

✅ Your project is COMPLETE and WORKING
✅ You have a REAL, FUNCTIONAL application
✅ The code is CLEAN and WELL-STRUCTURED
✅ You understand EVERY part of it
✅ You've TESTED it and it works
✅ You have BACKUP plans ready

**You've got this! 💪**
