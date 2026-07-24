// src/config.ts
var config = {
  queryApi: {
    endpoint: "https://api.sec-api.io"
  },
  fullTextApi: {
    endpoint: "https://api.sec-api.io/full-text-search"
  },
  downloadApiV1: {
    endpoint: "https://archive.sec-api.io"
  },
  downloadApiV2: {
    endpoint: "https://edgar-mirror.sec-api.io"
  },
  renderApi: {
    endpoint: "https://api.sec-api.io/filing-reader"
  },
  downloadApi: {
    endpoint: "https://archive.sec-api.io/"
  },
  xbrlToJsonApi: {
    endpoint: "https://api.sec-api.io/xbrl-to-json"
  },
  extractorApi: {
    endpoint: "https://api.sec-api.io/extractor"
  },
  pdfGeneratorApi: {
    endpoint: "https://api.sec-api.io/filing-reader"
  },
  formAdvApi: {
    endpoint: "https://api.sec-api.io/form-adv"
  },
  insiderTradingApi: {
    endpoint: "https://api.sec-api.io/insider-trading"
  },
  form144Api: {
    endpoint: "https://api.sec-api.io/form-144"
  },
  form13FHoldingsApi: {
    endpoint: "https://api.sec-api.io/form-13f/holdings"
  },
  form13FCoverPagesApi: {
    endpoint: "https://api.sec-api.io/form-13f/cover-pages"
  },
  formNportApi: {
    endpoint: "https://api.sec-api.io/form-nport"
  },
  form13DGApi: {
    endpoint: "https://api.sec-api.io/form-13d-13g"
  },
  formNcenApi: {
    endpoint: "https://api.sec-api.io/form-ncen"
  },
  formNpxApi: {
    endpoint: "https://api.sec-api.io/form-npx"
  },
  formS1424B4Api: {
    endpoint: "https://api.sec-api.io/form-s1-424b4"
  },
  formDApi: {
    endpoint: "https://api.sec-api.io/form-d"
  },
  formCApi: {
    endpoint: "https://api.sec-api.io/form-c"
  },
  regASearchApi: {
    endpoint: "https://api.sec-api.io/reg-a/search"
  },
  form1AApi: {
    endpoint: "https://api.sec-api.io/reg-a/form-1a"
  },
  form1KApi: {
    endpoint: "https://api.sec-api.io/reg-a/form-1k"
  },
  form1ZApi: {
    endpoint: "https://api.sec-api.io/reg-a/form-1z"
  },
  form8KApi: {
    endpoint: "https://api.sec-api.io/form-8k"
  },
  execCompApi: {
    endpoint: "https://api.sec-api.io/compensation"
  },
  directorsBoardMembersApi: {
    endpoint: "https://api.sec-api.io/directors-and-board-members"
  },
  floatApi: {
    endpoint: "https://api.sec-api.io/float"
  },
  subsidiaryApi: {
    endpoint: "https://api.sec-api.io/subsidiaries"
  },
  secEnforcementActionsApi: {
    endpoint: "https://api.sec-api.io/sec-enforcement-actions"
  },
  secLitigationsApi: {
    endpoint: "https://api.sec-api.io/sec-litigation-releases"
  },
  secAdminProceedingsApi: {
    endpoint: "https://api.sec-api.io/sec-administrative-proceedings"
  },
  aaerApi: {
    endpoint: "https://api.sec-api.io/aaers"
  },
  sroApi: {
    endpoint: "https://api.sec-api.io/sro"
  },
  mappingApi: {
    endpoint: "https://api.sec-api.io/mapping"
  },
  edgarEntitiesApi: {
    endpoint: "https://api.sec-api.io/edgar-entities"
  },
  auditFeesApi: {
    endpoint: "https://api.sec-api.io/audit-fees"
  },
  edgarIndexIngestionLogApi: {
    endpoint: "https://api.sec-api.io/edgar-index/ingestion-log"
  },
  datasetsApi: {
    indexEndpoint: "https://api.sec-api.io/bulk/indicies/master/index.json",
    detailEndpoint: "https://api.sec-api.io/datasets"
  }
};

