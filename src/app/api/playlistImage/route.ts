import { NextResponse } from "next/server";
import { uploadFileS3 } from "../s3-upload/route";

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const imageFile = formData.get('image') as File

    if (!imageFile)
      return NextResponse.json({ error: 'Image is required' }, { status: 400 })

    const imgArrayBuffer = await imageFile.arrayBuffer()
    const imgBuffer = new Uint8Array(imgArrayBuffer)

    const imgFileName = await uploadFileS3(imgBuffer, imageFile.name, imageFile.type)

    return NextResponse.json({ imgFileName })
  } catch (error) {
    return NextResponse.json({ error })
  }
}
