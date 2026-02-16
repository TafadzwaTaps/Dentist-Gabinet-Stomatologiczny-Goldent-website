// =====================================================
// Firebase Configuration & Initialization
// =====================================================

// Firebase configuration - REPLACE WITH YOUR FIREBASE PROJECT CREDENTIALS
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "goldent-dental.firebaseapp.com",
    projectId: "goldent-dental",
    storageBucket: "goldent-dental.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (will be loaded from CDN)
let app, db, auth;

// Initialize Firebase when available
function initializeFirebase() {
    try {
        if (typeof firebase !== 'undefined') {
            app = firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            auth = firebase.auth();
            console.log('✅ Firebase initialized successfully');
            return true;
        } else {
            console.warn('⚠️ Firebase not loaded yet');
            return false;
        }
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        return false;
    }
}

// =====================================================
// Booking System Functions
// =====================================================

// Clinic working hours configuration
const clinicSchedule = {
    1: { open: '11:00', close: '18:00' }, // Monday
    2: { open: '09:00', close: '13:00' }, // Tuesday
    3: { open: '12:00', close: '18:00' }, // Wednesday
    4: { open: '12:00', close: '18:00' }, // Thursday
    5: { open: '09:00', close: '13:00' }, // Friday
    6: null, // Saturday - Closed
    0: null  // Sunday - Closed
};

// Services list
const services = {
    pl: [
        { id: 'conservative', name: 'Stomatologia zachowawcza', duration: 60 },
        { id: 'hygiene', name: 'Higienizacja i profilaktyka', duration: 30 },
        { id: 'endodontics', name: 'Leczenie kanałowe', duration: 60 },
        { id: 'diagnostics', name: 'Diagnostyka stomatologiczna', duration: 30 },
        { id: 'complex', name: 'Leczenie trudnych przypadków', duration: 60 },
        { id: 'consultation', name: 'Konsultacja', duration: 30 }
    ],
    en: [
        { id: 'conservative', name: 'Conservative Dentistry', duration: 60 },
        { id: 'hygiene', name: 'Hygiene and Prevention', duration: 30 },
        { id: 'endodontics', name: 'Root Canal Treatment', duration: 60 },
        { id: 'diagnostics', name: 'Dental Diagnostics', duration: 30 },
        { id: 'complex', name: 'Treatment of Difficult Cases', duration: 60 },
        { id: 'consultation', name: 'Consultation', duration: 30 }
    ]
};

// Generate time slots for a given day
function generateTimeSlots(date, duration) {
    const dayOfWeek = date.getDay();
    const schedule = clinicSchedule[dayOfWeek];
    
    if (!schedule) {
        return []; // Clinic is closed
    }
    
    const slots = [];
    const [openHour, openMin] = schedule.open.split(':').map(Number);
    const [closeHour, closeMin] = schedule.close.split(':').map(Number);
    
    let currentTime = new Date(date);
    currentTime.setHours(openHour, openMin, 0, 0);
    
    const endTime = new Date(date);
    endTime.setHours(closeHour, closeMin, 0, 0);
    
    while (currentTime < endTime) {
        const slotEndTime = new Date(currentTime.getTime() + duration * 60000);
        
        if (slotEndTime <= endTime) {
            const timeString = currentTime.toTimeString().slice(0, 5);
            slots.push({
                time: timeString,
                timestamp: currentTime.getTime(),
                available: true
            });
        }
        
        currentTime = slotEndTime;
    }
    
    return slots;
}

// Check if slot is available (not booked)
async function checkSlotAvailability(date, time) {
    if (!db) return true; // If Firebase not initialized, assume available
    
    try {
        const dateStr = date.toISOString().split('T')[0];
        const bookingsRef = db.collection('bookings');
        const snapshot = await bookingsRef
            .where('date', '==', dateStr)
            .where('time', '==', time)
            .get();
        
        return snapshot.empty;
    } catch (error) {
        console.error('Error checking availability:', error);
        return false;
    }
}

