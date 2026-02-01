import * as Wallet from '../../modules/wallets'

export const createWallet = async (req: any, res: any) => {
  try {
    const wallet = await Wallet.walletBuilds({ ...req.body, userId: req.user.id })
    res.status(201).send(wallet)
  } catch (error: any) {
    console.log('error on createWallet', error)
    res.status(400).send(error)
  }
}

export const updateWallet = async (req: any, res: any) => {
  try {
    const wallet = await Wallet.walletUpdate({
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

export const walletList = async (req: any, res: any) => {
  try {
    const wallets = await Wallet.walletList({ userId: req.user.id })
    res.status(200).send(wallets)
  } catch (error: any) {
    console.log('error on walletList', error)
    res.status(400).send(error)
  }
}

export const walletFetch = async (req: any, res: any) => {
  try {
    const wallet = await Wallet.walletFetch({ id: req.params.id, userId: req.user.id })
    res.status(200).send(wallet)
  } catch (error: any) {
    console.log('error on walletFetch', error)
    res.status(400).send(error)
  }
}
