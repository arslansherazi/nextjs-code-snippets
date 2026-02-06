"use server"

import { revalidatePath, revalidateTag } from "next/cache"

export async function revalidateCachePage() {
  revalidatePath("/cache")
}

export async function revalidateByTag() {
  revalidateTag("cache-demo", "max")
  revalidatePath("/cache")
}
