const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:3000/api';

const form = document.getElementById('submitForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const submitStatus = document.getElementById('submitStatus');
const submissionsList = document.getElementById('submissionsList');
const loadingStatus = document.getElementById('loadingStatus');
const apiEndpointDisplay = document.getElementById('apiEndpoint');
const lastUpdatedDisplay = document.getElementById('lastUpdated');

apiEndpointDisplay.textContent = API_ENDPOINT;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !email || !message) {
    showStatus('Please fill out all fields', 'error');
    return;
  }

  try {
    submitStatus.textContent = 'Submitting...';
    submitStatus.className = 'status loading';

    const response = await fetch(`${API_ENDPOINT}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit');
    }

    const result = await response.json();

    showStatus('Submitted successfully!', 'success');
    form.reset();
    await loadSubmissions();
  } catch (error) {
    console.error('Submission error:', error);
    showStatus(`Error: ${error.message}`, 'error');
  }
});

async function loadSubmissions() {
  try {
    loadingStatus.style.display = 'block';
    submissionsList.innerHTML = '';

    const response = await fetch(`${API_ENDPOINT}/submissions`);
    if (!response.ok) {
      throw new Error('Failed to load submissions');
    }

    const submissions = await response.json();
    updateLastUpdated();

    if (!submissions || submissions.length === 0) {
      submissionsList.innerHTML = '<div class="empty-state">No submissions yet. Be the first!</div>';
      loadingStatus.style.display = 'none';
      return;
    }

    submissionsList.innerHTML = submissions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(submission => `
        <div class="submission-item">
          <h3>${escapeHtml(submission.name)}</h3>
          <p class="email">
            <a href="mailto:${escapeHtml(submission.email)}">${escapeHtml(submission.email)}</a>
          </p>
          <p class="message">${escapeHtml(submission.message)}</p>
          <p class="timestamp">${formatDate(submission.createdAt)}</p>
        </div>
      `)
      .join('');

    loadingStatus.style.display = 'none';
  } catch (error) {
    console.error('Load error:', error);
    submissionsList.innerHTML = `<div class="empty-state">Failed to load submissions: ${error.message}</div>`;
    loadingStatus.style.display = 'none';
  }
}

function showStatus(message, type) {
  submitStatus.textContent = message;
  submitStatus.className = `status ${type}`;

  if (type === 'success') {
    setTimeout(() => {
      submitStatus.textContent = '';
      submitStatus.className = 'status';
    }, 5000);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function updateLastUpdated() {
  lastUpdatedDisplay.textContent = formatDate(new Date().toISOString());
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

loadSubmissions();
setInterval(loadSubmissions, 30000);
