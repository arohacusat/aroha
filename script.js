document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('sheetdb-form');
            const successAlert = document.getElementById('success-alert');
            const errorAlert = document.getElementById('error-alert');
            const errorMessage = document.getElementById('error-message');
            const statusMessage = document.getElementById('status-message');
            const buttonText = document.getElementById('button-text');
            const buttonSpinner = document.getElementById('button-spinner');
            
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                buttonText.textContent = 'Sending...';
                buttonSpinner.style.display = 'inline-block';
                statusMessage.textContent = 'Submitting your form...';
                statusMessage.style.color = '#ffc107';
                
                // Hide any previous alerts
                successAlert.style.display = 'none';
                errorAlert.style.display = 'none';
                
                try {
                    // Create URLSearchParams from form data
                    const formData = new URLSearchParams();
                    formData.append('data[Name]', document.getElementById('name').value);
                    formData.append('data[Email]', document.getElementById('email').value);
                    formData.append('data[Subject]', document.getElementById('subject').value);
                    formData.append('data[Message]', document.getElementById('message').value);
                    
                    const response = await fetch('https://sheetdb.io/api/v1/fuhinmcu6mjm3', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: formData.toString()
                    });
                    
                    // Check if response is OK without trying to parse as JSON first
                    if (response.ok) {
                        // Try to parse as JSON, but if it fails, still consider it a success
                        try {
                            const result = await response.json();
                            console.log('Success:', result);
                        } catch (jsonError) {
                            console.log('Success (non-JSON response):', response.status, response.statusText);
                        }
                        
                        // Show success message
                        successAlert.style.display = 'block';
                        statusMessage.textContent = 'Form submitted successfully!';
                        statusMessage.style.color = '#28a745';
                        
                        // Create confetti effect
                        createConfetti();
                        
                        // Reset form
                        form.reset();
                    } else {
                        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    
                    // Show error message
                    errorMessage.textContent = error.message || 'There was an error submitting your form. Please try again.';
                    errorAlert.style.display = 'block';
                    statusMessage.textContent = 'Error: ' + error.message;
                    statusMessage.style.color = '#dc3545';
                    
                    // Try alternative approach with JSON if the first method fails
                    if (error.message.includes('CORS') || error.message.includes('Network')) {
                        statusMessage.textContent = 'Trying alternative method...';
                        
                        try {
                            const jsonData = {
                                data: {
                                    Name: document.getElementById('name').value,
                                    Email: document.getElementById('email').value,
                                    Subject: document.getElementById('subject').value,
                                    Message: document.getElementById('message').value
                                }
                            };
                            
                            const response = await fetch('https://sheetdb.io/api/v1/fuhinmcu6mjm3', {
                                method: "POST",
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(jsonData)
                            });
                            
                            if (response.ok) {
                                successAlert.style.display = 'block';
                                statusMessage.textContent = 'Form submitted successfully!';
                                statusMessage.style.color = '#28a745';
                                form.reset();
                                
                                // Create confetti effect
                                createConfetti();
                            } else {
                                throw new Error(`Alternative method failed: ${response.status}`);
                            }
                        } catch (fallbackError) {
                            console.error('Fallback error:', fallbackError);
                            errorMessage.textContent = 'Both methods failed. Please try again later.';
                        }
                    }
                } finally {
                    // Reset button state
                    submitBtn.disabled = false;
                    buttonText.textContent = 'Send Message';
                    buttonSpinner.style.display = 'none';
                }
            });
            
            // Function to create confetti effect
            function createConfetti() {
                const confettiCount = 100;
                const container = document.body;
                
                for (let i = 0; i < confettiCount; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    
                    // Random colors
                    const colors = ['#ffc107', '#dc3545', '#28a745', '#17a2b8', '#6f42c1'];
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.backgroundColor = color;
                    
                    // Random size
                    const size = Math.random() * 10 + 5;
                    confetti.style.width = `${size}px`;
                    confetti.style.height = `${size}px`;
                    
                    // Random position
                    confetti.style.left = `${Math.random() * 100}vw`;
                    
                    // Random animation delay
                    confetti.style.animationDelay = `${Math.random() * 2}s`;
                    
                    container.appendChild(confetti);
                    
                    // Remove confetti after animation completes
                    setTimeout(() => {
                        confetti.remove();
                    }, 5000);
                }
            }
        });

// Auto-hide navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    // Variables for navbar hide/show functionality
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar.offsetHeight;
    const mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-menu-overlay';
    document.body.appendChild(mobileOverlay);
    
    // Set initial state
    navbar.style.top = '0';
    
    // Function to handle navbar visibility on scroll
    function handleNavbarScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
            // Scroll down - hide navbar
            navbar.classList.add('navbar-hidden');
        } else {
            // Scroll up - show navbar
            navbar.classList.remove('navbar-hidden');
        }
        
        lastScrollTop = scrollTop;
    }
    
    // Mobile menu close when clicking outside
    function setupMobileMenuClose() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.getElementById('myNavbar');
        
        // Only set up if we're on mobile
        if (window.innerWidth >= 768) return;
        
        navbarToggler.addEventListener('click', function() {
            const isExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                mobileOverlay.classList.add('active');
            } else {
                mobileOverlay.classList.remove('active');
            }
        });
        
        mobileOverlay.addEventListener('click', function() {
            const navbarToggler = document.querySelector('.navbar-toggler');
            const isExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                navbarToggler.click(); // This will close the menu
                mobileOverlay.classList.remove('active');
            }
        });
        
        // Also close menu when a nav link is clicked (on mobile)
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 768) {
                    navbarToggler.click();
                    mobileOverlay.classList.remove('active');
                }
            });
        });
    }
    
    // Initialize everything
    function initNavbar() {
        // Set up scroll event listener with throttling
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    handleNavbarScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Set up mobile menu functionality
        setupMobileMenuClose();
        
        // Update on window resize
        window.addEventListener('resize', function() {
            // Re-setup mobile menu if needed
            setupMobileMenuClose();
            
            // Ensure overlay is hidden on desktop
            if (window.innerWidth >= 768) {
                mobileOverlay.classList.remove('active');
            }
        });
    }
    
    // Start the navbar functionality
    initNavbar();
    
    // Your existing form submission code follows below...
    // ... [your existing form code remains unchanged]
});

document.addEventListener('DOMContentLoaded', function() {
        const teamMembers = document.querySelectorAll('.team-member');
        
        // Add touch support for mobile devices
        teamMembers.forEach(member => {
            let startX, endX;
            
            member.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
            }, false);
            
            member.addEventListener('touchend', function(e) {
                endX = e.changedTouches[0].clientX;
                
                // If it's a tap (not a swipe), toggle the flip
                if (Math.abs(endX - startX) < 30) {
                    const inner = this.querySelector('.team-member-inner');
                    if (inner.style.transform === 'rotateY(180deg)') {
                        inner.style.transform = 'rotateY(0deg)';
                    } else {
                        inner.style.transform = 'rotateY(180deg)';
                    }
                }
            }, false);
        });
        
        // Add keyboard navigation support
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                teamMembers.forEach(member => {
                    member.querySelector('.team-member-inner').style.transform = 'rotateY(0deg)';
                });
            }
        });
    });