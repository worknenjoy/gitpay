import { fetchTransfer } from '../../queries/transfer/fetchTransfer'

export async function transferFetch(id: number, userId: number) {
  return fetchTransfer(id, userId)
}
