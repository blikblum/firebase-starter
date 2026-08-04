# firebase-starter

Starter for firebase / typescript project

It contains base packages with common structures alongside different applications each one with a stack of technologies. The main goal is to provide a reference for how to organize the code and structure the project.

It is configured for AI assistance in a way that instructs the agents to follow the defined structures and patterns.

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
  
