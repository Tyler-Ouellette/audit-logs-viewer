# DISCLAIMER
This project was created by myself, an SE of Dynatrace. This is not an official Dynatrace application and it is not something you can open a support ticket on. You may create an issue on the github repository, however there is no guaruntee it will be addressed (this isn't my primary job, just a fun project). 

# Prerequisites

Install the Dynatarce dt-app toolkit and then make sure it is added to your $PATH in environment variables:
```
npx dt-app@latest
```

Users looking to access the application will need the following scopes to be able to access all the pages of the application:
```
  storage:logs:read
  storage:buckets:read
  storage:system:read
  environment-api:audit-logs:read
  environment:roles:manage-settings

  The user must also have:
  app-engine:apps:run
  app-engine:functions:run
```

```
    "scopes": [
      {
        "name": "storage:logs:read",
        "comment": "Access Logs"
      },
      {
        "name": "storage:buckets:read",
        "comment": "Access Buckets"
      },
      {
        "name": "storage:system:read",
        "comment": "Read System Tables for Audit Logs"
      },
      {
        "name": "environment-api:audit-logs:read",
        "comment": "Read old Audit Logs from API"
      },
      {
        "name": "environment:roles:manage-settings",
        "comment": "Manage Settings are required to view old audit logs"
      }
    ]
```

# Getting Started with your Dynatrace App

Git clone the repository.

## Update the configuration file
Go to the file app.config.json and update the environmentURL to your environment.

```
{
  "environmentUrl": "ENTER YOUR TENANT URL HERE https://abc123.apps.dynatrace.com",
  "app": {
    "name": "Audit Logs Viewer",
    "version": "0.0.4",
    "description": "An application to view and quickly filter audit logs.",
    "id": "my.audit.logs.viewer",
    "scopes": [
      {
        "name": "storage:logs:read",
        "comment": "Access Logs"
      },
      {
        "name": "storage:buckets:read",
        "comment": "Access Buckets"
      },
      {
        "name": "storage:system:read",
        "comment": "Read System Tables for Audit Logs"
      },
      {
        "name": "environment-api:audit-logs:read",
        "comment": "Read old Audit Logs from API"
      }
    ]
  },
  "icon": "./src/assets/auditLogsIcon.png"
}


```

## Install the dependencies
```npm install```

## Start the app in development mode
```npm run start```
## Make Changes

## Deploy to your tenant:
```npm run deploy```

## Available Scripts

In the project directory, you can run:

### `npm run start` or `yarn start`

Runs the app in the development mode. A new browser window with your running app will be automatically opened.

Edit a component file in `src` and save it. The page will reload when you make changes. You may also see any errors in the console.

### `npm run build` or `yarn build`

Builds the app for production to the `dist` folder. It correctly bundles your app in production mode and optimizes the build for the best performance.

### `npm run deploy` or `yarn deploy`

Builds the app and deploys it to the specified environment in `app.config.json`.

### `npm run uninstall` or `yarn uninstall`

Uninstalls the app from the specified environment in `app.config.json`.

### `npm run generate:function` or `yarn generate:function`

Generates a new serverless function for your app in the `api` folder.

### `npm run update` or `yarn update`

Updates @dynatrace-scoped packages to the latest version and applies automatic migrations.

### `npm run info` or `yarn info`

Outputs the CLI and environment information.

### `npm run help` or `yarn run help`

Outputs help for the Dynatrace App Toolkit.

## Learn more

You can find more information on how to use all the features of the new Dynatrace Platform in [Dynatrace Developer](https://dt-url.net/developers).

To learn React, check out the [React documentation](https://reactjs.org/).
