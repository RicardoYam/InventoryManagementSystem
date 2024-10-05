# Output the RDS endpoint and database informations
output "rds_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "backend_lb_domain_name" {
    value = aws_lb.imsbackend.dns_name
}