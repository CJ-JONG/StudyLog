AGENTS.md

Project scope

This repository contains only the StudyLog frontend.

StudyLog is a personal study-record application. Authenticated users can manage their own categories and create, read, update, and delete study logs. The backend is a separate Spring Boot application running locally on port 8080.

Before making changes, read these files completely:

README.md

docs/API_SPEC.md

docs/FRONTEND_SPEC.md

Do not change or invent backend API contracts. If the documents conflict with observed backend behavior, report the mismatch before creating a workaround.

Technology constraints

React + TypeScript + Vite

Node.js 24.13.x

npm 11.6.x

React Router for client-side routing

Axios for HTTP requests

Plain CSS or CSS Modules for styling

Use the dependencies already present in package.json whenever possible.

lucide-react may be added if icons are needed.

Do not add a UI framework, server-state library, global-state library, form library, or CSS framework without user approval.

Keep TypeScript strict. Do not use any merely to silence an error.

Product rules

The visible product name is StudyLog.

User-facing text is Korean.

Dates are displayed in Korean local time and in an easy-to-read format.

Never ask the user to enter or select memberId.

Never send memberId in a query string, path variable, request body, or custom header.

The backend identifies the current member from the JWT access token.

Do not use mock data after an API integration is implemented.

Do not leave placeholder pages, dead buttons, TODO comments, or incomplete CRUD flows in the final result.

Authentication rules

Store the login response's accessToken in localStorage under the exact key accessToken.

Send it on protected API calls as Authorization: Bearer <accessToken>.

Use one configured Axios instance for API calls.

Do not attach the token to the signup or login request unless the shared instance does it harmlessly.

Protect private routes. A user without a token must be redirected to /login.

After login, call GET /api/members/me or use the returned login member to initialize the current user.

Treat GET /api/members/me as the authoritative check that a stored token is still valid.

On a protected request returning 401, clear authentication state and localStorage, then move to /login.

Avoid a redirect loop when the login request itself returns 401.

Logout is client-side for the current API: clear the token and cached member, then navigate to /login.

Never log access tokens, passwords, or the Authorization header.

Recommended source structure

Use the existing structure when it is already coherent. Otherwise prefer:

src/
├─ api/
│  ├─ axiosInstance.ts
│  ├─ authApi.ts
│  ├─ categoryApi.ts
│  └─ studyLogApi.ts
├─ components/
│  ├─ common/
│  └─ layout/
├─ contexts/
│  └─ AuthContext.tsx
├─ hooks/
├─ pages/
├─ routes/
│  └─ ProtectedRoute.tsx
├─ types/
│  ├─ api.ts
│  ├─ auth.ts
│  ├─ category.ts
│  └─ studyLog.ts
├─ styles/
├─ App.tsx
└─ main.tsx

Do not create unnecessary abstraction layers. Shared components should exist only when they are genuinely reused or isolate meaningful behavior.

API implementation rules

Use /api as the browser-facing API base URL during local development.

Configure the Vite development proxy to forward /api to http://localhost:8080.

Put API calls in src/api; page components must not contain raw Axios calls.

Define request and response types that match docs/API_SPEC.md.

Accept every successful 2xx status. Do not depend on one status code unless behavior requires it.

Display the backend's message when an error response provides one.

Otherwise display a short Korean fallback message.

Handle network failure separately from backend validation or authorization failure.

After successful create, update, or delete, keep UI data synchronized by updating state or refetching.

Do not silently catch errors.

UI and accessibility rules

Follow docs/FRONTEND_SPEC.md for routes, flows, states, and visual direction.

Build a responsive interface for desktop and mobile.

Every form control has a visible label.

Every icon-only button has an accessible name.

Forms are keyboard accessible and submit with Enter where appropriate.

Provide visible focus styles.

Do not use color as the only indication of status.

Ask for confirmation before destructive deletion.

Every API-backed area has loading, error, empty, and success states.

Disable duplicate-submit actions while a mutation is pending.

Working process

Inspect the current repository and package.json before editing.

Preserve useful existing code and user changes.

For a large request, state a short implementation plan before editing.

Implement complete vertical flows rather than disconnected visual scaffolding.

Check the browser console and resolve relevant warnings and errors.

Run the required validation commands.

Summarize changed files, validation results, and any backend mismatch.

Validation commands

Run these after implementation:

npm run lint
npm run build

If the repository has a test script, also run:

npm test

Do not claim completion while a relevant lint, TypeScript, test, or production-build error remains.

Definition of done

The frontend is complete only when:

Signup, login, session restoration, protected routing, and logout work.

Category list, create, rename, and delete work against the real API.

Study-log list, detail, create, edit, and delete work against the real API.

Forms show useful validation and backend error messages.

Loading, empty, error, confirmation, and disabled-submit states exist.

Desktop and mobile layouts are usable.

No memberId is supplied by the frontend.

No secrets or real access tokens are committed.

npm run lint and npm run build pass.

Code review rules

Flag any request that sends memberId from the frontend.

Flag any protected API call that bypasses the configured Axios instance.

Flag hard-coded access tokens, passwords, API secrets, or test credentials.

Flag user-visible controls that have no implemented action.

Flag authentication failures that leave stale private content visible.

Flag incorrect API fields or endpoint paths compared with docs/API_SPEC.md.