document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Search Modal
    const searchBtn = document.querySelector('.search-btn');
    const searchModal = document.querySelector('.search-modal');
    const closeSearch = document.querySelector('.close-search');
    
    searchBtn.addEventListener('click', function() {
        searchModal.classList.add('active');
        document.querySelector('.search-form input').focus();
    });
    
    closeSearch.addEventListener('click', function() {
        searchModal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    searchModal.addEventListener('click', function(e) {
        if (e.target === searchModal) {
            searchModal.classList.remove('active');
        }
    });
    
    // Game Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const gamesGrid = document.querySelector('.games-grid');
    
    // Sample game data
    const games = [
        {
            id: 1,
            title: 'Super Mario Bros',
            platform: 'nes',
            year: 1985,
            rating: 5,
            image: 'https://olitechgames.com/src/fifa-2025-psp.webp'
        },
        {
            id: 2,
            title: 'The Legend of Zelda',
            platform: 'nes',
            year: 1986,
            rating: 5,
            image: 'https://via.placeholder.com/300x200/333/cccccc?text=Legend+of+Zelda'
        },
        {
            id: 3,
            title: 'Super Metroid',
            platform: 'snes',
            year: 1994,
            rating: 5,
            image: 'https://via.placeholder.com/300x200/333/cccccc?text=Super+Metroid'
        },
        {
            id: 4,
            title: 'Sonic the Hedgehog',
            platform: 'genesis',
            year: 1991,
            rating: 4,
            image: 'https://via.placeholder.com/300x200/333/cccccc?text=Sonic+Hedgehog'
        },
        {
            id: 5,
            title: 'Pokémon Red',
            platform: 'gb',
            year: 1996,
            rating: 5,
            image: 'https://via.placeholder.com/300x200/333/cccccc?text=Pokemon+Red'
        },
        {
            id: 6,
            title: 'Donkey Kong Country',
            platform: 'snes',
            year: 1994,
            rating: 4,
            image: 'https://via.placeholder.com/300x200/333/cccccc?text=Donkey+Kong'
        },
        {
            id: 7,
            title: 'Mega Man X',
            platform: 'snes',
            year: 1993,
            rating: 4,
            image: 'https://via.placeholder.com/300x200/333/cccccc?text=Mega+Man+X'
        },
        {
            id: 8,
            title: 'Castlevania',
            platform: 'nes',
            year: 1986,
            rating: 4,
            image: 'https://via.placeholder.com/300x200/333/cccccc?text=Castlevania'
        }
    ];
    
    // Display all games initially
    displayGames(games);
    
    // Filter games
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            if (filter === 'all') {
                displayGames(games);
            } else {
                const filteredGames = games.filter(game => game.platform === filter);
                displayGames(filteredGames);
            }
        });
    });
    
    // Function to display games
    function displayGames(gamesToDisplay) {
        gamesGrid.innerHTML = '';
        
        if (gamesToDisplay.length === 0) {
            gamesGrid.innerHTML = '<p class="no-games">No games found for this platform.</p>';
            return;
        }
        
        gamesToDisplay.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            
            gameCard.innerHTML = `
                <img src="${game.image}" alt="${game.title}" class="game-card-img">
                <div class="game-card-content">
                    <h3 class="game-card-title">${game.title}</h3>
                    <div class="game-card-meta">
                        <span>${game.year}</span>
                        <span class="game-card-platform platform-${game.platform}">${game.platform.toUpperCase()}</span>
                    </div>
                    <div class="game-card-footer">
                        <div class="game-card-rating">
                            ${'★'.repeat(game.rating)}${'☆'.repeat(5 - game.rating)}
                        </div>
                        <button class="btn btn-small">Download</button>
                    </div>
                </div>
            `;
            
            gamesGrid.appendChild(gameCard);
        });
    }
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            
            if (this.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });
    
    // Form submission handlers
    const newsletterForm = document.querySelector('.newsletter-form');
    const contactForm = document.querySelector('.contact-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            alert(`Thank you for subscribing with ${email}! You'll receive our newsletter soon.`);
            this.reset();
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Search functionality
    const searchForm = document.querySelector('.search-form');
    const searchResults = document.querySelector('.search-results');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = this.querySelector('input').value.toLowerCase();
            
            if (searchTerm.trim() === '') {
                searchResults.innerHTML = '<p class="no-results">Please enter a search term</p>';
                return;
            }
            
            const results = games.filter(game => 
                game.title.toLowerCase().includes(searchTerm) || 
                game.platform.toLowerCase().includes(searchTerm)
            );
            
            displaySearchResults(results);
        });
    }
    
    function displaySearchResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="no-results">No games found matching your search</p>';
            return;
        }
        
        results.forEach(game => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            
            resultItem.innerHTML = `
                <img src="${game.image}" alt="${game.title}" class="search-result-img">
                <div class="search-result-info">
                    <h4>${game.title}</h4>
                    <p>${game.year} • ${game.platform.toUpperCase()}</p>
                </div>
            `;
            
            resultItem.addEventListener('click', function() {
                // In a real app, this would navigate to the game page
                alert(`You selected ${game.title}`);
                searchModal.classList.remove('active');
            });
            
            searchResults.appendChild(resultItem);
        });
    }
});





// Blog Post Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Toggle comments visibility
    const showCommentsBtn = document.getElementById('showComments');
    const commentsContainer = document.getElementById('commentsContainer');
    
    if (showCommentsBtn && commentsContainer) {
        commentsContainer.style.display = 'none';
        
        showCommentsBtn.addEventListener('click', function() {
            if (commentsContainer.style.display === 'none') {
                commentsContainer.style.display = 'block';
                this.textContent = 'Hide Comments';
            } else {
                commentsContainer.style.display = 'none';
                this.textContent = 'Show Comments';
            }
        });
    }
    
    // Comment form submission
    const commentForm = document.querySelector('.comment-form form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your comment! It will be visible after moderation.');
            this.reset();
        });
    }
    
    // Newsletter subscription
    const sidebarNewsletter = document.querySelector('.sidebar-newsletter');
    if (sidebarNewsletter) {
        sidebarNewsletter.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            alert(`Thank you for subscribing with ${email}! You'll receive our newsletter soon.`);
            this.reset();
        });
    }
    
    // Smooth scrolling for anchor links in blog content
    document.querySelectorAll('.blog-content a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});