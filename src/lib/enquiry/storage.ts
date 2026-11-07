import fs from "node:fs/promises";
import path from "node:path";
import { EnquiryInput } from "@/lib/validation/schemas";

export interface StoredEnquiry extends EnquiryInput {
  enquiryId: string;
  createdAt: string;
  status: "pending" | "processed" | "archived";
}

const DATA_DIR = path.join(process.cwd(), ".data");
const ENQUIRIES_FILE = path.join(DATA_DIR, "enquiries.json");

let writeQueue: Promise<void> = Promise.resolve();

export async function persistOrderEnquiry(enquiry: StoredEnquiry): Promise<void> {
  const next = writeQueue.catch(() => {}).then(() => doPersistOrderEnquiry(enquiry));
  writeQueue = next;
  return next;
}

async function doPersistOrderEnquiry(enquiry: StoredEnquiry): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    let existing: StoredEnquiry[] = [];
    try {
      const fileData = await fs.readFile(ENQUIRIES_FILE, "utf-8");
      existing = JSON.parse(fileData);
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException)?.code !== "ENOENT") {
        throw err;
      }
      // File does not exist yet (ENOENT) -> start empty
    }

    existing.unshift(enquiry);

    // Keep most recent 500 enquiries
    if (existing.length > 500) {
      existing = existing.slice(0, 500);
    }

    const tmpFile = `${ENQUIRIES_FILE}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2, 6)}.tmp`;
    await fs.writeFile(tmpFile, JSON.stringify(existing, null, 2), "utf-8");
    await fs.rename(tmpFile, ENQUIRIES_FILE);
  } catch (error) {
    console.error("Failed to persist order enquiry record to disk:", error);
    throw new Error("Persistence error saving order enquiry");
  }
}

