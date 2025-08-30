import { Alert } from 'react-native';
import { router } from 'expo-router';
import { DocumentName, DocumentData } from '@/hooks/useDocument';
import { BACKEND_URL } from "@/constants/Config";

// Helper function to fetch document data
export const fetchDocumentData = async (docName: DocumentName): Promise<DocumentData> => {
  try {
    const response = await fetch(`${BACKEND_URL}/public/${docName}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${docName} document`);
    }
    const data: DocumentData = await response.json();
    return data;
  } catch (error) {
    console.error(`[fetchDocumentData] Error fetching ${docName}:`, error);
    throw error;
  }
};

// Helper to load a document and navigate
export const openDocument = async (docName: DocumentName) => {
  try {
    const doc = await fetchDocumentData(docName);
    router.push({
      pathname: '/account/info-view',
      params: { data: JSON.stringify(doc) }, // pass JSON as string
    });
  } catch (error) {
    Alert.alert('Error', `Failed to load ${docName}.`);
  }
};
