import { pinata } from "@/lib/config";
import { NextResponse, NextRequest } from "next/server";
import sharp from "sharp";

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for raw FormData handling
  },
};

// Define constants
const MAX_FILE_SIZE_MB = 10;
const MAX_IMAGE_WIDTH = 1200;
const MAX_IMAGE_HEIGHT = 720;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();

    // Extract file from FormData
    const file = data.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit.` },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}.` },
        { status: 400 }
      );
    }

    // Convert file to a Buffer for processing
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Resize the image using sharp
    const resizedBuffer = await sharp(fileBuffer)
      .resize({
        width: MAX_IMAGE_WIDTH,
        height: MAX_IMAGE_HEIGHT,
        fit: "inside", // Preserve aspect ratio
        withoutEnlargement: true, // Do not enlarge smaller images
      })
      .toBuffer();

    // Convert the processed image back to a File-like object
    const resizedFile = new File([resizedBuffer], file.name, { type: file.type });

    // Upload the resized file to Pinata
    const uploadData = await pinata.upload.file(resizedFile);
    if (!uploadData || !uploadData.IpfsHash) {
      throw new Error("Failed to upload to Pinata.");
    }

    const url = await pinata.gateways.convert(uploadData.IpfsHash);
    return NextResponse.json(url, { status: 200 });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
