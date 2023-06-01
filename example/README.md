# Testing app for core DM packages

## Prerequisites

Make sure you have installed the following:

- Docker compose
- Python and the dm-cli python package(`pip install dm-cli`).
- Node

## Running the app

Open the terminal and navigate to the `dm-core-packages/example` folder before running the commands.

1. Pull and start API services with the command:
   `docker-compose pull && docker-compose up`

2. Build packages locally and create symlinks. Open a new terminal window, navigate to the `example` folder and run:

- `yarn build-all-packages`
- `yarn symlinks`

3. Start the test app (npm will not work)
   `yarn start`

2. Load all documents into the database. Open a new terminal window, navigate to the `example` folder and run:
   `./reset-all.sh`

> **Note**
> There can be no remaining `node_modules` in the packages.
> That will cause strange and subtle bugs

