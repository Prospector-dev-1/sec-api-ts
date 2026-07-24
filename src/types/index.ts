/**
 * SEC API TypeScript Type Definitions
 * Complete responses and requests for https://sec-api.io/docs
 */

export type SortOrder = 'asc' | 'desc';

export interface SortClause {
  [key: string]: {
    order: SortOrder;
  };
}

export interface SecApiErrorResponse {
  status?: number;
  httpStatus?: number;
  error?: string;
  [key: string]: any;
}

export class SecApiError extends Error {
  response?: SecApiErrorResponse;

  constructor(message: string, response?: SecApiErrorResponse) {
    super(message);
    this.name = 'SecApiError';
    this.response = response;
  }
}

// ==========================================
// SEC Filing Search (Query API)
// ==========================================

export interface QueryApiQuery {
  query: string;
  from?: string | number;
  size?: string | number;
  sort?: SortClause[];
}

export interface FilingEntity {
  fiscalYearEnd?: string;
  stateOfIncorporation?: string;
  act?: string;
  cik?: string;
  fileNo?: string;
  irsNo?: string;
  companyName?: string;
  type?: string;
  sic?: string;
  filmNo?: string;
  [key: string]: any;
}

export interface FilingDocument {
  sequence?: string;
  size?: string;
  documentUrl?: string;
  description?: string;
  type?: string;
  [key: string]: any;
}

export interface Filing {
  id: string;
  ticker?: string;
  formType: string;
  description: string;
  accessionNo: string;
  cik: string;
  companyNameLong: string;
  companyName: string;
  filedAt: string;
  periodOfReport?: string;
  linkToHtml: string;
  linkToFilingDetails: string;
  linkToTxt: string;
  entities?: FilingEntity[];
  documentFormatFiles?: FilingDocument[];
  dataFiles?: FilingDocument[];
  seriesAndClassesContractsInformation?: any[];
  [key: string]: any;
}

export interface QueryApiResponse {
  total: {
    value: number;
    relation: string;
  };
  filings: Filing[];
}

// ==========================================
// Full-Text Search API
// ==========================================

export interface FullTextSearchQuery {
  query: string;
  formTypes?: string[];
  startDate?: string;
  endDate?: string;
  ciks?: string[];
  tickers?: string[];
  sicCodes?: string[];
  from?: string | number;
  size?: string | number;
  sort?: SortClause[];
}

export interface FullTextSearchMatch {
  type?: string;
  text?: string;
  [key: string]: any;
}

export interface FullTextSearchFiling extends Filing {
  matches?: FullTextSearchMatch[];
}

export interface FullTextSearchResponse {
  total: {
    value: number;
    relation: string;
  };
  filings: FullTextSearchFiling[];
}

// ==========================================
// Download API
// ==========================================

export interface GetFileOptions {
  decompress?: boolean;
  autoConvertToString?: boolean;
}

// ==========================================
// XBRL-to-JSON API
// ==========================================

export interface XbrlToJsonOptions {
  htmUrl?: string;
  xbrlUrl?: string;
  accessionNo?: string;
}

export interface XbrlFact {
  value: string | number;
  decimals?: string | number;
  unitRef?: string;
  period?: {
    startDate?: string;
    endDate?: string;
    instant?: string;
  };
  segment?: Record<string, any>;
  [key: string]: any;
}

export interface XbrlToJsonResponse {
  CoverPage?: Record<string, any>;
  StatementsOfIncome?: Record<string, any>;
  BalanceSheets?: Record<string, any>;
  StatementsOfCashFlows?: Record<string, any>;
  StatementsOfShareholdersEquity?: Record<string, any>;
  StatementsOfComprehensiveIncome?: Record<string, any>;
  NotesToFinancialStatements?: Record<string, any>;
  [key: string]: any;
}

// ==========================================
// Extractor API
// ==========================================

export type ExtractorSection =
  | '1'
  | '1A'
  | '1B'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '7A'
  | '8'
  | '9'
  | '9A'
  | '9B'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | string;

export type ExtractorReturnType = 'text' | 'html';

