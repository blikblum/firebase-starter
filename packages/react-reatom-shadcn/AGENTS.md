# react-reatom-shadcn

This is a starter template for building React applications using Reatom for state management and Shadcn UI components.

## Dev environment

- Node.js project managed with Yarn package manager.

## Architecture Overview

- **UI Components**: Built using Shadcn, a collection of UI components for React.
- **State Management**: Application state is managed using Reatom
- **Routing**: Managed with TanStack Router with file-based routing.

## File Organization

- `src/components`: React components. Under `ui/` are Shadcn UI components.
- `src/helpers`: Utility functions
- `src/api`: Business logic types and functions.
- `src/stores`: Reatom atoms and related services
- `src/routes`: Application routes

## General Guidelines

- Keep types strict and explicit. Prefer typed params and explicit return types for functions, and avoid unused locals/params.
