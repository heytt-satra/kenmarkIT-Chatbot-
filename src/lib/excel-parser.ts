import * as XLSX from 'xlsx';
import { KnowledgeEntry } from '@prisma/client';

interface ExcelRow {
  Category?: string;
  Question?: string;
  Answer?: string;
  Source?: string;
  [key: string]: string | undefined;
}

// Helper type to match the expected return structure (excluding DB fields)
export type ParsedKnowledgeEntry = Omit<KnowledgeEntry, 'id' | 'createdAt' | 'embedding'>;

export async function parseExcel(buffer: Buffer): Promise<ParsedKnowledgeEntry[]> {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  if (workbook.SheetNames.length === 0) return [];

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Use 'unknown' first to safely cast
  const data = XLSX.utils.sheet_to_json(sheet) as unknown[];

  const entries: ParsedKnowledgeEntry[] = [];

  // Iterate safely
  for (const row of data) {
    // Cast row to ExcelRow for property access
    const excelRow = row as ExcelRow;

    if (excelRow.Question && excelRow.Answer) {
      entries.push({
        category: excelRow.Category || 'General',
        question: excelRow.Question,
        answer: excelRow.Answer,
        source: excelRow.Source || 'Uploaded File'
      });
    }
  }
  return entries;
}
