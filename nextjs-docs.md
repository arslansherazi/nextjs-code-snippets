# Next.js 16 Guide

Production-ready patterns and mental models for Next.js 16

---

## 1. App Router & Routing

### File-Based Routing

```
app/
  page.tsx              → /
  layout.tsx            → wraps all routes (root layout, required)
  about/
    page.tsx            → /about
  posts/
    page.tsx            → /posts
    layout.tsx          → OPTIONAL: shared UI for /posts/* routes
    [id]/
      page.tsx          → /posts/[id]
      loading.tsx       → loading UI for /posts/[id]
      error.tsx         → error UI for /posts/[id]
```

**Note:** Only create `layout.tsx` in a folder if you need shared UI for all routes under that path.

### Route Segments

**`page.tsx`** - Route endpoint, unique per route segment.

```tsx
// app/posts/page.tsx
export default async function PostsPage() {
  const posts = await fetchPosts()
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

**`layout.tsx`** - Optional. Shared UI that wraps all routes in that segment. Persists across navigation.

**When to use:** Only if you need shared UI (navigation, sidebar, header) for all routes under that path.

```tsx
// app/posts/layout.tsx - OPTIONAL
// Only create this if you need shared UI for /posts, /posts/[id], etc.
export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>Posts Navigation</nav>
      {children}
    </div>
  )
}
```

**Example:** If `/posts` and `/posts/[id]` both need the same navigation bar, create `app/posts/layout.tsx`. If not, skip it.

**`loading.tsx`** - Automatic loading UI, replaces page during fetch.

```tsx
// app/posts/[id]/loading.tsx
export default function Loading() {
  return <div>Loading post...</div>
}
```

**`error.tsx`** - Error boundary, must be client component.

```tsx
// app/posts/[id]/error.tsx
"use client"

