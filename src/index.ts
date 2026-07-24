import { config } from './config.js';
import { getJson, postJson, getBuffer, getText, get } from './http-client.js';
import { DatasetsApi } from './datasets.js';
import {
  QueryApiQuery,
  QueryApiResponse,
  FullTextSearchQuery,
  FullTextSearchResponse,
  GetFileOptions,
  XbrlToJsonOptions,
  XbrlToJsonResponse,
  ExtractorSection,
  ExtractorReturnType,
  MappingParameter,
  MappingEntity,
  FormAdvFirmQuery,
  FormAdvFirmResponse,
  FormAdvIndividualQuery,
  FormAdvIndividualResponse,
  FormAdvDirectOwnersResponse,
  FormAdvIndirectOwnersResponse,
  FormAdvPrivateFundsResponse,
  FormAdvBrochuresResponse,
  InsiderTradingQuery,
  InsiderTradingResponse,
  Form144Query,
  Form144Response,
  Form13FHoldingsQuery,
  Form13FHoldingsResponse,
  Form13FCoverPagesQuery,
  Form13FCoverPagesResponse,
  GenericQuery,
  FormNportResponse,
  Form13DGResponse,
  FormNcenResponse,
  FormNpxMetadataResponse,
  FormNpxVotingRecordsResponse,
  FormS1424B4Response,
  FormDResponse,
  FormCResponse,
  RegASearchResponse,
  Form1AResponse,
  Form1KResponse,
  Form1ZResponse,
  Form8KResponse,
  ExecCompParam,
  ExecCompResponse,
  DirectorsBoardMembersResponse,
  FloatOptions,
  FloatResponse,
  SubsidiaryResponse,
  SecEnforcementActionsResponse,
  SecLitigationsResponse,
  SecAdminProceedingsResponse,
  AaerResponse,
  SroFilingsResponse,
  EdgarEntitiesResponse,
  AuditFeesResponse,
  EdgarIngestionLogResponse,
} from './types/index.js';

export * from './types/index.js';

export class SecApi {
  private apiKey: string = '';
  public readonly datasetsApi: DatasetsApi;

