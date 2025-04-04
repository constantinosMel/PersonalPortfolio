// Project data
const projects = [
    {
        title: "Project 1",
        description: "A beautiful web application built with modern technologies.",
        tags: ["HTML", "CSS", "JavaScript"],
        image: "https://picsum.photos/400/300",
        link: "#"
    },
    {
        title: "Project 2",
        description: "An innovative solution for complex problems.",
        tags: ["React", "Node.js", "MongoDB"],
        image: "https://picsum.photos/400/301",
        link: "#"
    },
    {
        title: "Project 3",
        description: "A responsive and user-friendly interface design.",
        tags: ["UI/UX", "Figma", "HTML/CSS"],
        image: "https://picsum.photos/400/302",
        link: "#"
    }
];

// Populate project cards
function populateProjects() {
    const projectGrid = document.querySelector('.project-grid');
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
                <div class="project-overlay">
                    <a href="${project.link}" class="view-project">View Project</a>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        projectGrid.appendChild(projectCard);
    });
}

// Timeline animation
const timeline = document.querySelector('.timeline');
const timelineItems = document.querySelectorAll('.timeline-item');

const animateTimeline = () => {
    const triggerBottom = window.innerHeight * 0.8;

    timeline.classList.add('animate');

    timelineItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;

        if (itemTop < triggerBottom) {
            item.classList.add('visible');
        }
    });
};

// Initial check
animateTimeline();

// Scroll event listener
window.addEventListener('scroll', animateTimeline);

// Mobile menu functionality
const mobileMenuButton = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

const toggleMenu = () => {
    mobileMenuButton.classList.toggle('active');
    navLinks.classList.toggle('active');
    body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
};

// Toggle menu on button click
mobileMenuButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
});

// Close menu when clicking a link
navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            toggleMenu();
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !mobileMenuButton.contains(e.target)) {
        toggleMenu();
    }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        toggleMenu();
    }
});

// Prevent menu from staying open on resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        mobileMenuButton.classList.remove('active');
        navLinks.classList.remove('active');
        body.style.overflow = '';
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Sample App Data
const apps = [
    {
        name: "App Name 1",
        icon: "path_to_app_icon.png",
        description: "A powerful iOS app that helps users accomplish their goals efficiently.",
        category: "Productivity",
        rating: 4.8,
        appStoreLink: "#"
    },
    // Add more apps as needed
];

// Sample Blog Posts
const blogPosts = [
    {
        title: "Building Custom Animations in SwiftUI",
        image: "path_to_blog_image.jpg",
        date: "Jan 15, 2025",
        category: "SwiftUI",
        excerpt: "Learn how to create beautiful, custom animations in SwiftUI that enhance your app's user experience...",
        link: "#"
    },
    // Add more blog posts as needed
];

// Dynamic Content Loading
function loadApps() {
    const appsGrid = document.querySelector('.apps-grid');
    if (!appsGrid) return;

    apps.forEach(app => {
        const appCard = document.createElement('article');
        appCard.className = 'app-card';
        appCard.innerHTML = `
            <div class="app-icon">
                <img src="${app.icon}" alt="${app.name}">
            </div>
            <div class="app-info">
                <h3>${app.name}</h3>
                <p>${app.description}</p>
                <div class="app-meta">
                    <span class="category">${app.category}</span>
                    <span class="rating">★ ${app.rating}</span>
                </div>
                <a href="${app.appStoreLink}" class="app-store-link" target="_blank">
                    <img src="path_to_app_store_badge.svg" alt="Download on the App Store">
                </a>
            </div>
        `;
        appsGrid.appendChild(appCard);
    });
}

function loadBlogPosts() {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    blogPosts.forEach(post => {
        const blogCard = document.createElement('article');
        blogCard.className = 'blog-card';
        blogCard.innerHTML = `
            <div class="blog-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="date">${post.date}</span>
                    <span class="category">${post.category}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <a href="${post.link}" class="read-more">Read More</a>
            </div>
        `;
        blogGrid.appendChild(blogCard);
    });
}

// Contact form handling
const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
        submitButton.innerHTML = '<span>Sending...</span>';
        // Add your form submission logic here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
        
        // Show success message
        alert('Message sent successfully!');
        contactForm.reset();
    } catch (error) {
        alert('Failed to send message. Please try again.');
    } finally {
        submitButton.innerHTML = originalText;
    }
});

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Create notification content
    notification.innerHTML = `
        <div class="notification-content">
            <svg class="notification-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${type === 'success' 
                    ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
                    : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line>'}
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        background: type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
        color: '#fff',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(100px)',
        opacity: '0',
        transition: 'all 0.3s ease',
        zIndex: '1000'
    });

    // Add styles for the content
    const content = notification.querySelector('.notification-content');
    Object.assign(content.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    });

    // Add styles for the icon
    const icon = notification.querySelector('.notification-icon');
    Object.assign(icon.style, {
        width: '20px',
        height: '20px'
    });

    // Add to DOM
    document.body.appendChild(notification);

    // Trigger animation
    requestAnimationFrame(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    });

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Form validation
const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
            input.classList.add('invalid');
        } else {
            input.classList.remove('invalid');
        }
    });

    input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
            if (input.value.trim() !== '') {
                input.classList.remove('invalid');
            }
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-out');
    observer.observe(section);
});

// Logo animation
const logo = document.querySelector('.logo');
let isAnimating = false;

const triggerLogoAnimation = () => {
    if (!isAnimating) {
        isAnimating = true;
        logo.classList.add('animate');
        
        setTimeout(() => {
            logo.classList.remove('animate');
            isAnimating = false;
        }, 2000);
    }
};

// Animate on page load
// Initialize dynamic content
document.addEventListener('DOMContentLoaded', () => {
    populateProjects();
    loadApps();
    loadBlogPosts();
}); 