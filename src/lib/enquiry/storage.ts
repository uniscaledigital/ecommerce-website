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

export async function persistOrderEnquiry(enquiry: StoredEnquiry): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    let existing: StoredEnquiry[] = [];
    try {
      const fileData = await fs.readFile(ENQUIRIES_FILE, "utf-8");
      existing = JSON.parse(fileData);
    } catch {
      // File does not exist yet or empty
    }

    existing.unshift(enquiry);

    // Keep most recent 500 enquiries
    if (existing.length > 500) {
      existing = existing.slice(0, 500);
    }

    await fs.writeFile(ENQUIRIES_FILE, JSON.stringify(existing, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to persist order enquiry record to disk:", error);
    throw new Error("Persistence error saving order enquiry");
  }
}