export default function Error({ error, reset }: { error: Error, reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### Dynamic Routes

Use brackets `[param]` in folder names to create dynamic segments.

**Single dynamic segment:**

```tsx
// app/posts/[id]/page.tsx
type PostPageProps = {
  params: Promise<{ id: string }>
}

type Post = {
  id: string
  title: string
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  const post: Post = await fetchPost(id)
  return <article>{post.title}</article>
}
```

**Multiple segments:**

```tsx
// app/posts/[id]/comments/[commentId]/page.tsx
export default async function CommentPage({ 
  params 
}: { 
  params: Promise<{ id: string; commentId: string }> 
}) {
  const { id, commentId } = await params
  // ...
}
```

**Catch-all routes (advanced):**

```tsx
// app/shop/[...slug]/page.tsx - Matches /shop/a, /shop/a/b, /shop/a/b/c
// params.slug = ['a'], ['a', 'b'], or ['a', 'b', 'c']

// app/docs/[[...slug]]/page.tsx - Optional catch-all
// Also matches /docs itself (slug is undefined)
```

---

## 2. Server vs Client Components

### Default: Server Components

All components are server components by default. No JavaScript sent to client.

```tsx
// app/posts/page.tsx - Server Component
import { db } from '@/lib/db'

type Post = {
  id: string
  title: string
}

type PostsListProps = {
  posts: Post[]
}

function PostsList({ posts }: PostsListProps) {
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}

export default async function PostsPage() {
  const posts: Post[] = await db.posts.findMany()
  return <PostsList posts={posts} />
}
```

### Client Components: `"use client"`

Use only when you need:
- Browser APIs (`useState`, `useEffect`, `onClick`)
- Event handlers
- Context providers
- Third-party client-only libraries

```tsx
// app/components/LikeButton.tsx
"use client"

import { useState } from 'react'

export function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false)
  return <button onClick={() => setLiked(!liked)}>Like</button>
}
```

### Rules

- **Server Components**: Data fetching, database access, file system, secrets
- **Client Components**: Interactivity, browser APIs, state management
- **Composition**: Server components can import and render client components
- **No mixing**: Client components cannot import server components directly

```tsx
// ✅ Server component renders client component
// app/posts/page.tsx
import { LikeButton } from '@/components/LikeButton'

type Post = {
  id: string
  title: string
}

export default async function PostsPage() {
  const posts: Post[] = await fetchPosts()
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <LikeButton postId={post.id} />
        </div>
      ))}
    </div>
  )
}
```

---

## 3. Data Fetching

### Server-Side Fetch

Fetch in server components, layouts, and server actions. No `useEffect` for initial data.

```tsx
// app/posts/page.tsx
type Post = {
  id: string
  title: string
}

type PostsListProps = {
  posts: Post[]
}

function PostsList({ posts }: PostsListProps) {
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}

export default async function PostsPage() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 }
  })
  const posts: Post[] = await res.json()
  return <PostsList posts={posts} />
}
```

### User-Specific vs Shared Data

**User-specific data** - Use `cookies()` or `headers()` to make route dynamic:

```tsx
import { cookies } from 'next/headers'

type User = {
  name: string
}

export default async function Dashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')
  
  const res = await fetch('https://api.example.com/user', {
    headers: { Authorization: `Bearer ${token?.value}` },
    cache: 'no-store' // Required for user-specific data
  })
  const user: User = await res.json()
  return <div>Welcome {user.name}</div>
}
```

**Shared data** - Use caching:

```tsx
type Post = {
  id: string
  title: string
}

type PostsListProps = {
  posts: Post[]
}

function PostsList({ posts }: PostsListProps) {
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}

export default async function PostsPage() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'force-cache', // Default, shared across users
    next: { revalidate: 3600 }
  })
  const posts: Post[] = await res.json()
  return <PostsList posts={posts} />
}
```

### Parallel Fetching

Use `Promise.all` for independent requests:

```tsx
type Post = {
  id: string
  title: string
}

type User = {
  id: string
  name: string
}

type PostsListProps = {
  posts: Post[]
}

type UsersListProps = {
  users: User[]
}

function PostsList({ posts }: PostsListProps) {
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}

function UsersList({ users }: UsersListProps) {
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}

export default async function Page() {
  const [posts, users] = await Promise.all([
    fetch('https://api.example.com/posts').then(r => r.json()),
    fetch('https://api.example.com/users').then(r => r.json())
  ])
  
  return (
    <div>
      <PostsList posts={posts} />
      <UsersList users={users} />
    </div>
  )
}
```

---

## 4. Caching

### Cache Strategies

**`force-cache`** (default) - Cache indefinitely until revalidated.

```tsx
const res = await fetch('https://api.example.com/data', {
  cache: 'force-cache',
  next: { revalidate: 3600 } // Revalidate every hour
})
```

**`no-store`** - Never cache, always fetch fresh.

```tsx
const res = await fetch('https://api.example.com/user', {
  cache: 'no-store' // Required for user-specific data
})
```

**`no-cache`** - Revalidate on every request, but cache response.

```tsx
const res = await fetch('https://api.example.com/data', {
  cache: 'no-cache'
})
```

### Route Cache vs Data Cache

**Route Cache** - Caches rendered HTML of routes.
- Static routes: cached indefinitely
- Dynamic routes: not cached (when using `cookies()`, `headers()`, or `searchParams`)

**Data Cache** - Caches `fetch()` responses.
- Controlled by `cache` option and `revalidate`

### Revalidation

**Time-based revalidation:**

```tsx
fetch('https://api.example.com/data', {
  next: { revalidate: 3600 } // seconds
})
```

**On-demand revalidation:**

```tsx
// app/actions.ts
"use server"
import { revalidatePath, revalidateTag } from 'next/cache'

export async function updatePost(id: string): Promise<void> {
  await db.posts.update(id)
  revalidatePath('/posts') // Revalidate route cache
  revalidatePath('/posts/[id]', 'page') // Specific route
}

export async function updatePostWithTag(id: string): Promise<void> {
  await db.posts.update(id)
  revalidateTag('posts') // Revalidate all fetches with this tag
}
```

**Tag-based revalidation:**

```tsx
// Fetch with tag
const res = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] }
})

// Revalidate by tag
revalidateTag('posts')
```

### Cache Poisoning Prevention

**Rules:**
- User-specific data: always `cache: 'no-store'`
- Never cache responses containing user data
- Use `cookies()` or `headers()` only when needed (makes route dynamic)
- Revalidate after mutations

**When routes become dynamic:**
- Using `cookies()` or `headers()` in server component
- Using `searchParams` in `page.tsx`
- Using `dynamic = 'force-dynamic'` or `dynamicParams = true`

---

## 5. Server Actions

### Mutations Only

Server Actions handle create/update/delete operations. Not for reads.

```tsx
// app/posts/actions.ts
"use server"

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData): Promise<void> {
  const title = formData.get('title') as string
  
  await db.posts.create({ title })
  
  revalidatePath('/posts')
  redirect('/posts')
}

export async function deletePost(id: string): Promise<void> {
  await db.posts.delete(id)
  revalidatePath('/posts')
}
```

### Form Submission Pattern

```tsx
// app/posts/create/page.tsx
import { createPost } from './actions'

export default function CreatePostPage() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <button type="submit">Create</button>
    </form>
  )
}
```

### Client-Side Invocation

```tsx
// app/components/DeleteButton.tsx
"use client"

import { deletePost } from '@/app/posts/actions'

export function DeleteButton({ postId }: { postId: string }) {
  return (
    <button onClick={() => deletePost(postId)}>
      Delete
    </button>
  )
}
```

### Rules

- **No API routes** - Use Server Actions for mutations
- **No client fetch** - Don't call Server Actions via `fetch()`
- **Always revalidate** - Call `revalidatePath()` or `revalidateTag()` after mutations
- **Type safety** - Server Actions are type-safe end-to-end

---

## 6. Loading UI

### Automatic Loading States

`loading.tsx` automatically wraps page during data fetching.

```
app/
  posts/
    loading.tsx        → Shows during /posts fetch
    [id]/
      loading.tsx      → Shows during /posts/[id] fetch
      page.tsx
```

```tsx
// app/posts/loading.tsx
export default function Loading() {
  return <div>Loading posts...</div>
}
```

**Behavior:**
- Shows immediately on navigation
- Replaces page content during fetch
- Automatically removed when data loads
- Works with Suspense boundaries

---

## 7. Error Handling & Resilience

### Error Boundaries

`error.tsx` catches errors in route segments.

```tsx
// app/posts/[id]/error.tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### Throwing Errors

```tsx
// app/posts/[id]/page.tsx
type PostPageProps = {
  params: Promise<{ id: string }>
}

type Post = {
  id: string
  title: string
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  const post: Post | null = await fetchPost(id)
  
  if (!post) {
    throw new Error('Post not found') // Triggers error.tsx
  }
  
  return <article>{post.title}</article>
}
```

### Rules

- **Don't return error flags** - Throw errors, don't return `{ error: true }`
- **Error boundaries are client components** - Must use `"use client"`
- **Reset function** - Calls `reset()` to retry rendering
- **Error propagation** - Errors bubble to nearest `error.tsx`

---

## 8. Suspense & Streaming

### Streaming Mental Model

Suspense enables streaming HTML, showing content as it becomes available.

```tsx
// app/posts/page.tsx
import { Suspense } from 'react'

type Post = {
  id: string
  title: string
}

type User = {
  id: string
  name: string
}

function PostsSkeleton() {
  return <div>Loading posts...</div>
}

function UsersSkeleton() {
  return <div>Loading users...</div>
}

async function PostsList() {
  const posts: Post[] = await fetchPosts() // Slow
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}

async function UsersList() {
  const users: User[] = await fetchUsers() // Fast
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}

export default function PostsPage() {
  return (
    <div>
      <Suspense fallback={<PostsSkeleton />}>
        <PostsList />
      </Suspense>
      <Suspense fallback={<UsersSkeleton />}>
        <UsersList />
      </Suspense>
    </div>
  )
}
```

### When to Use

**Use Suspense for:**
- Independent data fetching sections
- Parallel data streams
- Progressive page rendering

**Don't use Suspense for:**
- Entire page (use `loading.tsx` instead)
- Client-side state management
- Error boundaries (use `error.tsx`)

### Fallback Pattern

```tsx
function CardSkeleton() {
  return <div>Loading...</div>
}

async function SlowComponent() {
  const data = await fetchData()
  return <div>{data}</div>
}

<Suspense fallback={<CardSkeleton />}>
  <SlowComponent />
</Suspense>
```

---

## 9. Optimistic UI

### `useOptimistic` Hook

For instant UI updates before server confirmation.

```tsx
// app/posts/LikeButton.tsx
"use client"

import { useOptimistic, useTransition } from 'react'
import { likePost } from './actions'

type LikeButtonProps = {
  postId: string
  initialLikes: number
}

export function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (state: number, increment: number) => state + increment
  )

  const handleLike = (): void => {
    startTransition(async () => {
      addOptimisticLike(1) // Immediate UI update
      await likePost(postId) // Server action
    })
  }

  return (
    <button onClick={handleLike} disabled={isPending}>
      {optimisticLikes} Likes
    </button>
  )
}
```

### `useTransition`

Tracks pending state of Server Actions.

```tsx
"use client"

