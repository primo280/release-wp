# Next.js Enterprise Boilerplate

![Project intro image](./project-logo.png)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/rharkor/next-boilerplate/blob/main/LICENSE)

Welcome to the _Next.js Boilerplate_, an open-source template for all your nextjs projects! It's loaded with features that'll help you build a high-performance, maintainable, and enjoyable app. We've done all the heavy lifting for you, so sit back, relax, and get ready to conquer the world with your incredible app! 🌍
<br />
<br />
You can test the demo [here](https://next-boilerplate-rharkor.vercel.app/).

> email: `test@mail.com`  
> password: `Azerty123!`

## 📚 Features

With this template, you get all the awesomeness you need:

- 🏎️ **[Next.js](https://nextjs.org/)** - Fast by default, with config optimized for performance
- 💅 **[Tailwind CSS](https://tailwindcss.com/)** - A utility-first CSS framework for rapid UI development
- ✨ **[ESlint](https://eslint.org/)** and **[Prettier](https://prettier.io/)** - For clean, consistent, and error-free code
- 🫙 **[Dev Container](https://code.visualstudio.com/docs/remote/containers)** - For a consistent development environment
- 🐳 **[Docker](https://www.docker.com/)** - For easy deployment
- 🐘 **[PostgreSQL](https://www.postgresql.org/)** - A powerful, open-source relational database system
- 🗃️ **[Prisma](https://www.prisma.io/)** - Next-generation ORM for Node.js and TypeScript
- ⚡ **[Redis](https://redis.io/)** - An in-memory data structure store, used as a database, cache, and message broker
- 🔑 **[Auth.js](https://authjs.dev/)** - A simple, lightweight authentication library
- 🛠️ **[Extremely strict TypeScript](https://www.typescriptlang.org/)** - With [`ts-reset`](https://github.com/total-typescript/ts-reset) library for ultimate type safety
- 📝 **[Conventional commits git hook](https://www.conventionalcommits.org/)** - Keep your commit history neat and tidy
- 🎯 **[Absolute imports](https://nextjs.org/docs/advanced-features/module-path-aliases)** - No more spaghetti imports
- ⚕️ **[Health checks](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)** - Kubernetes-compatible for robust deployments
- 🤖 **[Renovate BOT](https://www.whitesourcesoftware.com/free-developer-tools/renovate)** - Auto-updating dependencies, so you can focus on coding
- 🚀 **[GitHub Actions](https://github.com/features/actions)** - Pre-configured actions for smooth workflows, including check tests and deployment example
- 🚢 **[Semantic Release](https://github.com/semantic-release/semantic-release)** - for automatic changelog
- 💻 **[T3 Env](https://env.t3.gg/)** - Manage your environment variables with ease
- 📦 **[Unused dependencies checker](https://www.npmjs.com/package/depcheck)** - Keep your dependencies clean
- ✉️ **[Nodemailer](https://nodemailer.com/)** - Send emails with ease from any smtp server
- 🔗 **[Trpc](https://trpc.io/)** - Move Fast and Break Nothing. End-to-end typesafe APIs made easy.
- 🎨 **[Next ui](https://nextui.org/)** - Beautifully designed components
- 🗄️ **[Monorepo](https://docs.npmjs.com/cli/v7/using-npm/workspaces)** - Manage multiple packages in one repository
- 🌐 **Translation** - Translation module built in for intertionalization
- 🌈 **Theme** - Dark and light mode theme
- 📖 **[Documentation](https://docusaurus.io/)** - A modern static website generator
- 📅 **Cron jobs** - Schedule jobs to run at specific times
- 📄 **Landing Page** - A simple landing page to showcase your app

## Table of Contents

- [Next.js Enterprise Boilerplate](#nextjs-enterprise-boilerplate)
  - [📚 Features](#-features)
  - [Table of Contents](#table-of-contents)
  - [🎯 Getting Started](#-getting-started)
    - [Initialize the project](#initialize-the-project)
    - [Usage within a team](#usage-within-a-team)
  - [🗄️ Monorepo packages](#️-monorepo-packages)
  - [📃 Scripts Overview](#-scripts-overview)
  - [🐳 Container Stack](#-container-stack)
  - [💻 Environment Variables handling](#-environment-variables-handling)
  - [📝 Development tips](#-development-tips)
    - [Internationalization](#internationalization)
      - [Optimization](#optimization)
      - [Usage](#usage)
        - [Server-Side usage](#server-side-usage)
        - [Client-Side usage](#client-side-usage)
      - [Traduction file](#traduction-file)
    - [File storage with S3](#file-storage-with-s3)
      - [Upload files](#upload-files)
        - [How it works?](#how-it-works)
        - [What if the client do not send the file link to the server?](#what-if-the-client-do-not-send-the-file-link-to-the-server)
      - [Dead files](#dead-files)
    - [Git optimization](#git-optimization)
      - [Depth clone](#depth-clone)
      - [Sparse checkout](#sparse-checkout)
    - [Recommended extensions](#recommended-extensions)
    - [Database \& Redis](#database--redis)
    - [Git flow](#git-flow)
    - [Api development](#api-development)
      - [Api errors](#api-errors)
    - [Banned keywords](#banned-keywords)
  - [❌ Common issues](#-common-issues)
    - [Cannot commit](#cannot-commit)
    - [S3 upload error cors](#s3-upload-error-cors)
  - [☁️ Cloud deployment](#️-cloud-deployment)
    - [Build](#build)
    - [Build multi-architecture image](#build-multi-architecture-image)
    - [Debug in local](#debug-in-local)
    - [Deploy](#deploy)
  - [🤝 Contribution](#-contribution)
  - [Support](#support)
  - [📜 License](#-license)

## 🎯 Getting Started

### Initialize the project

1. Fork & clone repository:

```bash
# Don't forget to ⭐ star and fork it first :)
git clone --depth 1 <your_project_url> && cd next-boilerplate
```

2. Install the dependencies:

```bash
npm install
```

3. Initialize the project:

```bash
npm run init
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Usage within a team

> Those steps require a version of git >= 2.43.2 due to the `sparse-checkout` feature.

After initializing the project and pushing the changes to the repository, the other team members can follow the following steps:

1. Clone the repository:

```bash
git clone --depth 1 --filter=blob:none --no-checkout <your_project_url> && cd next-boilerplate && git checkout main
```

> See more about the clone optimizations [here](#git-optimization).

2. Select the apps you want to work on:

As a team member you may not need to work on all the apps, you can select the apps you want to work on by running the following command (for all the repository enter `full` as the team name):

```bash
./bootstrap.sh <team_name>
```

Possible values for `<team_name>` are:

- full
- app
- cron
- docs
- landing
- infra

> **If you are the first one initializing the project please select the team_name: `full`**.
> Otherwise the initialization script will not work correctly.

3. Initialize the project locally:

```bash
npm i -w packages && npm run init
```

> After those steps you can start developing. Since you do not want to install the dependecies of all the apps when doing `npm i` use the `-w` flag to install the dependencies of the selected apps.
> For example if you run `npm i -w apps/app` at root it will install the dependencies of the app package only.

## 🗄️ Monorepo packages

This boilerplate uses [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to manage multiple packages in one repository.
The following packages are available:

- `apps/app`: The main application
- `apps/cron`: The cron jobs
- `apps/docs`: The documentation website
- `apps/landing`: The landing page

To run a script in a package, you can use the following command:

```bash
npm run <script> --workspace=<package>
```

For example, to run the `dev` script in the `app` package, you can use the following command:

```bash
npm run dev --workspace=apps/app
```

or

```bash
cd apps/app && npm run dev
```

Each package has its own `package.json` file, so you can add dependencies specific to a package.

Please make sure to add the dependencies to the `package.json` file of the package you want to use them in.
For example, if you want to add a dependency to the `app` package, you should add it to the `app/package.json` file with the following command:

```bash
npm install <package> --workspace=apps/app
```

or

```bash
cd apps/app
npm install <package>
```

> If you install a dependency in the root `package.json` file, it will be available in all packages and in most cases, you don't want that.

Port for each package:

- **App**: `3000`
- **Docs**: `3001`
- **Landing**: `3002`

## 📃 Scripts Overview

The following scripts are available in the `package.json`:

- `init`: Initializes the project by setting up your information
- `dev`: Starts the development server (only the main application package)
- `build`: Builds the app for production
- `start`: Starts the production server
- `lint`: Lints the code using ESLint
- `lint:fix`: Automatically fixes linting errors
- `prettier`: Checks the code for proper formatting
- `prettier:fix`: Automatically fixes formatting issues
- `test`: Runs unit and integration tests
- `preinstall`: Ensures the project is installed with Npm
- `depcheck`: Checks for unused dependencies

## 🐳 Container Stack

The boilerplate comes with a pre-configured Docker container stack and a dev container. The stack includes the following services:

- **PostgreSQL** - A powerful, open-source relational database system
- **Redis** - An in-memory data structure store, used as a database, cache, and message broker

To start the development container in vsCode [see](https://code.visualstudio.com/docs/remote/containers#_quick-start-open-an-existing-folder-in-a-container).

Ports:

- Next.js: 3000
- Docs: 3001
- Landing: 3002
- PostgreSQL: 5432
- Redis: 6379

## 💻 Environment Variables handling

[T3 Env](https://env.t3.gg/) is a library that provides environmental variables checking at build time, type validation and transforming. It ensures that your application is using the correct environment variables and their values are of the expected type. You’ll never again struggle with runtime errors caused by incorrect environment variable usage.

Config file is located at `env.ts`. Simply set your client and server variables and import `env` from any file in your project.

```ts
export const env = createEnv({
  server: {
    // Server variables
    SECRET_KEY: z.string(),
  },
  client: {
    // Client variables
    API_URL: z.string().url(),
  },
  runtimeEnv: {
    // Assign runtime variables
    SECRET_KEY: process.env.SECRET_KEY,
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
});
```

If the required environment variables are not set, you'll get an error message:

```sh
  ❌ Invalid environment variables: { SECRET_KEY: [ 'Required' ] }
```

## 📝 Development tips

### Internationalization

#### Optimization

In order to optimize the dictionary in client side you need to provide some information about what keys you really need from the dictionary. Then it will provide you a dictionary with only the required keys and not all the dictionary.

#### Usage

You can define the requirements for the dictionary like the example below. You can either import single keys like `myTitle` or import a whole object like `mySecondPage`.

_When importing a whole object make sure you use almost all the keys inside in order to optimize the dictionary. If that's not the case, just define the needed keys one by one._

```ts
dictionaryRequirements({
  myTitle: true,
  myPage: {
    title: true,
  },
  mySecondPage: true,
});
```

##### Server-Side usage

```tsx
import { MyComponentDr } from "@/components/my-component.dr";
import MyComponent from "@/components/my-component";
import { Locale } from "@/lib/i18n-config";
import { getDictionary } from "@/lib/langs";
import { dictionaryRequirements } from "@/lib/utils/dictionary";

export default async function Profile({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const dictionary = await getDictionary(
    lang,
    dictionaryRequirements(
      {
        profile: true,
      },
      MyComponentDr,
    ),
  );

  return (
    <main className="container m-auto flex flex-1 flex-col items-center justify-center p-6 pb-20">
      {dictionary.profile}
      <MyComponent dictionary={dictionary} />
    </main>
  );
}
```

In this example we load dictionary for two usages, one for the local component usage and the other for an external component usage.
To make your life easier we suggest that for each component you create a `my-component.dr.ts` file and define the **dictionary requirements** inside (see Client-Side usage).

##### Client-Side usage

For each component that require the use of dictionary create a file named `my-component.dr.ts`.
Then define the requirements inside:

```tsx
import { dictionaryRequirements } from "@/lib/utils/dictionary";

import { OtherComponentDr } from "./other-component.dr";

export const MyComponentDr = dictionaryRequirements(
  {
    profilePage: true,
  },
  OtherComponent,
);
```

In order to use it in your component your can import the Dr definition file and use it with `TDictionary`:

```tsx
import { TDictionary } from "@/lib/langs";

import OtherComponent from "./other-component";
import { MyComponentDr } from "./my-component.dr";

export default async function MyComponent({
  dictionary,
}: {
  dictionary: TDictionary<typeof MyComponentDr>;
}) {
  return (
    <section className="p-2 text-foreground">
      <header>
        <h3 className="text-lg font-medium">{dictionary.profilePage.title}</h3>
      </header>
      <OtherComponent dictionary={dictionary} />
    </section>
  );
}
```

#### Traduction file

The files for traduction are located in `apps/app/src/langs` or `apps/landing/src/langs` depending on the package you want to use it in.
If you want to add a new language, you can add a new file in the `langs` folder then modify the file `i18n-config.ts` and `langs.ts`.

### File storage with S3

#### Upload files

When you want to upload files to a bucket s3 you have to main choices:

1. Upload the file directly from the client to s3
2. Upload the file to the server then to s3

Both have their pros and cons. The first one is faster and more secure because the file does not pass through the server. The second one is more secure because you can check the file before uploading it to s3.

In this boilerplate I choose the first solution because uploading the file to your server then to s3 can be expensive in terms of resources and time.

> If you want to use the second solution you can use the `multer` library to upload the file to your server then to s3.

##### How it works?

1. The client sends a request to the server with the file name and file type.
2. The server sends a signed url to the client.
3. The client uploads the file to s3 with the signed url.
4. The client sends the file link to the server.
5. The server stores the file link in the database.

##### What if the client do not send the file link to the server?

To solve this problem I created a table named `FileUploading` and store all the upload request in it (step 2). Then I created a cron that check if the file is uploaded to s3 and used (see [Dead files](#dead-files)). If the file is not uploaded or not used within the expiration time (10 minutes) the cron delete the file from s3.

#### Dead files

A common problem in storing files to s3 is dead files. Dead files are files that are uploaded to s3 but not used in the application. To solve this problem. It's very hard to detect them manually if you do not set correctly your database.

For example, I upload a profile picture to s3 and I store the link in the database. If I delete the link in the database, the file is still in s3 and not used anymore.

To solve this I add a `File` table in the database, each time you need store a file link please use this table. Now we have a table that store all of our files but what if I need to override a file (like a profile picture). What I recommend is to unlink the `File` with the concerned table (here `User`) but leave the row in the table so the cron will detect it as a dead file an delete it.
Why not deleting the file directly? Because the logic to delete the file from s3 and the database is in the same place is complex and any error can lead to a data loss and dead files. This is why this logic is centralized in the cron and not in the api route.

### Git optimization

#### Depth clone

When you clone a repository, you can specify the depth of the clone. The depth is the number of commits from the tip of the branch. The depth is useful when you want to clone a repository but you don't need the full history.

Example:

```bash
git clone --depth 1 <repository-url>
```

In the (Getting Started)[#getting-started] section, I use the depth clone to clone the repository with only the last commit because you may not need the full history of the repository.

Here are good resources to learn more about the depth clone:

- https://github.blog/2020-12-21-get-up-to-speed-with-partial-clone-and-shallow-clone/
- https://stackoverflow.com/questions/24107485/how-to-checkout-remote-branch-with-git-clone-depth-1

#### Sparse checkout

> Those steps require a version of git >= 2.43.2 due to the `space-checkout` feature.

When you clone a repository, you can specify the files you want to clone. This is useful when you want to clone a repository but you don't need all the files.

Example:

```bash
git clone <repository-url> --no-checkout
```

In case of using this boilerplate with a team I specify the `--no-checkout` flag to clone the repository without the files. Then I use the `git sparse-checkout` command to select the files I want to work on. This is useful when you don't need to work on all the packages.

For example if you only want to work on the `app` package:

```bash
git sparse-checkout set apps/app
```

> The command above is just and example, please use the bootstrap script to select the team you want to work on.

In order to avoid knowing all the commands you can use the `bootstrap.sh` script to select the team you want to work on.
Example with the `app` team:

```bash
./bootstrap.sh app
```

You can revert the sparse checkout with the following command:

```bash
git sparse-checkout disable
```

Here are good resources to learn more about the sparse checkout:

- https://github.blog/2020-01-17-bring-your-monorepo-down-to-size-with-sparse-checkout/

### Recommended extensions

In order to install all recommended extensions please run:
`bash ./packages/scripts/install/install-extensions.sh`

> The dev container should install those extensions automatically but you can still execute the command above if there's a problem.

### Database & Redis

By default the boilerplate needs a PostgreSQL and Redis database to work.

If you are using the devcontainer those services will start automatically when opening the project in vsCode.

If you are not using the devcontainer you can start the services with the following command:

```bash
docker compose -f ./docker/docker-compose.local.yml up -d
```

### Git flow

The boilerplate uses the [Git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) workflow.

The main branches are:

- `main`: The main branch
- `rec`: The staging branch
- `develop`: The development branchs

### Api development

For the interaction with the api you can use the `trpc` library. It's a library that allows you to create typesafe APIs with ease. See [trpc](https://trpc.io/).

#### Api errors

All the possible errors are defined in `apps/app/src/langs/errors/<lang>.json`

### Banned keywords

In order to avoid using banned keywords in the codebase, we use the `banned-keywords.sh`. This script will check if there are any banned keywords in the codebase. By default all `TODO` and `FIXME` comments are banned.

Use this rules at your advantage !
For example if you are debugging a feature and you have commented some code you can use one of the following keywords to ensure this cannot be merged in the main branch.

```ts
// TODO: Debugging feature
```

## ❌ Common issues

### Cannot commit

Error: `.git-hooks/commit-msg: 6: git-conventional-commits: not found`

This error occurs when the `git-conventional-commits` package is not installed. To fix this issue, run the following command:

```bash
npm install -g git-conventional-commits
```

This package is used to check the commit message format.

### S3 upload error cors

See: https://www.scaleway.com/en/docs/storage/object/api-cli/setting-cors-rules/

Create a `cors.json` file

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["http://MY_DOMAIN_NAME", "http://www.MY_DOMAIN_NAME"],
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "HEAD", "POST", "PUT", "DELETE"],
      "MaxAgeSeconds": 3000,
      "ExposeHeaders": ["Etag"]
    }
  ]
}
```

Then execute the following command:

```bash
aws --endpoint https://s3.fr-par.scw.cloud --profile=scaleway s3api put-bucket-cors --bucket <bucket_name> --cors-configuration file://cors.json
```

## ☁️ Cloud deployment

_Please note that the following steps are for deploying the any application package._

### Build

1. Build the docker image

```bash
docker build -t <image-name> -f <path-to-Dockerfile> .
```

Exemple (landing):

```bash
docker build -t next-boilerplate/landing -f apps/landing/Dockerfile .
```

2. Push the image to a container registry

```bash
docker push <image-name>
```

Exemple (landing):

```bash
docker tag next-boilerplate/landing:latest <registry-url>/next-boilerplate/landing:latest
docker push <registry-url>/next-boilerplate/landing:latest
```

### Build multi-architecture image

Exemple (landing):

```bash
docker buildx build -t "<registry-url>/next-boilerplate/landing:latest" -f apps/landing/Dockerfile --platform linux/amd64,linux/arm64 --push .
```

### Debug in local

After the build you can run the image in local to see if everything is working as expected.

```bash
docker run --rm -it -p 3000:3000 <image-name>
```

> See:
> https://www.docker.com/blog/multi-arch-images/ > https://aws.amazon.com/fr/blogs/containers/how-to-build-your-containers-for-arm-and-save-with-graviton-and-spot-instances-on-amazon-ecs/ > https://docs.docker.com/build/drivers/docker-container/

### Deploy

For development environment or low usage application please prefer "Fargate", for production environment or high usage application please prefer "EC2".

## 🤝 Contribution

Contributions are always welcome! To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch with a descriptive name.
3. Make your changes, and commit them using the [Conventional Commits](https://www.conventionalcommits.org/) format.
4. Push your changes to the forked repository.
5. Create a pull request, and we'll review your changes.

## Support

For support, contact me on discord at `ryzer` or by email at `louis@huort.com`.

## 📜 License

This project is licensed under the MIT License. For more information, see the [LICENSE](./LICENSE) file.
