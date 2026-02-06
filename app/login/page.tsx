import LoginForm from "./LoginForm"

export default function LoginPage() {
  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-2xl font-semibold text-foreground md:text-3xl">
          Login
        </h1>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
