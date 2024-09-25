import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import { join } from "node:path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const imageFile = formData.get("image") as File

    const imgArrayBuffer = await imageFile.arrayBuffer()
    const imgBuffer = new Uint8Array(imgArrayBuffer)

    const imgFileName = `${Date.now()}${imageFile.name}`
    const imgPath = join(process.cwd(), 'public', imgFileName)

    await fs.writeFile(imgPath, imgBuffer)

    // revalidatePath('/playlist')
    return NextResponse.json({ imgFileName })
  } catch (e) {
    return NextResponse.json({ status: "fail", error: e })
  }
}
