// Blog data structure
const blogPosts = [
    {
        id: 1,
        title: "Building Custom Animations in SwiftUI",
        excerpt: "Learn how to create beautiful, performant animations in SwiftUI",
        date: "2025-01-15",
        category: "SwiftUI",
        tags: ["iOS", "SwiftUI", "Animation"],
        image: "../assets/images/blog/swiftui-animations.jpg"
    },
    {
        id: 2,
        title: "Advanced Core Data Techniques",
        excerpt: "Deep dive into Core Data's advanced features and optimization",
        date: "2025-01-10",
        category: "iOS",
        tags: ["iOS", "Core Data", "Performance"],
        image: "../assets/images/blog/core-data.jpg"
    },
    // Add more blog posts here
];

// Function to generate blog post HTML
function generateBlogPostHTML(post) {
    return `
        <article class="blog-post">
            <header class="blog-header">
                <h1>${post.title}</h1>
                <div class="blog-meta">
                    <span class="date">${post.date}</span>
                    <span class="category">${post.category}</span>
                    <span class="author">By ${post.author}</span>
                </div>
            </header>
            <div class="blog-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="blog-content">
                ${post.content}
            </div>
            <footer class="blog-footer">
                <div class="tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </footer>
        </article>
    `;
}

// Function to load blog post preview cards
function loadBlogPreviews() {
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
                <a href="/blog/${post.id}" class="read-more">Read More</a>
            </div>
        `;
        blogGrid.appendChild(blogCard);
    });
}

// Function to load a single blog post
function loadBlogPost(postId) {
    const post = blogPosts.find(p => p.id === parseInt(postId));
    if (!post) {
        console.error('Blog post not found');
        return;
    }

    const blogContainer = document.querySelector('.blog-container');
    if (!blogContainer) return;

    blogContainer.innerHTML = generateBlogPostHTML(post);
}

// Function to filter blog posts by tag
function filterBlogsByTag(tag) {
    const filteredPosts = blogPosts.filter(post => post.tags.includes(tag));
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    blogGrid.innerHTML = '';
    filteredPosts.forEach(post => {
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
                <a href="/blog/${post.id}" class="read-more">Read More</a>
            </div>
        `;
        blogGrid.appendChild(blogCard);
    });
}

// Function to search blog posts
function searchBlogPosts(query) {
    const searchTerm = query.toLowerCase();
    const filteredPosts = blogPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    blogGrid.innerHTML = '';
    if (filteredPosts.length === 0) {
        blogGrid.innerHTML = '<div class="no-results">No blog posts found matching your search.</div>';
        return;
    }

    filteredPosts.forEach(post => {
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
                <a href="/blog/${post.id}" class="read-more">Read More</a>
            </div>
        `;
        blogGrid.appendChild(blogCard);
    });
}

// Load recent posts in the sidebar
function loadRecentPosts() {
    const recentPostsList = document.querySelector('.recent-posts ul');
    if (!recentPostsList) return;

    const recentPosts = blogPosts.slice(0, 3); // Get latest 3 posts
    recentPosts.forEach(post => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="post-${post.id}.html" class="recent-post-link">
                <h4>${post.title}</h4>
                <span class="post-date">${formatDate(post.date)}</span>
            </a>
        `;
        recentPostsList.appendChild(li);
    });
}

// Format date to readable string
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Handle social sharing
function setupSocialSharing() {
    const shareButtons = document.querySelectorAll('.share-button');
    if (!shareButtons.length) return;

    const postTitle = document.querySelector('.blog-header h1')?.textContent;
    const postUrl = window.location.href;

    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = button.textContent.toLowerCase().includes('twitter') ? 'twitter' : 'linkedin';
            sharePost(platform, postTitle, postUrl);
        });
    });
}

// Share post on social media
function sharePost(platform, title, url) {
    let shareUrl;
    
    switch(platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
        default:
            return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// Handle newsletter form submission
function setupNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value;

        try {
            // Here you would typically send this to your backend
            console.log('Newsletter signup:', email);
            emailInput.value = '';
            showToast('Thanks for subscribing!');
        } catch (error) {
            console.error('Newsletter signup error:', error);
            showToast('Something went wrong. Please try again.');
        }
    });
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Add styles dynamically
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '1rem 2rem';
    toast.style.background = 'rgba(18, 18, 18, 0.9)';
    toast.style.color = '#fff';
    toast.style.borderRadius = '8px';
    toast.style.backdropFilter = 'blur(10px)';
    toast.style.animation = 'fadeIn 0.3s ease';

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
    }
    .recent-post-link {
        display: block;
        padding: 0.8rem;
        text-decoration: none;
        color: var(--text-primary);
        border-radius: 8px;
        transition: background-color 0.3s ease;
    }
    .recent-post-link:hover {
        background: rgba(255, 255, 255, 0.05);
    }
    .recent-post-link h4 {
        margin: 0 0 0.3rem;
        font-size: 0.95rem;
    }
    .post-date {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
`;
document.head.appendChild(style);

// Initialize blog functionality
document.addEventListener('DOMContentLoaded', () => {
    // Load blog previews on the main page
    loadBlogPreviews();

    // Handle search functionality
    const searchForm = document.querySelector('.blog-search');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchInput = searchForm.querySelector('input[type="search"]');
            if (searchInput) {
                searchBlogPosts(searchInput.value);
            }
        });
    }

    // Handle tag filtering
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            filterBlogsByTag(tag.textContent);
        });
    });

    // Load individual blog post if on a blog post page
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');
    if (postId) {
        loadBlogPost(postId);
    }

    loadRecentPosts();
    setupSocialSharing();
    setupNewsletterForm();
}); 