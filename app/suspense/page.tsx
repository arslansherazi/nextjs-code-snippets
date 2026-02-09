import { Suspense } from "react"
import CardLoading from "./CardLoading"
import FastSection from "./FastSection"
import SlowSection from "./SlowSection"

export default function SuspensePage() {
  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl text-foreground md:text-3xl">Suspense Demo</h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Each section loads independently. Fast section appears first, slow section shows loading then appears.
        </p>

        <div className="space-y-6">
          <Suspense fallback={<CardLoading title="Fast Data" />}>
            <FastSection />
          </Suspense>

          <Suspense fallback={<CardLoading title="Slow Data" />}>
            <SlowSection />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
