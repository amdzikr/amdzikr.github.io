
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
    
    
    
    
        const target = document.getElementById('typing-text');
const phrases = [
    "Complex Core | Online Resources  ", 
    "Systems Build | Bugs Patched", 
    "Is Root  &lt;Flow Stack Unlocked/&gt;",
    " Work Fasters - Anti Bullshit Tweak"
];
        let pIdx = 0, cIdx = 0, isDel = false;

        function type() {
            const current = phrases[pIdx];
            target.textContent = current.substring(0, cIdx);

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

        function anim() {
            document.querySelectorAll('.bar-fill').forEach(f => {
                f.style.width = f.getAttribute('data-val');
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            type();
            setTimeout(anim, 400);
        });
    
    
    
    
    