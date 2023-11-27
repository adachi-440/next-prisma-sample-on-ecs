FROM node:19.5.0 AS builder

WORKDIR /app/
COPY package.json yarn.lock ./

COPY prisma ./prisma/

RUN yarn install
COPY ./ /app/

RUN yarn prisma generate --schema ./prisma/schema.prisma
RUN yarn build
# ローカル開発し易いようにCMDは未指定にする

FROM node:19.5.0-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder /app/prisma/migrations ./prisma/migrations
# COPY --from=builder /app/public ./public # 必要があれば
COPY package.json ./
RUN yarn --frozen-lockfile --production --ignore-scripts && yarn cache clean

ENV NODE_ENV production
EXPOSE 3000

CMD ["yarn", "start"]