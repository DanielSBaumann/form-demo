import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "form-demo-submissions";
const REGION = process.env.AWS_REGION || "us-east-1";
const API_ORIGIN = process.env.API_ORIGIN || "http://localhost:3000";

const client = new DynamoDBClient({ region: REGION });
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
    "Access-Control-Allow-Origin": API_ORIGIN,
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

    if (!name || name.length < 1 || name.length > 100) {
      return response(400, {
        error: "Invalid name (1-100 characters required)",
      });
    }

    if (!email || !validateEmail(email)) {
      return response(400, { error: "Invalid email address" });
    }

    if (!message || message.length < 1 || message.length > 500) {
      return response(400, {
        error: "Invalid message (1-500 characters required)",
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
        TableName: TABLE_NAME,
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
        TableName: TABLE_NAME,
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
  const path = event.requestContext.http.path;

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
