(() => {
  const cards = [...document.querySelectorAll('.video-card')];
  const videos = [...document.querySelectorAll('.video-card video')];
  const modal = document.getElementById('lightbox');
  const modalVideo = document.getElementById('lightbox-video');
  const title = document.getElementById('lightbox-title');
  const subtitle = document.getElementById('lightbox-subtitle');
  const count = document.getElementById('lightbox-count');
  let activeIndex = -1;
  let lastFocused = null;

  // All gallery videos play muted and loop when visible. Offscreen videos pause to save resources.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const video = entry.target;
        if (entry.isIntersecting && !modal.hidden) continue;
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      }
    }, { rootMargin: '120px 0px', threshold: 0.12 });
    videos.forEach(video => observer.observe(video));
  } else {
    videos.forEach(video => video.play().catch(() => {}));
  }

  function show(index) {
    activeIndex = (index + cards.length) % cards.length;
    const card = cards[activeIndex];
    modalVideo.pause();
    modalVideo.src = card.dataset.src;
    title.textContent = card.dataset.title;
    subtitle.textContent = card.dataset.subtitle;
    count.textContent = `VIDEO ${String(activeIndex + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    modalVideo.load();
    modalVideo.play().catch(() => {});
  }

  function open(index) {
    lastFocused = document.activeElement;
    videos.forEach(video => video.pause());
    modal.hidden = false;
    document.body.classList.add('modal-open');
    show(index);
    modal.querySelector('.lightbox-close').focus();
  }

  function close() {
    if (modal.hidden) return;
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    activeIndex = -1;
    if (lastFocused) lastFocused.focus();
    videos.forEach(video => {
      const rect = video.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) video.play().catch(() => {});
    });
  }

  cards.forEach((card, index) => {
    card.querySelector('.expand-button').addEventListener('click', () => open(index));
  });
  modal.querySelector('.lightbox-close').addEventListener('click', close);
  modal.querySelector('.lightbox-backdrop').addEventListener('click', close);
  document.getElementById('previous-video').addEventListener('click', () => show(activeIndex - 1));
  document.getElementById('next-video').addEventListener('click', () => show(activeIndex + 1));
  document.addEventListener('keydown', event => {
    if (modal.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(activeIndex - 1);
    if (event.key === 'ArrowRight') show(activeIndex + 1);
  });
})();
