import { CONSTANTS } from './constants.js';

const form = document.getElementById('submitForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const submitStatus = document.getElementById('submitStatus');
const submissionsList = document.getElementById('submissionsList');
const loadingStatus = document.getElementById('loadingStatus');
const apiEndpointDisplay = document.getElementById('apiEndpoint');
const lastUpdatedDisplay = document.getElementById('lastUpdated');

apiEndpointDisplay.textContent = CONSTANTS.API.ENDPOINT;

function validateForm(name, email, message) {
  if (!name || name.length < CONSTANTS.VALIDATION.NAME.MIN_LENGTH || name.length > CONSTANTS.VALIDATION.NAME.MAX_LENGTH) {
    return { valid: false, error: CONSTANTS.ERROR_MESSAGES.NAME_LENGTH };
  }

  if (!email || !CONSTANTS.VALIDATION.EMAIL.PATTERN.test(email)) {
    return { valid: false, error: CONSTANTS.ERROR_MESSAGES.INVALID_EMAIL };
  }

  if (!message || message.length < CONSTANTS.VALIDATION.MESSAGE.MIN_LENGTH || message.length > CONSTANTS.VALIDATION.MESSAGE.MAX_LENGTH) {
    return { valid: false, error: CONSTANTS.ERROR_MESSAGES.MESSAGE_LENGTH };
  }

  return { valid: true };
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  const validation = validateForm(name, email, message);
  if (!validation.valid) {
    showStatus(validation.error, 'error');
    return;
  }

  try {
    submitStatus.textContent = 'Submitting...';
    submitStatus.className = 'status loading';

    const response = await fetch(`${CONSTANTS.API.ENDPOINT}${CONSTANTS.API.SUBMIT_PATH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || CONSTANTS.ERROR_MESSAGES.SUBMIT_FAILED);
    }

    const result = await response.json();

    showStatus(CONSTANTS.SUCCESS_MESSAGES.SUBMITTED, 'success');
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

    const response = await fetch(`${CONSTANTS.API.ENDPOINT}${CONSTANTS.API.SUBMISSIONS_PATH}`);
    if (!response.ok) {
      throw new Error(CONSTANTS.ERROR_MESSAGES.LOAD_FAILED);
    }

    const submissions = await response.json();
    updateLastUpdated();

    if (!submissions || submissions.length === 0) {
      submissionsList.innerHTML = `<div class="empty-state">${CONSTANTS.UI_TEXT.EMPTY_STATE}</div>`;
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
    submissionsList.innerHTML = `<div class="empty-state">${CONSTANTS.ERROR_MESSAGES.LOAD_FAILED}: ${error.message}</div>`;
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
    }, CONSTANTS.UI.STATUS_MESSAGE_DURATION_MS);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return CONSTANTS.UI_TEXT.JUST_NOW;
  if (diffMins < 60) return `${diffMins}${CONSTANTS.UI_TEXT.MINUTES_AGO}`;
  if (diffHours < 24) return `${diffHours}${CONSTANTS.UI_TEXT.HOURS_AGO}`;
  if (diffDays < 7) return `${diffDays}${CONSTANTS.UI_TEXT.DAYS_AGO}`;

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
setInterval(loadSubmissions, CONSTANTS.UI.REFRESH_INTERVAL_MS);
