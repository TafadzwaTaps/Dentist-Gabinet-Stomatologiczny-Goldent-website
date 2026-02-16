// =====================================================
// Multi-language & Booking System - Main App
// =====================================================

// Current language (default: Polish)
let currentLang = 'pl';

// =====================================================
// Language Switcher
// =====================================================

function initLanguageSwitcher() {
    // Get language from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    const savedLang = localStorage.getItem('preferred_language');
    
    currentLang = urlLang || savedLang || 'pl';
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }
        
        // Add click handler
        btn.addEventListener('click', function() {
            switchLanguage(this.dataset.lang);
        });
    });
    
    // Apply translations
    applyTranslations(currentLang);
}

function switchLanguage(lang) {
    currentLang = lang;
    
    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.history.pushState({}, '', url);
    
    // Save preference
    localStorage.setItem('preferred_language', lang);
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Apply translations
    applyTranslations(lang);
    
    // Update meta tags
    updateMetaTags(lang);
    
    // Reload booking services if visible
    if (document.getElementById('bookingSection')) {
        loadBookingServices();
    }
}

function applyTranslations(lang) {
    const t = translations[lang];
    
    if (!t) {
        console.error('Translations not found for language:', lang);
        return;
    }
    
    // Apply all translations using data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = t;
        
        // Navigate through nested object
        for (const k of keys) {
            value = value[k];
            if (value === undefined) break;
        }
        
        if (value !== undefined) {
            // Check if it contains HTML (like <br> tags)
            if (typeof value === 'string' && value.includes('<br>')) {
                element.innerHTML = value;
            } else {
                element.textContent = value;
            }
        }
    });
    
    // Update dynamic content
    updateDynamicContent(lang);
}

function updateDynamicContent(lang) {
    const t = translations[lang];
    
    // Update page title
    if (lang === 'pl') {
        document.title = "Gabinet Stomatologiczny Goldent - Dentysta Rzeszów | Wołyńska 5/2";
    } else {
        document.title = "Goldent Dental Clinic - Dentist Rzeszów | Wołyńska 5/2";
    }
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        if (lang === 'pl') {
            metaDesc.content = "Gabinet Stomatologiczny Goldent w Rzeszowie - profesjonalna opieka stomatologiczna, nowoczesne leczenie, przystępne ceny. Dentysta Rzeszów ul. Wołyńska 5/2. Ocena 5.0 ⭐";
        } else {
            metaDesc.content = "Goldent Dental Clinic in Rzeszów - professional dental care, modern treatment, affordable prices. Dentist Rzeszów, Wołyńska 5/2. Rating 5.0 ⭐";
        }
    }
}

function updateMetaTags(lang) {
    // Update hreflang tags
    const hreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
    hreflangs.forEach(link => {
        const hreflang = link.getAttribute('hreflang');
        if (hreflang !== 'x-default') {
            link.href = window.location.origin + window.location.pathname + '?lang=' + hreflang;
        }
    });
    
    // Update og:locale
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
        ogLocale.content = lang === 'pl' ? 'pl_PL' : 'en_US';
    }
}

// =====================================================
// Booking System
// =====================================================

let selectedService = null;
let selectedDuration = null;
let selectedDate = null;
let selectedTime = null;
let availableSlots = [];

function initBookingSystem() {
    if (!document.getElementById('bookingSection')) return;
    
    loadBookingServices();
    initCalendar();
    setupBookingForm();
}

function loadBookingServices() {
    const serviceGrid = document.getElementById('serviceGrid');
    if (!serviceGrid) return;
    
    const serviceList = services[currentLang];
    serviceGrid.innerHTML = '';
    
    serviceList.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-option';
        serviceCard.dataset.serviceId = service.id;
        serviceCard.dataset.duration = service.duration;
        serviceCard.innerHTML = `
            <div class="service-name">${service.name}</div>
            <div class="service-duration">${service.duration} min</div>
        `;
        
        serviceCard.addEventListener('click', function() {
            selectService(service);
        });
        
        serviceGrid.appendChild(serviceCard);
    });
}

