# 🔥 Firebase Setup Guide - Gabinet Goldent

Complete guide for setting up Firebase for the Goldent Dental Clinic website.

## 📋 What Firebase Provides

1. **Firestore Database** - Store bookings and contact messages
2. **Authentication** - Secure admin panel access
3. **Free Tier** - Perfect for small businesses
4. **Real-time Updates** - Instant data synchronization

---

## 🚀 Step-by-Step Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `goldent-dental` (or your choice)
4. **Google Analytics**: Optional (you can disable for simplicity)
5. Click "Create project"

### Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon** (`</>`)
2. App nickname: `Goldent Website`
3. **Firebase Hosting**: No (we're using GitHub Pages)
4. Click "Register app"
5. **COPY the config object** - you'll need this!

It looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "goldent-dental.firebaseapp.com",
  projectId: "goldent-dental",
  storageBucket: "goldent-dental.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

### Step 3: Set Up Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. **Start mode**: 
   - Choose **"Production mode"** (we'll set rules next)
4. **Location**: Choose closest to Rzeszów (europe-central2 - Warsaw)
5. Click "Enable"

### Step 4: Configure Firestore Security Rules

1. Go to **Firestore Database** → **Rules** tab
2. Replace existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Bookings collection
    match /bookings/{bookingId} {
      // Anyone can create (book appointment)
      allow create: if request.auth == null;
      
      // Only authenticated admins can read, update, delete
      allow read, update, delete: if request.auth != null;
    }
    
    // Messages collection
    match /messages/{messageId} {
      // Anyone can create (send message)
      allow create: if request.auth == null;
      
      // Only authenticated admins can read, update, delete
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

**What these rules do:**
- ✅ Public users can create bookings and messages
- ✅ Only logged-in admins can view/manage them
- ✅ Prevents unauthorized access

### Step 5: Enable Authentication

1. Go to **Build** → **Authentication**
2. Click "Get started"
3. Select **"Email/Password"** sign-in method
4. **Enable** it
5. Click "Save"

### Step 6: Create Admin User

1. Still in **Authentication**, go to **Users** tab
2. Click "Add user"
3. Enter:
   - **Email**: `admin@goldent.pl` (or your preferred email)
   - **Password**: Create a strong password (min. 6 characters)
4. Click "Add user"

**Save these credentials** - you'll use them to log in to the admin panel!

### Step 7: Update Website Files

1. Open `/app/static/js/firebase-config.js`
2. **Replace** the config at the top with YOUR Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",                    // ← Replace
    authDomain: "goldent-dental.firebaseapp.com",   // ← Replace
    projectId: "goldent-dental",                     // ← Replace
    storageBucket: "goldent-dental.appspot.com",    // ← Replace
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // ← Replace
    appId: "YOUR_APP_ID"                            // ← Replace
};
```

3. Save the file

---

## ✅ Testing Your Setup

### Test 1: Booking System

1. Open your website (local or GitHub Pages)
2. Go to "Rezerwacja" section
3. Try to book an appointment:
   - Select a service
   - Choose a date
   - Pick a time slot
   - Fill in your details
   - Submit
4. **Expected**: Success message appears

**Verify in Firebase:**
1. Go to Firestore Database
2. You should see a new collection `bookings`
3. Check if your booking data is there

### Test 2: Contact Form

1. Go to "Kontakt" section
2. Fill out and submit the contact form
3. **Expected**: Success message appears

**Verify in Firebase:**
1. Check Firestore Database
2. Look for `messages` collection
3. Your message should be saved there

### Test 3: Admin Panel

1. Open `admin.html` in your browser
2. Log in with your admin credentials
3. **Expected**: You should see the admin dashboard
4. Check:
   - ✅ Bookings tab shows your test booking
   - ✅ Messages tab shows your test message
   - ✅ You can change status (pending → confirmed)
   - ✅ You can delete items

---

## 🔒 Security Best Practices

### ✅ DO:
- Use strong admin passwords (12+ characters)
- Keep your Firebase config public (it's safe - rules protect data)
- Regularly monitor your Firebase usage
- Review security rules periodically

### ❌ DON'T:
- Share admin credentials
- Modify security rules without understanding them
- Leave admin panel open on shared computers

---

## 📊 Firebase Quotas (Free Tier)

**Firestore:**
- 50,000 reads/day
- 20,000 writes/day
- 1 GB storage

**Authentication:**
- Unlimited users

**Perfect for small clinic!** 🎉

---

## 🆘 Troubleshooting

### Issue: "Firebase not initialized"
**Solution:** Check that firebase-config.js has correct credentials

### Issue: "Permission denied" in Firestore
**Solution:** 
1. Check Firestore Rules (Step 4)
2. Make sure rules are published
3. Wait 1-2 minutes for changes to propagate

### Issue: "Admin login fails"
**Solution:**
1. Verify admin user exists in Authentication → Users
2. Check email and password are correct
3. Try resetting password in Firebase Console

### Issue: Bookings/Messages not saving
**Solution:**
1. Open browser console (F12)
2. Look for error messages
3. Check Firebase config is correct
4. Verify internet connection

---

## 📈 Monitoring & Analytics

### View Usage:
1. Firebase Console → **Usage**
2. Monitor:
   - Database reads/writes
   - Authentication sign-ins
   - Storage usage

### View Bookings/Messages:
1. Firebase Console → **Firestore Database**
2. Browse collections:
   - `bookings` - All appointment requests
   - `messages` - All contact form submissions

### Export Data:
1. Go to Firestore Database
2. Select collection
3. Click "Export" (requires Cloud Storage setup)
4. Or use admin panel to view and manage

---

## 🎯 Next Steps

1. ✅ Set up Firebase (follow this guide)
2. ✅ Update firebase-config.js with your credentials
3. ✅ Create admin user
4. ✅ Test booking system
5. ✅ Test contact form
6. ✅ Test admin panel
7. ✅ Deploy to GitHub Pages
8. 📧 Optionally: Set up email notifications (future enhancement)

---

## 💡 Pro Tips

1. **Backup Admin Credentials**: Store them in a password manager
2. **Mobile Access**: Admin panel works on mobile too!
3. **Quick Actions**: Use keyboard shortcuts in admin panel
4. **Bulk Operations**: Export data from Firestore for Excel analysis
5. **Multiple Admins**: Create additional users in Authentication

---

## 📞 Need Help?

If you encounter any issues:
1. Check Firebase Console for error messages
2. Review Firestore Rules
3. Verify credentials in firebase-config.js
4. Check browser console for errors (F12)

**Firebase is set up correctly when:**
- ✅ Bookings save to Firestore
- ✅ Messages save to Firestore
- ✅ Admin panel shows data
- ✅ Status updates work
- ✅ Delete operations work

---

**🎉 You're all set! Your website now has a full backend powered by Firebase!**
