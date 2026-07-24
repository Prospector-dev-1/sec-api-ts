import assert from 'node:assert/strict';
import SecApi, {
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
  SecApiError,
  Filing,
  QueryApiQuery,
} from '../src/index.js';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (err: any) {
    failed++;
    console.log(`  ❌ ${name}`);
    console.log(`    ${err.message}`);
  }
}

async function runTests() {
  console.log('\n--- Testing sec-api-ts TypeScript SDK Exports ---');

  await test('Default export & static methods exist', () => {
    assert.equal(typeof SecApi, 'function');
    assert.equal(typeof SecApi.setApiKey, 'function');
    assert.equal(typeof SecApi.queryApi?.getFilings, 'function');
  });

  await test('Named module exports exist and have setApiKey', () => {
    const apiModules = [
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
    ];

    for (const mod of apiModules) {
      assert.equal(typeof mod.setApiKey, 'function');
    }
  });

  await test('Class instantiation: new SecApi("API_KEY")', () => {
    const client = new SecApi('TEST_KEY');
    assert.equal(typeof client.setApiKey, 'function');
    assert.equal(typeof client.queryApi.getFilings, 'function');
    assert.equal(typeof client.fullTextSearchApi.getFilings, 'function');
    assert.equal(typeof client.downloadApi.getFile, 'function');
    assert.equal(typeof client.xbrlApi.xbrlToJson, 'function');
    assert.equal(typeof client.extractorApi.getSection, 'function');
    assert.equal(typeof client.mappingApi.resolve, 'function');
    assert.equal(typeof client.datasetsApi.download, 'function');
  });

  await test('Error handling on invalid key returns SecApiError', async () => {
    setApiKey('invalid-test-key');
    try {
      const query: QueryApiQuery = { query: 'formType:"10-K"', from: 0, size: 1 };
      await queryApi.getFilings(query);
      assert.fail('Should have thrown on invalid key');
    } catch (err: any) {
      assert.ok(err instanceof Error);
      assert.ok(err instanceof SecApiError || err.name === 'SecApiError');
      if (err.response) {
        assert.ok(err.response.httpStatus === 403 || err.response.status === 403);
      }
    }
  });

  console.log(`\nTests finished: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
