# XBRL Converter, Section Extractor & Downloads

## XBRL-to-JSON Converter API (`xbrlApi`)

Convert XBRL EDGAR financial disclosures into structured JSON Balance Sheets, Income Statements, and Cash Flow Statements.

```typescript
import SecApi from 'sec-api-ts';

const secApi = new SecApi('YOUR_API_KEY');

const financialStatements = await secApi.xbrlApi.xbrlToJson({
  accessionNo: '0000320193-20-000096',
});

// Access Income Statement items
console.log(financialStatements.StatementsOfIncome);
// Access Balance Sheet items
console.log(financialStatements.BalanceSheets);
```

---

## 10-K / 10-Q Section Extractor API (`extractorApi`)

Extract specific items (Item 1A Risk Factors, Item 7 MD&A, etc.) from SEC filings as text or HTML.

```typescript
import SecApi from 'sec-api-ts';

const secApi = new SecApi('YOUR_API_KEY');

const riskFactorsText = await secApi.extractorApi.getSection(
  'https://www.sec.gov/Archives/edgar/data/1318605/000156459021004599/tsla-10k_20201231.htm',
  '1A', // Item 1A
  'text' // Return format
);

console.log(riskFactorsText);
```

---

## Download API (`downloadApi`)

Download raw filing contents and exhibits with rate limiting and automatic decompression.

```typescript
import SecApi from 'sec-api-ts';

const secApi = new SecApi('YOUR_API_KEY');

const htmlContent = await secApi.downloadApi.getFile(
  'https://www.sec.gov/Archives/edgar/data/1318605/000162828025045968/tsla-20250930.htm'
);

console.log(htmlContent.slice(0, 1000));
```
