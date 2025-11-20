const user = require('../../models/user')
const Wallet = require('../../modules/wallets')

exports.createWallet = async (req, res) => {
  try {
    const wallet = await Wallet.walletBuilds({ ...req.body, userId: req.user.id })
    res.status(201).send(wallet)
  } catch (error) {
    console.log('error on createWallet', error)
    res.status(400).send(error)
  }
}

exports.updateWallet = async (req, res) => {
  try {
    const wallet = await Wallet.walletUpdate({
      ...req.body,
      id: req.params.id,
      userId: req.user.id,
    })
    res.status(200).send(wallet)
  } catch (error) {
    console.log('error on updateWallet', error)
    res.status(400).send(error)
  }
}

exports.walletList = async (req, res) => {
  try {
    const wallets = await Wallet.walletList({ userId: req.user.id })
    res.status(200).send(wallets)
  } catch (error) {
    console.log('error on walletList', error)
    res.status(400).send(error)
  }
}

exports.walletFetch = async (req, res) => {
  try {
    const wallet = await Wallet.walletFetch({ id: req.params.id, userId: req.user.id })
    res.status(200).send(wallet)
  } catch (error) {
    console.log('error on walletFetch', error)
    res.status(400).send(error)
  }
}