// src/http-client.ts
import https from "https";
import zlib from "zlib";
import fs from "fs";
import path from "path";

// src/types/index.ts
var SecApiError = class extends Error {
  response;
  constructor(message, response) {
    super(message);
    this.name = "SecApiError";
    this.response = response;
  }
};

// src/http-client.ts
var MAX_REDIRECTS = 5;
var MAX_RETRIES = 3;
var agent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 15e3,
  maxSockets: 10,
  scheduling: "fifo"
});
var decompressStream = (res) => {
  const encoding = (res.headers["content-encoding"] || "").toLowerCase();
  if (encoding === "gzip") {
    return res.pipe(zlib.createGunzip());
  }
  if (encoding === "deflate") {
    return res.pipe(zlib.createInflate());
  }
  if (encoding === "br") {
    return res.pipe(zlib.createBrotliDecompress());
  }
  return res;
};
var singleRequest = ({
  url,
  method = "GET",
  headers = {},
  body,
  _redirectCount = 0
}) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const req = https.request(
      parsedUrl,
      {
        method,
        headers: { "Accept-Encoding": "gzip, deflate", ...headers },
        agent
      },
      (res) => {
        const status = res.statusCode || 500;
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          if (_redirectCount >= MAX_REDIRECTS) {
            const errRes = { status, httpStatus: status, error: "Too many redirects" };
            const error = new SecApiError("Too many redirects", errRes);
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
              _redirectCount: _redirectCount + 1
            })
          );
          return;
        }
        if (status < 200 || status >= 300) {
          const stream2 = decompressStream(res);
          const chunks2 = [];
          stream2.on("data", (chunk) => chunks2.push(chunk));
          stream2.on("end", () => {
            const responseText = Buffer.concat(chunks2).toString("utf-8");
            let parsed = {};
            try {
              parsed = JSON.parse(responseText);
            } catch (_) {
            }
            const errorMessage = parsed.error || responseText || `HTTP Request failed with status ${status}`;
            const errRes = {
              status: parsed.status || status,
              httpStatus: status,
              error: parsed.error || errorMessage
            };
            const error = new SecApiError(errorMessage, errRes);
            reject(error);
          });
          stream2.on("error", (err) => reject(new SecApiError(err.message)));
          return;
        }
        const stream = decompressStream(res);
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => {
          resolve({
            status,
            headers: res.headers,
            data: Buffer.concat(chunks)
          });
        });
        stream.on("error", (err) => reject(new SecApiError(err.message)));
      }
    );
    req.on("error", (err) => reject(new SecApiError(err.message)));
    if (body) {
      req.write(body);
    }
    req.end();
  });
};
var requestWithRetry = async (options) => {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await singleRequest(options);
    } catch (err) {
      const is429 = err?.response?.httpStatus === 429;
      const isFreeTierExhausted = is429 && typeof err?.response?.error === "string" && err.response.error.includes("you exceeded the free");
      if (is429 && !isFreeTierExhausted && i < MAX_RETRIES - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new SecApiError("Request retries exceeded");
};
var getJson = async (url) => {
  const { data } = await requestWithRetry({ url });
  return JSON.parse(data.toString("utf-8"));
};
var postJson = async ({
  url,
  body,
  headers = {}
}) => {
  const { data } = await requestWithRetry({
    url,
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body)
  });
  return JSON.parse(data.toString("utf-8"));
};
var getBuffer = async (url) => {
  const { data, headers } = await requestWithRetry({ url });
  return { data, headers };
};
var getText = async (url) => {
  const { data } = await requestWithRetry({ url });
  return data.toString("utf-8");
};
var get = async (url) => {
  const { data, headers } = await requestWithRetry({ url });
  const contentType = headers["content-type"] || "";
  if (contentType.includes("json")) {
    return JSON.parse(data.toString("utf-8"));
  }
  return data.toString("utf-8");
};
var streamToFile = ({ url, destPath, _redirectCount = 0 }) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const req = https.request(parsedUrl, { method: "GET", agent }, (res) => {
      const status = res.statusCode || 500;
      if (status >= 300 && status < 400 && res.headers.location) {
        res.resume();
        if (_redirectCount >= MAX_REDIRECTS) {
          const errRes = { status, httpStatus: status, error: "Too many redirects" };
          reject(new SecApiError("Too many redirects", errRes));
          return;
        }
        const redirectUrl = new URL(res.headers.location, url).href;
        resolve(
          streamToFile({
            url: redirectUrl,
            destPath,
            _redirectCount: _redirectCount + 1
          })
        );
        return;
      }
      if (status < 200 || status >= 300) {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const responseText = Buffer.concat(chunks).toString("utf-8");
          let parsed = {};
          try {
            parsed = JSON.parse(responseText);
          } catch (_) {
          }
          const errorMessage = parsed.error || responseText;
          const errRes = {
            status: parsed.status || status,
            httpStatus: status,
            error: parsed.error || errorMessage
          };
          reject(new SecApiError(errorMessage, errRes));
        });
        res.on("error", (err) => reject(new SecApiError(err.message)));
        return;
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close(() => resolve());
      });
      fileStream.on("error", (err) => reject(new SecApiError(err.message)));
      res.on("error", (err) => reject(new SecApiError(err.message)));
    });
    req.on("error", (err) => reject(new SecApiError(err.message)));
    req.end();
  });
};
var downloadToFile = async ({
  url,
  destPath,
  expectedSize
}) => {
  if (fs.existsSync(destPath)) {
    if (expectedSize === void 0 || expectedSize === null || fs.statSync(destPath).size === expectedSize) {
      return destPath;
    }
  }
  const dir = path.dirname(destPath);
  if (dir && dir !== ".") {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tmpPath = destPath + ".tmp";
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      await streamToFile({ url, destPath: tmpPath });
      fs.renameSync(tmpPath, destPath);
      return destPath;
    } catch (error) {
      if (fs.existsSync(tmpPath)) {
        try {
          fs.unlinkSync(tmpPath);
        } catch (_) {
        }
      }
      if (error?.response?.httpStatus === 429 && attempt < MAX_RETRIES - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
        continue;
      }
      throw error;
    }
  }
  throw new SecApiError("Download failed");
};

