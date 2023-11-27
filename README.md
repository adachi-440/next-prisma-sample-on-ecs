# next-prisma-sample-on-ecs


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

![スクリーンショット 2023-11-27 19 14 12](https://github.com/YutaOkoshi/next-prisma-sample-on-ecs/assets/37532269/e3bcce06-e349-4037-a165-ac39fbbd2b86)


5. Setting GitHub Actions Variables

- Variables
  - AWS_IAM_ROLE_ARN
  - AWS_REGION
  - ECS_CLUSTER_NAME
  - ECS_SERVICE_NAME
  - ECS_TASK_DEFINITION_ARN

![スクリーンショット 2023-11-27 19 13 45](https://github.com/YutaOkoshi/next-prisma-sample-on-ecs/assets/37532269/2dea8f6b-4f50-486e-873f-937d8d477169)


6. Git Push for Deploy to ECS

```bash
$ git push
```

5. DB Migration


```bash
# On host os

$ bash ./script/run-migrate-task.sh
```

