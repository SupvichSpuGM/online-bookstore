import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const SLIP_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "slips");

function getExtension(fileName: string | undefined, fallback: string) {
  const ext = path.extname(fileName || "").toLowerCase();
  if (ext) return ext;
  return fallback;
}

async function writeSlipBuffer(buffer: Buffer, fileName: string | undefined) {
  await fs.mkdir(SLIP_UPLOAD_DIR, { recursive: true });

  const extension = getExtension(fileName, ".png");
  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const destination = path.join(SLIP_UPLOAD_DIR, filename);

  await fs.writeFile(destination, buffer);
  return `/uploads/slips/${filename}`;
}

export async function saveSlipImage(input: File | string | null | undefined) {
  if (!input) return null;

  if (typeof input === "string") {
    const rawValue = input.trim();
    if (!rawValue) return null;

    if (rawValue.startsWith("/uploads/") || rawValue.startsWith("http://") || rawValue.startsWith("https://")) {
      return rawValue;
    }

    if (rawValue.startsWith("data:image/")) {
      const match = rawValue.match(/^data:(image\/[-a-zA-Z0-9+.]+);base64,(.+)$/);
      if (!match) return null;

      const buffer = Buffer.from(match[2], "base64");
      return writeSlipBuffer(buffer, `slip${path.extname(match[1]) || ".png"}`);
    }

    return rawValue;
  }

  if (typeof File !== "undefined" && input instanceof File) {
    const buffer = Buffer.from(await input.arrayBuffer());
    return writeSlipBuffer(buffer, input.name || "slip");
  }

  return null;
}
