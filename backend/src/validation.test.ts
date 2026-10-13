import { describe, it } from "node:test";
import * as assert from "node:assert";

const CONFIG = {
  VALIDATION: {
    NAME_MIN: 1,
    NAME_MAX: 100,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE_MIN: 1,
    MESSAGE_MAX: 500,
  },
};

function validateEmail(email: string): boolean {
  return CONFIG.VALIDATION.EMAIL_PATTERN.test(email);
}

function validateName(name: string): boolean {
  return name.length >= CONFIG.VALIDATION.NAME_MIN && name.length <= CONFIG.VALIDATION.NAME_MAX;
}

function validateMessage(message: string): boolean {
  return message.length >= CONFIG.VALIDATION.MESSAGE_MIN && message.length <= CONFIG.VALIDATION.MESSAGE_MAX;
}

describe("Form Validation Logic", () => {
  describe("Email validation", () => {
    it("should accept valid emails", () => {
      assert.strictEqual(validateEmail("john@example.com"), true);
      assert.strictEqual(validateEmail("test.user+tag@domain.co.uk"), true);
      assert.strictEqual(validateEmail("a@b.c"), true);
    });

    it("should reject invalid emails", () => {
      assert.strictEqual(validateEmail(""), false);
      assert.strictEqual(validateEmail("invalid"), false);
      assert.strictEqual(validateEmail("invalid@"), false);
      assert.strictEqual(validateEmail("@example.com"), false);
      assert.strictEqual(validateEmail("user@"), false);
      assert.strictEqual(validateEmail("user @example.com"), false);
    });
  });

  describe("Name validation", () => {
    it("should accept names within limits (1-100 chars)", () => {
      assert.strictEqual(validateName("J"), true);
      assert.strictEqual(validateName("John Doe"), true);
      assert.strictEqual(validateName("A".repeat(100)), true);
    });

    it("should reject empty or too long names", () => {
      assert.strictEqual(validateName(""), false);
      assert.strictEqual(validateName("A".repeat(101)), false);
    });
  });

  describe("Message validation", () => {
    it("should accept messages within limits (1-500 chars)", () => {
      assert.strictEqual(validateMessage("Hi"), true);
      assert.strictEqual(validateMessage("This is a longer message about testing."), true);
      assert.strictEqual(validateMessage("A".repeat(500)), true);
    });

    it("should reject empty or too long messages", () => {
      assert.strictEqual(validateMessage(""), false);
      assert.strictEqual(validateMessage("A".repeat(501)), false);
    });
  });

  describe("Combined validation", () => {
    it("should validate a complete form", () => {
      const validForm = {
        name: "John Doe",
        email: "john@example.com",
        message: "This is my message",
      };

      const isValid =
        validateName(validForm.name) &&
        validateEmail(validForm.email) &&
        validateMessage(validForm.message);

      assert.strictEqual(isValid, true);
    });

    it("should reject form with one invalid field", () => {
      const invalidForm = {
        name: "John Doe",
        email: "invalid-email",
        message: "This is my message",
      };

      const isValid =
        validateName(invalidForm.name) &&
        validateEmail(invalidForm.email) &&
        validateMessage(invalidForm.message);

      assert.strictEqual(isValid, false);
    });
  });
});
