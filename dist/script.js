const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

const progress = document.querySelector('.page-progress');
let scrollScheduled = false;
window.addEventListener('scroll', () => {
  if (scrollScheduled) return;
  scrollScheduled = true;
  requestAnimationFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty('--scroll', `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`);
    scrollScheduled = false;
  });
}, { passive: true });

const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.desktop-nav');
menuToggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
}));

const sendButton = document.querySelector('#send-button');
const openButton = document.querySelector('#open-button');
const resetButton = document.querySelector('#reset-demo');
const stateCheck = document.querySelector('#state-check');
const stateText = document.querySelector('#state-text');
const receiptState = document.querySelector('#receipt-state');
const receiverScreen = document.querySelector('#receiver-screen');
const signal = document.querySelector('.signal-space');
const flyingMessage = document.querySelector('#flying-message');
const announcement = document.querySelector('#demo-announcement');
let state = 'ready';
let deliveryTimer;

function resetDemo() {
  clearTimeout(deliveryTimer);
  state = 'ready';
  stateCheck.textContent = '·';
  stateText.textContent = 'Ready to send';
  receiptState.classList.remove('is-seen');
  receiverScreen.classList.remove('has-message');
  signal.classList.remove('is-sent');
  flyingMessage.classList.remove('fly');
  sendButton.disabled = false;
  sendButton.innerHTML = 'Send the message <span>↗</span>';
  openButton.disabled = true;
  openButton.innerHTML = 'Open the conversation <span>↗</span>';
  announcement.textContent = 'Press “Send the message” to begin.';
}

sendButton.addEventListener('click', () => {
  if (state !== 'ready') return;
  state = 'sending';
  sendButton.disabled = true;
  stateCheck.textContent = '✓';
  stateText.textContent = 'Sent and tracked';
  signal.classList.add('is-sent');
  flyingMessage.classList.add('fly');
  announcement.textContent = 'One check: your message was sent and tracked.';
  deliveryTimer = setTimeout(() => {
    receiverScreen.classList.add('has-message');
    openButton.disabled = false;
    state = 'delivered';
    announcement.textContent = 'Now open the conversation as the other Slacker user.';
  }, reducedMotion ? 50 : 950);
});

openButton.addEventListener('click', () => {
  if (state !== 'delivered') return;
  state = 'seen';
  stateCheck.textContent = '✓✓';
  stateText.textContent = 'Seen just now';
  receiptState.classList.add('is-seen');
  openButton.disabled = true;
  openButton.innerHTML = 'Conversation opened <span>✓</span>';
  sendButton.innerHTML = 'Message sent <span>✓</span>';
  announcement.innerHTML = '<strong>Two teal checks:</strong> the other Slacker user opened the conversation.';
});
resetButton.addEventListener('click', resetDemo);

const installToggle = document.querySelector('#install-toggle');
const installSteps = document.querySelector('#install-steps');
installToggle.addEventListener('click', () => {
  const expanded = installToggle.getAttribute('aria-expanded') === 'true';
  installToggle.setAttribute('aria-expanded', String(!expanded));
  installSteps.hidden = expanded;
  installToggle.querySelector('span').textContent = expanded ? '+' : '−';
});
