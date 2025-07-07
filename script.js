// --- Constants ---
const DEFAULT_PORTS = ['U888', 'J88', '88CLB', 'ABC8'];
const CORRECT_USERNAME = 'funkaka'; // Updated username
const CORRECT_PASSWORD = 'Aa123456'; // Updated password

// --- DOM Elements ---
const loginOverlay = document.getElementById('login-overlay');
const loginUser = document.getElementById('login-user');
const loginPass = document.getElementById('login-pass');
const togglePass = document.getElementById('togglePass');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');
const terminalWindow = document.querySelector('.terminal-window'); // Reference to the main terminal window

const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Tab 1: Kiểm tra mã ẩn
const phoneInput1 = document.getElementById('phone');
const gamePortInput1 = document.getElementById('game-port');
const gameAccountInput1 = document.getElementById('game-account');
const startBtn1 = document.getElementById('start-btn1');
const outputSection1 = document.getElementById('output-section1');

// Tab 2: Xóa mã ẩn
const phoneInput2 = document.getElementById('del-phone');
const gamePortInput2 = document.getElementById('del-game-port');
const gameAccountInput2 = document.getElementById('del-game-account');
const startBtn2 = document.getElementById('start-btn2');
const outputSection2 = document.getElementById('output-section2');

// Tab 3: Kiểm tra cổng game
const checkPortInput = document.getElementById('check-port');
const startBtn3 = document.getElementById('start-btn3');
const outputSection3 = document.getElementById('output-section3');

// --- Utility Functions ---
function validatePhone(phone) {
    return /^0\d{9}$/.test(phone);
}

function validateText(text) {
    return /^[A-Za-z0-9]{4,}$/.test(text);
}

function generateRandomIP() {
    return Array(4).fill().map(() => Math.floor(Math.random() * 256)).join('.');
}

function generateCode(len = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array(len).fill().map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function randomPercent(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setStartButtonState() {
    document.querySelectorAll('[id^=start-btn]').forEach(btn => btn.classList.remove('enabled'));

    const checks = [
        { btn: 'start-btn1', ids: ['phone', 'game-port', 'game-account'], valid: [validatePhone, validateText, validateText] },
        { btn: 'start-btn2', ids: ['del-phone', 'del-game-port', 'del-game-account'], valid: [validatePhone, validateText, validateText] }
    ];

    checks.forEach(({ btn, ids, valid }) => {
        const values = ids.map(id => document.getElementById(id).value.trim());
        const isValid = values.every((val, i) => valid[i](val));
        const button = document.getElementById(btn);
        button.disabled = !isValid;
        if (isValid) button.classList.add('enabled');
    });
    // Special handling for tab3 as it only has one input
    const checkPortInput = document.getElementById('check-port');
    const startBtn3 = document.getElementById('start-btn3');
    if (checkPortInput.value.trim() !== '') {
        startBtn3.disabled = false;
        startBtn3.classList.add('enabled');
    } else {
        startBtn3.disabled = true;
        startBtn3.classList.remove('enabled');
    }
}

// --- Login Functionality ---
function validateLoginInputs() {
    if (loginUser.value.trim() !== '' && loginPass.value.trim() !== '') {
        loginBtn.disabled = false;
        loginBtn.classList.add('enabled');
    } else {
        loginBtn.disabled = true;
        loginBtn.classList.remove('enabled');
    }
    loginError.style.display = 'none'; // Hide error on input
}

function handleLogin() {
    const username = loginUser.value.trim();
    const password = loginPass.value.trim();

    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
        loginOverlay.style.display = 'none'; // Hide login overlay
        terminalWindow.style.display = 'flex'; // Show main terminal window
        // Background effect is already running
        setStartButtonState(); // Set initial button states
    } else {
        loginError.textContent = 'Tên đăng nhập hoặc mật khẩu không đúng!';
        loginError.style.display = 'block';
    }
}

// --- Event Listeners for Login ---
loginUser.addEventListener('input', validateLoginInputs);
loginPass.addEventListener('input', validateLoginInputs);
loginBtn.addEventListener('click', handleLogin);
togglePass.addEventListener('click', () => {
    if (loginPass.type === 'password') {
        loginPass.type = 'text';
        togglePass.textContent = '🙈';
    } else {
        loginPass.type = 'password';
        togglePass.textContent = '👁️';
    }
});
loginPass.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !loginBtn.disabled) {
        handleLogin();
    }
});

// --- Tab Switching ---
document.querySelectorAll('input').forEach(input => input.addEventListener('input', setStartButtonState));
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(tab.dataset.tab).classList.add('active');
        setStartButtonState(); // Re-evaluate button state after tab switch
    });
});

