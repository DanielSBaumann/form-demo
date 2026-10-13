output "api_endpoint" {
  description = "API Gateway HTTP endpoint"
  value       = aws_apigatewayv2_stage.api_stage.invoke_url
}

output "dynamodb_table_name" {
  description = "DynamoDB table name"
  value       = aws_dynamodb_table.submissions.name
}

output "dynamodb_table_arn" {
  description = "DynamoDB table ARN"
  value       = aws_dynamodb_table.submissions.arn
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.handler.function_name
}

output "lambda_function_arn" {
  description = "Lambda function ARN"
  value       = aws_lambda_function.handler.arn
}

output "api_id" {
  description = "API Gateway API ID"
  value       = aws_apigatewayv2_api.api.id
}

output "curl_submit_example" {
  description = "Example curl command to submit a form"
  value = "curl -X POST ${aws_apigatewayv2_stage.api_stage.invoke_url}/api/submit -H 'Content-Type: application/json' -d '{\"name\": \"John Doe\", \"email\": \"john@example.com\", \"message\": \"Hello\"}'"
}

output "curl_list_example" {
  description = "Example curl command to list submissions"
  value       = "curl ${aws_apigatewayv2_stage.api_stage.invoke_url}/api/submissions"
}
