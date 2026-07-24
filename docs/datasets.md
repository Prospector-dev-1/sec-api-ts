# Bulk Datasets API Guide

The `datasetsApi` allows downloading complete historical EDGAR filing datasets (1993 – Present) directly to local directory structures.

## Listing Available Datasets

```typescript
import { datasetsApi } from 'sec-api-ts';

// Pretty print all available datasets to stdout
const datasets = await datasetsApi.showAll();

// Or get dataset metadata programmatically
const details = await datasetsApi.getDetails('form-10k-content');
console.log(`Dataset size: ${details.totalSize} bytes`);
```

## Downloading a Dataset

You can download datasets by name using incremental container file sync (default) or as a single zip archive.

```typescript
import { datasetsApi, setApiKey } from 'sec-api-ts';

setApiKey('YOUR_API_KEY');

// 1. Download container files incrementally to ./sec-api-datasets/form-10k-content
await datasetsApi.download('form-10k-content');

// 2. Download as a single ZIP archive to custom directory
await datasetsApi.download({
  name: 'form-13f-holdings',
  path: './downloads',
  strategy: 'zip',
});
```

## Syncing Datasets

The `sync` method is an alias for `download` that checks remote container file sizes and skips any files already downloaded locally.

```typescript
import { datasetsApi, setApiKey } from 'sec-api-ts';

setApiKey('YOUR_API_KEY');

// Synchronize local dataset with latest remote changes
await datasetsApi.sync('form-8k-content');
```
