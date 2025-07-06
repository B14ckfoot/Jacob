// Global variables
let selectedTier = '';
let selectedPayment = '';

// Modal functions
function openMembershipModal() {
    const modal = document.getElementById('membershipModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeMembershipModal() {
    const modal = document.getElementById('membershipModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Tier selection
function selectTier(tier) {
    selectedTier = tier;
    const tierSelect = document.getElementById('membershipTier');
    tierSelect.value = tier;
    openMembershipModal();
}

// Payment method selection
function selectPayment(payment) {
    selectedPayment = payment;
    
    // Remove selected class from all options
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    event.currentTarget.classList.add('selected');
}

// Smooth scroll to features
function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    featuresSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Form validation
function validateForm() {
    const requiredFields = ['membershipTier', 'fullName', 'email', 'skills'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.style.borderColor = '#ff6b6b';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    // Validate email format
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailRegex.test(email.value)) {
        email.style.borderColor = '#ff6b6b';
        isValid = false;
    }
    
    // Check if payment method is selected
    if (!selectedPayment) {
        alert('Please select a payment method.');
        isValid = false;
    }
    
    return isValid;
}

// Form submission handler
function handleFormSubmission(formData) {
    // Show loading state
    const submitButton = document.querySelector('#membershipForm button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Show success message
        alert('Welcome to ZenMiscible PMA! Your membership application has been received. You will receive login credentials shortly.');
        
        // Close modal and reset form
        closeMembershipModal();
        resetForm();
    }, 2000);
}

// Reset form function
function resetForm() {
    document.getElementById('membershipForm').reset();
    selectedPayment = '';
    selectedTier = '';
    
    // Remove selected class from payment options
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Reset field styles
    document.querySelectorAll('input, select').forEach(field => {
        field.style.borderColor = '';
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Modal close on outside click
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('membershipModal');
        if (event.target === modal) {
            closeMembershipModal();
        }
    });
    
    // Form submission
    document.getElementById('membershipForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const formData = {
            tier: document.getElementById('membershipTier').value,
            name: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            skills: document.getElementById('skills').value,
            learningInterests: document.getElementById('learningInterests').value,
            paymentMethod: selectedPayment,
            timestamp: new Date().toISOString()
        };
        
        handleFormSubmission(formData);
    });
    
    // Keyboard navigation for modal
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('membershipModal');
        if (modal.style.display === 'block' && e.key === 'Escape') {
            closeMembershipModal();
        }
    });
    
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            // Add subtle click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Parallax effect for hero section
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards and tier cards
    document.querySelectorAll('.feature-card, .tier-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization for scroll events
const debouncedParallax = debounce(function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < window.innerHeight) {
        const rate = scrolled * -0.3;
        hero.style.transform = `translateY(${rate}px)`;
    }
}, 10);

// Replace the existing scroll listener with debounced version
window.addEventListener('scroll', debouncedParallax);

// Add error handling for form submission
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

// Add service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when you have a service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}