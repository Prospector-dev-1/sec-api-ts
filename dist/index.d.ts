/**
 * SEC API TypeScript Type Definitions
 * Complete responses and requests for https://sec-api.io/docs
 */
type SortOrder = 'asc' | 'desc';
interface SortClause {
    [key: string]: {
        order: SortOrder;
    };
}
interface SecApiErrorResponse {
    status?: number;
    httpStatus?: number;
    error?: string;
    [key: string]: any;
}
declare class SecApiError extends Error {
    response?: SecApiErrorResponse;
    constructor(message: string, response?: SecApiErrorResponse);
}
interface QueryApiQuery {
    query: string;
    from?: string | number;
    size?: string | number;
    sort?: SortClause[];
}
interface FilingEntity {
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
interface FilingDocument {
    sequence?: string;
    size?: string;
    documentUrl?: string;
    description?: string;
    type?: string;
    [key: string]: any;
}
interface Filing {
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
interface QueryApiResponse {
    total: {
        value: number;
        relation: string;
    };
    filings: Filing[];
}
interface FullTextSearchQuery {
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
interface FullTextSearchMatch {
    type?: string;
    text?: string;
    [key: string]: any;
}
interface FullTextSearchFiling extends Filing {
    matches?: FullTextSearchMatch[];
}
interface FullTextSearchResponse {
    total: {
        value: number;
        relation: string;
    };
    filings: FullTextSearchFiling[];
}
interface GetFileOptions {
    decompress?: boolean;
    autoConvertToString?: boolean;
}
interface XbrlToJsonOptions {
    htmUrl?: string;
    xbrlUrl?: string;
    accessionNo?: string;
}
interface XbrlFact {
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
interface XbrlToJsonResponse {
    CoverPage?: Record<string, any>;
    StatementsOfIncome?: Record<string, any>;
    BalanceSheets?: Record<string, any>;
    StatementsOfCashFlows?: Record<string, any>;
    StatementsOfShareholdersEquity?: Record<string, any>;
    StatementsOfComprehensiveIncome?: Record<string, any>;
    NotesToFinancialStatements?: Record<string, any>;
    [key: string]: any;
}
type ExtractorSection = '1' | '1A' | '1B' | '2' | '3' | '4' | '5' | '6' | '7' | '7A' | '8' | '9' | '9A' | '9B' | '10' | '11' | '12' | '13' | '14' | '15' | string;
type ExtractorReturnType = 'text' | 'html';
type MappingParameter = 'cik' | 'ticker' | 'cusip' | 'name' | 'exchange' | 'sector' | 'industry' | string;
interface MappingEntity {
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
interface FormAdvFirmQuery {
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
interface FormAdvFirm {
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
interface FormAdvFirmResponse {
    total: {
        value: number;
        relation: string;
    };
    firms: FormAdvFirm[];
}
interface FormAdvIndividualQuery {
    query?: string;
    crd?: string | number;
    name?: string;
    from?: string | number;
    size?: string | number;
    sort?: SortClause[];
    [key: string]: any;
}
interface FormAdvIndividual {
    crd: string;
    name: string;
    currentEmployers?: any[];
    [key: string]: any;
}
interface FormAdvIndividualResponse {
    total: {
        value: number;
        relation: string;
    };
    individuals: FormAdvIndividual[];
}
interface FormAdvDirectOwner {
    name: string;
    entityType?: string;
    titleOrStatus?: string;
    ownershipCode?: string;
    crdNo?: string;
    [key: string]: any;
}
interface FormAdvDirectOwnersResponse {
    crd: string;
    directOwners: FormAdvDirectOwner[];
    [key: string]: any;
}
interface FormAdvIndirectOwner {
    name: string;
    entityType?: string;
    titleOrStatus?: string;
    ownershipCode?: string;
    crdNo?: string;
    [key: string]: any;
}
interface FormAdvIndirectOwnersResponse {
    crd: string;
    indirectOwners: FormAdvIndirectOwner[];
    [key: string]: any;
}
interface FormAdvPrivateFund {
    name: string;
    fundType?: string;
    grossAssetValue?: number;
    [key: string]: any;
}
interface FormAdvPrivateFundsResponse {
    crd: string;
    privateFunds: FormAdvPrivateFund[];
    [key: string]: any;
}
interface FormAdvBrochure {
    title: string;
    url: string;
    date?: string;
    [key: string]: any;
}
interface FormAdvBrochuresResponse {
    crd: string;
    brochures: FormAdvBrochure[];
    [key: string]: any;
}
interface InsiderTradingQuery {
    query: string;
    from?: string | number;
    size?: string | number;
    sort?: SortClause[];
}
interface InsiderTransaction {
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
interface InsiderTradingResponse {
    total: {
        value: number;
        relation: string;
    };
    transactions: InsiderTransaction[];
    [key: string]: any;
}
interface Form144Query {
    query: string;
    from?: string | number;
    size?: string | number;
    sort?: SortClause[];
}
interface Form144Filing {
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
interface Form144Response {
    total: {
        value: number;
        relation: string;
    };
    filings: Form144Filing[];
    [key: string]: any;
}
interface Form13FHoldingsQuery {
    query: string;
    from?: string | number;
    size?: string | number;
    sort?: SortClause[];
}
interface Form13FHolding {
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
interface Form13FHoldingsResponse {
    total: {
        value: number;
        relation: string;
    };
    holdings: Form13FHolding[];
    [key: string]: any;
}
interface Form13FCoverPagesQuery {
    query: string;
    from?: string | number;
    size?: string | number;
    sort?: SortClause[];
}
interface Form13FCoverPage {
    accessionNo: string;
    filedAt: string;
    periodOfReport?: string;
    formType?: string;
    cik?: string;
    companyName?: string;
    otherIncludedManagers?: any[];
    [key: string]: any;
}
interface Form13FCoverPagesResponse {
    total: {
        value: number;
        relation: string;
    };
    coverPages: Form13FCoverPage[];
    [key: string]: any;
}
interface GenericQuery {
    query: string;
    from?: string | number;
    size?: string | number;
    sort?: SortClause[];
    [key: string]: any;
}
interface FormNportFiling {
    accessionNo: string;
    filedAt: string;
    periodOfReport?: string;
    seriesName?: string;
    seriesId?: string;
    netAssets?: number;
    holdings?: any[];
    [key: string]: any;
}
interface FormNportResponse {
    total: {
        value: number;
        relation: string;
    };
    filings: FormNportFiling[];
    [key: string]: any;
}
interface Form13DGFiling {
    accessionNo: string;
    filedAt: string;
    formType: string;
    issuerName?: string;
    cusip?: string;
    reportingPersons?: any[];
    percentOfClass?: number;
    [key: string]: any;
}
interface Form13DGResponse {
    total: {
        value: number;
        relation: string;
    };
    filings: Form13DGFiling[];
    [key: string]: any;
}
interface FormNcenFiling {
    accessionNo: string;
    filedAt: string;
    periodOfReport?: string;
    registrantName?: string;
    cik?: string;
    [key: string]: any;
}
interface FormNcenResponse {
    total: {
        value: number;
        relation: string;
    };
    filings: FormNcenFiling[];
    [key: string]: any;
}
interface FormNpxMetadata {
    accessionNo: string;
    filedAt: string;
    periodOfReport?: string;
    seriesName?: string;
    cik?: string;
    [key: string]: any;
}
interface FormNpxMetadataResponse {
    total: {
        value: number;
        relation: string;
    };
    metadata: FormNpxMetadata[];
    [key: string]: any;
}
interface FormNpxVotingRecord {
    issuerName?: string;
    cusip?: string;
    meetingDate?: string;
    matterDescription?: string;
    voteInstruction?: string;
    voteStatus?: string;
    [key: string]: any;
}
interface FormNpxVotingRecordsResponse {
    accessionNo: string;
    votingRecords: FormNpxVotingRecord[];
    [key: string]: any;
}
interface FormS1424B4Filing {
    accessionNo: string;
    filedAt: string;
    formType: string;
    companyName?: string;
    cik?: string;
    offeringAmount?: number;
    proposedMaximumOfferingPricePerShare?: number;
    [key: string]: any;
}
interface FormS1424B4Response {
    total: {
        value: number;
        relation: string;
    };
    filings: FormS1424B4Filing[];
    [key: string]: any;
}
interface FormDFiling {
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
interface FormDResponse {
    total: {
        value: number;
        relation: string;
    };
    filings: FormDFiling[];
    [key: string]: any;
}
interface FormCFiling {
    accessionNo: string;
    filedAt: string;
    companyName?: string;
    cik?: string;
    targetOfferingAmount?: number;
    maximumOfferingAmount?: number;
    deadlineDate?: string;
    [key: string]: any;
}
interface FormCResponse {
    total: {
        value: number;
        relation: string;
    };
    filings: FormCFiling[];
    [key: string]: any;
}
interface RegAFiling {
    accessionNo: string;
    filedAt: string;
    formType: string;
    companyName?: string;
    cik?: string;
    tier?: string;
    offeringAmount?: number;
    [key: string]: any;
}
interface RegASearchResponse {
    total: {
        value: number;
        relation: string;
    };
    filings: RegAFiling[];
    [key: string]: any;
}
type Form1AResponse = RegASearchResponse;
type Form1KResponse = RegASearchResponse;
type Form1ZResponse = RegASearchResponse;
interface Form8KFiling {
    accessionNo: string;
    filedAt: string;
    companyName?: string;
    cik?: string;
    items?: string[];
    itemDetails?: any[];
    [key: string]: any;
}
interface Form8KResponse {
    total: {
        value: number;
        relation: string;
    };
    filings: Form8KFiling[];
    [key: string]: any;
}
type ExecCompParam = string | GenericQuery;
interface ExecCompData {
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
interface ExecCompResponse {
    total?: {
        value: number;
        relation: string;
    };
    compensation?: ExecCompData[];
    [key: string]: any;
}
interface DirectorBoardMember {
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
interface DirectorsBoardMembersResponse {
    total: {
        value: number;
        relation: string;
    };
    members: DirectorBoardMember[];
    [key: string]: any;
}
interface FloatOptions {
    ticker?: string;
    cik?: string;
}
interface FloatResponse {
    ticker?: string;
    cik?: string;
    companyName?: string;
    outstandingShares?: number;
    publicFloat?: number;
    asOfDate?: string;
    [key: string]: any;
}
interface Subsidiary {
    parentCik?: string;
    parentName?: string;
    subsidiaryName?: string;
    stateOrJurisdictionOfIncorporation?: string;
    [key: string]: any;
}
interface SubsidiaryResponse {
    total: {
        value: number;
        relation: string;
    };
    subsidiaries: Subsidiary[];
    [key: string]: any;
}
interface SecEnforcementAction {
    title?: string;
    releaseNo?: string;
    date?: string;
    respondents?: string[];
    url?: string;
    summary?: string;
    [key: string]: any;
}
interface SecEnforcementActionsResponse {
    total: {
        value: number;
        relation: string;
    };
    actions: SecEnforcementAction[];
    [key: string]: any;
}
interface SecLitigationRelease {
    title?: string;
    releaseNo?: string;
    date?: string;
    defendants?: string[];
    url?: string;
    summary?: string;
    [key: string]: any;
}
interface SecLitigationsResponse {
    total: {
        value: number;
        relation: string;
    };
    litigations: SecLitigationRelease[];
    [key: string]: any;
}
interface SecAdminProceeding {
    title?: string;
    releaseNo?: string;
    date?: string;
    respondents?: string[];
    url?: string;
    summary?: string;
    [key: string]: any;
}
interface SecAdminProceedingsResponse {
    total: {
        value: number;
        relation: string;
    };
    proceedings: SecAdminProceeding[];
    [key: string]: any;
}
interface AaerRelease {
    title?: string;
    releaseNo?: string;
    date?: string;
    url?: string;
    summary?: string;
    [key: string]: any;
}
interface AaerResponse {
    total: {
        value: number;
        relation: string;
    };
    releases: AaerRelease[];
    [key: string]: any;
}
interface SroFiling {
    sro?: string;
    title?: string;
    fileNo?: string;
    date?: string;
    url?: string;
    [key: string]: any;
}
interface SroFilingsResponse {
    total: {
        value: number;
        relation: string;
    };
    filings: SroFiling[];
    [key: string]: any;
}
interface EdgarEntity {
    cik: string;
    name: string;
    sic?: string;
    sicDescription?: string;
    stateLocation?: string;
    stateIncorporation?: string;
    fiscalYearEnd?: string;
    [key: string]: any;
}
interface EdgarEntitiesResponse {
    total: {
        value: number;
        relation: string;
    };
    entities: EdgarEntity[];
    [key: string]: any;
}
interface AuditFeeRecord {
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
interface AuditFeesResponse {
    total: {
        value: number;
        relation: string;
    };
    auditFees: AuditFeeRecord[];
    [key: string]: any;
}
interface IngestedFilingLog {
    accessionNo: string;
    formType: string;
    cik: string;
    filedAt: string;
    ingestedAt: string;
    [key: string]: any;
}
interface EdgarIngestionLogResponse {
    date: string;
    totalFilings: number;
    filings: IngestedFilingLog[];
    [key: string]: any;
}
interface DatasetMetadata {
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
interface DatasetContainer {
    key: string;
    downloadUrl: string;
    size: number;
    [key: string]: any;
}
interface DatasetDetail extends DatasetMetadata {
    containers?: DatasetContainer[];
    datasetDownloadUrl?: string;
}
interface DatasetDownloadOptions {
    name: string;
    path?: string;
    strategy?: 'containers' | 'zip';
}

declare class DatasetsApi {
    private apiKey;
    constructor(apiKey?: string);
    setApiKey(apiKey: string): void;
    getAll(): Promise<DatasetMetadata[]>;
    showAll(): Promise<DatasetMetadata[]>;
    getDetails(name: string): Promise<DatasetDetail>;
    showDetails(name: string): Promise<DatasetDetail>;
    private appendToken;
    download(nameOrOptions: string | DatasetDownloadOptions): Promise<string | string[]>;
    sync(nameOrOptions: string | DatasetDownloadOptions): Promise<string | string[]>;
}

declare class SecApi {
    private apiKey;
    readonly datasetsApi: DatasetsApi;
    constructor(apiKeyOrOptions?: string | {
        apiKey: string;
    });
    setApiKey(apiKey: string): void;
    private postWithToken;
    private getWithToken;
    queryApi: {
        setApiKey: (apiKey: string) => void;
        getFilings: <T = QueryApiResponse>(query: QueryApiQuery) => Promise<T>;
    };
    fullTextSearchApi: {
        setApiKey: (apiKey: string) => void;
        getFilings: <T = FullTextSearchResponse>(query: FullTextSearchQuery) => Promise<T>;
    };
    downloadApi: {
        setApiKey: (apiKey: string) => void;
        getFile: (edgarFileUrl: string, params?: GetFileOptions) => Promise<string | Buffer>;
    };
    renderApi: {
        setApiKey: (apiKey: string) => void;
        getFilingContent: (url: string, type?: "html" | "pdf") => Promise<string>;
    };
    pdfGeneratorApi: {
        setApiKey: (apiKey: string) => void;
        getPdf: (url: string) => Promise<Buffer>;
    };
    xbrlApi: {
        setApiKey: (apiKey: string) => void;
        xbrlToJson: <T = XbrlToJsonResponse>({ htmUrl, xbrlUrl, accessionNo }?: XbrlToJsonOptions) => Promise<T>;
    };
    extractorApi: {
        setApiKey: (apiKey: string) => void;
        getSection: <T = string>(filingUrl: string, section?: ExtractorSection, returnType?: ExtractorReturnType) => Promise<T>;
    };
    mappingApi: {
        setApiKey: (apiKey: string) => void;
        resolve: <T = MappingEntity[]>(parameter: MappingParameter, value: string) => Promise<T>;
    };
    formAdvApi: {
        setApiKey: (apiKey: string) => void;
        getFirms: <T = FormAdvFirmResponse>(query: FormAdvFirmQuery) => Promise<T>;
        getIndividuals: <T = FormAdvIndividualResponse>(query: FormAdvIndividualQuery) => Promise<T>;
        getDirectOwners: <T = FormAdvDirectOwnersResponse>(crd: string | number) => Promise<T>;
        getIndirectOwners: <T = FormAdvIndirectOwnersResponse>(crd: string | number) => Promise<T>;
        getPrivateFunds: <T = FormAdvPrivateFundsResponse>(crd: string | number) => Promise<T>;
        getOtherBusinessNames: <T = any>(crd: string | number) => Promise<T>;
        getSeparatelyManagedAccounts: <T = any>(crd: string | number) => Promise<T>;
        getFinancialIndustryAffiliations: <T = any>(crd: string | number) => Promise<T>;
        getBrochures: <T = FormAdvBrochuresResponse>(crd: string | number) => Promise<T>;
    };
    insiderTradingApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = InsiderTradingResponse>(query: InsiderTradingQuery) => Promise<T>;
    };
    form144Api: {
        setApiKey: (apiKey: string) => void;
        getData: <T = Form144Response>(query: Form144Query) => Promise<T>;
    };
    form13FHoldingsApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = Form13FHoldingsResponse>(query: Form13FHoldingsQuery) => Promise<T>;
    };
    form13FCoverPagesApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = Form13FCoverPagesResponse>(query: Form13FCoverPagesQuery) => Promise<T>;
    };
    formNportApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = FormNportResponse>(query: GenericQuery) => Promise<T>;
    };
    form13DGApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = Form13DGResponse>(query: GenericQuery) => Promise<T>;
    };
    formNcenApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = FormNcenResponse>(query: GenericQuery) => Promise<T>;
    };
    formNpxApi: {
        setApiKey: (apiKey: string) => void;
        getMetadata: <T = FormNpxMetadataResponse>(query: GenericQuery) => Promise<T>;
        getVotingRecords: <T = FormNpxVotingRecordsResponse>(accessionNo: string) => Promise<T>;
    };
    formS1424B4Api: {
        setApiKey: (apiKey: string) => void;
        getData: <T = FormS1424B4Response>(query: GenericQuery) => Promise<T>;
    };
    formDApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = FormDResponse>(query: GenericQuery) => Promise<T>;
    };
    formCApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = FormCResponse>(query: GenericQuery) => Promise<T>;
    };
    regASearchApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = RegASearchResponse>(query: GenericQuery) => Promise<T>;
    };
    form1AApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = RegASearchResponse>(query: GenericQuery) => Promise<T>;
    };
    form1KApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = RegASearchResponse>(query: GenericQuery) => Promise<T>;
    };
    form1ZApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = RegASearchResponse>(query: GenericQuery) => Promise<T>;
    };
    form8KApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = Form8KResponse>(query: GenericQuery) => Promise<T>;
    };
    execCompApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = ExecCompResponse>(parameter: ExecCompParam) => Promise<T>;
    };
    directorsBoardMembersApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = DirectorsBoardMembersResponse>(query: GenericQuery) => Promise<T>;
    };
    floatApi: {
        setApiKey: (apiKey: string) => void;
        getFloat: <T = FloatResponse>({ ticker, cik }?: FloatOptions) => Promise<T>;
    };
    subsidiaryApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = SubsidiaryResponse>(query: GenericQuery) => Promise<T>;
    };
    secEnforcementActionsApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = SecEnforcementActionsResponse>(query: GenericQuery) => Promise<T>;
    };
    secLitigationsApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = SecLitigationsResponse>(query: GenericQuery) => Promise<T>;
    };
    secAdminProceedingsApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = SecAdminProceedingsResponse>(query: GenericQuery) => Promise<T>;
    };
    aaerApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = AaerResponse>(query: GenericQuery) => Promise<T>;
    };
    sroFilingsApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = SroFilingsResponse>(query: GenericQuery) => Promise<T>;
    };
    edgarEntitiesApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = EdgarEntitiesResponse>(query: GenericQuery) => Promise<T>;
    };
    auditFeesApi: {
        setApiKey: (apiKey: string) => void;
        getData: <T = AuditFeesResponse>(query: GenericQuery) => Promise<T>;
    };
    edgarIndexApi: {
        setApiKey: (apiKey: string) => void;
        getIngestionLog: <T = EdgarIngestionLogResponse>(date: string) => Promise<T>;
    };
}
declare const setApiKey: (apiKey: string) => void;
declare const queryApi: {
    setApiKey: (apiKey: string) => void;
    getFilings: <T = QueryApiResponse>(query: QueryApiQuery) => Promise<T>;
};
declare const fullTextSearchApi: {
    setApiKey: (apiKey: string) => void;
    getFilings: <T = FullTextSearchResponse>(query: FullTextSearchQuery) => Promise<T>;
};
declare const downloadApi: {
    setApiKey: (apiKey: string) => void;
    getFile: (edgarFileUrl: string, params?: GetFileOptions) => Promise<string | Buffer>;
};
declare const renderApi: {
    setApiKey: (apiKey: string) => void;
    getFilingContent: (url: string, type?: "html" | "pdf") => Promise<string>;
};
declare const pdfGeneratorApi: {
    setApiKey: (apiKey: string) => void;
    getPdf: (url: string) => Promise<Buffer>;
};
declare const xbrlApi: {
    setApiKey: (apiKey: string) => void;
    xbrlToJson: <T = XbrlToJsonResponse>({ htmUrl, xbrlUrl, accessionNo }?: XbrlToJsonOptions) => Promise<T>;
};
declare const extractorApi: {
    setApiKey: (apiKey: string) => void;
    getSection: <T = string>(filingUrl: string, section?: ExtractorSection, returnType?: ExtractorReturnType) => Promise<T>;
};
declare const mappingApi: {
    setApiKey: (apiKey: string) => void;
    resolve: <T = MappingEntity[]>(parameter: MappingParameter, value: string) => Promise<T>;
};
declare const formAdvApi: {
    setApiKey: (apiKey: string) => void;
    getFirms: <T = FormAdvFirmResponse>(query: FormAdvFirmQuery) => Promise<T>;
    getIndividuals: <T = FormAdvIndividualResponse>(query: FormAdvIndividualQuery) => Promise<T>;
    getDirectOwners: <T = FormAdvDirectOwnersResponse>(crd: string | number) => Promise<T>;
    getIndirectOwners: <T = FormAdvIndirectOwnersResponse>(crd: string | number) => Promise<T>;
    getPrivateFunds: <T = FormAdvPrivateFundsResponse>(crd: string | number) => Promise<T>;
    getOtherBusinessNames: <T = any>(crd: string | number) => Promise<T>;
    getSeparatelyManagedAccounts: <T = any>(crd: string | number) => Promise<T>;
    getFinancialIndustryAffiliations: <T = any>(crd: string | number) => Promise<T>;
    getBrochures: <T = FormAdvBrochuresResponse>(crd: string | number) => Promise<T>;
};
declare const insiderTradingApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = InsiderTradingResponse>(query: InsiderTradingQuery) => Promise<T>;
};
declare const form144Api: {
    setApiKey: (apiKey: string) => void;
    getData: <T = Form144Response>(query: Form144Query) => Promise<T>;
};
declare const form13FHoldingsApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = Form13FHoldingsResponse>(query: Form13FHoldingsQuery) => Promise<T>;
};
declare const form13FCoverPagesApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = Form13FCoverPagesResponse>(query: Form13FCoverPagesQuery) => Promise<T>;
};
declare const formNportApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = FormNportResponse>(query: GenericQuery) => Promise<T>;
};
declare const form13DGApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = Form13DGResponse>(query: GenericQuery) => Promise<T>;
};
declare const formNcenApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = FormNcenResponse>(query: GenericQuery) => Promise<T>;
};
declare const formNpxApi: {
    setApiKey: (apiKey: string) => void;
    getMetadata: <T = FormNpxMetadataResponse>(query: GenericQuery) => Promise<T>;
    getVotingRecords: <T = FormNpxVotingRecordsResponse>(accessionNo: string) => Promise<T>;
};
declare const formS1424B4Api: {
    setApiKey: (apiKey: string) => void;
    getData: <T = FormS1424B4Response>(query: GenericQuery) => Promise<T>;
};
declare const formDApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = FormDResponse>(query: GenericQuery) => Promise<T>;
};
declare const formCApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = FormCResponse>(query: GenericQuery) => Promise<T>;
};
declare const regASearchApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = RegASearchResponse>(query: GenericQuery) => Promise<T>;
};
declare const form1AApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = RegASearchResponse>(query: GenericQuery) => Promise<T>;
};
declare const form1KApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = RegASearchResponse>(query: GenericQuery) => Promise<T>;
};
declare const form1ZApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = RegASearchResponse>(query: GenericQuery) => Promise<T>;
};
declare const form8KApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = Form8KResponse>(query: GenericQuery) => Promise<T>;
};
declare const execCompApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = ExecCompResponse>(parameter: ExecCompParam) => Promise<T>;
};
declare const directorsBoardMembersApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = DirectorsBoardMembersResponse>(query: GenericQuery) => Promise<T>;
};
declare const floatApi: {
    setApiKey: (apiKey: string) => void;
    getFloat: <T = FloatResponse>({ ticker, cik }?: FloatOptions) => Promise<T>;
};
declare const subsidiaryApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = SubsidiaryResponse>(query: GenericQuery) => Promise<T>;
};
declare const secEnforcementActionsApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = SecEnforcementActionsResponse>(query: GenericQuery) => Promise<T>;
};
declare const secLitigationsApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = SecLitigationsResponse>(query: GenericQuery) => Promise<T>;
};
declare const secAdminProceedingsApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = SecAdminProceedingsResponse>(query: GenericQuery) => Promise<T>;
};
declare const aaerApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = AaerResponse>(query: GenericQuery) => Promise<T>;
};
declare const sroFilingsApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = SroFilingsResponse>(query: GenericQuery) => Promise<T>;
};
declare const edgarEntitiesApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = EdgarEntitiesResponse>(query: GenericQuery) => Promise<T>;
};
declare const auditFeesApi: {
    setApiKey: (apiKey: string) => void;
    getData: <T = AuditFeesResponse>(query: GenericQuery) => Promise<T>;
};
declare const edgarIndexApi: {
    setApiKey: (apiKey: string) => void;
    getIngestionLog: <T = EdgarIngestionLogResponse>(date: string) => Promise<T>;
};
declare const datasetsApi: DatasetsApi;

