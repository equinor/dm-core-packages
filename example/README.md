# Testing app for core DM packages

## Prerequisites

- Node and yarn
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Make sure you have Python installed. version 3.11 or higher is required.

## Running (Mac / Linux)

> **Note**
> Run all these commands from the `dm-core-packages/` (main project) folder unless otherwise stated

1. Install dependecies.

   #### Frontend

   The project uses yarn workspaces to handle dependencies for all three sub-projects.

    - Run `yarn install`

   #### Backend

   Navigate to the `example` folder:  

    - Initialize and activate virtual env
        - `python3 -m venv .venv`
        - `source .venv/bin/activate`
        - Install dm-cli package by running `pip install -r requirements.txt`. 

2. Navigate to the root of the project, and build the local packages. 
    - Run `yarn build:dm-core && yarn build:dm-core-plugins`
3. Navigate to the `example` folder, then pull and start API services.  
    - Run `docker-compose pull && docker-compose up -d`
4. From the `example` folder, load data into the database.    
    - Run `./reset-app.sh`
5. Start the test app.  
    - Run `yarn start:example`

## Running (Windows)

1. Open Powershell and navigate to dm-core-packages and run `yarn install`.
2. Navigate to dm-core-packages/example. Make sure docker engine is running, then run these commands:
    - `docker-compose down && docker-compose pull && docker-compose up -d`
    - `docker-compose run --rm dmss reset-app`
    - `docker-compose run --rm job-api dm -u http://dmss:5000 reset ../app`
3. Download and open WSL (windows subsystem for linux) terminal and navigate to c disk using the command: `cd /mnt/c`.
    1. A useful tip is to download 'Windows Terminal' from the App Store, which is a useful terminal for switching
       between WSL (Ubuntu) and powershell.
4. Make sure you have pip and venv installed in the WSL (Ubuntu) system.
   ```
   sudo apt-get update &&
   sudo apt-get upgrade && 
   sudo apt install python3-pip &&
   sudo apt install python3-venv
   ```
5. In the WSL terminal navigate to `dm-core-packages/example` and run
   ```
   python3 -m venv .venv && 
   source .venv/bin/activate &&
   pip install -r requirements.txt
   ```
6. Upload entities to the database by running
   ```
   dm reset app &&
   dm import-plugin-blueprints ../node_modules/@development-framework/dm-core-plugins &&
   dm create-lookup example DemoDataSource/recipes
   ```
   (dm reset app can also be run with --no-validate-entities to skip validation)
7. Go back to the Powershell terminal and navigate to root in `dm-core-packages/` by typing the command `cd .. ` and
   start the app with the command `yarn start:example`.

## Naming Convention

In the example app, json files are named according to what type they are.

- JSON files of type Blueprint are named `<MyBluePrint>.blueprint.json`, using the PascalCase notation.
- JSON files of type RecipeLink are named `<MyBluePrint>.recipe.json`, using the PascalCase notation.
- JSON files of type Entity are named `<myEntity>.entity.json`, with the camelCase notation.

In the example app, folders are named according to the naming convention:

- Apps are to have the PascalCase notation
- All other folders are to have the snake_case notation.

## Aliasing dm-core-packages

To support watching and live-reload of dm-core dependencies start the application by running this command:

```bash
ALIAS=on yarn start
```

The configuration to support this hot reloading is in the `vite.local.config.ts` and `tsconfig.local.json`.