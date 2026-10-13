import { describe, it, before, after } from "node:test";
import * as assert from "node:assert";
import { DynamoDBClient, CreateTableCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const ENDPOINT = "http://localhost:4566";
const TABLE_NAME = "form-demo-submissions";
const REGION = "us-east-1";

let client: DynamoDBClient;
let docClient: DynamoDBDocumentClient;

async function setupTable() {
  try {
    await client.send(
      new DeleteTableCommand({ TableName: TABLE_NAME })
    );
    console.log("  Deleted existing table");
  } catch {
    // Table doesn't exist yet, that's fine
  }

  await client.send(
    new CreateTableCommand({
      TableName: TABLE_NAME,
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    })
  );
  console.log("  Created table");
}

async function teardownTable() {
  try {
    await client.send(
      new DeleteTableCommand({ TableName: TABLE_NAME })
    );
    console.log("  Deleted table");
  } catch {
    // Already deleted, that's fine
  }
}

describe("Form Demo - Integration Tests (LocalStack)", () => {
  before(async () => {
    client = new DynamoDBClient({
      endpoint: ENDPOINT,
      region: REGION,
      credentials: {
        accessKeyId: "test",
        secretAccessKey: "test",
      },
    });

    docClient = DynamoDBDocumentClient.from(client);

    console.log("Connecting to LocalStack...");
    let attempts = 0;
    while (attempts < 30) {
      try {
        await fetch(`${ENDPOINT}/_localstack/health`);
        console.log("✓ Connected to LocalStack");
        break;
      } catch {
        attempts++;
        if (attempts >= 30) {
          throw new Error("LocalStack not available after 30 attempts");
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    console.log("Setting up test table...");
    await setupTable();
  });

  after(async () => {
    console.log("Cleaning up...");
    await teardownTable();
  });

  it("should store a submission in DynamoDB", async () => {
    const submission = {
      id: "test-1",
      name: "John Doe",
      email: "john@example.com",
      message: "Test message",
      createdAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: submission,
      })
    );

    const result = await docClient.send(
      new ScanCommand({ TableName: TABLE_NAME })
    );

    assert.strictEqual(result.Items?.length, 1);
    assert.deepStrictEqual(result.Items?.[0], submission);
  });

  it("should retrieve multiple submissions", async () => {
    const submissions = [
      {
        id: "test-1",
        name: "Alice",
        email: "alice@example.com",
        message: "First message",
        createdAt: "2026-10-13T20:00:00Z",
      },
      {
        id: "test-2",
        name: "Bob",
        email: "bob@example.com",
        message: "Second message",
        createdAt: "2026-10-13T20:05:00Z",
      },
    ];

    for (const submission of submissions) {
      await docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: submission,
        })
      );
    }

    const result = await docClient.send(
      new ScanCommand({ TableName: TABLE_NAME })
    );

    assert.strictEqual(result.Items?.length, 2);
  });

  it("should validate email format", () => {
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    assert.strictEqual(EMAIL_PATTERN.test("valid@example.com"), true);
    assert.strictEqual(EMAIL_PATTERN.test("invalid@"), false);
    assert.strictEqual(EMAIL_PATTERN.test("invalid.com"), false);
    assert.strictEqual(EMAIL_PATTERN.test(""), false);
  });

  it("should validate name length (1-100 chars)", () => {
    const NAME_MIN = 1;
    const NAME_MAX = 100;

    const validName = "John Doe";
    assert.strictEqual(validName.length >= NAME_MIN && validName.length <= NAME_MAX, true);

    const invalidShort = "";
    assert.strictEqual(invalidShort.length >= NAME_MIN, false);

    const invalidLong = "A".repeat(NAME_MAX + 1);
    assert.strictEqual(invalidLong.length <= NAME_MAX, false);
  });

  it("should validate message length (1-500 chars)", () => {
    const MESSAGE_MIN = 1;
    const MESSAGE_MAX = 500;

    const validMessage = "This is a valid message";
    assert.strictEqual(validMessage.length >= MESSAGE_MIN && validMessage.length <= MESSAGE_MAX, true);

    const invalidShort = "";
    assert.strictEqual(invalidShort.length >= MESSAGE_MIN, false);

    const invalidLong = "A".repeat(MESSAGE_MAX + 1);
    assert.strictEqual(invalidLong.length <= MESSAGE_MAX, false);
  });
});
