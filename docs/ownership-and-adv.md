# Ownership Data & Investment Advisers Guide

## Form ADV API (`formAdvApi`)

Query Form ADV investment advisor firms, individual advisers, direct/indirect owners, private funds, and brochures.

```typescript
import SecApi from 'sec-api-ts';

const secApi = new SecApi('YOUR_API_KEY');

// Query Investment Adviser Firms
const firms = await secApi.formAdvApi.getFirms({
  query: 'legalName:"Bridgewater Associates"',
});

console.log(firms.firms);

// Query Direct Owners for a CRD
const directOwners = await secApi.formAdvApi.getDirectOwners('104518');
console.log(directOwners);
```

---

## Form 3/4/5 Insider Trading API (`insiderTradingApi`)

Track corporate insider purchases and sales in real time.

```typescript
import SecApi from 'sec-api-ts';

const secApi = new SecApi('YOUR_API_KEY');

const transactions = await secApi.insiderTradingApi.getData({
  query: 'issuer.tradingSymbol:NVDA AND filedAt:[2024-01-01 TO 2024-12-31]',
  from: 0,
  size: 10,
});

transactions.transactions.forEach((tx) => {
  console.log(`Filer: ${tx.reportingOwner?.name}`);
  console.log(`Officer Title: ${tx.reportingOwner?.officerTitle}`);
});
```

---

## Form 13F Holdings API (`form13FHoldingsApi`)

Retrieve quarterly portfolio holdings disclosed by institutional investment managers.

```typescript
import SecApi from 'sec-api-ts';

const secApi = new SecApi('YOUR_API_KEY');

const holdings = await secApi.form13FHoldingsApi.getData({
  query: 'cik:0001067983', // Berkshire Hathaway CIK
  from: 0,
  size: 25,
});

holdings.holdings.forEach((holding) => {
  console.log(`${holding.nameOfIssuer} (${holding.titleOfClass}): Value $${holding.value}`);
});
```
