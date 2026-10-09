import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.number(),
  accountId: z.number(),
  type: z.enum(['Credit', 'Debit']),
  date: z.number(),
  amount: z.number(),
  description: z.string(),
}).strict();

export type Transaction = z.infer<typeof TransactionSchema>;
export const TransactionListSchema = z.array(TransactionSchema);