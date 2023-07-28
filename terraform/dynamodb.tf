resource "aws_dynamodb_table" "users" {
  name           = "users"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "uuid"

  attribute {
    name = "uuid"
    type = "S"
  }
}

resource "aws_dynamodb_table" "user_unique_identifiers" {
  name           = "user_unique_identifiers"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "unique_identifier"
  range_key      = "provider"

  attribute {
    name = "unique_identifier"
    type = "S"
  }

  attribute {
    name = "provider"
    type = "S"
  }
}

resource "aws_dynamodb_table" "sessions" {
  name           = "sessions"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "uuid"

  attribute {
    name = "uuid"
    type = "S"
  }
}

resource "aws_dynamodb_table" "messages" {
  name           = "messages"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "uuid"

  attribute {
    name = "uuid"
    type = "S"
  }
}