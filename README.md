# firebase-starter

Starter for firebase / typescript project

It contains base packages with common structures alongside different applications each one with a stack of technologies. The main goal is to provide a reference for how to organize the code and structure the project.

It is configured for AI assistance in a way that instructs the agents to follow the defined structures and patterns.

## Local development

Install the workspace dependencies and start a selected application with the complete development environment from the repository root:

```sh
pnpm install
pnpm dev react-reatom-shadcn
```

The first argument is a required Turborepo package filter. Add more filters to start multiple applications in the same session:

```sh
pnpm dev react-reatom-shadcn --filter=react-kumo
```

All selected applications share one Firebase emulator and data population task. Running `pnpm dev` without an application filter fails instead of starting every application in the workspace.

You can also run `pnpm dev` from an application package; its script delegates to the root workflow with its own package name.

Turborepo starts the selected application servers alongside the Firebase Authentication and Cloud Firestore emulators. A one-shot setup task waits up to 30 seconds for both emulators, then creates or updates the development users and movie data. If emulator startup or data population fails, the complete development workflow stops.

To start only the emulators, run `pnpm start-emulators`. To populate an already-running emulator suite manually, run `pnpm --filter tools populate:data`.

New application packages join this workflow by exposing a `dev:app` script for their framework's development server and a package-local `dev` script that delegates to `pnpm --dir ../.. run dev <package-name>`. Configure each application to use a unique development-server port; the shared emulator relationship is inherited from the root `turbo.json`.

## Enterprise movie text search

The movie list uses Firestore Enterprise Pipeline text search on the `title` field. Before using search, open Firestore Database > Indexes in the Google Cloud Console, choose a Text search index, and configure:

- Collection ID: `movies`
- Query scope: collection
- Indexed field: `title`
- Language override path: none

The `movies` collection is nested under each user document, so a collection-scope index applies to each user's `movies` subcollection. Wait for the index to finish building before testing search.

The Firestore emulator does not implement the Enterprise `document_matches` function. When the app uses the emulator, movie searches use a one-shot local title filter instead. Set `VITE_REMOTE_DATA=true` while running against a configured Enterprise project to exercise the Cloud text-search pipeline.

## Organization

The code is organized in `packages/` subfolder

**Common code**

  - `base/` (common code for all apps)
  - `tools/` (scripts and tools for development)

**Apps**
  
  - `react-reatom-shadcn/` (react app with reatom for state management and shadcn/ui for components)
  
