import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  },
})

export async function uploadFileS3(fileBuffer: Uint8Array, fileName: string, fileType: string) {
  const isImage = fileType.split('/')[0].toLowerCase() === 'image'
  const fileKey = isImage ? `images/${Date.now()}-${fileName}` : `songs/${Date.now()}-${fileName}`

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: fileType,
  })

  await s3Client.send(command)
  return fileKey.split('/')[1]
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const songFile = formData.get('song') as File

    if (!imageFile || !songFile)
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })

    const imgArrayBuffer = await imageFile.arrayBuffer()
    const imgBuffer = new Uint8Array(imgArrayBuffer)

    const songArrayBuffer = await songFile.arrayBuffer()
    const songBuffer = new Uint8Array(songArrayBuffer)

    const imgFileName = await uploadFileS3(imgBuffer, imageFile.name, imageFile.type)
    const songFileName = await uploadFileS3(songBuffer, songFile.name, songFile.type)

    return NextResponse.json({ imgFileName, songFileName })
  } catch (error) {
    return NextResponse.json({ error })
  }
}