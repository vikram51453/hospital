document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 10. Theme Switcher (Light / Dark Mode)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage for preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        document.body.classList.remove('dark-mode');
        themeIcon.className = 'fa-solid fa-moon';
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        if (isDark) {
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'light');
        }
    });

    // ==========================================================================
    // 9. Date and Time Display (Live Updating)
    // ==========================================================================
    const clockText = document.getElementById('clock-text');
    
    function updateClock() {
        const now = new Date();
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        };
        clockText.textContent = now.toLocaleString('en-US', options);
    }
    
    updateClock();
    setInterval(updateClock, 1000);

    // ==========================================================================
    // 11. Notification Panel Toggle
    // ==========================================================================
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPanel = document.getElementById('notificationPanel');
    const badge = notificationBtn.querySelector('.notification-badge');
    const markAllRead = document.getElementById('markAllRead');
    
    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationPanel.classList.toggle('show');
    });

    // Click outside to close notification panel
    document.addEventListener('click', (e) => {
        if (!notificationPanel.contains(e.target) && e.target !== notificationBtn) {
            notificationPanel.classList.remove('show');
        }
    });

    // Clear notifications badge
    markAllRead.addEventListener('click', () => {
        const unreadItems = notificationPanel.querySelectorAll('.notification-list li.unread');
        unreadItems.forEach(item => item.classList.remove('unread'));
        if (badge) {
            badge.style.display = 'none';
        }
    });

    // ==========================================================================
    // 8. Image/Banner Slider (Auto + Manual Carousel)
    // ==========================================================================
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlideHandler() {
        showSlide(currentSlide + 1);
    }

    function prevSlideHandler() {
        showSlide(currentSlide - 1);
    }

    // Auto Play Interval Setup
    function startAutoSlide() {
        slideInterval = setInterval(nextSlideHandler, 5000); // changes slide every 5 seconds
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    // Add listeners for controls
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlideHandler();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlideHandler();
        startAutoSlide();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });

    startAutoSlide();

    // ==========================================================================
    // 5. Dynamic Statistics Counters (Animated Increment Effect)
    // ==========================================================================
    const counters = document.querySelectorAll('.counter');
    
    function animateCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const prefix = counter.getAttribute('data-prefix') || '';
        const duration = 2000; // 2 seconds animation
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let currentCount = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            currentCount += increment;
            
            if (step >= totalSteps) {
                counter.textContent = prefix + target.toLocaleString();
                clearInterval(timer);
            } else {
                counter.textContent = prefix + Math.floor(currentCount).toLocaleString();
            }
        }, stepTime);
    }

    // Intersection Observer to trigger counter animation when stats section is visible
    const statsSection = document.getElementById('dashboard');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => animateCounter(counter));
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, { threshold: 0.1 });

    if (statsSection) {
        observer.observe(statsSection);
    } else {
        // Fallback if not supported / element missing
        counters.forEach(counter => animateCounter(counter));
    }

    // ==========================================================================
    // 13. Form Validation Logic (Registration Form)
    // ==========================================================================
    const form = document.getElementById('registrationForm');
    
    // Form Inputs
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const password = document.getElementById('password');
    const dob = document.getElementById('dob');
    const address = document.getElementById('address');
    
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('valid');
        formGroup.classList.add('invalid');
        const errorSpan = document.getElementById(`error-${input.name || input.id}`);
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    }

    function showSuccess(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('invalid');
        formGroup.classList.add('valid');
        const errorSpan = document.getElementById(`error-${input.name || input.id}`);
        if (errorSpan) {
            errorSpan.textContent = '';
        }
    }

    function validateFullName() {
        const value = fullName.value.trim();
        if (value === '') {
            showError(fullName, 'Full Name is required.');
            return false;
        } else if (value.length < 3) {
            showError(fullName, 'Name must be at least 3 characters.');
            return false;
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
            showError(fullName, 'Name should only contain letters.');
            return false;
        }
        showSuccess(fullName);
        return true;
    }

    function validateEmail() {
        const value = email.value.trim();
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (value === '') {
            showError(email, 'Email address is required.');
            return false;
        } else if (!emailPattern.test(value)) {
            showError(email, 'Please enter a valid email address.');
            return false;
        }
        showSuccess(email);
        return true;
    }

    function validatePhone() {
        const value = phone.value.trim();
        const phonePattern = /^\d{10}$/; // exactly 10 digits
        if (value === '') {
            showError(phone, 'Phone number is required.');
            return false;
        } else if (!phonePattern.test(value)) {
            showError(phone, 'Phone number must be exactly 10 digits.');
            return false;
        }
        showSuccess(phone);
        return true;
    }

    function validatePassword() {
        const value = password.value;
        // Password strength: min 8 chars, 1 number, 1 special character
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        if (value === '') {
            showError(password, 'Password is required.');
            return false;
        } else if (value.length < 8) {
            showError(password, 'Password must be at least 8 characters long.');
            return false;
        } else if (!hasNumber || !hasSpecial) {
            showError(password, 'Password must contain at least one digit and one special character.');
            return false;
        }
        showSuccess(password);
        return true;
    }

    function validateGender() {
        const genders = document.getElementsByName('gender');
        let selected = false;
        for (const radio of genders) {
            if (radio.checked) {
                selected = true;
                break;
            }
        }
        const errorSpan = document.getElementById('error-gender');
        const radioGroup = document.querySelector('.radio-group');
        const formGroup = radioGroup.closest('.form-group');
        
        if (!selected) {
            formGroup.classList.add('invalid');
            if (errorSpan) errorSpan.textContent = 'Please select a gender.';
            return false;
        } else {
            formGroup.classList.remove('invalid');
            formGroup.classList.add('valid');
            if (errorSpan) errorSpan.textContent = '';
            return true;
        }
    }

    function validateDOB() {
        const value = dob.value;
        if (value === '') {
            showError(dob, 'Date of Birth is required.');
            return false;
        }
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate > today) {
            showError(dob, 'Date of Birth cannot be in the future.');
            return false;
        }
        showSuccess(dob);
        return true;
    }

    function validateAddress() {
        const value = address.value.trim();
        if (value === '') {
            showError(address, 'Residential address is required.');
            return false;
        } else if (value.length < 10) {
            showError(address, 'Please enter a complete address (min 10 characters).');
            return false;
        }
        showSuccess(address);
        return true;
    }

    // Input listeners for real-time dynamic validations
    fullName.addEventListener('input', validateFullName);
    email.addEventListener('input', validateEmail);
    phone.addEventListener('input', validatePhone);
    password.addEventListener('input', validatePassword);
    dob.addEventListener('input', validateDOB);
    address.addEventListener('input', validateAddress);
    document.getElementsByName('gender').forEach(el => {
        el.addEventListener('change', validateGender);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Execute all validations
        const isNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isPasswordValid = validatePassword();
        const isGenderValid = validateGender();
        const isDobValid = validateDOB();
        const isAddressValid = validateAddress();
        
        if (isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isGenderValid && isDobValid && isAddressValid) {
            // All valid - Show success simulation
            alert('Registration Successful! Patient onboarding details have been processed.');
            form.reset();
            
            // Clear validation design helpers
            document.querySelectorAll('.form-group').forEach(grp => {
                grp.classList.remove('valid');
                grp.classList.remove('invalid');
            });
        } else {
            // Focus on first invalid element
            const firstInvalid = document.querySelector('.form-group.invalid input, .form-group.invalid textarea');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
    });

    form.addEventListener('reset', () => {
        document.querySelectorAll('.form-group').forEach(grp => {
            grp.classList.remove('valid');
            grp.classList.remove('invalid');
        });
        document.querySelectorAll('.error-msg').forEach(msg => {
            msg.textContent = '';
        });
    });

    // ==========================================================================
    // 16. Scroll-to-Top Button
    // ==========================================================================
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================================================
    // Navigation active highlights based on scroll position
    // ==========================================================================
    const sections = document.querySelectorAll('main section');
    const navItems = document.querySelectorAll('.nav-links li a');

    window.addEventListener('scroll', () => {
        let currentSectionId = 'home';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    });
    
    // Logout Simulation
    const logoutLink = document.getElementById('logoutLink');
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        const confirmLogout = confirm('Are you sure you want to log out of MediCare Plus?');
        if (confirmLogout) {
            alert('Logged out successfully.');
            // Simulate redirection
            window.location.reload();
        }
    });
});
