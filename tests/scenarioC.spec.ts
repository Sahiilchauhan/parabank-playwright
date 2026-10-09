import { test, expect } from '@playwright/test';
import { TransactionListSchema, Transaction } from '../types/api';

const BASE = 'https://parabank.parasoft.com/parabank';
const JSON_HDR = { Accept: 'application/json' };

// Turns an HTML page into short readable text (for debugging only)
function pageText(html: string): string {
  const i = html.indexOf('id="rightPanel"');
  const part = i >= 0 ? html.slice(i) : html;
  return part
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 400);
}

test('Scenario C: API parity', async ({ request }) => {
  // Short unique username (18 chars max, same length as the working Scenario A user)
  const username = `api${Date.now()}${Math.floor(Math.random() * 10)}`.slice(0, 18);
  const password = 'Pass1234';
  console.log('Username:', username, 'length:', username.length);

  // 1. Create user (no browser, just HTTP)
  await request.get(`${BASE}/register.htm`);

  const reg = await request.post(`${BASE}/register.htm`, {
    form: {
      'customer.firstName': 'Api',
      'customer.lastName': 'User',
      'customer.address.street': '1 Test Street',
      'customer.address.city': 'Pune',
      'customer.address.state': 'MH',
      'customer.address.zipCode': '411001',
      'customer.phoneNumber': '9999999999',
      'customer.ssn': '123-45-6789',
      'customer.username': username,
      'customer.password': password,
      repeatedPassword: password,
    },
  });
  console.log('Register status:', reg.status());
  console.log('Register page says:', pageText(await reg.text()));
  expect(reg.ok()).toBeTruthy();

  // 2. Get customer id, then their accounts
  const loginRes = await request.get(
    `${BASE}/services/bank/login/${encodeURIComponent(username)}/${encodeURIComponent(password)}`,
    { headers: JSON_HDR }
  );
  console.log('Login status:', loginRes.status());
  if (!loginRes.ok()) console.log('Login body:', (await loginRes.text()).slice(0, 300));
  expect(loginRes.ok()).toBeTruthy();
  const customer = await loginRes.json();

  const accRes = await request.get(`${BASE}/services/bank/customers/${customer.id}/accounts`, { headers: JSON_HDR });
  console.log('Accounts status:', accRes.status());
  expect(accRes.ok()).toBeTruthy();
  const accounts = await accRes.json();
  expect(accounts.length).toBeGreaterThan(0);
  const accountId = accounts[0].id;

  // 3. Deposit money
  const depositAmount = 250;
  const dep = await request.post(`${BASE}/services/bank/deposit`, {
    headers: JSON_HDR,
    params: { accountId, amount: depositAmount },
  });
  console.log('Deposit status:', dep.status());
  if (!dep.ok()) console.log('Deposit body:', (await dep.text()).slice(0, 300));
  expect(dep.ok()).toBeTruthy();

  // 4. Get transactions and validate the shape
  const txRes = await request.get(`${BASE}/services/bank/accounts/${accountId}/transactions`, { headers: JSON_HDR });
  console.log('Transactions status:', txRes.status());
  expect(txRes.ok()).toBeTruthy();
  const body = await txRes.json();
  console.log('Sample transaction:', JSON.stringify(body[0]));

  const parsed = TransactionListSchema.safeParse(body);
  expect(parsed.success, parsed.success ? '' : JSON.stringify(parsed.error.issues, null, 2)).toBeTruthy();

  const txs: Transaction[] = parsed.success ? parsed.data : [];
  expect(txs.some(t => t.type === 'Credit' && t.amount === depositAmount)).toBeTruthy();
});