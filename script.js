function enterSite() {
    // 1. Hide Welcome Screen
    const welcomeScreen = document.getElementById('welcome-screen');
    welcomeScreen.style.opacity = '0';
    setTimeout(() => {
        welcomeScreen.classList.add('hidden');
    }, 1000);

    // 2. Play Audio
    const audio = document.getElementById('bg-music');
    if (audio) {
        audio.volume = 0.5;
        audio.play().catch(e => {
            console.log("Audio play failed (user interaction might be needed):", e);
        });
    }

    // 3. Start Animations
    const landingContent = document.querySelector('#landing .content');
    if (landingContent) {
        landingContent.classList.remove('paused');
        landingContent.classList.add('running');
    }

    // 4. Start Particles (delayed slightly to match fade out)
    setTimeout(createFloatingHearts, 500);
}

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-on-scroll').forEach(el => {
    observer.observe(el);
});

// Gift Box Interaction
function openGift() {
    const giftBox = document.querySelector('.gift-box');
    const giftContent = document.getElementById('gift-content');

    // Check if already opened to prevent re-animation glitch
    if (giftBox && !giftBox.classList.contains('opened')) {
        giftBox.classList.add('opened');

        // Confetti effect on open
        createConfetti();

        // Reveal content after delay
        setTimeout(() => {
            if (giftContent) {
                giftContent.classList.remove('hidden');
                giftContent.classList.add('show');
                giftContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 500);
    }
}

// Background Floating Hearts
function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    if (container) {
        container.innerHTML = '';

        const heartCount = 20;

        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '❤';
            heart.classList.add('heart');

            // Random positioning
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = (100 + Math.random() * 100) + 'vh'; // Start below screen

            // Random size
            const size = Math.random() * 20 + 10;
            heart.style.fontSize = size + 'px';

            // Random animation duration
            const duration = Math.random() * 10 + 10;
            heart.style.animationDuration = duration + 's';

            container.appendChild(heart);
        }
    }
}

// Simple Confetti Function
function createConfetti() {
    const colors = ['#f48fb1', '#c2185b', '#e1bee7', '#fff3e0'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = '50%';
        confetti.style.top = '50%';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.zIndex = '1000';

        document.body.appendChild(confetti);

        // Animate using Web Animations API
        const angle = Math.random() * 360;
        const velocity = Math.random() * 200 + 50;

        const animation = confetti.animate([
            { transform: `translate(0, 0)` },
            { transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        });

        animation.onfinish = () => confetti.remove();
    }
}

// Voice Message Logic
// Voice Message Logic
let talkingInterval;

function toggleVoiceMessage() {
    const voiceAudio = document.getElementById('voice-msg');
    const bgMusic = document.getElementById('bg-music');
    const icon = document.getElementById('voice-icon');

    // Elements for animation
    const talkingFace = document.getElementById('talking-face');
    const playBtn = document.getElementById('play-btn-wrapper');
    const hoverHint = document.querySelector('.hover-hint');

    if (!voiceAudio) return;

    if (voiceAudio.paused) {
        // Start playing
        voiceAudio.play().then(() => {
            if (icon) icon.textContent = '⏸';

            // UI Updates: Hide button, Show Face
            if (playBtn) playBtn.style.display = 'none';
            if (hoverHint) hoverHint.style.display = 'none';
            if (talkingFace) {
                talkingFace.style.display = 'block';
                startTalkingAnimation(talkingFace);
            }

            // Lower background music
            if (bgMusic && !bgMusic.paused) {
                bgMusic.volume = 0.1;
            }
        }).catch(e => console.error("Error playing voice:", e));
    } else {
        // Pause
        voiceAudio.pause();
        stopVoiceUI();
    }
}

function stopVoiceUI() {
    const icon = document.getElementById('voice-icon');
    const bgMusic = document.getElementById('bg-music');
    const talkingFace = document.getElementById('talking-face');
    const playBtn = document.getElementById('play-btn-wrapper');
    const hoverHint = document.querySelector('.hover-hint');

    if (icon) icon.textContent = '▶';

    // Stop animation
    stopTalkingAnimation();

    // UI Updates: Show button, Hide Face
    if (talkingFace) talkingFace.style.display = 'none';
    if (playBtn) playBtn.style.display = 'flex';
    if (hoverHint) hoverHint.style.display = 'block';

    // Restore background music
    if (bgMusic) {
        bgMusic.volume = 0.5;
    }
}

function onVoiceEnd() {
    stopVoiceUI();
}

function startTalkingAnimation(imgElement) {
    if (talkingInterval) clearInterval(talkingInterval);

    let isOpen = false;
    talkingInterval = setInterval(() => {
        if (imgElement) {
            imgElement.src = isOpen ? 'face.png' : 'face1.png';
            isOpen = !isOpen;
        }
    }, 200); // Switch every 200ms
}

function stopTalkingAnimation() {
    if (talkingInterval) {
        clearInterval(talkingInterval);
        talkingInterval = null;
    }
    const talkingFace = document.getElementById('talking-face');
    if (talkingFace) talkingFace.src = 'face.png'; // Reset to default
}
