// =====================================================
// Admin Panel JavaScript
// =====================================================

let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeFirebase();
    
    // Setup login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Setup logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Setup tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Check auth state
    if (typeof onAuthStateChanged === 'function') {
        onAuthStateChanged((user) => {
            if (user) {
                currentUser = user;
                showAdminPanel();
            } else {
                showLoginScreen();
            }
        });
    }
});

// =====================================================
// Authentication
// =====================================================

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const loginError = document.getElementById('loginError');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Logowanie...';
    loginError.textContent = '';
    
    try {
        const result = await adminLogin(email, password);
        if (result.success) {
            currentUser = result.user;
            showAdminPanel();
        }
    } catch (error) {
        loginError.textContent = 'Błąd logowania: ' + (error.message || 'Nieprawidłowe dane logowania');
        console.error('Login error:', error);
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Zaloguj się';
    }
}

async function handleLogout() {
    try {
        await adminLogout();
        showLoginScreen();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('admin-hidden');
    document.getElementById('adminPanel').classList.add('admin-hidden');
}

function showAdminPanel() {
    document.getElementById('loginScreen').classList.add('admin-hidden');
    document.getElementById('adminPanel').classList.remove('admin-hidden');
    
    if (currentUser) {
        document.querySelector('#adminPanel #adminEmail').textContent = currentUser.email;
    }
    
    // Load data
    loadBookings();
    loadMessages();
}

// =====================================================
// Tab Switching
// =====================================================

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });
    
    // Show/hide tab content
    document.getElementById('bookingsTab').style.display = tabName === 'bookings' ? 'block' : 'none';
    document.getElementById('messagesTab').style.display = tabName === 'messages' ? 'block' : 'none';
}

// =====================================================
// Bookings Management
// =====================================================

async function loadBookings() {
    const tableBody = document.getElementById('bookingsTableBody');
    const countBadge = document.getElementById('bookingsCount');
    
    try {
        const bookings = await getAllBookings();
        
        countBadge.textContent = bookings.length;
        
        if (bookings.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-5 text-secondary">
                        <i class="fas fa-inbox me-2"></i>Brak rezerwacji
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = '';
        
        bookings.forEach(booking => {
            const row = document.createElement('tr');
            
            const createdAt = booking.createdAt?.toDate ? 
                booking.createdAt.toDate().toLocaleDateString('pl-PL') : 
                'N/A';
            
            row.innerHTML = `
                <td>${booking.date || 'N/A'}</td>
                <td><strong>${booking.time || 'N/A'}</strong></td>
                <td>${booking.name || 'N/A'}</td>
                <td><a href="tel:${booking.phone}">${booking.phone || 'N/A'}</a></td>
                <td>${booking.service || 'N/A'}</td>
                <td>${booking.duration || '30'} min</td>
                <td>
                    <span class="status-badge ${booking.status || 'pending'}">
                        ${getStatusLabel(booking.status || 'pending')}
                    </span>
                </td>
                <td>
                    <button class="admin-action-btn" onclick="changeBookingStatus('${booking.id}', 'confirmed')" 
                            ${booking.status === 'confirmed' ? 'disabled' : ''}>
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="admin-action-btn" onclick="changeBookingStatus('${booking.id}', 'cancelled')"
                            ${booking.status === 'cancelled' ? 'disabled' : ''}>
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="admin-action-btn danger" onclick="deleteBookingItem('${booking.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading bookings:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-5 text-danger">
                    <i class="fas fa-exclamation-circle me-2"></i>Błąd wczytywania danych
                </td>
            </tr>
        `;
    }
}

async function changeBookingStatus(bookingId, newStatus) {
    if (!confirm(`Czy na pewno chcesz zmienić status na "${getStatusLabel(newStatus)}"?`)) {
        return;
    }
    
    try {
        await updateBookingStatus(bookingId, newStatus);
        await loadBookings();
        alert('Status zaktualizowany!');
    } catch (error) {
        console.error('Error updating booking status:', error);
        alert('Błąd podczas aktualizacji statusu');
    }
}

async function deleteBookingItem(bookingId) {
    if (!confirm('Czy na pewno chcesz usunąć tę rezerwację?')) {
        return;
    }
    
    try {
        await deleteBooking(bookingId);
        await loadBookings();
        alert('Rezerwacja usunięta!');
    } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Błąd podczas usuwania rezerwacji');
    }
}

// =====================================================
// Messages Management
// =====================================================

async function loadMessages() {
    const tableBody = document.getElementById('messagesTableBody');
    const countBadge = document.getElementById('messagesCount');
    
    try {
        const messages = await getAllMessages();
        
        countBadge.textContent = messages.length;
        
        if (messages.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-5 text-secondary">
                        <i class="fas fa-inbox me-2"></i>Brak wiadomości
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = '';
        
        messages.forEach(message => {
            const row = document.createElement('tr');
            
            const createdAt = message.createdAt?.toDate ? 
                message.createdAt.toDate().toLocaleDateString('pl-PL') + ' ' + 
                message.createdAt.toDate().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) : 
                'N/A';
            
            row.innerHTML = `
                <td>${createdAt}</td>
                <td>${message.name || 'N/A'}</td>
                <td><a href="tel:${message.phone}">${message.phone || 'N/A'}</a></td>
                <td><a href="mailto:${message.email}">${message.email || '-'}</a></td>
                <td>
                    <div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" 
                         title="${message.message}">
                        ${message.message || 'N/A'}
                    </div>
                </td>
                <td>
                    <span class="status-badge ${message.status || 'unread'}">
                        ${getMessageStatusLabel(message.status || 'unread')}
                    </span>
                </td>
                <td>
                    <button class="admin-action-btn" onclick="changeMessageStatus('${message.id}', 'read')"
                            ${message.status === 'read' ? 'disabled' : ''}>
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="admin-action-btn danger" onclick="deleteMessageItem('${message.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading messages:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5 text-danger">
                    <i class="fas fa-exclamation-circle me-2"></i>Błąd wczytywania danych
                </td>
            </tr>
        `;
    }
}

async function changeMessageStatus(messageId, newStatus) {
    try {
        await updateMessageStatus(messageId, newStatus);
        await loadMessages();
    } catch (error) {
        console.error('Error updating message status:', error);
        alert('Błąd podczas aktualizacji statusu');
    }
}

async function deleteMessageItem(messageId) {
    if (!confirm('Czy na pewno chcesz usunąć tę wiadomość?')) {
        return;
    }
    
    try {
        await deleteMessage(messageId);
        await loadMessages();
        alert('Wiadomość usunięta!');
    } catch (error) {
        console.error('Error deleting message:', error);
        alert('Błąd podczas usuwania wiadomości');
    }
}

// =====================================================
// Helper Functions
// =====================================================

function getStatusLabel(status) {
    const labels = {
        'pending': 'Oczekująca',
        'confirmed': 'Potwierdzona',
        'cancelled': 'Anulowana'
    };
    return labels[status] || status;
}

function getMessageStatusLabel(status) {
    const labels = {
        'unread': 'Nieprzeczytana',
        'read': 'Przeczytana'
    };
    return labels[status] || status;
}

// Auto-refresh every 30 seconds
setInterval(() => {
    if (document.getElementById('adminPanel').classList.contains('admin-hidden')) {
        return;
    }
    
    const activeTab = document.querySelector('.admin-tab.active');
    if (activeTab) {
        if (activeTab.dataset.tab === 'bookings') {
            loadBookings();
        } else if (activeTab.dataset.tab === 'messages') {
            loadMessages();
        }
    }
}, 30000);
