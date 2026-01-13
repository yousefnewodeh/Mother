document.addEventListener('DOMContentLoaded', () => {
    // Audio Control
    const audio = document.getElementById('birthdaySong');

    // Page Elements
    const pages = document.querySelectorAll('.page');
    const book = document.getElementById('book');
    const totalPages = pages.length;
    let currentPage = 0; // 0 = Closed, 1 = P1 flipped, etc.

    // Initialize Z-Indexes
    function updateZIndexes() {
        // Logic:
        // Right side (unflipped): Higher index means it's on top of the pile on the right.
        // Left side (flipped): Higher index means it's on top of the pile on the left.

        // When currentPage=0: All Unflipped. P1(3), P2(2), P3(1).
        // When currentPage=1: P1 Flipped. Left: P1(3). Right: P2(2), P3(1). 
        // Wait, if P1 is flipped, it should be below P2? No.
        // Conceptually:
        // Right Stack: P1 is top, P2 below it. z-index: total - index.
        // Left Stack: P1 is at bottom, P2 would be on top of it if flipped. z-index: index.

        pages.forEach((page, index) => {
            // Index 0 based.
            // Page Number = index + 1.

            if (index < currentPage) {
                // This page is FLIPPED (on the Left)
                // Stack order: 1st page is bottom, 2nd page is on top of it.
                // z-index = index + 1;
                page.style.zIndex = index + 1;
            } else {
                // This page is UNFLIPPED (on the Right)
                // Stack order: 1st page is top, 2nd page is below.
                // z-index = totalPages - index; 
                // However, we want the current page (index=currentPage) to be most prominent or just below the previous?
                // Standard: P1(z3), P2(z2), P3(z1).
                page.style.zIndex = totalPages - index + totalPages; // Boost right side to be above left side generally? 
                // Let's stick to simple logic:
                // Right side z-index: (Total - index).
                page.style.zIndex = totalPages - index;
            }
        });
    }

    // Initial Set
    updateZIndexes();

    pages.forEach((page, index) => {
        page.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent duplicate triggers if nesting occurs 

            if (index === currentPage) {
                // Moving Forward: Flip this page to Left
                page.classList.add('flipped');
                currentPage++;

                // Play audio on first interaction
                if (index === 0) {
                    audio.play().catch(e => console.log('Audio autoplay prevented:', e));
                }

                // If this is the last page, launch confetti
                if (currentPage === totalPages) {
                    launchConfetti();
                }
            }
            else if (index === currentPage - 1) {
                // Moving Backward: Unflip this page to Right
                page.classList.remove('flipped');
                currentPage--;
            }

            updateZIndexes();
        });
    });


    // --- MOUSE TILT EFFECT ---
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Calculate rotation intensity
        // Center (0.5, 0.5) = 0deg.
        // Left = -y deg, Right = +y deg.
        const ax = (x - width / 2) / width * 35; // Increased range from 20 to 35
        const ay = (y - height / 2) / height * -35; // Increased range from 20 to 35 (inverted)

        book.style.transform = `rotateY(${ax}deg) rotateX(${ay}deg)`;
    });


    // --- FLOATING INTERNAL EMOJIS ---
    const internalSymbols = ['🌸', '✨', '💖', '🐰', '🦋'];

    function spawnInternalEmoji() {
        // Only spawn if book is mostly open
        if (currentPage > 0 && currentPage < totalPages) {
            const emoji = document.createElement('span');
            emoji.classList.add('internal-emoji');
            emoji.innerText = internalSymbols[Math.floor(Math.random() * internalSymbols.length)];

            // Random position within the book content
            // Need to append to the currently visible page's content or scene?
            // Easier to append to scene/book and position absolutely logic.
            // Let's append to the book container so it moves with it.

            // Random X/Y near center
            const randomX = Math.random() * 200 + 50; // 50 to 250
            const randomY = Math.random() * 300 + 100; // 100 to 400

            emoji.style.left = `${randomX}px`;
            emoji.style.top = `${randomY}px`;

            book.appendChild(emoji);

            setTimeout(() => {
                emoji.remove();
            }, 2000);
        }
    }

    setInterval(spawnInternalEmoji, 800); // Create one every 800ms


    // --- Shared Effects (Confetti & Hearts) ---

    function launchConfetti() {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ffb7c5', '#ff69b4', '#ffd700']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ffb7c5', '#ff69b4', '#ffd700']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    function createHearts() {
        const heartContainer = document.createElement('div');
        Object.assign(heartContainer.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: '-1'
        });
        document.body.appendChild(heartContainer);

        const symbols = ['❤️', '💖', '🌸', '✨', '🎀'];

        setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('floating-heart');
            heart.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = Math.random() * 5 + 5 + 's';
            heart.style.fontSize = Math.random() * 20 + 20 + 'px';

            heartContainer.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 10000);
        }, 500);
    }

    createHearts();
});
