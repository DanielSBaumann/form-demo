export const CONFIG = {
  TABLE_NAME: process.env.DYNAMODB_TABLE_NAME || "form-demo-submissions",
  REGION: process.env.AWS_REGION || "us-east-1",
  ENDPOINT_URL: process.env.AWS_ENDPOINT_URL, // undefined for AWS, set for LocalStack
  API_ORIGIN: process.env.API_ORIGIN || "http://localhost:3000",

  VALIDATION: {
    NAME_MIN: 1,
    NAME_MAX: 100,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE_MIN: 1,
    MESSAGE_MAX: 500,
  },
};