// Save booking to Firestore
async function saveBooking(bookingData) {
    if (!db) {
        throw new Error('Firebase not initialized');
    }
    
    try {
        const booking = {
            ...bookingData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'pending',
            id: Date.now().toString()
        };
        
        await db.collection('bookings').add(booking);
        console.log('✅ Booking saved successfully');
        return { success: true, id: booking.id };
    } catch (error) {
        console.error('❌ Error saving booking:', error);
        throw error;
    }
}

// =====================================================
// Contact Form - Save Messages to Firestore
// =====================================================

async function saveContactMessage(messageData) {
    if (!db) {
        console.warn('⚠️ Firebase not initialized, message not saved to database');
        return { success: false, savedToDb: false };
    }
    
    try {
        const message = {
            ...messageData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'unread',
            id: Date.now().toString()
        };
        
        await db.collection('messages').add(message);
        console.log('✅ Message saved to Firebase');
        return { success: true, savedToDb: true };
    } catch (error) {
        console.error('❌ Error saving message:', error);
        return { success: false, savedToDb: false, error: error.message };
    }
}

// =====================================================
// Admin Authentication
// =====================================================

async function adminLogin(email, password) {
    if (!auth) {
        throw new Error('Firebase Auth not initialized');
    }
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('✅ Admin logged in:', userCredential.user.email);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('❌ Login error:', error);
        throw error;
    }
}

async function adminLogout() {
    if (!auth) return;
    
    try {
        await auth.signOut();
        console.log('✅ Admin logged out');
    } catch (error) {
        console.error('❌ Logout error:', error);
        throw error;
    }
}

// Check if user is authenticated
function onAuthStateChanged(callback) {
    if (!auth) return;
    
    auth.onAuthStateChanged(callback);
}

// =====================================================
// Admin Panel Functions
// =====================================================

// Get all bookings
async function getAllBookings(status = null) {
    if (!db) return [];
    
    try {
        let query = db.collection('bookings').orderBy('createdAt', 'desc');
        
        if (status) {
            query = query.where('status', '==', status);
        }
        
        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }
}

// Get all messages
async function getAllMessages(status = null) {
    if (!db) return [];
    
    try {
        let query = db.collection('messages').orderBy('createdAt', 'desc');
        
        if (status) {
            query = query.where('status', '==', status);
        }
        
        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
}

// Update booking status
async function updateBookingStatus(bookingId, newStatus) {
    if (!db) return;
    
    try {
        await db.collection('bookings').doc(bookingId).update({
            status: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('✅ Booking status updated');
    } catch (error) {
        console.error('❌ Error updating booking:', error);
        throw error;
    }
}

// Update message status
async function updateMessageStatus(messageId, newStatus) {
    if (!db) return;
    
    try {
        await db.collection('messages').doc(messageId).update({
            status: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('✅ Message status updated');
    } catch (error) {
        console.error('❌ Error updating message:', error);
        throw error;
    }
}

// Delete booking
async function deleteBooking(bookingId) {
    if (!db) return;
    
    try {
        await db.collection('bookings').doc(bookingId).delete();
        console.log('✅ Booking deleted');
    } catch (error) {
        console.error('❌ Error deleting booking:', error);
        throw error;
    }
}

// Delete message
async function deleteMessage(messageId) {
    if (!db) return;
    
    try {
        await db.collection('messages').doc(messageId).delete();
        console.log('✅ Message deleted');
    } catch (error) {
        console.error('❌ Error deleting message:', error);
        throw error;
    }
}

// =====================================================
// Export Functions
// =====================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeFirebase,
        clinicSchedule,
        services,
        generateTimeSlots,
        checkSlotAvailability,
        saveBooking,
        saveContactMessage,
        adminLogin,
        adminLogout,
        onAuthStateChanged,
        getAllBookings,
        getAllMessages,
        updateBookingStatus,
        updateMessageStatus,
        deleteBooking,
        deleteMessage
    };
}
