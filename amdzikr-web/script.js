function setTheme(themeName) {
    const body = document.body;
    body.classList.remove('theme-cyber', 'theme-nord', 'theme-red', 'theme-whitehat');
    if (themeName !== 'default') {
        body.classList.add('theme-' + themeName);
    }
    localStorage.setItem('amdz-pref-theme', themeName);
}

const savedTheme = localStorage.getItem('amdz-pref-theme');
if (savedTheme) { setTheme(savedTheme); }

// --- TYPING ANIMATION ---
const target = document.getElementById('typing-text');
const phrases = [
    "Complex Core | Online Resources  ", 
    "Systems Build | Bugs Patched", 
    "Is Root  &lt;Flow Stack Unlocked/&gt;", // Parser Aman
    " Work Fasters - Anti Bullshit Tweak"
];

let pIdx = 0, cIdx = 0, isDel = false;

function type() {
    const current = phrases[pIdx];
    
    /* FIX: Pake innerHTML mangat &lt; jibeut keu < 
       Substring bak innerHTML nakeuh trik ucut mangat HTML Entities jiteubiet jroh
    */
    target.innerHTML = current.substring(0, cIdx);

    if (!isDel && cIdx < current.length) { 
        cIdx++; 
        setTimeout(type, 70); 
    } 
    else if (isDel && cIdx > 0) { 
        cIdx--; 
        setTimeout(type, 20); 
    } 
    else if (!isDel && cIdx === current.length) { 
        isDel = true; 
        setTimeout(type, 2000); 
    } 
    else { 
        isDel = false; 
        pIdx = (pIdx + 1) % phrases.length; 
        setTimeout(type, 500); 
    }
}

// --- SKILL BAR ANIMATION ---
function anim() {
    document.querySelectorAll('.bar-fill').forEach(f => {
        f.style.width = f.getAttribute('data-val');
    });
}

// --- EXECUTE ON LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    type();
    setTimeout(anim, 400);
});
