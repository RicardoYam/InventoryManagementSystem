locals {
  database_username = "administrator"
  database_password = "ims-testing"
}

resource "aws_db_instance" "postgres" {
  allocated_storage      = 20
  max_allocated_storage  = 100 
  engine                 = "postgres"
  engine_version         = "14"
  instance_class         = "db.t3.micro"
  db_name                = "imsdb"
  username               = local.database_username
  password               = local.database_password
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  multi_az               = true
  publicly_accessible    = false
  backup_retention_period = 7 
  delete_automated_backups = true

  skip_final_snapshot    = true 

  tags = {
    Name = "IMS Database"
  }
}
