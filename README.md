<div align="center">
  <img src="./doc/logo.png" alt="IMS logo" width="200" height="auto"/>
  <h1>
    IMS
  </h1>
  <p>
    Open source Inventory Management System for clothing business👗
  </p>
  <h4>
    <a href="https://demoims.com">View Demo</a>
	</h4>
</div>

## 🌟 About the Project

IMS is an open-source Inventory Management System which provides powerful features for stock control, customer management and order placement, deployed on highly available AWS services. The system is built on a Python/Django-based database backend, coupled with an interactive React-based frontend, providing an intuitive interface for shop managers to efficiently manage operations.



### 👾 Tech Stack

<details>
  <summary>Frontend</summary>
  <ul style="font-size:14px">
    <li>React</li>
    <li>React Router</li>
    <li>Tailwind css</li>
  </ul>
</details>

<details>
  <summary>Backend</summary>
  <ul style="font-size:14px">
    <li>Python</li>
    <li>pytest</li>
    <li>Django</li>
    <li>JWT</li>
  </ul>
</details>

<details>
  <summary>Database</summary>
  <ul style="font-size:14px">
    <li>Postgres</li>
    <li>SQLite</li>
  </ul>
</details>

<details>
  <summary>DevOps</summary>
  <ul style="font-size:14px">
    <li>Docker</li>
    <li>Terraform</li>
  </ul>
</details>

<details>
  <summary>AWS</summary>
  <ul style="font-size:14px">
    <li>VPC</li>
    <li>NAT Gateway</li>
    <li>Internet Gateway</li>
    <li>Application Load Balancer</li>
    <li>RDS</li>
    <li>S3</li>
    <li>ECS Fargate</li>
    <li>Auto Scaling</li>
    <li>ECR</li>
    <li>ACM</li>
    <li>Route 53</li>
    <li>CloudFront</li>
  </ul>
</details>



<h3>🔒 Demo Account</h3>

**Account:** Admin

**Password:**  123456



## 🗺️ Architecture

![Architecture](./doc/arc.png)



## 🧰 Getting Started

### Local Deployment





### AWS Deployment

Before starting the deployment, ensure that [Terraform](https://www.terraform.io/) is installed on your system.

To configure AWS credentials, navigate to the `/terraform/provider.tf` file and **update** the following line:

```Terraform
profile = "iamadmin-test" # AWS profile name
```

or, **delete** this line to use default configuration.



To start your deployment, run the following line:

```bash
terraform init
terraform apply
```



## Screenshots

VPN Deployment by Terraform

![](./doc/vpc.png)



RDS Deployment by Terraform

![RDS](./doc/rds.png)



ECS Deployment by Terraform

![ECS](./doc/ecs.png)



