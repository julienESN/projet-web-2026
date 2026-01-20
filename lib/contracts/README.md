# 📦 Contracts Library

This library serves as the **Single Source of Truth** for data models and API contracts shared between the Frontend and Backend. It relies entirely on **Zod** for runtime validation and static type inference.

## 🤖 LLM & Developer Guidelines (Read Carefully)

### 🚨 Golden Rule: ZOD IS MANDATORY
**Never** manually define a TypeScript `interface` or `type` for data structures that travel over the network (API DTOs).
**ALWAYS** define a Zod schema first, then infer the TypeScript type from it.

- ✅ **CORRECT**:
  ```typescript
  import { z } from 'zod';

  export const LoginRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  export type LoginRequest = z.infer<typeof LoginRequestSchema>;
  ```

- ❌ **INCORRECT**:
  ```typescript
  export interface LoginRequest {
    email: string;
    password: string;
  }
  ```

---

## 🛠 Workflow & Usage

### 1. Adding a New Contract
1. Create a file in the appropriate domain folder (e.g., `src/auth/register.ts`).
2. Define the Zod schema.
3. Export the inferred type.
4. **Export everything** in `src/index.ts`.

#### Example: `src/auth/reset-password.ts`
```typescript
import { z } from 'zod';

// 1. Define Schema
export const ResetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8).max(100),
});

// 2. Infer Type
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
```

#### Update `src/index.ts`
```typescript
export * from './auth/reset-password';
```

### 2. Building the Library
After making changes, you may need to rebuild typescript files if they are not picked up automatically by your IDE.
```bash
# From workspace root
npm run build -w lib/contracts
```

---

## 💻 Consumer Usage

### Frontend (React + Vite)
Use the schema for form validation (e.g., with `react-hook-form`).

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginRequestSchema, LoginRequest } from 'contracts';

export const LoginForm = () => {
  const { register, handleSubmit } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema)
  });

  const onSubmit = (data: LoginRequest) => {
    // data is typed correctly!
    console.log(data.email);
  };
  // ...
};
```

### Backend (NestJS)
Use the DTO for type safety and the Schema for validation pipes.

```typescript
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { LoginRequest, LoginRequestSchema } from 'contracts';
// Assuming you have a ZodValidationPipe
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginRequestSchema))
  login(@Body() body: LoginRequest) {
    // body is typed as LoginRequest and validated at runtime!
    return this.authService.login(body);
  }
}
```

## 📦 Dependency Management
To install a new package into this library (e.g., `date-fns`), run from the project root:

```bash
npm install date-fns -w lib/contracts
```
