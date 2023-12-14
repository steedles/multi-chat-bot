terraform {
  backend "s3" {
    bucket         = "multi-chat-tf"
    key            = "terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "multi-chat-tf"
  }
}

provider "aws" {
  region = "eu-central-1"
}