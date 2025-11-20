const WalletOrder = require('../../modules/walletOrders')

exports.createWalletOrder = async (req, res) => {
  try {
    const wallet = await WalletOrder.walletOrderBuilds({ ...req.body, userId: req.user.id })
    res.status(201).send(wallet)
  } catch (error) {
    console.log('error on createWallet', error)
    res.status(400).send(error)
  }
}

exports.updateWalletOrder = async (req, res) => {
  try {
    const wallet = await WalletOrder.walletOrderUpdate({
      ...req.body,
      id: req.params.id,
      userId: req.user.id
    })
    res.status(200).send(wallet)
  } catch (error) {
    console.log('error on updateWallet', error)
    res.status(400).send(error)
  }
}

exports.walletOrderList = async (req, res) => {
  try {
    const wallets = await WalletOrder.walletOrderList({ walletId: req.query.walletId })
    res.status(200).send(wallets)
  } catch (error) {
    console.log('error on walletList', error)
    res.status(400).send(error)
  }
}

exports.walletOrderFetch = async (req, res) => {
  try {
    const wallet = await WalletOrder.walletOrderFetch({ id: req.params.id })
    res.status(200).send(wallet)
  } catch (error) {
    console.log('error on walletFetch', error)
    res.status(400).send(error)
  }
}