import { useTransition } from 'react'
import { updatePost } from './actions'

export function UpdateButton() {
  const [isPending, startTransition] = useTransition()

  const handleUpdate = (): void => {
    startTransition(async () => {
      await updatePost()
    })
  }

  return (
    <button onClick={handleUpdate} disabled={isPending}>
      {isPending ? 'Updating...' : 'Update'}
    </button>
  )
}
```

### Rules

- **Client-side only** - Requires `"use client"`
- **Use for mutations** - Likes, comments, toggles
- **Rollback on error** - Server Action errors revert optimistic state
- **Not for reads** - Only for mutations

---

## 10. Middleware

### `proxy.ts`

Runs before request completes. Use for auth checks, redirects, header modification.

```tsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')
  
  // Auth check
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Add header
  const response = NextResponse.next()
  response.headers.set('x-pathname', request.nextUrl.pathname)
  
  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/protected/:path*'
  ]
}
```

### Matcher Configuration

```tsx
export const config = {
  matcher: [
    '/dashboard/:path*',        // All routes under /dashboard
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // All except static files
  ]
}
```

### Common Patterns

**Auth redirect:**

```tsx
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-token')
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  return NextResponse.next()
}
```

**A/B testing:**

```tsx
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const variant = request.cookies.get('variant') || (Math.random() > 0.5 ? 'a' : 'b')
  const response = NextResponse.next()
  response.cookies.set('variant', variant)
  return response
}
```

---

## 11. Authentication Pattern

### HTTP-Only Cookies

Store session tokens in HTTP-only cookies, never in localStorage.

```tsx
// app/actions/auth.ts
"use server"

