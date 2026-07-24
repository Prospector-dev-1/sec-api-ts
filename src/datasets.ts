import path from 'path';
import { config } from './config.js';
import { getJson, downloadToFile } from './http-client.js';
import { DatasetDetail, DatasetDownloadOptions, DatasetMetadata } from './types/index.js';

const DEFAULT_DOWNLOAD_DIR = './sec-api-datasets';

export class DatasetsApi {
  private apiKey: string;

  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }

  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  public async getAll(): Promise<DatasetMetadata[]> {
    return getJson<DatasetMetadata[]>(config.datasetsApi.indexEndpoint);
  }

  public async showAll(): Promise<DatasetMetadata[]> {
    const datasets = await this.getAll();
    const idCol = 50;
    const nameCol = 55;
    const fmtCol = 10;
    const sizeCol = 12;
    console.log('');
    console.log(
      '  ' +
        'ID'.padEnd(idCol) +
        ' ' +
        'Name'.padEnd(nameCol) +
        ' ' +
        'Format'.padEnd(fmtCol) +
        ' ' +
        'Size'.padStart(sizeCol),
    );
    console.log(
      '  ' +
        '─'.repeat(idCol) +
        ' ' +
        '─'.repeat(nameCol) +
        ' ' +
        '─'.repeat(fmtCol) +
        ' ' +
        '─'.repeat(sizeCol),
    );
    datasets.forEach((ds) => {
      const total = ds.totalSize || 0;
      const sizeStr =
        total >= 1_000_000_000
          ? (total / 1_000_000_000).toFixed(1) + ' GB'
          : (total / 1_000_000).toFixed(1) + ' MB';
      const id = (ds.datasetIdInUrl || '').padEnd(idCol);
      const name = (ds.name || '').slice(0, nameCol).padEnd(nameCol);
      const fmt = (ds.containerFormat || '').padEnd(fmtCol);
      console.log('  ' + id + ' ' + name + ' ' + fmt + ' ' + sizeStr.padStart(sizeCol));
    });
    console.log('');
    console.log(
      '  ' +
        datasets.length +
        ' datasets available. Browse all at https://sec-api.io/datasets',
    );
    console.log('');
    return datasets;
  }

  public async getDetails(name: string): Promise<DatasetDetail> {
    const url = `${config.datasetsApi.detailEndpoint}/${name}.json`;
    try {
      return await getJson<DatasetDetail>(url);
    } catch (_) {
      const all = await this.getAll();
      const available = all.map((d) => d.datasetIdInUrl).join(', ');
      throw new Error(`Dataset "${name}" not found. Available datasets: ${available}`);
    }
  }

  public async showDetails(name: string): Promise<DatasetDetail> {
    const ds = await this.getDetails(name);
    const sizeMb = (ds.totalSize || 0) / 1_000_000;
    const description = (ds.description || '').slice(0, 100);
    console.log('  Name:             ' + ds.name);
    console.log('  Description:      ' + description + '...');
    console.log('  Updated:          ' + (ds.updatedAt || 'N/A'));
    console.log('  Earliest data:    ' + (ds.earliestSampleDate || 'N/A'));
    console.log('  Form types:       ' + (ds.formTypes || []).join(', '));
    console.log('  Format:           ' + (ds.containerFormat || 'N/A'));
    console.log(
      '  Total records:    ' +
        (ds.totalRecords ? ds.totalRecords.toLocaleString() : 'N/A'),
    );
    console.log('  Total size:       ' + sizeMb.toFixed(1) + ' MB');
    console.log('  Containers:       ' + (ds.containers || []).length);
    return ds;
  }

  private appendToken(url: string, apiKey: string): string {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}token=${apiKey}`;
  }

  public async download(
    nameOrOptions: string | DatasetDownloadOptions,
  ): Promise<string | string[]> {
    const options: DatasetDownloadOptions =
      typeof nameOrOptions === 'string'
        ? { name: nameOrOptions }
        : nameOrOptions || { name: '' };
    const { name, path: downloadPath, strategy = 'containers' } = options;
    const dataset = await this.getDetails(name);

    if (strategy === 'zip') {
      const targetDir = downloadPath || DEFAULT_DOWNLOAD_DIR;
      const url = this.appendToken(dataset.datasetDownloadUrl || '', this.apiKey);
      const dest = path.join(targetDir, `${name}.zip`);
      return downloadToFile({
        url,
        destPath: dest,
        expectedSize: dataset.totalSize,
      });
    }

    const targetDir = downloadPath || path.join(DEFAULT_DOWNLOAD_DIR, name);
    const containers = dataset.containers || [];
    const downloaded: string[] = [];

    for (const container of containers) {
      const url = this.appendToken(container.downloadUrl, this.apiKey);
      const dest = path.join(targetDir, container.key);
      await downloadToFile({
        url,
        destPath: dest,
        expectedSize: container.size,
      });
      downloaded.push(dest);
    }

    return downloaded;
  }

  public async sync(
    nameOrOptions: string | DatasetDownloadOptions,
  ): Promise<string | string[]> {
    return this.download(nameOrOptions);
  }
}

// Module-level default singleton instance
const datasetsSingleton = new DatasetsApi();

export const setApiKey = (apiKey: string) => datasetsSingleton.setApiKey(apiKey);
export const getAll = () => datasetsSingleton.getAll();
export const showAll = () => datasetsSingleton.showAll();
export const getDetails = (name: string) => datasetsSingleton.getDetails(name);
export const showDetails = (name: string) => datasetsSingleton.showDetails(name);
export const download = (nameOrOptions: string | DatasetDownloadOptions) =>
  datasetsSingleton.download(nameOrOptions);
export const sync = (nameOrOptions: string | DatasetDownloadOptions) =>
  datasetsSingleton.sync(nameOrOptions);
