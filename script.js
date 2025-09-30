// script.js - Code JavaScript optimisé pour le portfolio

// Configuration globale
const CONFIG = {
    animationThreshold: 0.1,
    scrollOffset: 0.5,
    welcomeAnimationInterval: 10000
};

// Gestionnaire d'état de l'application
const AppState = {
    isMenuOpen: false,
    currentTheme: localStorage.getItem('theme') || 'light'
};

// Initialisation de l'application
function initApp() {
    initNavigation();
    initTheme();
    initAnimations();
    initContactForm();
    initFAQ();
    initWelcomeAnimation();
}

// Navigation et menu burger
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Menu burger
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            AppState.isMenuOpen = !AppState.isMenuOpen;
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Fermer le menu mobile en cliquant sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (AppState.isMenuOpen) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                AppState.isMenuOpen = false;
            }
        });
    });

    // Navigation active basée sur le défilement
    initActiveNavigation();
}

// Navigation active
function initActiveNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: CONFIG.scrollOffset });

    sections.forEach(section => observer.observe(section));
}

// Gestion du thème
function initTheme() {
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = AppState.currentTheme === 'dark' ? '☀️' : '🌙';
    document.body.appendChild(themeToggle);

    // Appliquer le thème sauvegardé
    if (AppState.currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Basculer le thème
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '☀️';
        localStorage.setItem('theme', 'dark');
        AppState.currentTheme = 'dark';
    } else {
        themeToggle.innerHTML = '🌙';
        localStorage.setItem('theme', 'light');
        AppState.currentTheme = 'light';
    }
}

// Animations
function initAnimations() {
    initScrollAnimations();
    initSkillsAnimation();
    initNavbarScrollEffect();
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: CONFIG.animationThreshold,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animation spécifique pour les compétences
                if (entry.target.classList.contains('about')) {
                    animateSkills();
                }
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll(
        '.project-card, .timeline-item, .skill-item, .contact-item, .contact-form-container, .section-title, .about-text p, .faq-item'
    );
    
    animateElements.forEach(el => observer.observe(el));
}

function initSkillsAnimation() {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
            }
        });
    }, { threshold: 0.5 });

    const skillsSection = document.querySelector('.about');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
}

function animateSkills() {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    skillLevels.forEach(skill => {
        const level = skill.getAttribute('data-level');
        skill.style.width = level + '%';
    });
}

function initNavbarScrollEffect() {
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Animation du texte de bienvenue
function initWelcomeAnimation() {
    const typingContainer = document.querySelector('.typing-container');
    const nameElement = document.querySelector('.name-animation');
    
    if (typingContainer && nameElement) {
        resetWelcomeAnimation(typingContainer, nameElement);
        
        // Réanimer périodiquement
        setInterval(() => {
            resetWelcomeAnimation(typingContainer, nameElement);
        }, CONFIG.welcomeAnimationInterval);
    }
}

function resetWelcomeAnimation(typingContainer, nameElement) {
    // Réinitialiser l'animation de frappe
    typingContainer.style.animation = 'none';
    setTimeout(() => {
        typingContainer.style.animation = 'typing 3.5s steps(40, end), blink 1s step-end infinite';
    }, 10);
    
    // Réinitialiser l'animation du nom
    nameElement.style.animation = 'none';
    setTimeout(() => {
        nameElement.style.animation = 'nameGlow 2s infinite';
    }, 3500);
}

// Formulaire de contact
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

function handleContactFormSubmit(e) {
    e.preventDefault();
    
    if (validateContactForm()) {
        simulateFormSubmission();
    }
}

function validateContactForm() {
    const fields = [
        { id: 'name', errorId: 'name-error', validator: value => value.trim() !== '' },
        { id: 'email', errorId: 'email-error', validator: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) },
        { id: 'subject', errorId: 'subject-error', validator: value => value.trim() !== '' },
        { id: 'message', errorId: 'message-error', validator: value => value.trim() !== '' }
    ];

    let isValid = true;

    // Réinitialiser les messages d'erreur
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.textContent = '';
    });

    // Valider chaque champ
    fields.forEach(field => {
        const element = document.getElementById(field.id);
        const errorElement = document.getElementById(field.errorId);
        
        if (!field.validator(element.value)) {
            errorElement.textContent = getErrorMessage(field.id);
            isValid = false;
        }
    });

    return isValid;
}

function getErrorMessage(fieldId) {
    const messages = {
        'name': 'Le nom est requis',
        'email': 'Format d\'email invalide',
        'subject': 'Le sujet est requis',
        'message': 'Le message est requis'
    };
    return messages[fieldId] || 'Champ invalide';
}

function simulateFormSubmission() {
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    setTimeout(() => {
        contactForm.reset();
        contactForm.classList.add('hidden');
        formSuccess.classList.remove('hidden');
        
        setTimeout(() => {
            formSuccess.classList.add('hidden');
            contactForm.classList.remove('hidden');
        }, 5000);
    }, 1000);
}

// FAQ Accordéon
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => toggleFAQItem(item, faqItems));
    });
}

function toggleFAQItem(activeItem, allItems) {
    // Fermer tous les autres éléments
    allItems.forEach(item => {
        if (item !== activeItem) {
            item.classList.remove('active');
        }
    });
    
    // Basculer l'élément actuel
    activeItem.classList.toggle('active');
}

// Ajout des styles CSS pour les animations
function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .project-card, .timeline-item, .skill-item, .contact-item, .contact-form-container, .faq-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .project-card.animate-in, 
        .timeline-item.animate-in, 
        .skill-item.animate-in,
        .contact-item.animate-in,
        .contact-form-container.animate-in,
        .faq-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Délais d'animation */
        .project-card:nth-child(1) { transition-delay: 0.1s; }
        .project-card:nth-child(2) { transition-delay: 0.2s; }
        .project-card:nth-child(3) { transition-delay: 0.3s; }
        
        .timeline-item:nth-child(1) { transition-delay: 0.1s; }
        .timeline-item:nth-child(2) { transition-delay: 0.2s; }
        .timeline-item:nth-child(3) { transition-delay: 0.3s; }
        
        .skill-item:nth-child(1) { transition-delay: 0.1s; }
        .skill-item:nth-child(2) { transition-delay: 0.2s; }
        .skill-item:nth-child(3) { transition-delay: 0.3s; }
        .skill-item:nth-child(4) { transition-delay: 0.4s; }
        
        .contact-item:nth-child(1) { transition-delay: 0.1s; }
        .contact-item:nth-child(2) { transition-delay: 0.2s; }
        .contact-item:nth-child(3) { transition-delay: 0.3s; }
        .contact-form-container { transition-delay: 0.4s; }
        
        .faq-item:nth-child(1) { transition-delay: 0.1s; }
        .faq-item:nth-child(2) { transition-delay: 0.2s; }
        .faq-item:nth-child(3) { transition-delay: 0.3s; }
    `;
    document.head.appendChild(style);
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    injectAnimationStyles();
    initApp();
});
