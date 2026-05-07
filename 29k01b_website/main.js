// ==========================================
// 29K01B — Main Script (Hosted on GitHub)
// ==========================================

(function() {
  // Smooth scroll untuk anchor link
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Lazy load gambar yang belum loading="lazy"
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
  }

  // Copy code block (untuk tool output)
  document.querySelectorAll('.output-box').forEach(box => {
    box.addEventListener('click', function() {
      const text = this.textContent;
      navigator.clipboard.writeText(text).then(() => {
        const original = this.style.background;
        this.style.background = '#1e40af';
        setTimeout(() => { this.style.background = original; }, 500);
      });
    });
  });

  console.log('🚀 29K01B — Script loaded');
})();
