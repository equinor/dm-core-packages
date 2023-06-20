# Testing app for core DM packages

## Prerequisites

- Node and yarn
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Make sure you have Python installed. version 3.10 or higher is required.

## Running

> **Note**
> Run all these commands from the `dm-core-packages/` (main project) folder unless otherwise stated

1. Install dependecies.

   #### Frontend

   The project uses yarn workspaces to handle dependencies for all three sub-projects.

   - Run `yarn install`

   #### Backend

   Install dm-cli locally

   - Initialize and activate virtual env
     - `python3 -m venv .venv`
     - `source .venv/bin/activate`
   - Install dm-cli package by running `pip install dm-cli`

2. Build the required packages locally (dm-core and dm-core-plugins).
   - Run `yarn build:dm-core && yarn build:dm-core-plugins`
3. Navigate to the `example` folder, then pull and start API services
   - `docker-compose pull && docker-compose up -d`
4. Navigate to the `example` folder, then run shell script to load dmss data. If the command fails, try updating dm-cli before retrying.
   - `./reset-all.sh`
5. Start the test app
   - `yarn start:example`
