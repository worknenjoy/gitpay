import * as WalletOrder from '../../modules/walletOrders'

export const createWalletOrder = async (req: any, res: any) => {
  try {
    const wallet = await WalletOrder.walletOrderBuilds({ ...req.body, userId: req.user.id })
    res.status(201).send(wallet)
  } catch (error: any) {
    console.log('error on createWallet', error)
    res.status(400).send(error)
  }
}

export const updateWalletOrder = async (req: any, res: any) => {
  try {
    const wallet = await WalletOrder.walletOrderUpdate({
      ...req.body,
      id: req.params.id,
      userId: req.user.id
    })
    res.status(200).send(wallet)
  } catch (error: any) {
    console.log('error on updateWallet', error)
    res.status(400).send(error)
  }
}

export const walletOrderList = async (req: any, res: any) => {
  try {
    const wallets = await WalletOrder.walletOrderList({ walletId: req.query.walletId })
    res.status(200).send(wallets)
  } catch (error: any) {
    console.log('error on walletList', error)
    res.status(400).send(error)
  }
}

export const walletOrderFetch = async (req: any, res: any) => {
  try {
    const wallet = await WalletOrder.walletOrderFetch({ id: req.params.id })
    res.status(200).send(wallet)
  } catch (error: any) {
    console.log('error on walletFetch', error)
    res.status(400).send(error)
  }
}
