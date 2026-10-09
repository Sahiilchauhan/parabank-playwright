import { APIRequestContext, expect } from '@playwright/test';

const BASE_URL = 'https://parabank.parasoft.com/parabank/services/bank';

export async function cleanDatabase(request: APIRequestContext): Promise<void> {
  const response = await request.post(`${BASE_URL}/cleanDB`);
  console.log('cleanDB status:', response.status());
  expect(response.ok(), 'cleanDB failed').toBeTruthy();
}

export async function setLoanProvider(
  request: APIRequestContext,
  provider: string = 'ws'
): Promise<void> {
  const response = await request.post(
    `${BASE_URL}/setParameter/loanProvider/${provider}`
  );
  console.log('setLoanProvider status:', response.status());
  expect(response.ok(), 'setLoanProvider failed').toBeTruthy();
}
