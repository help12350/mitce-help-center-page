const sidebar = document.querySelector('[data-sidebar]');
const menuButton = document.querySelector('[data-mobile-menu]');
const backTopButton = document.querySelector('[data-back-top]');
const tocLinks = [...document.querySelectorAll('.toc a')];
const sections = tocLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const userAgent = navigator.userAgent.toLowerCase();

if (userAgent.includes('android')) {
  document.body.classList.add('is-android');
}

if (/iphone|ipad|ipod/.test(userAgent)) {
  document.body.classList.add('is-ios');
}

const setMenuOpen = (isOpen) => {
  sidebar?.classList.toggle('open', isOpen);
  menuButton?.setAttribute('aria-expanded', String(isOpen));
};

menuButton?.addEventListener('click', () => {
  setMenuOpen(!sidebar?.classList.contains('open'));
});

sidebar?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    setMenuOpen(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenuOpen(false);
  }
});

backTopButton?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const syncToc = () => {
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 110) {
      current = section;
    }
  }

  const currentId = current?.id;

  tocLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
};

document.addEventListener('scroll', syncToc, { passive: true });
syncToc();
