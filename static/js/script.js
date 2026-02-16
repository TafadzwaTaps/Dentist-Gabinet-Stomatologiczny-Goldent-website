// =====================================================
// Gabinet Stomatologiczny Goldent - JavaScript
// =====================================================

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100
    });
});

// =====================================================
// Header Scroll Effect
// =====================================================
window.addEventListener('scroll', function() {
    const header = document.getElementById('mainHeader');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// =====================================================
// Smooth Scroll for Navigation Links
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#" or empty
        if (href === '#' || !href) {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerHeight = document.getElementById('mainHeader').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
});

// =====================================================
// Contact Form Handling with Web3Forms + Firebase
// =====================================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        const t = translations[currentLang || 'pl'].contact;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>' + 
            (currentLang === 'en' ? 'Sending...' : 'Wysyłanie...');
        submitButton.disabled = true;
        
        // Clear previous status
        formStatus.innerHTML = '';
        formStatus.className = '';
        
        try {
            // Get form data
            const formData = new FormData(contactForm);
            
            // Save to Firebase first (if available)
            const messageData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email') || null,
                message: formData.get('message'),
                language: currentLang || 'pl'
            };
            
            if (typeof saveContactMessage === 'function') {
                try {
                    await saveContactMessage(messageData);
                } catch (fbError) {
                    console.warn('Firebase save failed, continuing with Web3Forms:', fbError);
                }
            }
            
            // Send to Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Success
                formStatus.innerHTML = '<i class="fas fa-check-circle me-2"></i>' + t.formSuccess;
                formStatus.className = 'success';
                
                // Reset form
                contactForm.reset();
                
                // Track conversion (if analytics available)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submission', {
                        'event_category': 'Contact',
                        'event_label': 'Contact Form'
                    });
                }
            } else {
                // Error from Web3Forms
                throw new Error(data.message || 'Form submission failed');
            }
        } catch (error) {
            // Error handling
            formStatus.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>' + t.formError;
            formStatus.className = 'error';
            console.error('Form submission error:', error);
        } finally {
            // Reset button
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            
            // Auto-hide status after 8 seconds
            setTimeout(() => {
                formStatus.style.opacity = '0';
                formStatus.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    formStatus.innerHTML = '';
                    formStatus.className = '';
                    formStatus.style.opacity = '1';
                }, 500);
            }, 8000);
        }
    });
}

// =====================================================
// Phone Number Click Tracking (for Analytics)
// =====================================================
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'phone_call', {
                'event_category': 'Contact',
                'event_label': 'Phone Click'
            });
        }
    });
});

// =====================================================
// CTA Button Click Tracking
// =====================================================
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.textContent.trim();
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_click', {
                'event_category': 'Engagement',
                'event_label': buttonText
            });
        }
    });
});

// =====================================================
// Gallery Lightbox Effect (Simple Implementation)
// =====================================================
const galleryItems = document.querySelectorAll('.gallery-item img');

galleryItems.forEach(img => {
    img.addEventListener('click', function() {
        // Create lightbox overlay
        const lightbox = document.createElement('div');
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: zoom-out;
            animation: fadeIn 0.3s ease;
        `;
        
        // Add fade-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Create image
        const lightboxImg = document.createElement('img');
        lightboxImg.src = this.src;
        lightboxImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 1rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        `;
        
        // Close on click
        lightbox.addEventListener('click', function() {
            lightbox.style.animation = 'fadeOut 0.3s ease';
            style.textContent += `
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            setTimeout(() => {
                document.body.removeChild(lightbox);
                document.head.removeChild(style);
            }, 300);
        });
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.style.cssText = `
            position: absolute;
            top: 2rem;
            right: 2rem;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 1.5rem;
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            cursor: pointer;
            backdrop-filter: blur(8px);
            transition: all 0.2s ease;
        `;
        
        closeBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.3)';
            this.style.transform = 'scale(1.1)';
        });
        
        closeBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
            this.style.transform = 'scale(1)';
        });
        
        lightbox.appendChild(lightboxImg);
        lightbox.appendChild(closeBtn);
        document.body.appendChild(lightbox);
        
        // Prevent body scroll when lightbox is open
        document.body.style.overflow = 'hidden';
        lightbox.addEventListener('click', function() {
            document.body.style.overflow = 'auto';
        });
    });
});

// =====================================================
// Form Input Validation & UX Enhancement
// =====================================================
const formInputs = document.querySelectorAll('.form-control-custom');

formInputs.forEach(input => {
    // Add floating label effect
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
    
    // Phone number formatting (Polish format)
    if (input.type === 'tel') {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Limit to 9 digits (Polish mobile)
            if (value.length > 9) {
                value = value.slice(0, 9);
            }
            
            // Format: XXX XXX XXX
            if (value.length > 6) {
                value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
            } else if (value.length > 3) {
                value = value.slice(0, 3) + ' ' + value.slice(3);
            }
            
            e.target.value = value;
        });
    }
});

// =====================================================
// Lazy Loading for Images (Performance)
// =====================================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

// =====================================================
// Back to Top Button (Optional Enhancement)
// =====================================================
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopButton.className = 'back-to-top-btn';
backToTopButton.style.cssText = `
    position: fixed;
    bottom: 6rem;
    right: 2rem;
    width: 3rem;
    height: 3rem;
    background: rgba(255, 255, 255, 0.9);
    color: var(--text-primary);
    border: 1px solid var(--border-light);
    border-radius: 50%;
    font-size: 1.125rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 997;
    backdrop-filter: blur(8px);
`;

backToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

document.body.appendChild(backToTopButton);

window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.visibility = 'visible';
    } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.visibility = 'hidden';
    }
});

backToTopButton.addEventListener('mouseenter', function() {
    this.style.background = 'var(--accent-gold)';
    this.style.transform = 'scale(1.1)';
});

backToTopButton.addEventListener('mouseleave', function() {
    this.style.background = 'rgba(255, 255, 255, 0.9)';
    this.style.transform = 'scale(1)';
});

// =====================================================
// Console Welcome Message
// =====================================================
console.log('%c👋 Gabinet Stomatologiczny Goldent', 'font-size: 20px; font-weight: bold; color: #D4AF37;');
console.log('%cProfesjonalna opieka stomatologiczna w Rzeszowie', 'font-size: 14px; color: #353535;');
console.log('%cTel: 883 977 202 | Wołyńska 5/2, Rzeszów', 'font-size: 12px; color: #666666;');

// =====================================================
// Performance Monitoring (Optional)
// =====================================================
window.addEventListener('load', function() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page loaded in ${pageLoadTime}ms`);
    }
});