  constructor(apiKeyOrOptions?: string | { apiKey: string }) {
    if (typeof apiKeyOrOptions === 'string') {
      this.apiKey = apiKeyOrOptions;
    } else if (apiKeyOrOptions && typeof apiKeyOrOptions.apiKey === 'string') {
      this.apiKey = apiKeyOrOptions.apiKey;
    }
    this.datasetsApi = new DatasetsApi(this.apiKey);
  }

  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.datasetsApi.setApiKey(apiKey);
  }

  private postWithToken = async <T = any>(endpoint: string, query: any): Promise<T> => {
    const url = `${endpoint}?token=${this.apiKey}`;
    return postJson<T>({ url, body: query });
  };

  private getWithToken = async <T = any>(url: string): Promise<T> => {
    return getJson<T>(url);
  };

  // ------------------------------------------
  // Query API
  // ------------------------------------------
  public queryApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getFilings: async <T = QueryApiResponse>(query: QueryApiQuery): Promise<T> => {
      return postJson<T>({
        url: config.queryApi.endpoint,
        body: query,
        headers: { Authorization: this.apiKey },
      });
    },
  };

  // ------------------------------------------
  // Full-Text Search API
  // ------------------------------------------
  public fullTextSearchApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getFilings: async <T = FullTextSearchResponse>(query: FullTextSearchQuery): Promise<T> => {
      return postJson<T>({
        url: config.fullTextApi.endpoint,
        body: query,
        headers: { Authorization: this.apiKey },
      });
    },
  };

  // ------------------------------------------
  // Download API
  // ------------------------------------------
  public downloadApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getFile: async (
      edgarFileUrl: string,
      params: GetFileOptions = { decompress: true, autoConvertToString: true },
    ): Promise<string | Buffer> => {
      const removeIxbrlRenderingQuery = (urlPath: string) =>
        urlPath.replace('/ix?doc=/', '/').replace('/ix.xhtml?doc=/', '/');
      const edgarFileUrlToUrlPath = (url: string) => url.replace(/.*\/edgar\/data\//, '/');
      const addLeadingSlash = (urlPath: string) => (urlPath.charAt(0) !== '/' ? '/' + urlPath : urlPath);

      const normalizedEdgarFileUrl = removeIxbrlRenderingQuery(edgarFileUrl);
      let urlPath = edgarFileUrlToUrlPath(normalizedEdgarFileUrl);
      urlPath = addLeadingSlash(urlPath);

      const url = `${config.downloadApiV2.endpoint}${urlPath}?token=${this.apiKey}`;
      const { data, headers } = await getBuffer(url);

      if (params.autoConvertToString === false) {
        return data;
      }

      const contentType = (headers['content-type'] as string) || '';
      if (contentType.includes('text')) {
        return data.toString('utf-8');
      }

      return data;
    },
  };

  // ------------------------------------------
  // Render API
  // ------------------------------------------
  public renderApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getFilingContent: async (url: string, type: 'html' | 'pdf' = 'html'): Promise<string> => {
      let requestUrl: string;
      if (type === 'pdf') {
        requestUrl = `${config.renderApi.endpoint}&type=${type}&url=${url}`;
      } else {
        const filename = url.replace('https://www.sec.gov/Archives/edgar/data/', '');
        requestUrl = `${config.downloadApi.endpoint}${filename}?token=${this.apiKey}`;
      }
      return getText(requestUrl);
    },
  };

  // ------------------------------------------
  // PDF Generator API
  // ------------------------------------------
  public pdfGeneratorApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getPdf: async (url: string): Promise<Buffer> => {
      const fileUrl = url.replace(/ix\?doc=\//, '');
      const requestUrl = `${config.pdfGeneratorApi.endpoint}?type=pdf&url=${fileUrl}&token=${this.apiKey}`;
      const { data } = await getBuffer(requestUrl);
      return data;
    },
  };

  // ------------------------------------------
  // XBRL-to-JSON Converter API
  // ------------------------------------------
  public xbrlApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    xbrlToJson: async <T = XbrlToJsonResponse>({ htmUrl, xbrlUrl, accessionNo }: XbrlToJsonOptions = {}): Promise<T> => {
      if (!htmUrl && !xbrlUrl && !accessionNo) {
        throw new Error('Please provide one of the following arguments: htmUrl, xbrlUrl or accessionNo');
      }
      let requestUrl = `${config.xbrlToJsonApi.endpoint}?token=${this.apiKey}`;
      if (htmUrl) requestUrl += `&htm-url=${htmUrl}`;
      if (xbrlUrl) requestUrl += `&xbrl-url=${xbrlUrl}`;
      if (accessionNo) requestUrl += `&accession-no=${accessionNo}`;
      return getJson<T>(requestUrl);
    },
  };

  // ------------------------------------------
  // Extractor API
  // ------------------------------------------
  public extractorApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getSection: async <T = string>(
      filingUrl: string,
      section: ExtractorSection = '1A',
      returnType: ExtractorReturnType = 'text',
    ): Promise<T> => {
      if (!filingUrl || !filingUrl.length) {
        throw new Error('No valid filing URL provided');
      }
      const requestUrl = `${config.extractorApi.endpoint}?token=${this.apiKey}&url=${filingUrl}&item=${section}&type=${returnType}`;
      return get(requestUrl);
    },
  };

  // ------------------------------------------
  // Mapping API
  // ------------------------------------------
  public mappingApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    resolve: async <T = MappingEntity[]>(parameter: MappingParameter, value: string): Promise<T> => {
      const supportedParams = ['cik', 'ticker', 'cusip', 'name', 'exchange', 'sector', 'industry'];
      if (!supportedParams.includes(parameter.toLowerCase())) {
        throw new Error(`Parameter not supported. Supported parameters: ${supportedParams.join(', ')}`);
      }
      const url = `${config.mappingApi.endpoint}/${parameter.toLowerCase()}/${value}?token=${this.apiKey}`;
      return this.getWithToken<T>(url);
    },
  };

  // ------------------------------------------
  // Form ADV API
  // ------------------------------------------
  public formAdvApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getFirms: <T = FormAdvFirmResponse>(query: FormAdvFirmQuery): Promise<T> =>
      this.postWithToken<T>(`${config.formAdvApi.endpoint}/firm`, query),
    getIndividuals: <T = FormAdvIndividualResponse>(query: FormAdvIndividualQuery): Promise<T> =>
      this.postWithToken<T>(`${config.formAdvApi.endpoint}/individual`, query),
    getDirectOwners: <T = FormAdvDirectOwnersResponse>(crd: string | number): Promise<T> =>
      this.getWithToken<T>(`${config.formAdvApi.endpoint}/schedule-a-direct-owners/${crd}?token=${this.apiKey}`),
    getIndirectOwners: <T = FormAdvIndirectOwnersResponse>(crd: string | number): Promise<T> =>
      this.getWithToken<T>(`${config.formAdvApi.endpoint}/schedule-b-indirect-owners/${crd}?token=${this.apiKey}`),
    getPrivateFunds: <T = FormAdvPrivateFundsResponse>(crd: string | number): Promise<T> =>
      this.getWithToken<T>(`${config.formAdvApi.endpoint}/schedule-d-7-b-1/${crd}?token=${this.apiKey}`),
    getOtherBusinessNames: <T = any>(crd: string | number): Promise<T> =>
      this.getWithToken<T>(`${config.formAdvApi.endpoint}/schedule-d-1-b/${crd}?token=${this.apiKey}`),
    getSeparatelyManagedAccounts: <T = any>(crd: string | number): Promise<T> =>
      this.getWithToken<T>(`${config.formAdvApi.endpoint}/schedule-d-5-k/${crd}?token=${this.apiKey}`),
    getFinancialIndustryAffiliations: <T = any>(crd: string | number): Promise<T> =>
      this.getWithToken<T>(`${config.formAdvApi.endpoint}/schedule-d-7-a/${crd}?token=${this.apiKey}`),
    getBrochures: <T = FormAdvBrochuresResponse>(crd: string | number): Promise<T> =>
      this.getWithToken<T>(`${config.formAdvApi.endpoint}/brochures/${crd}?token=${this.apiKey}`),
  };

  // ------------------------------------------
  // Insider Trading API
  // ------------------------------------------
  public insiderTradingApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = InsiderTradingResponse>(query: InsiderTradingQuery): Promise<T> =>
      this.postWithToken<T>(config.insiderTradingApi.endpoint, query),
  };

  // ------------------------------------------
  // Form 144 API
  // ------------------------------------------
  public form144Api = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = Form144Response>(query: Form144Query): Promise<T> =>
      this.postWithToken<T>(config.form144Api.endpoint, query),
  };

  // ------------------------------------------
  // Form 13F Holdings & Cover Pages APIs
  // ------------------------------------------
  public form13FHoldingsApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = Form13FHoldingsResponse>(query: Form13FHoldingsQuery): Promise<T> =>
      this.postWithToken<T>(config.form13FHoldingsApi.endpoint, query),
  };

  public form13FCoverPagesApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = Form13FCoverPagesResponse>(query: Form13FCoverPagesQuery): Promise<T> =>
      this.postWithToken<T>(config.form13FCoverPagesApi.endpoint, query),
  };

  // ------------------------------------------
  // Form N-PORT API
  // ------------------------------------------
  public formNportApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = FormNportResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.formNportApi.endpoint, query),
  };

  // ------------------------------------------
  // Form 13D/13G API
  // ------------------------------------------
  public form13DGApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = Form13DGResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.form13DGApi.endpoint, query),
  };

  // ------------------------------------------
  // Form N-CEN API
  // ------------------------------------------
  public formNcenApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = FormNcenResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.formNcenApi.endpoint, query),
  };

  // ------------------------------------------
  // Form N-PX API
  // ------------------------------------------
  public formNpxApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getMetadata: <T = FormNpxMetadataResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.formNpxApi.endpoint, query),
    getVotingRecords: <T = FormNpxVotingRecordsResponse>(accessionNo: string): Promise<T> =>
      this.getWithToken<T>(`${config.formNpxApi.endpoint}/${accessionNo}?token=${this.apiKey}`),
  };

  // ------------------------------------------
  // Form S-1/424B4 API
  // ------------------------------------------
  public formS1424B4Api = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = FormS1424B4Response>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.formS1424B4Api.endpoint, query),
  };

  // ------------------------------------------
  // Form D API
  // ------------------------------------------
  public formDApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = FormDResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.formDApi.endpoint, query),
  };

  // ------------------------------------------
  // Form C API
  // ------------------------------------------
  public formCApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = FormCResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.formCApi.endpoint, query),
  };

  // ------------------------------------------
  // Reg A Search API
  // ------------------------------------------
  public regASearchApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = RegASearchResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.regASearchApi.endpoint, query),
  };

  // ------------------------------------------
  // Form 1-A API
  // ------------------------------------------
  public form1AApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = Form1AResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.form1AApi.endpoint, query),
  };

  // ------------------------------------------
  // Form 1-K API
  // ------------------------------------------
  public form1KApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = Form1KResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.form1KApi.endpoint, query),
  };

  // ------------------------------------------
  // Form 1-Z API
  // ------------------------------------------
  public form1ZApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = Form1ZResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.form1ZApi.endpoint, query),
  };

  // ------------------------------------------
  // Form 8-K API
  // ------------------------------------------
  public form8KApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = Form8KResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.form8KApi.endpoint, query),
  };

  // ------------------------------------------
  // Executive Compensation API
  // ------------------------------------------
  public execCompApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: async <T = ExecCompResponse>(parameter: ExecCompParam): Promise<T> => {
      if (typeof parameter === 'string') {
        const url = `${config.execCompApi.endpoint}/${parameter.toUpperCase()}?token=${this.apiKey}`;
        return this.getWithToken<T>(url);
      } else if (typeof parameter === 'object' && parameter !== null) {
        return this.postWithToken<T>(config.execCompApi.endpoint, parameter);
      } else {
        throw new Error('Invalid parameter. Provide a ticker string or a query object.');
      }
    },
  };

  // ------------------------------------------
  // Directors & Board Members API
  // ------------------------------------------
  public directorsBoardMembersApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = DirectorsBoardMembersResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.directorsBoardMembersApi.endpoint, query),
  };

  // ------------------------------------------
  // Public Float API
  // ------------------------------------------
  public floatApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getFloat: async <T = FloatResponse>({ ticker, cik }: FloatOptions = {}): Promise<T> => {
      if (!ticker && !cik) {
        throw new Error('Please provide either a ticker or cik parameter.');
      }
      const searchTerm = ticker ? `&ticker=${ticker}` : `&cik=${cik}`;
      const url = `${config.floatApi.endpoint}?token=${this.apiKey}${searchTerm}`;
      return this.getWithToken<T>(url);
    },
  };

  // ------------------------------------------
  // Subsidiaries API
  // ------------------------------------------
  public subsidiaryApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = SubsidiaryResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.subsidiaryApi.endpoint, query),
  };

  // ------------------------------------------
  // SEC Enforcement Actions API
  // ------------------------------------------
  public secEnforcementActionsApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = SecEnforcementActionsResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.secEnforcementActionsApi.endpoint, query),
  };

  // ------------------------------------------
  // SEC Litigations API
  // ------------------------------------------
  public secLitigationsApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = SecLitigationsResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.secLitigationsApi.endpoint, query),
  };

  // ------------------------------------------
  // SEC Admin Proceedings API
  // ------------------------------------------
  public secAdminProceedingsApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = SecAdminProceedingsResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.secAdminProceedingsApi.endpoint, query),
  };

  // ------------------------------------------
  // AAER API
  // ------------------------------------------
  public aaerApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = AaerResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.aaerApi.endpoint, query),
  };

  // ------------------------------------------
  // SRO Filings API
  // ------------------------------------------
  public sroFilingsApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = SroFilingsResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.sroApi.endpoint, query),
  };

  // ------------------------------------------
  // EDGAR Entities API
  // ------------------------------------------
  public edgarEntitiesApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = EdgarEntitiesResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.edgarEntitiesApi.endpoint, query),
  };

  // ------------------------------------------
  // Audit Fees API
  // ------------------------------------------
  public auditFeesApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getData: <T = AuditFeesResponse>(query: GenericQuery): Promise<T> =>
      this.postWithToken<T>(config.auditFeesApi.endpoint, query),
  };

  // ------------------------------------------
  // EDGAR Index API
  // ------------------------------------------
  public edgarIndexApi = {
    setApiKey: (apiKey: string) => this.setApiKey(apiKey),
    getIngestionLog: <T = EdgarIngestionLogResponse>(date: string): Promise<T> =>
      this.getWithToken<T>(`${config.edgarIndexIngestionLogApi.endpoint}/${date}?token=${this.apiKey}`),
  };
}