import { cookies } from 'next/headers'

export async function login(formData: FormData): Promise<void> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const session = await authenticateUser(email, password)
  
  const cookieStore = await cookies()
  cookieStore.set('session', session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
```

### Server-Side Auth Check

```tsx
// app/dashboard/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type User = {
  name: string
}

export default async function Dashboard() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')
  
  if (!session) {
    redirect('/login')
  }
  
  const user: User = await getUserFromSession(session.value)
  return <div>Welcome {user.name}</div>
}
```

### Cookie Access

```tsx
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  // ...
}
```

### Rules

- **No localStorage** - Use HTTP-only cookies only
- **No client-side tokens** - Never expose tokens to client JavaScript
- **Server-side validation** - Always validate on server
- **Secure cookies** - Use `secure` flag in production

---

## 12. RBAC (Roles & Permissions)

### Role-Based Access Control

Enforce permissions on server, UI checks are cosmetic only.

```tsx
// lib/auth.ts
import { cookies } from 'next/headers'

type User = {
  id: string
  role: string
}

export async function requireRole(requiredRole: string): Promise<User> {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  const user: User = await getUserFromSession(session.value)
  
  if (user.role !== requiredRole && user.role !== 'admin') {
    throw new Error('Forbidden')
  }
  
  return user
}
```

### Server Enforcement

```tsx
// app/admin/users/page.tsx
import { requireRole } from '@/lib/auth'
import { redirect } from 'next/navigation'