// ==========================================
// CUSIP / CIK / Ticker Mapping API
// ==========================================

export type MappingParameter =
  | 'cik'
  | 'ticker'
  | 'cusip'
  | 'name'
  | 'exchange'
  | 'sector'
  | 'industry'
  | string;

export interface MappingEntity {
  cik: string;
  name: string;
  ticker?: string;
  cusip?: string;
  exchange?: string;
  sector?: string;
  industry?: string;
  sic?: string;
  sicSector?: string;
  sicIndustry?: string;
  [key: string]: any;
}

// ==========================================
// Form ADV API
// ==========================================

export interface FormAdvFirmQuery {
  query?: string;
  crd?: string | number;
  secNumber?: string;
  legalName?: string;
  primaryBusinessName?: string;
  from?: string | number;
  size?: string | number;
  sort?: SortClause[];
  [key: string]: any;
}

export interface FormAdvFirm {
  crd: string;
  secNumber?: string;
  legalName: string;
  primaryBusinessName: string;
  mainAddress?: {
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    [key: string]: any;
  };
  totalAssetsUnderManagement?: number;
  [key: string]: any;
}

export interface FormAdvFirmResponse {
  total: {
    value: number;
    relation: string;
  };
  firms: FormAdvFirm[];
}

export interface FormAdvIndividualQuery {
  query?: string;
  crd?: string | number;
  name?: string;
  from?: string | number;
  size?: string | number;
  sort?: SortClause[];
  [key: string]: any;
}

export interface FormAdvIndividual {
  crd: string;
  name: string;
  currentEmployers?: any[];
  [key: string]: any;
}

export interface FormAdvIndividualResponse {
  total: {
    value: number;
    relation: string;
  };
  individuals: FormAdvIndividual[];
}

export interface FormAdvDirectOwner {
  name: string;
  entityType?: string;
  titleOrStatus?: string;
  ownershipCode?: string;
  crdNo?: string;
  [key: string]: any;
}

export interface FormAdvDirectOwnersResponse {
  crd: string;
  directOwners: FormAdvDirectOwner[];
  [key: string]: any;
}

export interface FormAdvIndirectOwner {
  name: string;
  entityType?: string;
  titleOrStatus?: string;
  ownershipCode?: string;
  crdNo?: string;
  [key: string]: any;
}

export interface FormAdvIndirectOwnersResponse {
  crd: string;
  indirectOwners: FormAdvIndirectOwner[];
  [key: string]: any;
}

export interface FormAdvPrivateFund {
  name: string;
  fundType?: string;
  grossAssetValue?: number;
  [key: string]: any;
}

export interface FormAdvPrivateFundsResponse {
  crd: string;
  privateFunds: FormAdvPrivateFund[];
  [key: string]: any;
}

export interface FormAdvBrochure {
  title: string;
  url: string;
  date?: string;
  [key: string]: any;
}

export interface FormAdvBrochuresResponse {
  crd: string;
  brochures: FormAdvBrochure[];
  [key: string]: any;
}

// ==========================================
// Insider Trading (Form 3, 4, 5) API
// ==========================================

export interface InsiderTradingQuery {
  query: string;
  from?: string | number;
  size?: string | number;
  sort?: SortClause[];
}

export interface InsiderTransaction {
  accessionNo?: string;
  filedAt?: string;
  periodOfReport?: string;
  issuer?: {
    cik?: string;
    name?: string;
    tradingSymbol?: string;
    [key: string]: any;
  };
  reportingOwner?: {
    cik?: string;
    name?: string;
    isDirector?: boolean;
    isOfficer?: boolean;
    isTenPercentOwner?: boolean;
    officerTitle?: string;
    [key: string]: any;
  };
  nonDerivativeTransactions?: any[];
  derivativeTransactions?: any[];
  [key: string]: any;
}

export interface InsiderTradingResponse {
  total: {
    value: number;
    relation: string;
  };
  transactions: InsiderTransaction[];
  [key: string]: any;
}

// ==========================================
// Form 144 API
// ==========================================

export interface Form144Query {
  query: string;
  from?: string | number;
  size?: string | number;
  sort?: SortClause[];
}

