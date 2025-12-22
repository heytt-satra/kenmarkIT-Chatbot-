import * as XLSX from 'xlsx';

export interface KnowledgeItem {
  category: string;
  question: string;
  answer: string;
  source: string;
}

export async function parseExcel(buffer: Buffer, filename: string): Promise<KnowledgeItem[]> {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const items: KnowledgeItem[] = [];

  workbook.SheetNames.forEach((sheetName: string) => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    if (!jsonData || jsonData.length === 0) return;

    // Assuming first row is header. Find indices case-insensitively
    const header = jsonData[0];
    if (!header) return;

    const catIdx = header.findIndex((h: any) => h?.toString().toLowerCase().trim() === 'category');
    const qIdx = header.findIndex((h: any) => h?.toString().toLowerCase().trim() === 'question');
    const aIdx = header.findIndex((h: any) => h?.toString().toLowerCase().trim() === 'answer');

    // If columns are missing, skip this sheet (or try to process if some exist?)
    // Requirement implies strict structure, so skipping is safer to avoid garbage data.
    if (qIdx === -1 || aIdx === -1) {
        console.warn(`Sheet "${sheetName}" missing 'Question' or 'Answer' column. Skipping.`);
        return; 
    }

    for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row) continue;
        
        const category = catIdx !== -1 ? row[catIdx]?.toString() || 'General' : 'General';
        const question = row[qIdx]?.toString();
        const answer = row[aIdx]?.toString();

        if (question && answer) {
            items.push({
                category: category.trim(),
                question: question.trim(),
                answer: answer.trim(),
                source: filename
            });
        }
    }
  });

  return items;
}
