FROM node:26-alpine AS base

ARG AUTH_ENABLED=0
ARG REDIRECT_URI=http://localhost/
# Azure AD requires a scope.
ARG AUTH_SCOPE=""
ARG CLIENT_ID=""
ARG TENANT_ID=""
ENV REACT_APP_AUTH_SCOPE=$AUTH_SCOPE
ENV REACT_APP_AUTH=$AUTH_ENABLED
ENV REACT_APP_AUTH_CLIENT_ID=$CLIENT_ID
ENV REACT_APP_AUTH_TENANT=$TENANT_ID
ENV REACT_APP_TOKEN_ENDPOINT=https://login.microsoftonline.com/${REACT_APP_AUTH_TENANT}/oauth2/v2.0/token
ENV REACT_APP_AUTH_ENDPOINT=https://login.microsoftonline.com/${REACT_APP_AUTH_TENANT}/oauth2/v2.0/authorize
ENV REACT_APP_LOGOUT_ENDPOINT=https://login.microsoftonline.com/${REACT_APP_AUTH_TENANT}/oauth2/logout
ENV REACT_APP_AUTH_REDIRECT_URI=$REDIRECT_URI

WORKDIR /code/
COPY jest.config.base.js package.json package-lock.json jest.config.js tsconfig.json .eslintignore .eslintrc.json ./
COPY --chown=1000 web/packages ./packages
RUN npm ci --ignore-scripts

FROM base AS development
CMD ["npm", "start"]

FROM base AS prod
RUN npm install -g serve
RUN npm run build
WORKDIR /code/packages/home
EXPOSE 3000
CMD ["serve", "--single", "build", "--listen", "3000"]
USER 1000