export interface Form144Filing {
  accessionNo: string;
  filedAt: string;
  issuer?: {
    cik?: string;
    name?: string;
    tradingSymbol?: string;
    [key: string]: any;
  };
  reportingOwner?: {
    cik?: string;
    name?: string;
    [key: string]: any;
  };
  securitiesToBeSold?: any[];
  securitiesSoldInPast3Months?: any[];
  [key: string]: any;
}

export interface Form144Response {
  total: {
    value: number;
    relation: string;
  };
  filings: Form144Filing[];
  [key: string]: any;
}

// ==========================================
// Form 13F Holdings & Cover Pages API
// ==========================================

export interface Form13FHoldingsQuery {
  query: string;
  from?: string | number;
  size?: string | number;
  sort?: SortClause[];
}

export interface Form13FHolding {
  nameOfIssuer?: string;
  titleOfClass?: string;
  cusip?: string;
  value?: number;
  sshPrnamt?: number;
  sshPrnamtType?: string;
  investmentDiscretion?: string;
  votingAuthority?: {
    sole?: number;
    shared?: number;
    none?: number;
  };
  [key: string]: any;
}

export interface Form13FHoldingsResponse {
  total: {
    value: number;
    relation: string;
  };
  holdings: Form13FHolding[];
  [key: string]: any;
}

export interface Form13FCoverPagesQuery {
  query: string;
  from?: string | number;
  size?: string | number;
  sort?: SortClause[];
}

export interface Form13FCoverPage {
  accessionNo: string;
  filedAt: string;
  periodOfReport?: string;
  formType?: string;
  cik?: string;
  companyName?: string;
  otherIncludedManagers?: any[];
  [key: string]: any;
}

export interface Form13FCoverPagesResponse {
  total: {
    value: number;
    relation: string;
  };
  coverPages: Form13FCoverPage[];
  [key: string]: any;
}

// ==========================================
// Generic API Query
// ==========================================

export interface GenericQuery {
  query: string;
  from?: string | number;
  size?: string | number;
  sort?: SortClause[];
  [key: string]: any;
}

// ==========================================
// Form N-PORT API
// ==========================================

export interface FormNportFiling {
  accessionNo: string;
  filedAt: string;
  periodOfReport?: string;
  seriesName?: string;
  seriesId?: string;
  netAssets?: number;
  holdings?: any[];
  [key: string]: any;
}

export interface FormNportResponse {
  total: {
    value: number;
    relation: string;
  };
  filings: FormNportFiling[];
  [key: string]: any;
}

// ==========================================
// Form 13D/13G API
// ==========================================

export interface Form13DGFiling {
  accessionNo: string;
  filedAt: string;
  formType: string;
  issuerName?: string;
  cusip?: string;
  reportingPersons?: any[];
  percentOfClass?: number;
  [key: string]: any;
}

export interface Form13DGResponse {
  total: {
    value: number;
    relation: string;
  };
  filings: Form13DGFiling[];
  [key: string]: any;
}

// ==========================================
// Form N-CEN API
// ==========================================

export interface FormNcenFiling {
  accessionNo: string;
  filedAt: string;
  periodOfReport?: string;
  registrantName?: string;
  cik?: string;
  [key: string]: any;
}

export interface FormNcenResponse {
  total: {
    value: number;
    relation: string;
  };
  filings: FormNcenFiling[];
  [key: string]: any;
}

// ==========================================
// Form N-PX API
// ==========================================

export interface FormNpxMetadata {
  accessionNo: string;
  filedAt: string;
  periodOfReport?: string;
  seriesName?: string;
  cik?: string;
  [key: string]: any;
}

export interface FormNpxMetadataResponse {
  total: {
    value: number;
    relation: string;
  };
  metadata: FormNpxMetadata[];
  [key: string]: any;
}

export interface FormNpxVotingRecord {
  issuerName?: string;
  cusip?: string;
  meetingDate?: string;
  matterDescription?: string;
  voteInstruction?: string;
  voteStatus?: string;
  [key: string]: any;
}

