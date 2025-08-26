import { BACKEND_URL } from "@/constants/Config";

export type DocumentSection = {
  subtitle: string;
  description: string;
};

export type DocumentData = {
  title: string;
  description: string;
  updatedOn: string;
  sections: DocumentSection[];
};

/**
 * Fetches a JSON document (terms, privacy, manual) from the backend public folder.
 * 
 * @param docName The name of the JSON file (e.g., "terms", "privacy", "manual").
 * @returns The parsed document data.
 */
export async function fetchDocument(docName: "terms-mobileApp" | "privacyPolicy-mobileApp" | "manual-mobileApp"): Promise<DocumentData> {
  try {
    const response = await fetch(`${BACKEND_URL}/public/${docName}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${docName} document`);
    }
    const data: DocumentData = await response.json();
    return data;
  } catch (error) {
    console.error(`[fetchDocument] Error fetching ${docName}:`, error);
    throw error;
  }
}
