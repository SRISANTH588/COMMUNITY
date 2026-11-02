import { auth, db } from "./firebase-config.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Billing toggle
const billingButtons = [...document.querySelectorAll('[data-billing]')];
const planPrices = [...document.querySelectorAll('[data-month][data-year]')];
const periodLabels = [...document.querySelectorAll('[data-period]')];

billingButtons.forEach(button => button.addEventListener('click', () => {
  const annual = button.dataset.billing === 'annual';
  billingButtons.forEach(item => item.classList.toggle('selected', item === button));
  planPrices.forEach(price => {
    const amount = Number(price.dataset[annual ? 'year' : 'month']);
    price.textContent = `₹${amount.toLocaleString('en-IN')}`;
  });
  periodLabels.forEach(label => {
    label.textContent = annual ? '/ month, billed yearly' : '/ month';
  });
}));

// Mobile nav
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  document.querySelector('.main-nav')?.classList.toggle('open');
});

// Toast
const toast = document.getElementById('toast');
let toastTimer;
function showMessage(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// Save membership plan to Firestore on CTA click
document.querySelectorAll('.plan-cta').forEach(btn => {
  btn.addEventListener('click', async e => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      showMessage('Please log in to choose a plan.');
      setTimeout(() => window.location.href = `login.html?redirect=membership.html`, 1500);
      return;
    }

    const href = btn.getAttribute('href') || '';
    const plan = href.includes('plus') ? 'plus' : href.includes('all-access') ? 'all-access' : 'free';
    const billing = document.querySelector('[data-billing].selected')?.dataset.billing || 'monthly';

    try {
      await setDoc(doc(db, 'memberships', user.uid), {
        userId: user.uid,
        userEmail: user.email,
        plan,
        billing,
        updatedAt: serverTimestamp()
      });
      showMessage(plan === 'free' ? 'You\'re on the free plan!' : `${plan === 'plus' ? 'Communitie Plus' : 'All Access'} plan activated! 🎉`);
    } catch (err) {
      showMessage('Could not save your plan. Please try again.');
    }
  });
});