export interface FormNpxVotingRecordsResponse {
  accessionNo: string;
  votingRecords: FormNpxVotingRecord[];
  [key: string]: any;
}

// ==========================================
// Form S-1 / 424B4 API
// ==========================================

export interface FormS1424B4Filing {
  accessionNo: string;
  filedAt: string;
  formType: string;
  companyName?: string;
  cik?: string;
  offeringAmount?: number;
  proposedMaximumOfferingPricePerShare?: number;
  [key: string]: any;
}

export interface FormS1424B4Response {
  total: {
    value: number;
    relation: string;
  };
  filings: FormS1424B4Filing[];
  [key: string]: any;
}

// ==========================================
// Form D API
// ==========================================

export interface FormDFiling {
  accessionNo: string;
  filedAt: string;
  companyName?: string;
  cik?: string;
  totalOfferingAmount?: number;
  totalAmountSold?: number;
  industryGroup?: string;
  offeringSalesCommissions?: number;
  [key: string]: any;
}

export interface FormDResponse {
  total: {
    value: number;
    relation: string;
  };
  filings: FormDFiling[];
  [key: string]: any;
}

// ==========================================
// Form C API
// ==========================================

export interface FormCFiling {
  accessionNo: string;
  filedAt: string;
  companyName?: string;
  cik?: string;
  targetOfferingAmount?: number;
  maximumOfferingAmount?: number;
  deadlineDate?: string;
  [key: string]: any;
}

export interface FormCResponse {
  total: {
    value: number;
    relation: string;
  };
  filings: FormCFiling[];
  [key: string]: any;
}

// ==========================================
// Regulation A (Search, 1-A, 1-K, 1-Z) APIs
// ==========================================

export interface RegAFiling {
  accessionNo: string;
  filedAt: string;
  formType: string;
  companyName?: string;
  cik?: string;
  tier?: string;
  offeringAmount?: number;
  [key: string]: any;
}

export interface RegASearchResponse {
  total: {
    value: number;
    relation: string;
  };
  filings: RegAFiling[];
  [key: string]: any;
}

export type Form1AResponse = RegASearchResponse;
export type Form1KResponse = RegASearchResponse;
export type Form1ZResponse = RegASearchResponse;

// ==========================================
// Form 8-K API
// ==========================================

export interface Form8KFiling {
  accessionNo: string;
  filedAt: string;
  companyName?: string;
  cik?: string;
  items?: string[];
  itemDetails?: any[];
  [key: string]: any;
}

export interface Form8KResponse {
  total: {
    value: number;
    relation: string;
  };
  filings: Form8KFiling[];
  [key: string]: any;
}

// ==========================================
// Executive Compensation API
// ==========================================

export type ExecCompParam = string | GenericQuery;

export interface ExecCompData {
  cik?: string;
  name?: string;
  ticker?: string;
  nameAndPosition?: string;
  year?: number;
  salary?: number;
  bonus?: number;
  stockAwards?: number;
  optionAwards?: number;
  totalCompensation?: number;
  [key: string]: any;
}

export interface ExecCompResponse {
  total?: {
    value: number;
    relation: string;
  };
  compensation?: ExecCompData[];
  [key: string]: any;
}

// ==========================================
// Directors & Board Members API
// ==========================================

export interface DirectorBoardMember {
  cik?: string;
  companyName?: string;
  ticker?: string;
  name?: string;
  position?: string;
  age?: number;
  since?: string;
  independent?: boolean;
  [key: string]: any;
}

export interface DirectorsBoardMembersResponse {
  total: {
    value: number;
    relation: string;
  };
  members: DirectorBoardMember[];
  [key: string]: any;
}

// ==========================================
// Outstanding Shares & Public Float API
// ==========================================

export interface FloatOptions {
  ticker?: string;
  cik?: string;
}

export interface FloatResponse {
  ticker?: string;
  cik?: string;
  companyName?: string;
  outstandingShares?: number;
  publicFloat?: number;
  asOfDate?: string;
  [key: string]: any;
}

// ==========================================
// Subsidiaries API
// ==========================================

