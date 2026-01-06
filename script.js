// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('hidden');
    observer.observe(section);
});

// Add dynamic class for animations in CSS
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    .hidden {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    .visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(styleSheet);

// --- Typewriter Effect ---
const texts = [
    "M.Sc. ICT Student",
    "Embedded Systems Engineer",
    "AI Enthusiast",
    "IoT Developer"
];

let count = 0;
let index = 0;
let currentText = "";
let letter = "";

(function type() {
    if (count === texts.length) {
        count = 0;
    }
    currentText = texts[count];
    letter = currentText.slice(0, ++index);

    document.querySelector(".typewriter-text").textContent = letter;

    if (letter.length === currentText.length) {
        count++;
        index = 0;
        setTimeout(type, 2000); // Wait 2s before deleting/next
    } else {
        setTimeout(type, 100); // Typing speed
    }
})();

// --- Pulse Button ---
const cvBtn = document.querySelector('.btn-secondary');
if (cvBtn) {
    cvBtn.classList.add('pulse');
    // Stop pulsing on hover so it doesn't look weird
    cvBtn.addEventListener('mouseenter', () => cvBtn.classList.remove('pulse'));
    cvBtn.addEventListener('mouseleave', () => cvBtn.classList.add('pulse'));
}
