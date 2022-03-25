# HEIG-VD - Délégué de classe Discord Bot

### Docker
[dacc4/heig-ddc-discord-bot](https://hub.docker.com/repository/docker/dacc4/heig-ddc-discord-bot) on docker hub

## Development

### Prerequisites

- [Node 16](https://nodejs.org/en/) with npm (latest)
- Redis sevrer
- Firebase app

### Preparation of the environment

Install the dependencies with npm:
```bash
npm install
```

Copy the file `.env.example`, and complete the properties with the corresponding tokens:
```bash
cp .env.example .env
```

### Running the bot

```console
npm run dev
```

This command compiles the bot sources, then starts the bot (through `src/bot.ts`). If `NODE_ENV == development`, the HMR module is enabled,
and commands, tasks, listeners, etc. will be automatically reloaded on compile.

#### Lint

We use ESLint and Prettier, with the airbnb config adapted to check Typescript source code.

```console
# Running ESLint
npm run lint

# Run ESLint with auto-correction
npm run lint:fix
```

#### TypeScript type checking

```console
npm run tsc:check
```

This command runs the TypeScript compiler with the `--noEmit` option. It validates types for the entire project.

### Writing features

This bot uses the Sapphire Framework, features should follow the standard conventions from the framework.