type User = {
  id: string
  name: string
}

type UsersListProps = {
  users: User[]
}

function UsersList({ users }: UsersListProps) {
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}

export default async function AdminUsersPage() {
  try {
    const user = await requireRole('admin')
    const users: User[] = await getUsers()
    return <UsersList users={users} />
  } catch (error) {
    redirect('/unauthorized')
  }
}
```

### UI Checks (Cosmetic)

```tsx
// app/components/AdminButton.tsx
"use client"

import { useUser } from '@/hooks/useUser'

type User = {
  role: string
}

export function AdminButton() {
  const { user }: { user: User | null } = useUser()
  
  if (user?.role !== 'admin') {
    return null // Hide, but server already enforces
  }
  
  return <button>Admin Action</button>
}
```

### Default Deny Rule

**Always deny by default.** Explicitly allow access, never assume.

```tsx
// ✅ Correct
if (user.role === 'admin') {
  // allow
} else {
  throw new Error('Forbidden')
}

// ❌ Wrong
if (user.role !== 'admin') {
  throw new Error('Forbidden')
}
// Missing else case
```

---

## 13. Performance Best Practices

### Parallel Server Fetches

Use `Promise.all` for independent requests:

```tsx
type Post = {
  id: string
  title: string
}

type User = {
  id: string
  name: string
}

type Setting = {
  key: string
  value: string
}

type PostsListProps = {
  posts: Post[]
}

type UsersListProps = {
  users: User[]
}

type SettingsProps = {
  settings: Setting[]
}

function PostsList({ posts }: PostsListProps) {
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}

function UsersList({ users }: UsersListProps) {
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}

function Settings({ settings }: SettingsProps) {
  return (
    <div>
      {settings.map(setting => (
        <div key={setting.key}>{setting.value}</div>
      ))}
    </div>
  )
}

export default async function Page() {
  const [posts, users, settings] = await Promise.all([
    fetchPosts(),
    fetchUsers(),
    fetchSettings()
  ])
  
  return (
    <div>
      <PostsList posts={posts} />
      <UsersList users={users} />
      <Settings settings={settings} />
    </div>
  )
}
```

### Minimize Client Components

Keep components as server components when possible. Only use `"use client"` when necessary.

```tsx
// ✅ Server component (default)
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}

// ❌ Unnecessary client component
"use client"
export default function Page() {
  // No interactivity needed
  return <div>Static content</div>
}
```

### Suspense Boundaries

Wrap independent data sections:

```tsx
function Skeleton() {
  return <div>Loading...</div>
}

async function SlowSection() {
  const data = await fetchSlowData()
  return <div>{data}</div>
}

async function FastSection() {
  const data = await fetchFastData()
  return <div>{data}</div>
}

<Suspense fallback={<Skeleton />}>
  <SlowSection />
</Suspense>
<Suspense fallback={<Skeleton />}>
  <FastSection />
</Suspense>
```

### Reduce JS Payload

- Use server components by default
- Code split with dynamic imports: `const Component = dynamic(() => import('./Component'))`
- Avoid large client-side libraries
- Use Next.js Image component for images

---

## 14. Testing Strategy

### What to Test

**Server Actions:**

```tsx
// __tests__/actions.test.ts
import { createPost } from '@/app/posts/actions'

