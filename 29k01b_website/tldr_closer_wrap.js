(function () {
  const toolRoot = document.getElementById('ads-helper-root');
  if (!toolRoot) return;

  // Cegah double init. solver suka pencet inject berkali-kali lalu bingung kenapa DOM jadi lasagna.
  if (toolRoot.dataset.collapsibleInit === 'true') return;
  toolRoot.dataset.collapsibleInit = 'true';

  // Wrapper wajib ada id ads-helper-root
  const wrapper = document.createElement('div');
  wrapper.className = 'collapsible-tool-wrapper';

  toolRoot.parentNode.insertBefore(wrapper, toolRoot);
  wrapper.appendChild(toolRoot);

  // Tombol toggle
  const btn = document.createElement('button');
  btn.className = 'tool-toggle-btn';
  btn.type = 'button';

  wrapper.parentNode.insertBefore(btn, wrapper);

  // State awal = close
  let isOpen = false;

  // Function update UI
  function updateCollapse() {
    if (isOpen) {
      wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
      wrapper.style.opacity = '1';
      wrapper.classList.remove('collapsed');

      btn.textContent = '🔽 Close Tool';
      btn.setAttribute('aria-expanded', 'true');
    } else {
      wrapper.style.maxHeight = '0px';
      wrapper.style.opacity = '0';
      wrapper.classList.add('collapsed');

      btn.textContent = '🔧 Open Tool Now';
      btn.setAttribute('aria-expanded', 'false');
    }
  }

  // Init close
  updateCollapse();

  // Toggle
  btn.addEventListener('click', function () {
    isOpen = !isOpen;

    // Recalculate height tiap buka
    if (isOpen) {
      requestAnimationFrame(() => {
        wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
      });
    }

    updateCollapse();
  });

  // Auto update jika isi berubah
  const resizeObserver = new ResizeObserver(() => {
    if (isOpen) {
      wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
    }
  });

  resizeObserver.observe(toolRoot);
})();
