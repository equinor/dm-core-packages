# Testing app for core DM packages

## Running

1. Build all the packages locally (`npm run build`)
2. Pull and start API services
   - `docker-compose pull && docker-compose up`
3. Load dmss data
    - `docker-compose run --rm dmss reset-app`
4. Load test app data
    - `dm reset app`
    - `dm create-lookup example DemoDataSource/DemoPackage/recipe_links`
5. Start the test app (npm will not work)
   - `yarn install && yarn start`