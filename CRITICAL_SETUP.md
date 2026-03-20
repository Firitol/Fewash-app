# CRITICAL: Follow These Steps Now

Your app has two issues that need to be fixed:

1. **Build cache still has bcrypt** (old dependency)
2. **Database tables don't exist**

Follow these steps in order:

## Step 1: Clear Everything

### On Mac/Linux:
```bash
rm -rf .next node_modules pnpm-lock.yaml package-lock.json
```

### On Windows:
```bash
rmdir /s /q .next
rmdir /s /q node_modules
del pnpm-lock.yaml package-lock.json
```

## Step 2: Reinstall Clean Dependencies
```bash
npm install
```

This will install without bcrypt (it's been removed from package.json).

## Step 3: Initialize the Database

**This is the most important step - it creates the database tables!**

```bash
npm run init-db
```

You should see output like:
```
🗄️  Initializing Relief-Zone database...

⏳ Executing: CREATE TABLE IF NOT EXISTS users...
   ✓ OK
⏳ Executing: CREATE TABLE IF NOT EXISTS patient_profiles...
   ✓ OK
... (more tables)

✅ Database initialization complete!
   Created: 50+ statements
   Skipped: 0 statements
```

## Step 4: Start the App
```bash
npm run dev
```

## Step 5: Clear Browser Cache
1. Press **F12** (or **Cmd+Shift+I** on Mac)
2. Right-click the refresh button
3. Click "Empty cache and hard reload"
4. Go to `http://localhost:3000/register`
5. Try registering again!

---

## What Each Command Does:

- `npm run init-db` - Creates all 10 database tables needed for the app
- `npm run dev` - Starts the development server
- The app automatically clears old bcrypt files when you reinstall

## If You Still See Errors:

Check that:
- [ ] DATABASE_URL environment variable is set
- [ ] You ran `npm run init-db` successfully
- [ ] You did a hard refresh in the browser (Ctrl+Shift+R or Cmd+Shift+R)

---

**DO NOT SKIP STEP 3** - The database tables must be created before registration will work!
