# next-prisma-sample-on-ecs


## about

- deploy flow
- ![n-ecs-ページ1 drawio](https://github.com/YutaOkoshi/next-prisma-sample-on-ecs/assets/37532269/1ea50ad8-6a3a-443f-8099-e8252273107d)


- Cloudformation Stack
- ![cs-ページ2 drawio](https://github.com/YutaOkoshi/next-prisma-sample-on-ecs/assets/37532269/dd4af0f8-81cd-4e70-88ad-a1e30bf4b0be)


## deploy to aws
1. cdk deploy

```bash
$ cd cdk

$ yarn
$ yarn cdk bootstrap
$ yarn cdk deploy EcrStack

```

2. Docker push to ECR

```bash

$ cd ./app
$ aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 123412341234.dkr.ecr.ap-northeast-1.amazonaws.com
$ docker build --platform linux/amd64 -t next-prisma-sample .
$ docker tag next-prisma-sample:latest 123412341234.dkr.ecr.ap-northeast-1.amazonaws.com/next-prisma-sample:latest
$ docker push 123412341234.dkr.ecr.ap-northeast-1.amazonaws.com/next-prisma-sample:latest
```

3. cdk deploy main stack

```bash
$ cd ../cdk
$ yarn cdk deploy MainStack
```

4. Check to Top page

![スクリーンショット 2023-11-27 20 54 45](https://github.com/YutaOkoshi/next-prisma-sample-on-ecs/assets/37532269/a3622966-138e-410a-bd58-60de9cad8e98)

5. Setting GitHub Actions Variables

- Variables
  - AWS_IAM_ROLE_ARN
  - AWS_REGION
  - ECS_CLUSTER_NAME
  - ECS_SERVICE_NAME
  - ECS_TASK_DEFINITION_ARN

![スクリーンショット 2023-11-27 20 54 16](https://github.com/YutaOkoshi/next-prisma-sample-on-ecs/assets/37532269/331a1858-acca-493f-8b8c-7830c74dec29)

6. Git Push for Deploy to ECS

```bash
$ git push
```

5. DB Migration


```bash
# On host os

$ bash ./script/run-migrate-task.sh
```