export interface Subsidiary {
  parentCik?: string;
  parentName?: string;
  subsidiaryName?: string;
  stateOrJurisdictionOfIncorporation?: string;
  [key: string]: any;
}

export interface SubsidiaryResponse {
  total: {
    value: number;
    relation: string;
  };
  subsidiaries: Subsidiary[];
  [key: string]: any;
}

// ==========================================
// SEC Enforcement Actions, Litigations & Admin Proceedings
// ==========================================

export interface SecEnforcementAction {
  title?: string;
  releaseNo?: string;
  date?: string;
  respondents?: string[];
  url?: string;
  summary?: string;
  [key: string]: any;
}

export interface SecEnforcementActionsResponse {
  total: {
    value: number;
    relation: string;
  };
  actions: SecEnforcementAction[];
  [key: string]: any;
}

export interface SecLitigationRelease {
  title?: string;
  releaseNo?: string;
  date?: string;
  defendants?: string[];
  url?: string;
  summary?: string;
  [key: string]: any;
}

export interface SecLitigationsResponse {
  total: {
    value: number;
    relation: string;
  };
  litigations: SecLitigationRelease[];
  [key: string]: any;
}

export interface SecAdminProceeding {
  title?: string;
  releaseNo?: string;
  date?: string;
  respondents?: string[];
  url?: string;
  summary?: string;
  [key: string]: any;
}

export interface SecAdminProceedingsResponse {
  total: {
    value: number;
    relation: string;
  };
  proceedings: SecAdminProceeding[];
  [key: string]: any;
}

export interface AaerRelease {
  title?: string;
  releaseNo?: string;
  date?: string;
  url?: string;
  summary?: string;
  [key: string]: any;
}

export interface AaerResponse {
  total: {
    value: number;
    relation: string;
  };
  releases: AaerRelease[];
  [key: string]: any;
}

export interface SroFiling {
  sro?: string;
  title?: string;
  fileNo?: string;
  date?: string;
  url?: string;
  [key: string]: any;
}

export interface SroFilingsResponse {
  total: {
    value: number;
    relation: string;
  };
  filings: SroFiling[];
  [key: string]: any;
}

export interface EdgarEntity {
  cik: string;
  name: string;
  sic?: string;
  sicDescription?: string;
  stateLocation?: string;
  stateIncorporation?: string;
  fiscalYearEnd?: string;
  [key: string]: any;
}

export interface EdgarEntitiesResponse {
  total: {
    value: number;
    relation: string;
  };
  entities: EdgarEntity[];
  [key: string]: any;
}

export interface AuditFeeRecord {
  cik?: string;
  companyName?: string;
  ticker?: string;
  fiscalYear?: number;
  auditFees?: number;
  auditRelatedFees?: number;
  taxFees?: number;
  allOtherFees?: number;
  accountant?: string;
  [key: string]: any;
}

export interface AuditFeesResponse {
  total: {
    value: number;
    relation: string;
  };
  auditFees: AuditFeeRecord[];
  [key: string]: any;
}

export interface IngestedFilingLog {
  accessionNo: string;
  formType: string;
  cik: string;
  filedAt: string;
  ingestedAt: string;
  [key: string]: any;
}

export interface EdgarIngestionLogResponse {
  date: string;
  totalFilings: number;
  filings: IngestedFilingLog[];
  [key: string]: any;
}

// ==========================================
// Datasets API
// ==========================================

export interface DatasetMetadata {
  id?: string;
  datasetIdInUrl?: string;
  name?: string;
  description?: string;
  totalSize?: number;
  totalRecords?: number;
  containerFormat?: string;
  formTypes?: string[];
  updatedAt?: string;
  earliestSampleDate?: string;
  [key: string]: any;
}

export interface DatasetContainer {
  key: string;
  downloadUrl: string;
  size: number;
  [key: string]: any;
}

export interface DatasetDetail extends DatasetMetadata {
  containers?: DatasetContainer[];
  datasetDownloadUrl?: string;
}

export interface DatasetDownloadOptions {
  name: string;
  path?: string;
  strategy?: 'containers' | 'zip';
}
