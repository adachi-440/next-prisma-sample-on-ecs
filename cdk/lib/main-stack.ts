import {
  Stack, StackProps,
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_ecr as ecr,
  aws_rds as rds,
  aws_elasticloadbalancingv2 as elbv2,
  aws_ecs_patterns as ecs_patterns,
  aws_iam as iam,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface CustomProps extends StackProps {
  repository: ecr.Repository
  projectName: string
}

export class MainStack extends Stack {
  public readonly vpc: ec2.Vpc;
  public readonly cluster: ecs.Cluster;
  public readonly auroraPg: rds.DatabaseCluster;
  public readonly alb: elbv2.ApplicationLoadBalancer;

  constructor(scope: Construct, id: string, props: CustomProps) {
    super(scope, id, props);

    // TODO: devと STGはAZとNAT GW２つもいらない
    // const natGatewayProvider = ec2.NatProvider.gateway();
    this.vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'ingress',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'app',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: 'rds',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        }
      ]
      // natGatewayProvider: natGatewayProvider,
      // natGateways: 2
    });

    // Aurora {pstgreSQLを用意
    // TODO:DEVとSTGはインスタンス２つもいらない
    this.auroraPg = new rds.DatabaseCluster(this, 'AuroraPg', {
      // clusterIdentifier: 'futabaRelayer',
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_15_3
      }),
      writer: rds.ClusterInstance.provisioned('writer', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MEDIUM),
      }),
      vpc: this.vpc,
    });

    this.cluster = new ecs.Cluster(this, 'Cluster', { vpc: this.vpc });

    const image = ecs.ContainerImage.fromEcrRepository(props.repository, 'latest')
    // image: ecs.ContainerImage.fromRegistry('public.ecr.aws/nginx/nginx:mainline'), // 初回CDKデプロイ時はとりあえずサンプル

    const service = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'Service', {
      cluster: this.cluster,
      memoryLimitMiB: 1024,
      desiredCount: 1,
      cpu: 512,
      taskImageOptions: {
        containerName: props.projectName,
        containerPort: 3000,
        image: image,
        environment: {
          SECRET_NAME: this.auroraPg.secret?.secretName ?? ''
        }
      },
      taskSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      openListener: true,
    });
    service.service.taskDefinition.executionRole?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonECS_FullAccess'));


    // prisma migrateを実行するためのECS Task Definitionを定義
    new ecs.FargateTaskDefinition(this, 'MigrationFargateTask', {
      memoryLimitMiB: 1024,
      cpu: 512,
      executionRole: service.service.taskDefinition.executionRole,
      taskRole: service.service.taskDefinition.taskRole,
    }).addContainer(props.projectName, {
      // DBにマイグレーションできればいいのでWebポートもいらない
      image: image,
      environment: {
        SECRET_NAME: this.auroraPg.secret?.secretName ?? ''
      },
      command: [
        "yarn", "prisma", "migration", "deploy"
      ]
    });

  }
}
