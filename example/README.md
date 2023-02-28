# Testing app for core DM packages

## Running

1. Build all the packages locally (`npm run build`)
2. Pull and start API services
   - `docker-compose pull && docker-compose up`
3. Load dmss data
    - `docker-compose run --rm dmss reset-app`
4. Load dm-job data
   - `docker-compose run --rm job-api dm -u http://dmss:5000 reset ../app`
5. Load test app data
    - `dm reset app`
    - `dm create-lookup example DemoDataSource/DemoPackage/recipe_links`
6. Build dependent packages locally and create symlinks
   - `yarn build-all-packages`
   - `yarn symlinks`
7. Start the test app (npm will not work)
   - `yarn install`
   - `yarn start`

> **Note**
> There can be no remaining `node_modules` in the packages.
> That will cause strange and subtle bugs

### Development tips

Oneliner to get environment up and running (run command from the example folder in the terminal)
```bash
docker-compose run --rm dmss reset-app && dm reset app && docker-compose run --rm job-api dm -u http://dmss:5000 reset ../app && dm create-lookup example DemoDataSource/DemoPackage/recipe_links
```