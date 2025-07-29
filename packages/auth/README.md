# Authentication Library

This authentication library provides session management and user authentication functionalities that can be utilized in both client and admin applications.

## Features

- **Session Management**: Create, delete, and verify user sessions using JSON Web Tokens (JWT).
- **User Authentication**: Retrieve user information and enforce authentication and authorization rules.

## Installation

To install the library, run the following command:

```
npm install auth-library
```

## Usage

### Importing the Library

You can import the necessary functions from the library as follows:

```typescript
import {
  createSession,
  deleteSession,
  getSession,
} from "auth-library/src/session";
import { getUser, requireUser, requireAdmin } from "auth-library/src/auth";
```

### Session Management

- **Creating a Session**: Use `createSession(userId: string)` to create a new session for a user.

```typescript
await createSession("user-id");
```

- **Deleting a Session**: Call `deleteSession()` to remove the current session.

```typescript
await deleteSession();
```

- **Getting the Current Session**: Use `getSession()` to retrieve the current session.

```typescript
const session = await getSession();
```

### User Authentication

- **Getting the Current User**: Use `getUser()` to retrieve the user associated with the current session.

```typescript
const user = await getUser();
```

- **Require Authentication**: Use `requireUser()` to ensure that a user is authenticated. If not, it will redirect to the sign-in page.

```typescript
await requireUser();
```

- **Require Admin Privileges**: Use `requireAdmin()` to ensure that the authenticated user has admin privileges.

```typescript
await requireAdmin();
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