const ipCache = new Map();

document.getElementById('start-btn1').addEventListener('click', () => {
    const out = document.getElementById('output-section1');
    const phone = document.getElementById('phone').value.trim();
    const port = document.getElementById('game-port').value.trim().toUpperCase();
    const acc = document.getElementById('game-account').value.trim();
    const key = `${phone}_${acc}`;
    let ip = ipCache.get(key) || generateRandomIP();
    ipCache.set(key, ip);

    let progress = 0;
    out.innerHTML = ''; // Clear previous output
    const interval = setInterval(() => {
        progress++;
        out.innerHTML = `<div class='result-line'>Scanning... <span class='percent'>${progress}%</span></div>`;
        if (progress >= 100) {
            clearInterval(interval);
            out.innerHTML = `<div class='result-line'><strong>IP:</strong> <span style='color:#00ffff'>${ip}</span></div>`;
            if (DEFAULT_PORTS.includes(port)) {
                out.innerHTML += `<div class='result-line subtle-blink' style='color:#00ff00'><strong>✔️ TÀI KHOẢN KHÔNG CÓ MÃ ẨN</strong></div>`;
            } else {
                out.innerHTML += `<div class='warning-icon'>☢️</div><div class='result-line'>CẢNH BÁO TÀI KHOẢN CHỨA MÃ ẨN</div><div class='result-line blink'>${generateCode()}</div>`;
            }
        }
    }, 30);
});

document.getElementById('start-btn2').addEventListener('click', () => {
    const out = document.getElementById('output-section2');
    const phone = document.getElementById('del-phone').value.trim();
    const port = document.getElementById('del-game-port').value.trim().toUpperCase();
    const acc = document.getElementById('del-game-account').value.trim();
    const key = `${phone}_${acc}`;
    let ip = ipCache.get(key) || generateRandomIP();
    ipCache.set(key, ip);

    let progress = 0;
    out.innerHTML = ''; // Clear previous output
    const interval = setInterval(() => {
        progress++;
        out.innerHTML = `<div class='result-line'>Deleting... <span class='percent'>${progress}%</span></div>`;
        if (progress >= 100) {
            clearInterval(interval);
            out.innerHTML = `<div class='result-line'><strong>IP:</strong> <span style='color:#00ffff'>${ip}</span></div>`;
            if (DEFAULT_PORTS.includes(port)) {
                out.innerHTML += `<div class='result-line' style='color:#00ff00'><strong>✔️ TÀI KHOẢN KHÔNG CHỨA MÃ ẨN</strong></div>`;
            } else {
                out.innerHTML += `<div class='warning-icon'>☢️</div><div class='result-line blink'>CẢNH BÁO</div><div class='result-line blink'>KHÔNG THỂ XÓA MÃ ẨN</div>`;
            }
        }
    }, 30);
});

document.getElementById('start-btn3').addEventListener('click', () => {
    const out = document.getElementById('output-section3');
    const port = document.getElementById('check-port').value.trim().toUpperCase();
    let progress = 0;
    out.innerHTML = ''; // Clear previous output
    const interval = setInterval(() => {
        progress++;
        out.innerHTML = `<div class='result-line'>Checking... <span class='percent'>${progress}%</span></div>`;
        if (progress >= 100) {
            clearInterval(interval);
            const viTri = DEFAULT_PORTS.includes(port) ? 'Quốc tế' : 'Cambodia';
            const uyTin = DEFAULT_PORTS.includes(port) ? randomPercent(90, 99) : randomPercent(40, 50);
            const maAn = DEFAULT_PORTS.includes(port) ? 0 : randomPercent(70, 98);
            out.innerHTML += `<div class='result-line'><strong>Vị trí_</strong> <span style='color:#00ffff'>${viTri}</span></div><div class='result-line'><strong>% Uy tín_</strong> <span class='percent'>${uyTin}%</span></div><div class='result-line'><strong>% Mã ẩn_</strong> <span class='percent'>${maAn}%</span></div>`;
        }
    }, 30);
});

// --- Background Effect: Hacker Digital Rain with Grid ---
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
const streams = [];
const maxStreams = 150; // Even higher density
const streamSpeedMin = 1.5; // Faster min speed
const streamSpeedMax = 5; // Faster max speed
const streamLengthMin = 40; // Longer min line segment length
const streamLengthMax = 120; // Longer max line segment length
const streamOpacityFade = 0.015; // Even slower fade for longer, more visible trails
const horizontalNoiseFactor = 0.8; // More horizontal drift
const gridLineSpacing = 50; // Spacing for grid lines
const gridLineOpacity = 0.05; // Very subtle grid lines

