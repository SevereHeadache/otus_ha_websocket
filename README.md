## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run in docker

```bash
docker-compose up -d
```

1. Open postman and connect to `http://127.0.0.1:3000` by socket.io with `auth-token` header
2. Send request to app to create a new post (by user who is a friend of the user from first step)
3. In socket.io connection should displayed a new post