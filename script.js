// ==========================================================================
// SPICY VILLA - ADVANCED JAVASCRIPT WITH SPA ROUTER FOR LOADER FIX
// Loader shows ONLY on first entry/refresh, NEVER on internal nav
// ==========================================================================

let currentPage = 'index.html';
let pageMain = null;
let pageLoader = null;
let header = null;

// Pages map for quick lookup
const pages = ['index.html', 'about.html', 'menu.html', 'gallery.html', 'reservations.html', 'contact.html'];

// Re-init functions
function reInitPage() {
    setNavActive();
    initMenuTabs();
    initAIForm();
    initBookingForm();
    initCounters();
    initGSAP();
    initTilt();
}

document.addEventListener('DOMContentLoaded', () => {
    pageMain = document.getElementById('page-main');
    pageLoader = document.getElementById('page-loader');
    header = document.getElementById('header');

    if (!pageMain) {
        console.error('Main content container #page-main not found!');
        return;
    }

    // FIXED: Page Loader - ONLY on first true load
    const isFirstLoad = !sessionStorage.getItem('villaLoaded');
    if (pageLoader) {
        if (isFirstLoad) {
            setTimeout(() => {
                pageLoader.style.opacity = '0';
                setTimeout(() => {
                    pageLoader.style.display = 'none';
                    sessionStorage.setItem('villaLoaded', 'true');
                    initCore();
                }, 1000);
            }, 1500);
        } else {
            pageLoader.style.display = 'none';
            initCore();
        }
    } else {
        initCore();
    }
});

function initCore() {
    currentPage = window.location.pathname.split('/').pop() || 'index.html';
    reInitPage();
    initSPARouter();
    initStickyHeader();
}

function initSPARouter() {
    // Intercept ALL internal navigation links
    const navLinks = document.querySelectorAll('a[href].nav-item, .mobile-nav-item a[href], .nav-actions a[href]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (pages.includes(href) && href !== currentPage) {
                e.preventDefault();
                // Instant loader hide
                if (pageLoader) pageLoader.style.display = 'none';
                loadPage(href);
            }
        });
    });

    // Browser back/forward support
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.page) {
            loadPage(e.state.page);
        } else {
            loadPage('index.html');
        }
    });
}

async function loadPage(page) {
    try {
        const response = await fetch(page);
        if (!response.ok) throw new Error(`Page ${page} not found`);
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newMain = doc.getElementById('page-main');
        
        if (!newMain) throw new Error(`No #page-main in ${page}`);
        
        // Swap content with smooth transition
        pageMain.style.opacity = '0';
        pageMain.innerHTML = newMain.innerHTML;
        
        setTimeout(() => {
            pageMain.style.opacity = '1';
        }, 100);
        
        // Update URL & history
        history.pushState({page}, '', page);
        currentPage = page;
        
        // Re-init everything
        reInitPage();
        
    } catch (error) {
        console.error('SPA Load Error:', error);
        // Fallback to full reload
        window.location.href = page;
    }
}

// ===== SHARED INIT FUNCTIONS (re-init on page change) =====

function setNavActive() {
    const path = currentPage;
    const page = path.split("/").pop();
    
    const setActive = (selector) => {
        const items = document.querySelectorAll(selector);
        items.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (page === href || (page === '' && href === 'index.html')) {
                item.classList.add('active');
            }
        });
    };
    
    setActive('.nav-item');
    setActive('.mobile-nav-item');
}

function initStickyHeader() {
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        };
        window.removeEventListener('scroll', handleScroll); // Prevent duplicates
        window.addEventListener('scroll', handleScroll);
    }
}

function initCounters() {
    const counters = document.querySelectorAll('.stat-num');
    if (counters.length === 0) return;
    
    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/,/g, '');
                const speed = 200;
                const inc = target / speed;
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc).toLocaleString();
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target.toLocaleString() + (counter.getAttribute('data-plus') ? '+' : '');
                }
            };
            updateCount();
        });
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    });
    counterObserver.observe(counters[0].parentElement);
}

