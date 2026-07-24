import https from 'https';
import zlib from 'zlib';
import fs from 'fs';
import path from 'path';
import { SecApiError, SecApiErrorResponse } from './types/index.js';

const MAX_REDIRECTS = 5;
const MAX_RETRIES = 3;

const agent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 15000,
  maxSockets: 10,
  scheduling: 'fifo',
});

interface RequestOptions {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  _redirectCount?: number;
}

interface HttpResponse {
  status: number;
  headers: Record<string, string | string[] | undefined>;
  data: Buffer;
}

const decompressStream = (res: any): any => {
  const encoding = (res.headers['content-encoding'] || '').toLowerCase();
  if (encoding === 'gzip') {
    return res.pipe(zlib.createGunzip());
  }
  if (encoding === 'deflate') {
    return res.pipe(zlib.createInflate());
  }
  if (encoding === 'br') {
    return res.pipe(zlib.createBrotliDecompress());
  }
  return res;
};

const singleRequest = ({
  url,
  method = 'GET',
  headers = {},
  body,
  _redirectCount = 0,
}: RequestOptions): Promise<HttpResponse> => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);

    const req = https.request(
      parsedUrl,
      {
        method,
        headers: { 'Accept-Encoding': 'gzip, deflate', ...headers },
        agent,
      },
      (res) => {
        const status = res.statusCode || 500;

        // follow 3xx redirects
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          if (_redirectCount >= MAX_REDIRECTS) {
            const errRes: SecApiErrorResponse = { status, httpStatus: status, error: 'Too many redirects' };
            const error = new SecApiError('Too many redirects', errRes);
            reject(error);
            return;
          }
          const redirectUrl = new URL(res.headers.location, url).href;
          resolve(
            singleRequest({
              url: redirectUrl,
              method,
              headers,
              body,
              _redirectCount: _redirectCount + 1,
            }),
          );
          return;
        }

        if (status < 200 || status >= 300) {
          const stream = decompressStream(res);
          const chunks: Buffer[] = [];
          stream.on('data', (chunk: Buffer) => chunks.push(chunk));
          stream.on('end', () => {
            const responseText = Buffer.concat(chunks).toString('utf-8');
            let parsed: any = {};
            try {
              parsed = JSON.parse(responseText);
            } catch (_) {
              // not JSON
            }
            const errorMessage = parsed.error || responseText || `HTTP Request failed with status ${status}`;
            const errRes: SecApiErrorResponse = {
              status: parsed.status || status,
              httpStatus: status,
              error: parsed.error || errorMessage,
            };
            const error = new SecApiError(errorMessage, errRes);
            reject(error);
          });
          stream.on('error', (err: Error) => reject(new SecApiError(err.message)));
          return;
        }

        const stream = decompressStream(res);
        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('end', () => {
          resolve({
            status,
            headers: res.headers as Record<string, string | string[] | undefined>,
            data: Buffer.concat(chunks),
          });
        });
        stream.on('error', (err: Error) => reject(new SecApiError(err.message)));
      },
    );

    req.on('error', (err: Error) => reject(new SecApiError(err.message)));

    if (body) {
      req.write(body);
    }

    req.end();
  });
};

const requestWithRetry = async (options: RequestOptions): Promise<HttpResponse> => {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await singleRequest(options);
    } catch (err: any) {
      const is429 = err?.response?.httpStatus === 429;
      const isFreeTierExhausted =
        is429 &&
        typeof err?.response?.error === 'string' &&
        err.response.error.includes('you exceeded the free');
      if (is429 && !isFreeTierExhausted && i < MAX_RETRIES - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new SecApiError('Request retries exceeded');
};

export const getJson = async <T = any>(url: string): Promise<T> => {
  const { data } = await requestWithRetry({ url });
  return JSON.parse(data.toString('utf-8')) as T;
};

export const postJson = async <T = any>({
  url,
  body,
  headers = {},
}: {
  url: string;
  body: any;
  headers?: Record<string, string>;
}): Promise<T> => {
  const { data } = await requestWithRetry({
    url,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  return JSON.parse(data.toString('utf-8')) as T;
};

export const getBuffer = async (
  url: string,
): Promise<{ data: Buffer; headers: Record<string, string | string[] | undefined> }> => {
  const { data, headers } = await requestWithRetry({ url });
  return { data, headers };
};

export const getText = async (url: string): Promise<string> => {
  const { data } = await requestWithRetry({ url });
  return data.toString('utf-8');
};

export const get = async (url: string): Promise<any> => {
  const { data, headers } = await requestWithRetry({ url });
  const contentType = (headers['content-type'] as string) || '';
  if (contentType.includes('json')) {
    return JSON.parse(data.toString('utf-8'));
  }
  return data.toString('utf-8');
};

interface StreamToFileOptions {
  url: string;
  destPath: string;
  _redirectCount?: number;
}

export const streamToFile = ({ url, destPath, _redirectCount = 0 }: StreamToFileOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);

    const req = https.request(parsedUrl, { method: 'GET', agent }, (res) => {
      const status = res.statusCode || 500;

      if (status >= 300 && status < 400 && res.headers.location) {
        res.resume();
        if (_redirectCount >= MAX_REDIRECTS) {
          const errRes: SecApiErrorResponse = { status, httpStatus: status, error: 'Too many redirects' };
          reject(new SecApiError('Too many redirects', errRes));
          return;
        }
        const redirectUrl = new URL(res.headers.location, url).href;
        resolve(
          streamToFile({
            url: redirectUrl,
            destPath,
            _redirectCount: _redirectCount + 1,
          }),
        );
        return;
      }

      if (status < 200 || status >= 300) {
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          const responseText = Buffer.concat(chunks).toString('utf-8');
          let parsed: any = {};
          try {
            parsed = JSON.parse(responseText);
          } catch (_) {
            // not JSON
          }
          const errorMessage = parsed.error || responseText;
          const errRes: SecApiErrorResponse = {
            status: parsed.status || status,
            httpStatus: status,
            error: parsed.error || errorMessage,
          };
          reject(new SecApiError(errorMessage, errRes));
        });
        res.on('error', (err: Error) => reject(new SecApiError(err.message)));
        return;
      }

      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(() => resolve());
      });
      fileStream.on('error', (err: Error) => reject(new SecApiError(err.message)));
      res.on('error', (err: Error) => reject(new SecApiError(err.message)));
    });

    req.on('error', (err: Error) => reject(new SecApiError(err.message)));
    req.end();
  });
};

interface DownloadToFileOptions {
  url: string;
  destPath: string;
  expectedSize?: number;
}

export const downloadToFile = async ({
  url,
  destPath,
  expectedSize,
}: DownloadToFileOptions): Promise<string> => {
  if (fs.existsSync(destPath)) {
    if (
      expectedSize === undefined ||
      expectedSize === null ||
      fs.statSync(destPath).size === expectedSize
    ) {
      return destPath;
    }
  }

  const dir = path.dirname(destPath);
  if (dir && dir !== '.') {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tmpPath = destPath + '.tmp';

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      await streamToFile({ url, destPath: tmpPath });
      fs.renameSync(tmpPath, destPath);
      return destPath;
    } catch (error: any) {
      if (fs.existsSync(tmpPath)) {
        try {
          fs.unlinkSync(tmpPath);
        } catch (_) {
          // ignore
        }
      }
      if (error?.response?.httpStatus === 429 && attempt < MAX_RETRIES - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
        continue;
      }
      throw error;
    }
  }
  throw new SecApiError('Download failed');
};
