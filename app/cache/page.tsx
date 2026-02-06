import { getStatic, getDynamic, getTimeBased, getOnDemand, getTagBased } from "./api"
import Card from "./Card"
import { RevalidatePathButton, RevalidateTagButton } from "./RevalidateButton"

export default async function CachePage() {
  const [staticData, dynamicData, timeBasedData, onDemandData, tagData] = await Promise.all([
    getStatic(),
    getDynamic(),
    getTimeBased(),
    getOnDemand(),
    getTagBased(),
  ])

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl text-foreground md:text-3xl">
          Cache &amp; Revalidation
        </h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          First load: ~2s. Refresh: cached cards fast, Dynamic always ~2s.
        </p>

        <div className="space-y-6">
          <Card
            title="Static (default)"
            note="fetch(url) — cached"
            description={staticData.description}
            fetchedAt={staticData.fetchedAt}
          />
          <Card
            title="Dynamic (no-store)"
            note='fetch(url, { cache: "no-store" }) — not cached'
            description={dynamicData.description}
            fetchedAt={dynamicData.fetchedAt}
          />
          <Card
            title="Time-based (revalidate 5s)"
            note="next: { revalidate: 5 }"
            description={timeBasedData.description}
            fetchedAt={timeBasedData.fetchedAt}
          />
          <Card
            title="On-demand (path)"
            note="cached until revalidatePath()"
            description={onDemandData.description}
            fetchedAt={onDemandData.fetchedAt}
            action={<RevalidatePathButton />}
          />
          <Card
            title="Tag-based"
            note="next: { tags: ['cache-demo'] }"
            description={tagData.description}
            fetchedAt={tagData.fetchedAt}
            action={<RevalidateTagButton />}
          />
        </div>
      </div>
    </main>
  )
}
