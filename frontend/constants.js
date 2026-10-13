export const CONSTANTS = {
  API: {
    ENDPOINT: process.env.API_ENDPOINT || 'http://localhost:3000/api',
    SUBMIT_PATH: '/submit',
    SUBMISSIONS_PATH: '/submissions',
    TIMEOUT_MS: 10000,
  },

  VALIDATION: {
    NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 100,
    },
    EMAIL: {
      PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    MESSAGE: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 500,
    },
  },

  UI: {
    REFRESH_INTERVAL_MS: 30000,
    STATUS_MESSAGE_DURATION_MS: 5000,
    ANIMATION_DURATION_MS: 300,
  },

  ERROR_MESSAGES: {
    FILL_REQUIRED_FIELDS: 'Please fill out all fields',
    INVALID_EMAIL: 'Invalid email address',
    NAME_LENGTH: `Name must be 1-${100} characters`,
    MESSAGE_LENGTH: `Message must be 1-${500} characters`,
    SUBMIT_FAILED: 'Failed to submit form',
    LOAD_FAILED: 'Failed to load submissions',
  },

  SUCCESS_MESSAGES: {
    SUBMITTED: 'Submitted successfully!',
  },

  UI_TEXT: {
    HEADER_TITLE: 'Form Demo',
    HEADER_SUBTITLE: 'Test the full-stack pipeline: submit → persist → retrieve',
    FORM_SECTION_TITLE: 'Submit a Message',
    FORM_LABEL_NAME: 'Name:',
    FORM_LABEL_EMAIL: 'Email:',
    FORM_LABEL_MESSAGE: 'Message:',
    FORM_PLACEHOLDER_NAME: 'Your name',
    FORM_PLACEHOLDER_EMAIL: 'your@email.com',
    FORM_PLACEHOLDER_MESSAGE: 'Write your message here...',
    FORM_SUBMIT_BUTTON: 'Submit',
    LIST_SECTION_TITLE: 'Recent Submissions',
    EMPTY_STATE: 'No submissions yet. Be the first!',
    JUST_NOW: 'Just now',
    MINUTES_AGO: 'm ago',
    HOURS_AGO: 'h ago',
    DAYS_AGO: 'd ago',
  },
};
