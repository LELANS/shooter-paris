// Rotation follows section progress in both scroll directions; no autoplay.
(() => {
  const section = document.querySelector('.symbol-section');
  const spiral = section?.querySelector('.symbol-spiral');
  if (!spiral) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  function update() {
    frame = 0;
    if (reducedMotion.matches) {
      spiral.style.removeProperty('--spiral-angle');
      return;
    }
    const rect = section.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
    spiral.style.setProperty('--spiral-angle', `${(progress * 360).toFixed(2)}deg`);
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  reducedMotion.addEventListener('change', schedule);
  new ResizeObserver(schedule).observe(section);
  schedule();
})();