// src/datasets.ts
import path2 from "path";
var DEFAULT_DOWNLOAD_DIR = "./sec-api-datasets";
var DatasetsApi = class {
  apiKey;
  constructor(apiKey = "") {
    this.apiKey = apiKey;
  }
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }
  async getAll() {
    return getJson(config.datasetsApi.indexEndpoint);
  }
  async showAll() {
    const datasets = await this.getAll();
    const idCol = 50;
    const nameCol = 55;
    const fmtCol = 10;
    const sizeCol = 12;
    console.log("");
    console.log(
      "  " + "ID".padEnd(idCol) + " " + "Name".padEnd(nameCol) + " " + "Format".padEnd(fmtCol) + " " + "Size".padStart(sizeCol)
    );
    console.log(
      "  " + "\u2500".repeat(idCol) + " " + "\u2500".repeat(nameCol) + " " + "\u2500".repeat(fmtCol) + " " + "\u2500".repeat(sizeCol)
    );
    datasets.forEach((ds) => {
      const total = ds.totalSize || 0;
      const sizeStr = total >= 1e9 ? (total / 1e9).toFixed(1) + " GB" : (total / 1e6).toFixed(1) + " MB";
      const id = (ds.datasetIdInUrl || "").padEnd(idCol);
      const name = (ds.name || "").slice(0, nameCol).padEnd(nameCol);
      const fmt = (ds.containerFormat || "").padEnd(fmtCol);
      console.log("  " + id + " " + name + " " + fmt + " " + sizeStr.padStart(sizeCol));
    });
    console.log("");
    console.log(
      "  " + datasets.length + " datasets available. Browse all at https://sec-api.io/datasets"
    );
    console.log("");
    return datasets;
  }
  async getDetails(name) {
    const url = `${config.datasetsApi.detailEndpoint}/${name}.json`;
    try {
      return await getJson(url);
    } catch (_) {
      const all = await this.getAll();
      const available = all.map((d) => d.datasetIdInUrl).join(", ");
      throw new Error(`Dataset "${name}" not found. Available datasets: ${available}`);
    }
  }
  async showDetails(name) {
    const ds = await this.getDetails(name);
    const sizeMb = (ds.totalSize || 0) / 1e6;
    const description = (ds.description || "").slice(0, 100);
    console.log("  Name:             " + ds.name);
    console.log("  Description:      " + description + "...");
    console.log("  Updated:          " + (ds.updatedAt || "N/A"));
    console.log("  Earliest data:    " + (ds.earliestSampleDate || "N/A"));
    console.log("  Form types:       " + (ds.formTypes || []).join(", "));
    console.log("  Format:           " + (ds.containerFormat || "N/A"));
    console.log(
      "  Total records:    " + (ds.totalRecords ? ds.totalRecords.toLocaleString() : "N/A")
    );
    console.log("  Total size:       " + sizeMb.toFixed(1) + " MB");
    console.log("  Containers:       " + (ds.containers || []).length);
    return ds;
  }
  appendToken(url, apiKey) {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}token=${apiKey}`;
  }
  async download(nameOrOptions) {
    const options = typeof nameOrOptions === "string" ? { name: nameOrOptions } : nameOrOptions || { name: "" };
    const { name, path: downloadPath, strategy = "containers" } = options;
    const dataset = await this.getDetails(name);
    if (strategy === "zip") {
      const targetDir2 = downloadPath || DEFAULT_DOWNLOAD_DIR;
      const url = this.appendToken(dataset.datasetDownloadUrl || "", this.apiKey);
      const dest = path2.join(targetDir2, `${name}.zip`);
      return downloadToFile({
        url,
        destPath: dest,
        expectedSize: dataset.totalSize
      });
    }
    const targetDir = downloadPath || path2.join(DEFAULT_DOWNLOAD_DIR, name);
    const containers = dataset.containers || [];
    const downloaded = [];
    for (const container of containers) {
      const url = this.appendToken(container.downloadUrl, this.apiKey);
      const dest = path2.join(targetDir, container.key);
      await downloadToFile({
        url,
        destPath: dest,
        expectedSize: container.size
      });
      downloaded.push(dest);
    }
    return downloaded;
  }
  async sync(nameOrOptions) {
    return this.download(nameOrOptions);
  }
};
var datasetsSingleton = new DatasetsApi();

// src/index.ts
var SecApi = class {
  apiKey = "";
  datasetsApi;
  constructor(apiKeyOrOptions) {
    if (typeof apiKeyOrOptions === "string") {
      this.apiKey = apiKeyOrOptions;
    } else if (apiKeyOrOptions && typeof apiKeyOrOptions.apiKey === "string") {
      this.apiKey = apiKeyOrOptions.apiKey;
    }
    this.datasetsApi = new DatasetsApi(this.apiKey);
  }
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    this.datasetsApi.setApiKey(apiKey);
  }
  postWithToken = async (endpoint, query) => {
    const url = `${endpoint}?token=${this.apiKey}`;
    return postJson({ url, body: query });
  };
  getWithToken = async (url) => {
    return getJson(url);
  };
  // ------------------------------------------
  // Query API
  // ------------------------------------------
  queryApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getFilings: async (query) => {
      return postJson({
        url: config.queryApi.endpoint,
        body: query,
        headers: { Authorization: this.apiKey }
      });
    }
  };
  // ------------------------------------------
  // Full-Text Search API
  // ------------------------------------------
  fullTextSearchApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getFilings: async (query) => {
      return postJson({
        url: config.fullTextApi.endpoint,
        body: query,
        headers: { Authorization: this.apiKey }
      });
    }
  };
  // ------------------------------------------
  // Download API
  // ------------------------------------------
  downloadApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getFile: async (edgarFileUrl, params = { decompress: true, autoConvertToString: true }) => {
      const removeIxbrlRenderingQuery = (urlPath2) => urlPath2.replace("/ix?doc=/", "/").replace("/ix.xhtml?doc=/", "/");
      const edgarFileUrlToUrlPath = (url2) => url2.replace(/.*\/edgar\/data\//, "/");
      const addLeadingSlash = (urlPath2) => urlPath2.charAt(0) !== "/" ? "/" + urlPath2 : urlPath2;
      const normalizedEdgarFileUrl = removeIxbrlRenderingQuery(edgarFileUrl);
      let urlPath = edgarFileUrlToUrlPath(normalizedEdgarFileUrl);
      urlPath = addLeadingSlash(urlPath);
      const url = `${config.downloadApiV2.endpoint}${urlPath}?token=${this.apiKey}`;
      const { data, headers } = await getBuffer(url);
      if (params.autoConvertToString === false) {
        return data;
      }
      const contentType = headers["content-type"] || "";
      if (contentType.includes("text")) {
        return data.toString("utf-8");
      }
      return data;
    }
  };
  // ------------------------------------------
  // Render API
  // ------------------------------------------
  renderApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getFilingContent: async (url, type = "html") => {
      let requestUrl;
      if (type === "pdf") {
        requestUrl = `${config.renderApi.endpoint}&type=${type}&url=${url}`;
      } else {
        const filename = url.replace("https://www.sec.gov/Archives/edgar/data/", "");
        requestUrl = `${config.downloadApi.endpoint}${filename}?token=${this.apiKey}`;
      }
      return getText(requestUrl);
    }
  };
  // ------------------------------------------
  // PDF Generator API
  // ------------------------------------------
  pdfGeneratorApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getPdf: async (url) => {
      const fileUrl = url.replace(/ix\?doc=\//, "");
      const requestUrl = `${config.pdfGeneratorApi.endpoint}?type=pdf&url=${fileUrl}&token=${this.apiKey}`;
      const { data } = await getBuffer(requestUrl);
      return data;
    }
  };
  // ------------------------------------------
  // XBRL-to-JSON Converter API
  // ------------------------------------------
  xbrlApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    xbrlToJson: async ({ htmUrl, xbrlUrl, accessionNo } = {}) => {
      if (!htmUrl && !xbrlUrl && !accessionNo) {
        throw new Error("Please provide one of the following arguments: htmUrl, xbrlUrl or accessionNo");
      }
      let requestUrl = `${config.xbrlToJsonApi.endpoint}?token=${this.apiKey}`;
      if (htmUrl) requestUrl += `&htm-url=${htmUrl}`;
      if (xbrlUrl) requestUrl += `&xbrl-url=${xbrlUrl}`;
      if (accessionNo) requestUrl += `&accession-no=${accessionNo}`;
      return getJson(requestUrl);
    }
  };
  // ------------------------------------------
  // Extractor API
  // ------------------------------------------
  extractorApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getSection: async (filingUrl, section = "1A", returnType = "text") => {
      if (!filingUrl || !filingUrl.length) {
        throw new Error("No valid filing URL provided");
      }
      const requestUrl = `${config.extractorApi.endpoint}?token=${this.apiKey}&url=${filingUrl}&item=${section}&type=${returnType}`;
      return get(requestUrl);
    }
  };
  // ------------------------------------------
  // Mapping API
  // ------------------------------------------
  mappingApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    resolve: async (parameter, value) => {
      const supportedParams = ["cik", "ticker", "cusip", "name", "exchange", "sector", "industry"];
      if (!supportedParams.includes(parameter.toLowerCase())) {
        throw new Error(`Parameter not supported. Supported parameters: ${supportedParams.join(", ")}`);
      }
      const url = `${config.mappingApi.endpoint}/${parameter.toLowerCase()}/${value}?token=${this.apiKey}`;
      return this.getWithToken(url);
    }
  };
  // ------------------------------------------
  // Form ADV API
  // ------------------------------------------
  formAdvApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getFirms: (query) => this.postWithToken(`${config.formAdvApi.endpoint}/firm`, query),
    getIndividuals: (query) => this.postWithToken(`${config.formAdvApi.endpoint}/individual`, query),
    getDirectOwners: (crd) => this.getWithToken(`${config.formAdvApi.endpoint}/schedule-a-direct-owners/${crd}?token=${this.apiKey}`),
    getIndirectOwners: (crd) => this.getWithToken(`${config.formAdvApi.endpoint}/schedule-b-indirect-owners/${crd}?token=${this.apiKey}`),
    getPrivateFunds: (crd) => this.getWithToken(`${config.formAdvApi.endpoint}/schedule-d-7-b-1/${crd}?token=${this.apiKey}`),
    getOtherBusinessNames: (crd) => this.getWithToken(`${config.formAdvApi.endpoint}/schedule-d-1-b/${crd}?token=${this.apiKey}`),
    getSeparatelyManagedAccounts: (crd) => this.getWithToken(`${config.formAdvApi.endpoint}/schedule-d-5-k/${crd}?token=${this.apiKey}`),
    getFinancialIndustryAffiliations: (crd) => this.getWithToken(`${config.formAdvApi.endpoint}/schedule-d-7-a/${crd}?token=${this.apiKey}`),
    getBrochures: (crd) => this.getWithToken(`${config.formAdvApi.endpoint}/brochures/${crd}?token=${this.apiKey}`)
  };
  // ------------------------------------------
  // Insider Trading API
  // ------------------------------------------
  insiderTradingApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.insiderTradingApi.endpoint, query)
  };
  // ------------------------------------------
  // Form 144 API
  // ------------------------------------------
  form144Api = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.form144Api.endpoint, query)
  };
  // ------------------------------------------
  // Form 13F Holdings & Cover Pages APIs
  // ------------------------------------------
  form13FHoldingsApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.form13FHoldingsApi.endpoint, query)
  };
  form13FCoverPagesApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.form13FCoverPagesApi.endpoint, query)
  };
  // ------------------------------------------
  // Form N-PORT API
  // ------------------------------------------
  formNportApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.formNportApi.endpoint, query)
  };
  // ------------------------------------------
  // Form 13D/13G API
  // ------------------------------------------
  form13DGApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.form13DGApi.endpoint, query)
  };
  // ------------------------------------------
  // Form N-CEN API
  // ------------------------------------------
  formNcenApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.formNcenApi.endpoint, query)
  };
  // ------------------------------------------
  // Form N-PX API
  // ------------------------------------------
  formNpxApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getMetadata: (query) => this.postWithToken(config.formNpxApi.endpoint, query),
    getVotingRecords: (accessionNo) => this.getWithToken(`${config.formNpxApi.endpoint}/${accessionNo}?token=${this.apiKey}`)
  };
  // ------------------------------------------
  // Form S-1/424B4 API
  // ------------------------------------------
  formS1424B4Api = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.formS1424B4Api.endpoint, query)
  };
  // ------------------------------------------
  // Form D API
  // ------------------------------------------
  formDApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.formDApi.endpoint, query)
  };
  // ------------------------------------------
  // Form C API
  // ------------------------------------------
  formCApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.formCApi.endpoint, query)
  };
  // ------------------------------------------
  // Reg A Search API
  // ------------------------------------------
  regASearchApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.regASearchApi.endpoint, query)
  };
  // ------------------------------------------
  // Form 1-A API
  // ------------------------------------------
  form1AApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.form1AApi.endpoint, query)
  };
  // ------------------------------------------
  // Form 1-K API
  // ------------------------------------------
  form1KApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.form1KApi.endpoint, query)
  };
  // ------------------------------------------
  // Form 1-Z API
  // ------------------------------------------
  form1ZApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.form1ZApi.endpoint, query)
  };
  // ------------------------------------------
  // Form 8-K API
  // ------------------------------------------
  form8KApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.form8KApi.endpoint, query)
  };
  // ------------------------------------------
  // Executive Compensation API
  // ------------------------------------------
  execCompApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: async (parameter) => {
      if (typeof parameter === "string") {
        const url = `${config.execCompApi.endpoint}/${parameter.toUpperCase()}?token=${this.apiKey}`;
        return this.getWithToken(url);
      } else if (typeof parameter === "object" && parameter !== null) {
        return this.postWithToken(config.execCompApi.endpoint, parameter);
      } else {
        throw new Error("Invalid parameter. Provide a ticker string or a query object.");
      }
    }
  };
  // ------------------------------------------
  // Directors & Board Members API
  // ------------------------------------------
  directorsBoardMembersApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.directorsBoardMembersApi.endpoint, query)
  };
  // ------------------------------------------
  // Public Float API
  // ------------------------------------------
  floatApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getFloat: async ({ ticker, cik } = {}) => {
      if (!ticker && !cik) {
        throw new Error("Please provide either a ticker or cik parameter.");
      }
      const searchTerm = ticker ? `&ticker=${ticker}` : `&cik=${cik}`;
      const url = `${config.floatApi.endpoint}?token=${this.apiKey}${searchTerm}`;
      return this.getWithToken(url);
    }
  };
  // ------------------------------------------
  // Subsidiaries API
  // ------------------------------------------
  subsidiaryApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.subsidiaryApi.endpoint, query)
  };
  // ------------------------------------------
  // SEC Enforcement Actions API
  // ------------------------------------------
  secEnforcementActionsApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.secEnforcementActionsApi.endpoint, query)
  };
  // ------------------------------------------
  // SEC Litigations API
  // ------------------------------------------
  secLitigationsApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.secLitigationsApi.endpoint, query)
  };
  // ------------------------------------------
  // SEC Admin Proceedings API
  // ------------------------------------------
  secAdminProceedingsApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.secAdminProceedingsApi.endpoint, query)
  };
  // ------------------------------------------
  // AAER API
  // ------------------------------------------
  aaerApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.aaerApi.endpoint, query)
  };
  // ------------------------------------------
  // SRO Filings API
  // ------------------------------------------
  sroFilingsApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.sroApi.endpoint, query)
  };
  // ------------------------------------------
  // EDGAR Entities API
  // ------------------------------------------
  edgarEntitiesApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.edgarEntitiesApi.endpoint, query)
  };
  // ------------------------------------------
  // Audit Fees API
  // ------------------------------------------
  auditFeesApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getData: (query) => this.postWithToken(config.auditFeesApi.endpoint, query)
  };
  // ------------------------------------------
  // EDGAR Index API
  // ------------------------------------------
  edgarIndexApi = {
    setApiKey: (apiKey) => this.setApiKey(apiKey),
    getIngestionLog: (date) => this.getWithToken(`${config.edgarIndexIngestionLogApi.endpoint}/${date}?token=${this.apiKey}`)
  };
};
var defaultInstance = new SecApi();
var setApiKey = (apiKey) => defaultInstance.setApiKey(apiKey);
var queryApi = defaultInstance.queryApi;
var fullTextSearchApi = defaultInstance.fullTextSearchApi;
var downloadApi = defaultInstance.downloadApi;
var renderApi = defaultInstance.renderApi;
var pdfGeneratorApi = defaultInstance.pdfGeneratorApi;
var xbrlApi = defaultInstance.xbrlApi;
var extractorApi = defaultInstance.extractorApi;
var mappingApi = defaultInstance.mappingApi;
var formAdvApi = defaultInstance.formAdvApi;
var insiderTradingApi = defaultInstance.insiderTradingApi;
var form144Api = defaultInstance.form144Api;
var form13FHoldingsApi = defaultInstance.form13FHoldingsApi;
var form13FCoverPagesApi = defaultInstance.form13FCoverPagesApi;
var formNportApi = defaultInstance.formNportApi;
var form13DGApi = defaultInstance.form13DGApi;
var formNcenApi = defaultInstance.formNcenApi;
var formNpxApi = defaultInstance.formNpxApi;
var formS1424B4Api = defaultInstance.formS1424B4Api;
var formDApi = defaultInstance.formDApi;
var formCApi = defaultInstance.formCApi;
var regASearchApi = defaultInstance.regASearchApi;
var form1AApi = defaultInstance.form1AApi;
var form1KApi = defaultInstance.form1KApi;
var form1ZApi = defaultInstance.form1ZApi;
var form8KApi = defaultInstance.form8KApi;
var execCompApi = defaultInstance.execCompApi;
var directorsBoardMembersApi = defaultInstance.directorsBoardMembersApi;
var floatApi = defaultInstance.floatApi;
var subsidiaryApi = defaultInstance.subsidiaryApi;
var secEnforcementActionsApi = defaultInstance.secEnforcementActionsApi;
var secLitigationsApi = defaultInstance.secLitigationsApi;
var secAdminProceedingsApi = defaultInstance.secAdminProceedingsApi;
var aaerApi = defaultInstance.aaerApi;
var sroFilingsApi = defaultInstance.sroFilingsApi;
var edgarEntitiesApi = defaultInstance.edgarEntitiesApi;
var auditFeesApi = defaultInstance.auditFeesApi;
var edgarIndexApi = defaultInstance.edgarIndexApi;
var datasetsApi = defaultInstance.datasetsApi;
Object.assign(SecApi, {
  setApiKey,
  queryApi,
  fullTextSearchApi,
  downloadApi,
  renderApi,
  pdfGeneratorApi,
  xbrlApi,
  extractorApi,
  mappingApi,
  formAdvApi,
  insiderTradingApi,
  form144Api,
  form13FHoldingsApi,
  form13FCoverPagesApi,
  formNportApi,
  form13DGApi,
  formNcenApi,
  formNpxApi,
  formS1424B4Api,
  formDApi,
  formCApi,
  regASearchApi,
  form1AApi,
  form1KApi,
  form1ZApi,
  form8KApi,
  execCompApi,
  directorsBoardMembersApi,
  floatApi,
  subsidiaryApi,
  secEnforcementActionsApi,
  secLitigationsApi,
  secAdminProceedingsApi,
  aaerApi,
  sroFilingsApi,
  edgarEntitiesApi,
  auditFeesApi,
  edgarIndexApi,
  datasetsApi
});
var index_default = SecApi;
export {
  SecApi,
  SecApiError,
  aaerApi,
  auditFeesApi,
  datasetsApi,
  index_default as default,
  directorsBoardMembersApi,
  downloadApi,
  edgarEntitiesApi,
  edgarIndexApi,
  execCompApi,
  extractorApi,
  floatApi,
  form13DGApi,
  form13FCoverPagesApi,
  form13FHoldingsApi,
  form144Api,
  form1AApi,
  form1KApi,
  form1ZApi,
  form8KApi,
  formAdvApi,
  formCApi,
  formDApi,
  formNcenApi,
  formNportApi,
  formNpxApi,
  formS1424B4Api,
  fullTextSearchApi,
  insiderTradingApi,
  mappingApi,
  pdfGeneratorApi,
  queryApi,
  regASearchApi,
  renderApi,
  secAdminProceedingsApi,
  secEnforcementActionsApi,
  secLitigationsApi,
  setApiKey,
  sroFilingsApi,
  subsidiaryApi,
  xbrlApi
};
//# sourceMappingURL=index.mjs.map