// ------------------------------------------
// Default Singleton Instance & Module Exports
// ------------------------------------------
const defaultInstance = new SecApi();

export const setApiKey = (apiKey: string) => defaultInstance.setApiKey(apiKey);
export const queryApi = defaultInstance.queryApi;
export const fullTextSearchApi = defaultInstance.fullTextSearchApi;
export const downloadApi = defaultInstance.downloadApi;
export const renderApi = defaultInstance.renderApi;
export const pdfGeneratorApi = defaultInstance.pdfGeneratorApi;
export const xbrlApi = defaultInstance.xbrlApi;
export const extractorApi = defaultInstance.extractorApi;
export const mappingApi = defaultInstance.mappingApi;
export const formAdvApi = defaultInstance.formAdvApi;
export const insiderTradingApi = defaultInstance.insiderTradingApi;
export const form144Api = defaultInstance.form144Api;
export const form13FHoldingsApi = defaultInstance.form13FHoldingsApi;
export const form13FCoverPagesApi = defaultInstance.form13FCoverPagesApi;
export const formNportApi = defaultInstance.formNportApi;
export const form13DGApi = defaultInstance.form13DGApi;
export const formNcenApi = defaultInstance.formNcenApi;
export const formNpxApi = defaultInstance.formNpxApi;
export const formS1424B4Api = defaultInstance.formS1424B4Api;
export const formDApi = defaultInstance.formDApi;
export const formCApi = defaultInstance.formCApi;
export const regASearchApi = defaultInstance.regASearchApi;
export const form1AApi = defaultInstance.form1AApi;
export const form1KApi = defaultInstance.form1KApi;
export const form1ZApi = defaultInstance.form1ZApi;
export const form8KApi = defaultInstance.form8KApi;
export const execCompApi = defaultInstance.execCompApi;
export const directorsBoardMembersApi = defaultInstance.directorsBoardMembersApi;
export const floatApi = defaultInstance.floatApi;
export const subsidiaryApi = defaultInstance.subsidiaryApi;
export const secEnforcementActionsApi = defaultInstance.secEnforcementActionsApi;
export const secLitigationsApi = defaultInstance.secLitigationsApi;
export const secAdminProceedingsApi = defaultInstance.secAdminProceedingsApi;
export const aaerApi = defaultInstance.aaerApi;
export const sroFilingsApi = defaultInstance.sroFilingsApi;
export const edgarEntitiesApi = defaultInstance.edgarEntitiesApi;
export const auditFeesApi = defaultInstance.auditFeesApi;
export const edgarIndexApi = defaultInstance.edgarIndexApi;
export const datasetsApi = defaultInstance.datasetsApi;

// Attach static properties to SecApi class for backward compatibility: SecApi.queryApi, SecApi.setApiKey, etc.
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
  datasetsApi,
});

export default SecApi;
