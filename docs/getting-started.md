# Getting Started with sec-api-ts

`sec-api-ts` is a TypeScript SDK for interacting with [SEC API](https://sec-api.io). It provides strong typing, autocomplete, connection pooling, rate-limit retry logic, and full ESM/CommonJS compatibility.

## Installation

```bash
npm install sec-api-ts
```

Or using `yarn` / `pnpm`:

```bash
yarn add sec-api-ts
pnpm add sec-api-ts
```

## API Key Setup

Get your SEC API key at [sec-api.io](https://sec-api.io/signup).

### Option 1: Client Instance (Recommended)

Instantiating `SecApi` creates an isolated client instance without relying on global state.

```typescript
import SecApi from 'sec-api-ts';

const secApi = new SecApi('YOUR_API_KEY');

const filings = await secApi.queryApi.getFilings({
  query: 'ticker:AAPL AND formType:"10-K"',
});
```

### Option 2: Global Module Configuration

If you prefer module-level functions similar to traditional Node SDKs:

```typescript
import { setApiKey, queryApi } from 'sec-api-ts';

setApiKey('YOUR_API_KEY');

const filings = await queryApi.getFilings({
  query: 'ticker:TSLA AND formType:"10-Q"',
});
```

## Error Handling

All network or API errors throw an instance of `SecApiError`. You can inspect HTTP status codes and error messages directly:

```typescript
import SecApi, { SecApiError } from 'sec-api-ts';

const secApi = new SecApi('YOUR_API_KEY');

try {
  const result = await secApi.queryApi.getFilings({
    query: 'ticker:INVALID',
  });
} catch (error) {
  if (error instanceof SecApiError) {
    console.error('HTTP Status:', error.response?.httpStatus);
    console.error('Error Message:', error.response?.error);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## TypeScript Generics

Every API method allows passing custom response types if you wish to extend or narrow response objects:

```typescript
import SecApi, { Filing } from 'sec-api-ts';

interface CustomQueryResponse {
  total: { value: number; relation: string };
  filings: Array<Filing & { customMeta?: string }>;
}

const secApi = new SecApi('YOUR_API_KEY');

const response = await secApi.queryApi.getFilings<CustomQueryResponse>({
  query: 'formType:"10-K"',
});
```
