# docker
resource "aws_ecr_repository" "imsbackend" {
  name = "imsbackend"
}

resource "docker_registry_image" "imsbackend" {
  name = docker_image.imsbackend.name
}

resource "docker_image" "imsbackend" {
  name         = "${aws_ecr_repository.imsbackend.repository_url}:latest"
  build {
    context    = "../backend"
    dockerfile = "./Dockerfile"
  }
}

resource "aws_ecs_cluster" "imsbackend" {
  name = "imsbackend"
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecs_task_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# create task role to let boto3 get credentials to upload img
resource "aws_iam_role_policy_attachment" "ecs_task_s3_access" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

resource "aws_ecs_task_definition" "imsbackend" {
  family                   = "imsbackend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024
  memory                   = 2048
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  # boto3 can pick up here
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn 

  container_definitions = <<TASK_DEFINITION
[
  {
    "image": "${docker_image.imsbackend.name}",
    "cpu": 1024,
    "memory": 2048,
    "name": "imsbackend", 
    "networkMode": "awsvpc", 
    "portMappings": [ 
      { 
       "containerPort": 8000, 
       "hostPort": 8000 
      } 
    ], 
    "environment": [
        {
        "name": "DATABASE_URI",
        "value": "${aws_db_instance.postgres.address}"
        },
        {
        "name": "DATABASE_NAME",
        "value": "${aws_db_instance.postgres.name}"
        },
        {
        "name": "DATABASE_USERNAME",
        "value": "${aws_db_instance.postgres.username}"
        },
        {
        "name": "DATABASE_PASSWORD",
        "value": "${aws_db_instance.postgres.password}"
        },
        {
        "name": "DATABASE_PORT",
        "value": "${aws_db_instance.postgres.port}"
        },
        {
        "name": "AWS_STORAGE_BUCKET_NAME",
        "value": "${aws_s3_bucket.public_bucket.bucket}"
        },
        {
        "name": "AWS_S3_REGION",
        "value": "us-east-1"
        }
    ],
     "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
            "awslogs-group": "/ecs/imsbackend",
            "awslogs-region": "us-east-1",
            "awslogs-stream-prefix": "ecs",
            "awslogs-create-group": "true"
        }
    }
  }
]
TASK_DEFINITION
}

resource "aws_ecs_service" "imsbackend" {
  name            = "imsbackend"
  cluster         = aws_ecs_cluster.imsbackend.id
  task_definition = aws_ecs_task_definition.imsbackend.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = aws_subnet.private[*].id
    security_groups = [aws_security_group.ecs_service_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app_tg.arn
    container_name   = "imsbackend"
    container_port   = 8000
  }

  depends_on = [aws_lb_listener.http_listener]
}

resource "aws_lb" "imsbackend" {
  name               = "imsbackend"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = false

  tags = {
    Name = "imsbackend"
  }
}

resource "aws_lb_target_group" "app_tg" {
  name     = "app-target-group"
  port     = 8000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path                = "/ht/"
    port                = 8000
    protocol            = "HTTP"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.imsbackend.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg.arn
  }
}