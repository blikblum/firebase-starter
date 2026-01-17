---
name: create-components
description: Create or update React components in this repo, including adding or updating adjacent Storybook stories for component testing. Use when asked to build new UI components or adjust existing ones (e.g., "Create a login page component", "Update Login component to show error message").
---

# Create Components

## Overview

Provide a consistent workflow for adding or updating components under `src/components`, using shadcn UI building blocks and project conventions, and always create or update a `ComponentName.stories.tsx` story alongside the component.

## Workflow

### 1) Scope and location

- Determine whether the component is a reusable UI piece or a feature component.
- Place feature components in `src/components/`; keep shadcn primitives in `src/components/ui/`.
- Prefer one file per component; keep naming and casing consistent with nearby files.

### 2) Implement the component

- Match the local file style (quotes, semicolons, formatting) and prefer function components.
- Keep types strict and explicit; add explicit return types for functions and typed props.
- Use `React.JSX.Element` instead of the global `JSX.Element` namespace for component return types.
- Use existing UI components from `@/components/ui` before creating new primitives.
- Use `@/` path aliases for internal imports.
- When a component is tightly coupled to store state, consider extracting a presentational component to keep stories simple.

### 3) Add or update Storybook stories

- Create `ComponentName.stories.tsx` next to the component if it does not exist; update it when behavior or props change.
- Use `@storybook/react-vite` `Meta`/`StoryObj` and prefer args-based stories.
- Include a `Default` story plus variants for important states (error, loading, empty, etc.).
- Use `fn()` from `storybook/test` for callback props.
- If a component needs providers (store/router), wrap it via a `render` function or `decorators` on the story.

Use this template as a starting point:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'

import { fn } from 'storybook/test'

import { ComponentName } from './ComponentName'

const meta = {
  title: 'Components/ComponentName',
  component: ComponentName,
  args: {
    onAction: fn(),
  },
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
```