describe('createPost', () => {
  it('creates post and revalidates', async () => {
    await createPost(new FormData())
    // Assert post created, revalidation called
  })
})
```

**Auth flows:**

```tsx
describe('authentication', () => {
  it('redirects unauthenticated users', async () => {
    const response = await fetch('/dashboard')
    expect(response.redirected).toBe(true)
  })
})
```

**RBAC:**

```tsx
describe('RBAC', () => {
  it('denies access to non-admins', async () => {
    await expect(requireRole('admin')).rejects.toThrow('Forbidden')
  })
})
```

### What NOT to Test

- **Next.js internals** - Don't test routing, caching (Next.js handles this)
- **Server component rendering** - Test data fetching logic, not React rendering
- **Middleware edge cases** - Test business logic, not Next.js behavior

### Minimal E2E Guidance

Use Playwright or Cypress for critical user flows:

```tsx
// e2e/auth.spec.ts
test('user can login and access dashboard', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name="email"]', 'user@example.com')
  await page.fill('[name="password"]', 'password')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

---

## 15. Mental Model: Responsibility Split

### Client

- User interactions (`onClick`, `onChange`)
- Browser APIs (`localStorage`, `window`)
- Client-side state (`useState`, `useEffect`)
- Optimistic updates (`useOptimistic`)

### Server Components

- Data fetching (`fetch`, database queries)
- Rendering initial HTML
- Accessing secrets, environment variables
- File system, server-only APIs

### Server Actions

- Mutations (create, update, delete)
- Form submissions
- Revalidation (`revalidatePath`, `revalidateTag`)
- Auth operations (login, logout)

### Middleware

- Request interception
- Auth checks before rendering
- Redirects
- Header modification

### Backend

- Business logic
- Database operations
- External API calls
- Data validation

### Cache

- Route cache (rendered HTML)
- Data cache (`fetch` responses)
- Revalidation strategies
- Cache invalidation

---

## 16. Absolute Rules / Best Practices

### Data Fetching

- ❌ **No `useEffect` for initial data** - Fetch in server components
- ✅ **User-specific data: `cache: 'no-store'`** - Never cache user data
- ✅ **Parallel fetches: `Promise.all`** - Don't await sequentially

### Business Logic

- ❌ **No business logic in Next.js** - Keep in backend/API
- ✅ **Next.js is presentation layer** - Delegate to backend

### Authentication

- ❌ **No client-side auth tokens** - HTTP-only cookies only
- ❌ **No localStorage for sessions** - Server-side only
- ✅ **Always validate on server** - Never trust client

### Mutations

- ✅ **Always revalidate after mutations** - `revalidatePath()` or `revalidateTag()`
- ✅ **Use Server Actions for mutations** - No API routes needed
- ❌ **Don't call Server Actions via `fetch()`** - Direct invocation

### Caching

- ✅ **Cache shared data** - Use `force-cache` with revalidation
- ❌ **Never cache user-specific data** - Always `no-store`
- ✅ **Revalidate on-demand** - After mutations, via tags or paths

### Error Handling

- ✅ **Throw errors, don't return flags** - `throw new Error()`, not `{ error: true }`
- ✅ **Use error boundaries** - `error.tsx` for route segments

### Components

- ✅ **Server components by default** - Only use `"use client"` when needed
- ✅ **Compose server + client** - Server components can render client components
- ❌ **Don't import server components in client components** - Pass as props

---

## Quick Reference

### File Structure

```
app/
  layout.tsx           # Root layout
  page.tsx             # Home page
  loading.tsx          # Loading UI
  error.tsx            # Error boundary
  [id]/
    page.tsx           # Dynamic route
    loading.tsx        # Route-specific loading
    error.tsx          # Route-specific error
  actions.ts           # Server Actions
middleware.ts          # Middleware
```

### Common Patterns

**Server Component with Data:**

```tsx
type Data = {
  id: string
  content: string
}

export default async function Page() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store' // or 'force-cache' with revalidate
  })
  const data: Data = await res.json()
  return <div>{data.content}</div>
}
```

**Server Action:**

```tsx
"use server"
import { revalidatePath } from 'next/cache'

export async function updateData(formData: FormData): Promise<void> {
  await saveData(formData)
  revalidatePath('/data')
}
```

**Client Component:**

```tsx
"use client"
import { useState } from 'react'

export function InteractiveComponent() {
  const [state, setState] = useState<boolean>(false)
  return <button onClick={() => setState(!state)}>Click</button>
}
```

---
