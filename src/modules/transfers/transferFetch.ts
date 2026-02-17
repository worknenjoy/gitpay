import { fetchTransfer } from '../../queries/transfer/fetchTransfer'

export async function transferFetch(id: number) {
  return fetchTransfer(id)
}
