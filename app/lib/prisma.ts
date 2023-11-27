// lib/prisma.ts
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient({
//   log: ["query", "error", "info", "warn"],
// });
// export default prisma;

// export * from "@prisma/client";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandOutput,
} from "@aws-sdk/client-secrets-manager";
import { PrismaClient } from "@prisma/client";

export async function getPrismaClient() {
  let dbClient: PrismaClient;
  if (process.env.NODE_ENV === "production") {
    const secretsManagerClient = new SecretsManagerClient({
      region: process.env.AWS_REGION ?? 'ap-northeast-1',
    });
    const getSecretValueCommand = new GetSecretValueCommand({
      SecretId: process.env.SECRET_NAME,
    });
    const getSecretValueCommandResponse = await secretsManagerClient.send(
      getSecretValueCommand
    );

    const secret = JSON.parse(getSecretValueCommandResponse.SecretString!);
    const dbUrl = `postgresql://${secret.username}:${secret.password}@${secret.hostname}:${secret.port}/${secret.dbname}?schema=public&socket_timeout=3`;
    dbClient = await new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  } else {
    // for local develop
    const dbUrl = `postgresql://postgres:postgres@db:5432/next-prisma-sample?schema=public`;
    dbClient = await new PrismaClient({
      log: ["query", "error", "info", "warn"],
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }
  return dbClient;
}

export const prisma = getPrismaClient()
