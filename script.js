// ==========================================================================
// Spicy Villa - Interactive Features (Multi-Page)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. Set Active Nav Link ---
    const path = window.location.pathname;
    const page = path.split("/").pop();
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        // Remove existing active classes
        item.classList.remove('active');
        
        // Add active class based on href matching the current page
        // Default to index.html if on root directory
        const href = item.getAttribute('href');
        if (page === href || (page === '' && href === 'index.html')) {
            item.classList.add('active');
        }
    });

    // --- 1. Sticky Navbar & Scroll Effects ---
    const header = document.getElementById('header');
    
    if(header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 2. Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon between bars and times
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking a link (useful if not navigating away immediately)
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // --- 3. Menu Category Filtering (Menu Page Only) ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuGrids = document.querySelectorAll('.menu-grid');

    if(tabBtns.length > 0 && menuGrids.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and grids
                tabBtns.forEach(b => b.classList.remove('active'));
                menuGrids.forEach(g => g.classList.remove('active'));

                // Add active class to clicked button
                btn.classList.add('active');

                // Show corresponding grid
                const targetId = btn.getAttribute('data-target');
                const targetGrid = document.getElementById(targetId);
                if(targetGrid) {
                    targetGrid.classList.add('active');
                }
            });
        });
    }

    // --- 4. Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');

    if(revealElements.length > 0) {
        const revealOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);

        revealElements.forEach(el => {
            revealOnScroll.observe(el);
        });

        // Trigger initial reveal check
        setTimeout(() => {
            revealElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add('visible');
                }
            });
        }, 100);
    }

    // --- 5. Reservation Form Handling (Reservation Page Only) ---
    const bookingForm = document.getElementById('bookingForm');
    
    if(bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get values
            const name = document.getElementById('name').value;
            const btn = bookingForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            // Simulate API Call / Processing
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            btn.disabled = true;

            setTimeout(() => {
                // Show success
                btn.innerHTML = `<i class="fa-solid fa-check"></i> Table Booked for ${name}!`;
                btn.style.background = '#25D366'; // Green success color
                
                // Reset form
                bookingForm.reset();
                
                // Revert button after 3 seconds
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
});
