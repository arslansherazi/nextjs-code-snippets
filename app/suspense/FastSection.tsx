import { getFastData } from "./api"
import Card from "./Card"

export default async function FastSection() {
  const data = await getFastData()
  return <Card title="Fast Data" description="Loads quickly (~0.5s)" data={data.message} />
}
