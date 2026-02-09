import { getSlowData } from "./api"
import Card from "./Card"

export default async function SlowSection() {
  const data = await getSlowData()
  return <Card title="Slow Data" description="Takes longer (~2s)" data={data.message} />
}
