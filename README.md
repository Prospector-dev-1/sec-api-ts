# sec-api-ts

> TypeScript SDK for [SEC API](https://sec-api.io) — 20+ million SEC EDGAR filings, XBRL financial statements, Form 10-K, 10-Q, 8-K, Form ADV, Insider Trading, Form 13F, Section Extraction, and Datasets.

[![npm version](https://img.shields.io/npm/v/sec-api-ts.svg)](https://www.npmjs.com/package/sec-api-ts)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Documentation](https://img.shields.io/badge/Docs-sec--api.io-green.svg)](https://sec-api.io/docs)

---

## Features

- **100% Strongly Typed**: Full TypeScript types and interfaces for every endpoint request & response payload.
- **Dual Module Support**: Seamless ESM (`import`) and CommonJS (`require`) outputs with bundled `.d.ts` declarations.
- **Flexible Usage**: Supports OOP instance initialization (`new SecApi('KEY')`), default import (`import SecApi from 'sec-api-ts'`), and standalone named sub-module imports (`import { queryApi } from 'sec-api-ts'`).
- **Comprehensive SEC Coverage**:
  - 20M+ EDGAR Filings & 100M+ Exhibits (1993 – Present) in real-time.
  - XBRL-to-JSON Converter & Structured Financial Statements.
  - 10-K / 10-Q / 8-K Item Section Extraction (e.g. Risk Factors, MD&A).
  - CIK, Ticker, CUSIP & Entity Mapping.
  - Investment Advisers (Form ADV), Insider Trading (Form 3/4/5), Form 144, Form 13F Holdings, Form N-PORT, Form 13D/13G, Form N-PX, Form D, Form C, Regulation A.
  - Executive Compensation, Board Members, Subsidiaries, Audit Fees, SEC Enforcement Actions, AAERs, SRO Filings.
  - Bulk EDGAR Datasets & Auto-resumable download syncs.

---

## Installation

```bash
npm install sec-api-ts
```

---

## Quick Start

### 1. Class-Based Instance (Recommended)

```typescript
import SecApi from 'sec-api-ts';

const secApi = new SecApi('YOUR_API_KEY');

// Search 10-K filings for Apple Inc.
const response = await secApi.queryApi.getFilings({
  query: 'formType:"10-K" AND ticker:AAPL',
  from: 0,
  size: 5,
  sort: [{ filedAt: { order: 'desc' } }],
});

console.log(`Total filings found: ${response.total.value}`);
console.log(`Latest 10-K filing URL: ${response.filings[0].linkToFilingDetails}`);
```

### 2. Standalone Sub-module Imports

```typescript
import { setApiKey, queryApi, downloadApi, xbrlApi } from 'sec-api-ts';

setApiKey('YOUR_API_KEY');

// 1. Search filings
const filings = await queryApi.getFilings({
  query: 'formType:"10-Q" AND ticker:TSLA',
});

// 2. Download filing HTML
const htmlContent = await downloadApi.getFile(filings.filings[0].linkToFilingDetails);

// 3. Convert XBRL filing to JSON financial statements
const financialStatements = await xbrlApi.xbrlToJson({
  accessionNo: filings.filings[0].accessionNo,
});

console.log(financialStatements.StatementsOfIncome);
```

---

## Usage Examples

### SEC Filing Search API (`queryApi`)

Search and filter over 20 million SEC EDGAR filings with real-time updates.

```typescript
import SecApi, { QueryApiResponse } from 'sec-api-ts';

const secApi = new SecApi('YOUR_API_KEY');

const result: QueryApiResponse = await secApi.queryApi.getFilings({
  query: 'formType:"8-K" AND ticker:NVDA',
  from: 0,
  size: 10,
  sort: [{ filedAt: { order: 'desc' } }],
});

result.filings.forEach((filing) => {
  console.log(`${filing.companyName} (${filing.ticker}) - ${filing.filedAt}`);
});
```

### Full-Text Search API (`fullTextSearchApi`)

Search full text across all filings and exhibits.

```typescript
import { fullTextSearchApi, setApiKey } from 'sec-api-ts';

setApiKey('YOUR_API_KEY');

const result = await fullTextSearchApi.getFilings({
  query: '"artificial intelligence" AND "risk factors"',
  formTypes: ['10-K'],
  startDate: '2023-01-01',
  endDate: '2025-12-31',
});

console.log(`Found ${result.total.value} matching filings.`);
```

### XBRL-to-JSON Converter API (`xbrlApi`)

Extract structured Balance Sheets, Income Statements, and Cash Flows into JSON.

```typescript
import { xbrlApi, setApiKey } from 'sec-api-ts';

setApiKey('YOUR_API_KEY');

const jsonStatements = await xbrlApi.xbrlToJson({
  accessionNo: '0000320193-20-000096',
});

console.log('Cover Page:', jsonStatements.CoverPage);
console.log('Income Statement:', jsonStatements.StatementsOfIncome);
console.log('Balance Sheet:', jsonStatements.BalanceSheets);
```

### 10-K / 10-Q Section Extractor API (`extractorApi`)

Extract specific items (e.g. Item 1A Risk Factors, Item 7 MD&A) from filings as clean text or HTML.

```typescript
import { extractorApi, setApiKey } from 'sec-api-ts';

setApiKey('YOUR_API_KEY');

const riskFactors = await extractorApi.getSection(
  'https://www.sec.gov/Archives/edgar/data/1318605/000156459021004599/tsla-10k_20201231.htm',
  '1A', // Item 1A - Risk Factors
  'text' // Return type: 'text' or 'html'
);

console.log(riskFactors.slice(0, 500));
```

### CIK / Ticker / CUSIP Mapping API (`mappingApi`)

Resolve tickers, CIK numbers, CUSIPs, and company names.

```typescript
import { mappingApi, setApiKey } from 'sec-api-ts';

setApiKey('YOUR_API_KEY');

const entity = await mappingApi.resolve('ticker', 'AAPL');
console.log(entity[0]);
// { cik: "0000320193", name: "Apple Inc.", ticker: "AAPL", exchange: "Nasdaq", ... }
```

### Form 3 / 4 / 5 Insider Trading API (`insiderTradingApi`)

Query real-time insider buying and selling transactions.

```typescript
import { insiderTradingApi, setApiKey } from 'sec-api-ts';

setApiKey('YOUR_API_KEY');

const insiderData = await insiderTradingApi.getData({
  query: 'issuer.tradingSymbol:TSLA',
  from: 0,
  size: 5,
});

insiderData.transactions?.forEach((tx) => {
  console.log(`${tx.reportingOwner?.name}: ${tx.nonDerivativeTransactions?.length} transactions`);
});
```

### Form 13F Institutional Holdings API (`form13FHoldingsApi`)

Retrieve institutional manager stock portfolios.

```typescript
import { form13FHoldingsApi, setApiKey } from 'sec-api-ts';

setApiKey('YOUR_API_KEY');

const holdings = await form13FHoldingsApi.getData({
  query: 'cik:0001067983', // Berkshire Hathaway CIK
  from: 0,
  size: 20,
});

console.log(holdings.holdings);
```

### Bulk Datasets Download API (`datasetsApi`)

Download complete EDGAR datasets incrementally to local files.

```typescript
import { datasetsApi, setApiKey } from 'sec-api-ts';

setApiKey('YOUR_API_KEY');

// List all available datasets
await datasetsApi.showAll();

// Download all 10-K filings dataset
await datasetsApi.download('form-10k-content');
```

---

## API Reference & Type Exports

All TypeScript types and interfaces are re-exported at the package root:

```typescript
import {
  QueryApiQuery,
  QueryApiResponse,
  Filing,
  FilingEntity,
  FilingDocument,
  FullTextSearchQuery,
  FullTextSearchResponse,
  FullTextSearchFiling,
  XbrlToJsonOptions,
  XbrlToJsonResponse,
  MappingEntity,
  FormAdvFirmResponse,
  FormAdvIndividualResponse,
  InsiderTradingQuery,
  InsiderTradingResponse,
  Form144Query,
  Form144Response,
  Form13FHoldingsResponse,
  Form8KResponse,
  ExecCompResponse,
  DirectorsBoardMembersResponse,
  FloatResponse,
  SecApiError,
} from 'sec-api-ts';
```

---

## Documentation

For full API specifications and guides, check out the documentation in [`docs/`](./docs/):

- 📘 [Getting Started](./docs/getting-started.md)
- 🔍 [Query API & Full-Text Search](./docs/query-and-search.md)
- 📊 [XBRL-to-JSON & Section Extractor](./docs/xbrl-and-extractor.md)
- 🏢 [Ownership Data & Form ADV](./docs/ownership-and-adv.md)
- 📦 [Bulk Datasets Download](./docs/datasets.md)

For official API field schemas and live API consoles, visit [sec-api.io/docs](https://sec-api.io/docs).

## License

[MIT](LICENSE) © SEC API
