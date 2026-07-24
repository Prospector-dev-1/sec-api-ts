# SEC Filing Search & Full-Text Search Guide

## Query API (`queryApi`)

Search over 20+ million SEC EDGAR filings (10-K, 10-Q, 8-K, 13F, S-1, etc.) since 1993 in real time using Lucene query syntax.

### Basic Query

```typescript
import SecApi from 'sec-api-ts';

const secApi = new SecApi('YOUR_API_KEY');

const response = await secApi.queryApi.getFilings({
  query: 'formType:"10-K" AND ticker:MSFT',
  from: 0,
  size: 10,
  sort: [{ filedAt: { order: 'desc' } }],
});

console.log(`Found ${response.total.value} filings.`);
response.filings.forEach((filing) => {
  console.log(`${filing.formType} - ${filing.filedAt} - ${filing.linkToFilingDetails}`);
});
```

### Lucene Query Syntax Examples

| Purpose | Query String |
| --- | --- |
| Search by Ticker & Form Type | `ticker:AAPL AND formType:"10-Q"` |
| Date Range Filter | `filedAt:[2024-01-01 TO 2024-12-31]` |
| Multiple Form Types | `formType:("10-K" OR "10-Q") AND cik:0000320193` |
| Exclude Amended Filings | `formType:"8-K" NOT formType:"8-K/A"` |

---

## Full-Text Search API (`fullTextSearchApi`)

Search text content inside millions of EDGAR filings and attachments.

### Example

```typescript
import { fullTextSearchApi, setApiKey } from 'sec-api-ts';

setApiKey('YOUR_API_KEY');

const response = await fullTextSearchApi.getFilings({
  query: '"generative AI" OR "large language models"',
  formTypes: ['10-K', '10-Q'],
  startDate: '2023-01-01',
  endDate: '2025-12-31',
  from: 0,
  size: 5,
});

response.filings.forEach((filing) => {
  console.log(`Filing: ${filing.companyName}`);
  filing.matches?.forEach((match) => {
    console.log(`Snippet: ...${match.text}...`);
  });
});
```
