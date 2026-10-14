import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { CONFIG } from "./config.js";

const clientConfig: any = { region: CONFIG.REGION };
if (CONFIG.ENDPOINT_URL) {
  clientConfig.endpoint = CONFIG.ENDPOINT_URL;
}

const client = new DynamoDBClient(clientConfig);
const docClient = DynamoDBDocumentClient.from(client);

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface ApiResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": CONFIG.API_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

function response(statusCode: number, body: unknown): ApiResponse {
  return {
    statusCode,
    headers: corsHeaders(),
    body: JSON.stringify(body),
  };
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function handleSubmit(body: unknown): Promise<ApiResponse> {
  try {
    const data = body as Record<string, unknown>;

    const name = String(data.name ?? "").trim();
    const email = String(data.email ?? "").trim();
    const message = String(data.message ?? "").trim();

    if (!name || name.length < CONFIG.VALIDATION.NAME_MIN || name.length > CONFIG.VALIDATION.NAME_MAX) {
      return response(400, {
        error: `Invalid name (${CONFIG.VALIDATION.NAME_MIN}-${CONFIG.VALIDATION.NAME_MAX} characters required)`,
      });
    }

    if (!email || !validateEmail(email)) {
      return response(400, { error: "Invalid email address" });
    }

    if (!message || message.length < CONFIG.VALIDATION.MESSAGE_MIN || message.length > CONFIG.VALIDATION.MESSAGE_MAX) {
      return response(400, {
        error: `Invalid message (${CONFIG.VALIDATION.MESSAGE_MIN}-${CONFIG.VALIDATION.MESSAGE_MAX} characters required)`,
      });
    }

    const submission: Submission = {
      id: randomUUID(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: CONFIG.TABLE_NAME,
        Item: submission,
      })
    );

    return response(201, submission);
  } catch (error) {
    console.error("Submit error:", error);
    return response(500, {
      error: "Failed to submit form",
    });
  }
}

async function handleList(): Promise<ApiResponse> {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: CONFIG.TABLE_NAME,
      })
    );

    const submissions = (result.Items || []) as Submission[];
    const sorted = submissions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return response(200, sorted);
  } catch (error) {
    console.error("List error:", error);
    return response(500, {
      error: "Failed to fetch submissions",
    });
  }
}

function handleOptions(): ApiResponse {
  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: "",
  };
}

interface LambdaEvent {
  requestContext: {
    http: {
      method: string;
      path: string;
    };
  };
  body?: string;
}

export async function handler(event: LambdaEvent): Promise<ApiResponse> {
  const method = event.requestContext.http.method;
  let path = event.requestContext.http.path;

  // Remove stage name from path if present (e.g., /sandbox/api/submit → /api/submit)
  path = path.replace(/^\/[a-z0-9-]+\//, '/');

  console.log(`${method} ${path}`);

  if (method === "OPTIONS") {
    return handleOptions();
  }

  if (method === "POST" && path === "/api/submit") {
    const body = event.body ? JSON.parse(event.body) : {};
    return await handleSubmit(body);
  }

  if (method === "GET" && path === "/api/submissions") {
    return await handleList();
  }

  return response(404, { error: "Not found" });
}