// Function to create a new stream segment
function createStreamSegment() {
    const x = Math.random() * canvas.width;
    // Randomize initial y position to appear anywhere on the screen
    const y = Math.random() * canvas.height;
    const length = Math.random() * (streamLengthMax - streamLengthMin) + streamLengthMin;
    const speed = Math.random() * (streamSpeedMax - streamSpeedMin) + streamSpeedMin;
    const opacity = 1; // Start fully opaque
    const hueOffset = Math.random() * 60 - 30; // Wider hue variation (green to cyan/blue/yellow-green)
    const lineWidth = Math.random() * 2 + 0.5; // Wider range of line widths
    const horizontalSpeed = (Math.random() - 0.5) * horizontalNoiseFactor; // Slight horizontal drift

    return { x, y, length, speed, opacity, hueOffset, lineWidth, horizontalSpeed };
}

// Initialize streams
function initializeStreams() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    streams.length = 0; // Clear existing streams
    for (let i = 0; i < maxStreams; i++) {
        const newStream = createStreamSegment();
        // Initial positions are already randomized in createStreamSegment
        streams.push(newStream);
    }
}

// Draw the subtle grid
function drawGrid() {
    ctx.strokeStyle = `rgba(0, 255, 0, ${gridLineOpacity})`;
    ctx.lineWidth = 0.5;

    // Draw vertical lines
    for (let x = 0; x < canvas.width; x += gridLineSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y < canvas.height; y += gridLineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Draw the background effect
function drawDigitalStreamEffect() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; // Clear with slight fade, leaving trails
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the subtle grid first
    drawGrid();

    // Set composite operation for glow
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < streams.length; i++) {
        const stream = streams[i];

        // Update position (move downwards with horizontal noise)
        stream.y += stream.speed;
        stream.x += stream.horizontalSpeed;
        stream.opacity -= streamOpacityFade; // Fade out

        // If stream is off-screen or fully faded, reset it
        if (stream.y - stream.length > canvas.height || stream.opacity <= 0 || stream.x < -stream.length || stream.x > canvas.width + stream.length) {
            streams[i] = createStreamSegment();
        }

        // Draw stream segment with glow
        const baseHue = 120; // Green hue
        const currentHue = baseHue + stream.hueOffset;
        const streamColor = `hsla(${currentHue}, 100%, 50%, ${stream.opacity})`;

        ctx.strokeStyle = streamColor;
        ctx.lineWidth = stream.lineWidth;

        // Apply glow effect
        ctx.shadowBlur = 15; // Increased blur radius for stronger glow
        ctx.shadowColor = streamColor; // Color of the glow

        ctx.beginPath();
        ctx.moveTo(stream.x, stream.y);
        ctx.lineTo(stream.x, stream.y - stream.length);
        ctx.stroke();
    }
    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
    // Reset shadow properties for other drawings
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'rgba(0,0,0,0)';
}

// --- Audio Control Logic ---
const backgroundMusic = document.getElementById('background-music');
const toggleMusicBtn = document.getElementById('toggle-music-btn');
let isMusicPlaying = false; // Track music state

// Attempt to play music on user interaction (e.g., button click, or after the page loads and user interacts)
// Autoplay policies might prevent immediate play without user interaction.
// We'll try to play it on window load, but also allow toggling.
window.addEventListener('load', () => {
    // Start the background effect immediately on load
    initializeStreams();
    setInterval(drawDigitalStreamEffect, 30);
    window.addEventListener('resize', initializeStreams);

    // Try to play music. Modern browsers often require user interaction for audio.
    // A common workaround is to play it after a user clicks something.
    // Here, we'll try to play it on load, but if it fails, the toggle button will still work.
    backgroundMusic.volume = 0.2; // Set a default lower volume
    const playPromise = backgroundMusic.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            isMusicPlaying = true;
            toggleMusicBtn.textContent = 'Tắt nhạc';
        }).catch(error => {
            // Autoplay was prevented. User will need to click the button.
            console.log('Autoplay prevented:', error);
            isMusicPlaying = false;
            toggleMusicBtn.textContent = 'Bật nhạc';
        });
    }

    // Initial state check for login inputs
    validateLoginInputs();
});

toggleMusicBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        toggleMusicBtn.textContent = 'Bật nhạc';
    } else {
        backgroundMusic.play();
        toggleMusicBtn.textContent = 'Tắt nhạc';
    }
    isMusicPlaying = !isMusicPlaying;
});