function initAIForm() {
    const aiForm = document.getElementById('ai-form');
    if (!aiForm) return;
    
    const handler = () => {
        const results = document.getElementById('ai-results');
        if (!results) return;
        
        results.style.display = 'block';
        results.innerHTML = `<h3 class="text-center" style="color:var(--accent)"><i class="fa-solid fa-spinner fa-spin"></i> AI is curating your luxury meal...</h3>`;
        
        setTimeout(() => {
            results.innerHTML = `
                <div class="text-center fade-in-up">
                    <h3 style="color:var(--accent); font-family:'Cinzel', serif;">Perfect Match Found</h3>
                    <p style="margin-bottom: 20px;">Based on your mood, we recommend the <strong>Hyderabadi Dum Biryani</strong> & <strong>Sizzling Brownie</strong>.</p>
                    <button class="btn btn-primary" onclick="document.querySelector('[data-target=\\'main\\']').click();">View Dish</button>
                </div>
            `;
        }, 1200);
    };
    
    aiForm.removeEventListener('change', handler); // Prevent duplicates
    aiForm.addEventListener('change', handler);
}

function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;
    
    const handler = (e) => {
        e.preventDefault();
        const btn = bookingForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Securing Your Table...';
        btn.disabled = true;

        setTimeout(() => {
            bookingForm.innerHTML = `
                <div style="text-align:center; padding: 40px 0;">
                    <i class="fa-solid fa-circle-check" style="font-size: 4rem; color: #D4AF37; margin-bottom: 20px; box-shadow: var(--neon-glow); border-radius:50%;"></i>
                    <h2 style="font-family:'Cinzel', serif; color:white;">Table Reserved</h2>
                    <p style="color:var(--text-muted);">Your luxury dining experience awaits. We have sent the confirmation to your phone.</p>
                </div>
            `;
        }, 2000);
    };
    
    bookingForm.removeEventListener('submit', handler);
    bookingForm.addEventListener('submit', handler);
}

function initMenuTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuGrids = document.querySelectorAll('.menu-grid');
    
    if (tabBtns.length === 0 || menuGrids.length === 0) return;
    
    const handler = (e) => {
        tabBtns.forEach(b => b.classList.remove('active'));
        menuGrids.forEach(g => {
            g.classList.remove('active');
            g.style.display = 'none';
        });

        e.currentTarget.classList.add('active');
        const targetId = e.currentTarget.getAttribute('data-target');
        const targetGrid = document.getElementById(targetId);
        
        if (targetGrid) {
            targetGrid.classList.add('active');
            targetGrid.style.display = 'grid';
            
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(`#${targetId} .food-card`, 
                    {y: 50, opacity: 0}, 
                    {y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out"}
                );
            }
        }
    };
    
    tabBtns.forEach(btn => {
        btn.removeEventListener('click', handler);
        btn.addEventListener('click', handler);
    });
}



function initTilt() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    VanillaTilt.init(tiltElements, {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.3
    });
}

function initGSAP() {
    if(typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    // Hero animations (only if hero present)
    if (document.querySelector('.hero-content')) {
        const tl = gsap.timeline();
        tl.to(".hero-content h1", {y: 0, opacity: 1, duration: 1, ease: "power3.out"})
          .to(".hero-content p", {y: 0, opacity: 1, duration: 1, ease: "power3.out"}, "-=0.6")
          .to(".hero-buttons", {y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)"}, "-=0.5");
    }

    // Scroll animations
    gsap.utils.toArray('.fade-in-up').forEach(element => {
        gsap.fromTo(element, 
            { y: 50, opacity: 0 },
            { 
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                },
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out"
            }
        );
    });

    // Menu cards (if present)
    if(document.querySelector('.food-card')) {
        gsap.from(".menu-grid.active .food-card", {
            scrollTrigger: {
                trigger: ".menu",
                start: "top 70%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        });
    }
}

// Polyfill for VanillaTilt if needed
if (typeof VanillaTilt === 'undefined') {
    console.warn('VanillaTilt not loaded - 3D tilt disabled');
}

