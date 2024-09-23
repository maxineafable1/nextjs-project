import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import { join } from "node:path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const imageFile = formData.get("image") as File
    const songFile = formData.get("song") as File

    const imgArrayBuffer = await imageFile.arrayBuffer()
    const imgBuffer = new Uint8Array(imgArrayBuffer)

    const imgFileName = `${Date.now()}${imageFile.name}`
    const imgPath = join(process.cwd(), 'public', imgFileName)

    const songArrayBuffer = await songFile.arrayBuffer()
    const songBuffer = new Uint8Array(songArrayBuffer)

    const songFileName = `${Date.now()}${songFile.name}`
    const songPath = join(process.cwd(), 'public', songFileName)

    await fs.writeFile(imgPath, imgBuffer)
    await fs.writeFile(songPath, songBuffer)

    revalidatePath("/")
    return NextResponse.json({ imgFileName, songFileName })
  } catch (e) {
    return NextResponse.json({ status: "fail", error: e })
  }
}
