variable "project" {
  description = "Project name"
  type        = string
  default     = "form-demo"
}

variable "env" {
  description = "Environment name (sandbox/prod)"
  type        = string
  default     = "sandbox"
}

variable "environment" {
  description = "Environment name (sandbox/prod)"
  type        = string
  default     = "sandbox"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "lambda_timeout" {
  description = "Lambda function timeout in seconds"
  type        = number
  default     = 30
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name"
  type        = string
  default     = "form-demo-submissions"
}

variable "api_cors_origin" {
  description = "CORS origin for API"
  type        = string
  default     = "*"
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    project = "form-demo"
    env     = "sandbox"
    owner   = "agent"
  }
}
