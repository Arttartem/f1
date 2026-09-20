
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

document.querySelectorAll('a[href$=".html"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href.startsWith('http')) return;
    e.preventDefault();
    document.body.classList.add('fade-out');
    setTimeout(() => { window.location.href = href; }, 200);
  });
});