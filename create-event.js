(() => {
  const form = document.getElementById('event-create-form');
  if (!form) return;
  const toastEl = document.getElementById('create-toast');
  const field = name => form.elements.namedItem(name);
  const previewText = (id, value, fallback) => {
    const target = document.getElementById(id);
    if (target) target.textContent = value.trim() || fallback;
  };
  const updatePreview = () => {
    const title = field('title').value;
    const category = field('category').value;
    const host = field('host').value;
    const description = field('description').value;
    const dateValue = field('date').value;
    const timeValue = field('time').value;
    const location = field('location').value;
    const capacity = field('capacity').value;
    const price = Number(field('price').value || 0);
    previewText('preview-title', title, 'Your event title');
    previewText('preview-card-title', title, 'Your event title');
    previewText('preview-category', category, 'YOUR CATEGORY');
    previewText('preview-host', host, 'YOUR COMMUNITY');
    previewText('preview-description', description, 'Your event description will appear here when you add it.');
    previewText('preview-location', location ? `⌖　${location}` : '⌖　Venue or meeting point');
    previewText('preview-tickets', `◉　${capacity || '0'} spots`, '◉　100 spots');
    previewText('preview-price', price ? `₹${price.toLocaleString('en-IN')}` : 'Free');
    const dateLabel = document.getElementById('preview-date');
    if (dateLabel) {
      const date = dateValue ? new Date(`${dateValue}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }).toUpperCase() : 'DATE';
      const time = timeValue ? new Date(`2000-01-01T${timeValue}`).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }).toUpperCase() : 'TIME';
      dateLabel.textContent = `${date} · ${time}`;
    }
    const artTitle = document.getElementById('preview-title');
    if (artTitle) artTitle.style.fontSize = title.length > 30 ? '22px' : '';
  };

  const today = new Date();
  const localDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  field('date').min = localDate;
  field('date').value = localDate;
  const descriptionCount = document.getElementById('description-count');
  field('description').addEventListener('input', () => { descriptionCount.textContent = String(field('description').value.length); });
  form.addEventListener('input', updatePreview);
  form.addEventListener('change', updatePreview);
  updatePreview();

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const date = new Date(`${data.get('date')}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const item = {
      id: `event-${Date.now()}`,
      title: String(data.get('title')).trim(),
      category: String(data.get('category')).trim(),
      host: String(data.get('host')).trim(),
      description: String(data.get('description')).trim(),
      date,
      time: new Date(`2000-01-01T${data.get('time')}`).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
      location: String(data.get('location')).trim(),
      address: String(data.get('address')).trim(),
      price: Number(data.get('price')),
      capacity: Number(data.get('capacity')),
      status: 'Draft'
    };
    let items = [];
    try { items = JSON.parse(localStorage.getItem('community-admin-events-v1') || '[]'); } catch { items = []; }
    items.unshift(item);
    try {
      localStorage.setItem('community-admin-events-v1', JSON.stringify(items));
      notify('Draft saved. Opening your dashboard…');
      setTimeout(() => { location.href = 'admin-dashboard.html#events'; }, 700);
    } catch {
      notify('Could not save this draft in browser storage. Check available storage and try again.');
    }
  });

  function notify(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toastEl.classList.remove('show'), 3000);
  }
})();
