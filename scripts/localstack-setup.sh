#!/bin/bash

set -e

LOCALSTACK_ENDPOINT="http://localhost:4566"
TABLE_NAME="form-demo-submissions"
REGION="us-east-1"

echo "Waiting for LocalStack to be ready..."
for i in {1..30}; do
  if curl -s "$LOCALSTACK_ENDPOINT/_localstack/health" > /dev/null 2>&1; then
    echo "✓ LocalStack is ready"
    break
  fi
  echo "  Attempt $i/30..."
  sleep 1
done

echo "Setting up DynamoDB table: $TABLE_NAME"
aws dynamodb create-table \
  --endpoint-url "$LOCALSTACK_ENDPOINT" \
  --region "$REGION" \
  --table-name "$TABLE_NAME" \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  2>/dev/null || echo "  Table already exists"

echo "✓ LocalStack setup complete"
echo ""
echo "DynamoDB Admin UI: http://localhost:8001"
echo "LocalStack Endpoint: $LOCALSTACK_ENDPOINT"
