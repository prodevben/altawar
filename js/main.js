document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initScrollAnimations();
    initNavbarScroll();
    initProductFiltering();
    initProductModal();
    initContactForm();
    initCounterAnimations();
});

// Scroll Animations
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.background = 'rgba(30, 64, 175, 0.8)';
        } else {
            navbar.classList.remove('scrolled');
            if (navbar.classList.contains('navbar-blend')) {
                navbar.style.background = '';
            }
        }
    });
}

// Product Filtering
function initProductFiltering() {
    // Product filtering is now handled by the ProductManager class
    // This function is kept for compatibility but functionality moved to products.js
    console.log('Product filtering initialized by ProductManager');
}

// Product Modal
function initProductModal() {
    // Modal functionality is now handled by ProductManager class
    // This function is kept for compatibility
    console.log('Product modal initialized by ProductManager');
}


// Contact Form

function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic form validation
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('is-invalid');
            } else {
                field.classList.remove('is-invalid');
            }
        });

        if (isValid) {
            // Submit with AJAX only if valid
            $.ajax({
                url: "https://script.google.com/macros/s/AKfycbykWRPORcPA2kzaK91wwDQhBZdPy_B5InkpAWQ8fqva9gxOp9bPG1CfSYhzOw45pYDm-A/exec", // 🔹 Add your PHP or API endpoint here
                data: $(contactForm).serialize(),
                method: "post",
                success: function (response) {
                    showSuccessMessage();
                    contactForm.reset();
                },
                error: function (err) {
                    showErrorMessage("Something went wrong. Please try again.");
                }
            });
        } else {
            showErrorMessage("Please fill in all required fields.");
        }
    });
}

// Success/Error Messages
function showSuccessMessage() {
    const alert = createAlert('success', 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
    document.querySelector('.contact-form-wrapper').insertBefore(alert, document.getElementById('contactForm'));

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function showErrorMessage(msg) {
    const alert = createAlert('danger', msg);
    document.querySelector('.contact-form-wrapper').insertBefore(alert, document.getElementById('contactForm'));

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function createAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    return alert;
}

// Initialize the form
document.addEventListener('DOMContentLoaded', initContactForm);


// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add scroll-to-top functionality
function addScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-blue);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    `;
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.transform = 'translateY(0)';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.transform = 'translateY(10px)';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top
addScrollToTop();

// Add CSS for invalid form fields
const style = document.createElement('style');
style.textContent = `
    .form-control.is-invalid,
    .form-select.is-invalid {
        border-color: #dc3545;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
    
    .scroll-to-top:hover {
        background: var(--secondary-blue) !important;
        transform: translateY(-2px) !important;
    }
    
    .loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .loading-spinner {
        padding: 3rem 0;
        color: var(--text-light);
    }
    
    .loading-spinner .spinner-border {
        width: 3rem;
        height: 3rem;
    }
`;
document.head.appendChild(style);
