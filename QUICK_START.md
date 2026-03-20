# Relief-Zone Quick Start

## 1️⃣ If You're Getting an Error

**Run this command (Mac/Linux):**
```bash
chmod +x reset.sh && ./reset.sh
```

**Or (Windows):**
```cmd
reset.bat
```

Then visit: `http://localhost:3000/register`

---

## 2️⃣ First Time Setup (No errors)

```bash
# Install dependencies
npm install

# Setup database (creates tables & seeds data)
npm run setup

# Start dev server
npm run dev
```

Then visit: `http://localhost:3000/register`

---

## 3️⃣ Important Requirements

✅ **Environment Variables** - Must have `.env.local`:
```
DATABASE_URL=postgresql://...
JWT_SECRET=any-secure-string
```

✅ **Neon Database** - Must be connected (check in Vercel Settings)

✅ **Node Version** - Use Node 18 or higher

---

## 4️⃣ Registration

### Patient Account
1. Click "Register"
2. Select "Patient" role
3. Fill in details
4. Login and access patient dashboard

### Therapist Account  
1. Click "Register"
2. Select "Therapist" role
3. Fill in details
4. Login and manage patients

---

## 5️⃣ Features Available

### Patients
- 📋 Treatment Plans
- 🎯 Goals & Progress
- ✅ Action Items
- 🧘 Chill Zone (Meditations & Breathing)
- 😊 Mood Logging

### Therapists
- 👥 Patient Management
- 📝 Create Treatment Plans
- 📊 Session Tracking
- 📖 Therapy Notes

---

## 6️⃣ Languages

Switch between:
- 🇪🇹 **Amharic** (አማርኛ)
- 🇪🇹 **Afan Oromo** (ኦሮሞ)

---

## 7️⃣ Troubleshooting

| Issue | Fix |
|-------|-----|
| Registration error | Run `./reset.sh` or `reset.bat` |
| Database errors | Check `DATABASE_URL` in `.env.local` |
| Pages show error | Clear browser cache (F12 → hard reload) |
| Blank page | Restart dev server: `npm run dev` |

---

## 8️⃣ Development

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run start     # Start production server
npm run setup     # Setup/reset database
npm run lint      # Check code quality
```

---

## 📚 Full Documentation

- **Setup Guide**: See `SETUP.md`
- **Fix Errors**: See `FIX_REGISTRATION.md`
- **API Docs**: See `SETUP.md` API Endpoints section

---

**That's it! You're ready to use Relief-Zone.** 🎉
