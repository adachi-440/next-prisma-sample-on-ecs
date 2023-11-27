import {
  Stack, StackProps, CfnOutput,
  aws_ecr as ecr,
  aws_iam as iam,
} from 'aws-cdk-lib';
import {
  Construct
} from 'constructs';
import {
  GithubActionsIdentityProvider, GithubActionsRole
} from "aws-cdk-github-oidc";


interface CustomProps extends StackProps {
  projectName: string
  gitHubOwner: string
  gitHubRepositoryName: string
}

export class EcrStack extends Stack {
  public readonly repository: ecr.Repository;

  constructor(scope: Construct, id: string, props: CustomProps) {
    super(scope, id, props);

    this.repository = new ecr.Repository(this, 'Repository', {
      repositoryName: props.projectName,
    });

    // GitHub ActionsからECSへPushできるようにIAM RoleとIAMプロバイダーを追加
    const ghRole = new GithubActionsRole(this, "GithubRole", {
      provider: new GithubActionsIdentityProvider(this, "GithubProvider"),
      owner: props.gitHubOwner, // your repository owner (organization or user) name
      repo: props.gitHubRepositoryName, // your repository name (without the owner name)
      // TODO:
      // filter: "ref:refs/tags/v*", // JWT sub suffix filter, defaults to '*'
    });
    this.repository.grantPush(ghRole);
    // logGroup.grantWrite(taskExecRole);
    ghRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonECS_FullAccess'));
  }
}