function selectService(service) {
    selectedService = service;
    
    // Update UI
    document.querySelectorAll('.service-option').forEach(el => {
        el.classList.remove('selected');
    });
    document.querySelector(`[data-service-id="${service.id}"]`).classList.add('selected');
    
    // Auto-select duration
    selectedDuration = service.duration;
    document.querySelectorAll('.duration-option').forEach(el => {
        el.classList.remove('selected');
        if (parseInt(el.dataset.duration) === service.duration) {
            el.classList.add('selected');
        }
    });
    
    // Show calendar
    document.getElementById('step2').style.display = 'block';
    
    // Update available slots
    if (selectedDate) {
        updateAvailableSlots();
    }
}

function selectDuration(duration) {
    selectedDuration = duration;
    
    document.querySelectorAll('.duration-option').forEach(el => {
        el.classList.remove('selected');
        if (parseInt(el.dataset.duration) === duration) {
            el.classList.add('selected');
        }
    });
    
    if (selectedDate) {
        updateAvailableSlots();
    }
}

// =====================================================
// Calendar Functions
// =====================================================

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function initCalendar() {
    renderCalendar();
    
    // Setup navigation
    document.getElementById('prevMonth')?.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    document.getElementById('nextMonth')?.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    // Setup duration options
    document.querySelectorAll('.duration-option').forEach(el => {
        el.addEventListener('click', function() {
            selectDuration(parseInt(this.dataset.duration));
        });
    });
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const monthDisplay = document.getElementById('currentMonth');
    
    if (!calendarGrid) return;
    
    const monthNames = currentLang === 'pl' 
        ? ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    monthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Clear grid
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = currentLang === 'pl' 
        ? ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd']
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    // Get first day of month (Monday = 0)
    const firstDay = new Date(currentYear, currentMonth, 1);
    let firstDayOfWeek = firstDay.getDay() - 1;
    if (firstDayOfWeek < 0) firstDayOfWeek = 6; // Sunday = 6
    
    // Get number of days in month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Check if today
        if (date.getTime() === today.getTime()) {
            dayElement.classList.add('today');
        }
        
        // Check if past date
        if (date < today) {
            dayElement.classList.add('disabled');
        }
        
        // Check if clinic is closed
        const dayOfWeek = date.getDay();
        if (!clinicSchedule[dayOfWeek]) {
            dayElement.classList.add('disabled');
        }
        
        // Add click handler
        if (!dayElement.classList.contains('disabled')) {
            dayElement.addEventListener('click', function() {
                selectDate(date);
            });
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

function selectDate(date) {
    selectedDate = date;
    
    // Update UI
    document.querySelectorAll('.calendar-day').forEach(el => {
        el.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Show time slots
    document.getElementById('step3').style.display = 'block';
    
    // Update available slots
    updateAvailableSlots();
}

async function updateAvailableSlots() {
    if (!selectedDate || !selectedDuration) return;
    
    const timeSlotsGrid = document.getElementById('timeSlotsGrid');
    const noSlotsMessage = document.getElementById('noSlotsMessage');
    
    if (!timeSlotsGrid) return;
    
    // Generate time slots
    availableSlots = generateTimeSlots(selectedDate, selectedDuration);
    
    if (availableSlots.length === 0) {
        timeSlotsGrid.style.display = 'none';
        noSlotsMessage.style.display = 'block';
        return;
    }
    
    timeSlotsGrid.style.display = 'grid';
    noSlotsMessage.style.display = 'none';
    timeSlotsGrid.innerHTML = '';
    
    // Check availability for each slot
    for (const slot of availableSlots) {
        const isAvailable = await checkSlotAvailability(selectedDate, slot.time);
        
        const slotElement = document.createElement('div');
        slotElement.className = 'time-slot';
        slotElement.textContent = slot.time;
        
        if (!isAvailable) {
            slotElement.classList.add('disabled');
        } else {
            slotElement.addEventListener('click', function() {
                selectTimeSlot(slot.time);
            });
        }
        
        timeSlotsGrid.appendChild(slotElement);
    }
}

function selectTimeSlot(time) {
    selectedTime = time;
    
    // Update UI
    document.querySelectorAll('.time-slot').forEach(el => {
        el.classList.remove('selected');
        if (el.textContent === time) {
            el.classList.add('selected');
        }
    });
    
    // Show form
    document.getElementById('step4').style.display = 'block';
    
    // Update summary
    updateBookingSummary();
}

function updateBookingSummary() {
    const summary = document.getElementById('bookingSummary');
    if (!summary) return;
    
    const t = translations[currentLang].booking;
    
    const dateStr = selectedDate.toLocaleDateString(currentLang === 'pl' ? 'pl-PL' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    summary.innerHTML = `
        <div class="summary-item">
            <span class="summary-label">${t.selectService}:</span>
            <span class="summary-value">${selectedService.name}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">${t.selectDuration}:</span>
            <span class="summary-value">${selectedDuration} min</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">${t.selectDate}:</span>
            <span class="summary-value">${dateStr}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">${t.selectTime}:</span>
            <span class="summary-value">${selectedTime}</span>
        </div>
    `;
}

// =====================================================
// Booking Form Submission
// =====================================================

function setupBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    const bookingStatus = document.getElementById('bookingStatus');
    
    if (!bookingForm) return;
    
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = bookingForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        const t = translations[currentLang].booking;
        
        // Show loading
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>' + 
            (currentLang === 'pl' ? 'Wysyłanie...' : 'Sending...');
        submitButton.disabled = true;
        
        // Clear previous status
        bookingStatus.innerHTML = '';
        bookingStatus.className = '';
        
        try {
            // Get form data
            const formData = {
                service: selectedService.name,
                serviceId: selectedService.id,
                duration: selectedDuration,
                date: selectedDate.toISOString().split('T')[0],
                time: selectedTime,
                name: document.getElementById('bookingName').value,
                phone: document.getElementById('bookingPhone').value,
                email: document.getElementById('bookingEmail').value || null,
                notes: document.getElementById('bookingNotes').value || null,
                language: currentLang
            };
            
            // Save to Firebase
            const result = await saveBooking(formData);
            
            if (result.success) {
                // Success
                bookingStatus.innerHTML = '<i class="fas fa-check-circle me-2"></i>' + t.bookingSuccess;
                bookingStatus.className = 'success';
                
                // Reset form
                bookingForm.reset();
                resetBookingSelection();
                
                // Track conversion
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'booking_completed', {
                        'event_category': 'Booking',
                        'event_label': selectedService.name
                    });
                }
            } else {
                throw new Error('Booking failed');
            }
        } catch (error) {
            // Error
            bookingStatus.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>' + t.bookingError;
            bookingStatus.className = 'error';
            console.error('Booking error:', error);
        } finally {
            // Reset button
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            
            // Auto-hide status after 8 seconds
            setTimeout(() => {
                bookingStatus.style.opacity = '0';
                bookingStatus.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    bookingStatus.innerHTML = '';
                    bookingStatus.className = '';
                    bookingStatus.style.opacity = '1';
                }, 500);
            }, 8000);
        }
    });
}

function resetBookingSelection() {
    selectedService = null;
    selectedDuration = null;
    selectedDate = null;
    selectedTime = null;
    
    document.querySelectorAll('.service-option').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.duration-option').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
    
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'none';
    document.getElementById('step4').style.display = 'none';
}

// =====================================================
// Initialize on Load
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    // Load translations first
    if (typeof translations === 'undefined') {
        console.error('Translations not loaded!');
        return;
    }
    
    // Initialize language switcher
    initLanguageSwitcher();
    
    // Initialize Firebase
    setTimeout(() => {
        if (typeof initializeFirebase === 'function') {
            initializeFirebase();
        }
    }, 100);
    
    // Initialize booking system
    initBookingSystem();
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100
        });
    }
});