export { type AaerRelease, type AaerResponse, type AuditFeeRecord, type AuditFeesResponse, type DatasetContainer, type DatasetDetail, type DatasetDownloadOptions, type DatasetMetadata, type DirectorBoardMember, type DirectorsBoardMembersResponse, type EdgarEntitiesResponse, type EdgarEntity, type EdgarIngestionLogResponse, type ExecCompData, type ExecCompParam, type ExecCompResponse, type ExtractorReturnType, type ExtractorSection, type Filing, type FilingDocument, type FilingEntity, type FloatOptions, type FloatResponse, type Form13DGFiling, type Form13DGResponse, type Form13FCoverPage, type Form13FCoverPagesQuery, type Form13FCoverPagesResponse, type Form13FHolding, type Form13FHoldingsQuery, type Form13FHoldingsResponse, type Form144Filing, type Form144Query, type Form144Response, type Form1AResponse, type Form1KResponse, type Form1ZResponse, type Form8KFiling, type Form8KResponse, type FormAdvBrochure, type FormAdvBrochuresResponse, type FormAdvDirectOwner, type FormAdvDirectOwnersResponse, type FormAdvFirm, type FormAdvFirmQuery, type FormAdvFirmResponse, type FormAdvIndirectOwner, type FormAdvIndirectOwnersResponse, type FormAdvIndividual, type FormAdvIndividualQuery, type FormAdvIndividualResponse, type FormAdvPrivateFund, type FormAdvPrivateFundsResponse, type FormCFiling, type FormCResponse, type FormDFiling, type FormDResponse, type FormNcenFiling, type FormNcenResponse, type FormNportFiling, type FormNportResponse, type FormNpxMetadata, type FormNpxMetadataResponse, type FormNpxVotingRecord, type FormNpxVotingRecordsResponse, type FormS1424B4Filing, type FormS1424B4Response, type FullTextSearchFiling, type FullTextSearchMatch, type FullTextSearchQuery, type FullTextSearchResponse, type GenericQuery, type GetFileOptions, type IngestedFilingLog, type InsiderTradingQuery, type InsiderTradingResponse, type InsiderTransaction, type MappingEntity, type MappingParameter, type QueryApiQuery, type QueryApiResponse, type RegAFiling, type RegASearchResponse, type SecAdminProceeding, type SecAdminProceedingsResponse, SecApi, SecApiError, type SecApiErrorResponse, type SecEnforcementAction, type SecEnforcementActionsResponse, type SecLitigationRelease, type SecLitigationsResponse, type SortClause, type SortOrder, type SroFiling, type SroFilingsResponse, type Subsidiary, type SubsidiaryResponse, type XbrlFact, type XbrlToJsonOptions, type XbrlToJsonResponse, aaerApi, auditFeesApi, datasetsApi, SecApi as default, directorsBoardMembersApi, downloadApi, edgarEntitiesApi, edgarIndexApi, execCompApi, extractorApi, floatApi, form13DGApi, form13FCoverPagesApi, form13FHoldingsApi, form144Api, form1AApi, form1KApi, form1ZApi, form8KApi, formAdvApi, formCApi, formDApi, formNcenApi, formNportApi, formNpxApi, formS1424B4Api, fullTextSearchApi, insiderTradingApi, mappingApi, pdfGeneratorApi, queryApi, regASearchApi, renderApi, secAdminProceedingsApi, secEnforcementActionsApi, secLitigationsApi, setApiKey, sroFilingsApi, subsidiaryApi, xbrlApi };
