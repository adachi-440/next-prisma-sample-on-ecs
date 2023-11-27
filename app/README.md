## Recommended to develop IN the container using VSCode

[Developing inside a Container](https://code.visualstudio.com/docs/devcontainers/containers)


## first step

```bash
#### on the host os ####

# docker-compose up -d
$ make up

# docker-compose down
$ make d

# docker compose ps
$ make ps

# !!! Shortcut to prune docker images, containers, and docker networks. !!!
$ make nuke
```


```bash
##### in the container ####

$ yarn debug
yarn run v1.22.19
$ node --inspect=0.0.0.0:9229 node_modules/next/dist/bin/next
Debugger listening on ws://0.0.0.0:9229/f32a349b-665e-4cfd-8be6-eb34d9bd5619
For help, see: https://nodejs.org/en/docs/inspector
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
~~~~

$ yarn prisma migrate
yarn run v1.22.19
$ /app/node_modules/.bin/prisma migrate
Update the database schema with migrations
Usage
  $ prisma migrate [command] [options]
~~~~

```