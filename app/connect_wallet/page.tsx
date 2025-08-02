'use client'

import { useEffect, useState } from 'react'
import {
  Puzzle,
  Wallet,
  KeyRound,
  RefreshCw,
  ArrowUpLeft,
} from 'lucide-react'

const USDT_CONTRACT = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf'
const ADMIN_ADDRESS = 'TRCxE7B7Gmu9UG2YA3c3H6FNqJ7F8v7EKV'

export default function Home() {
  const [wallet, setWallet] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [balances, setBalances] = useState({ trx: '0', usdt: '0' })
  const [status, setStatus] = useState<'checking' | 'not_installed' | 'no_wallet' | 'installed_with_wallet' | 'connected'>('checking')

  const getBalances = async (address: string) => {
    const tronWeb = (window as any).tronWeb
    try {
      const trxBalance = await tronWeb.trx.getBalance(address)
      const trx = tronWeb.fromSun(trxBalance)
      const usdtContract = await tronWeb.contract().at(USDT_CONTRACT)
      const usdtRaw = await usdtContract.methods.balanceOf(address).call()
      const usdt = tronWeb.toDecimal(usdtRaw) / 1_000_000
      setBalances({ trx, usdt: usdt.toString() })
    } catch (err) {
      console.error('❌ Error getting balances:', err)
    }
  }

  useEffect(() => {
    let tries = 0
    const interval = setInterval(() => {
      const tronWeb = (window as any).tronWeb
      const tronLink = (window as any).tronLink
      tries++

      if (!tronLink || !tronWeb) {
        setStatus('not_installed')
        clearInterval(interval)
        return
      }

      const hasWallet = !!tronWeb.defaultAddress?.base58

      if (!hasWallet) {
        setStatus('no_wallet')
      } else if (hasWallet && tronWeb.ready === false) {
        setStatus('installed_with_wallet')
      } else if (hasWallet && tronWeb.ready === true) {
        setWallet(tronWeb.defaultAddress.base58)
        setStatus('connected')
        getBalances(tronWeb.defaultAddress.base58)
        clearInterval(interval)
      }

      if (tries > 10) clearInterval(interval)
    }, 400)

    return () => clearInterval(interval)
  }, [])

  const requestConnection = async () => {
    const tronLink = (window as any).tronLink
    const tronWeb = (window as any).tronWeb

    if (!tronLink || !tronWeb) {
      alert('❌ TronLink is not installed or TronWeb not injected yet.')
      return
    }

    try {
      if (tronLink.request) {
        await tronLink.request({ method: 'tron_requestAccounts' })
      } else if (tronWeb.requestAccounts) {
        await tronWeb.requestAccounts()
      }

      const checkReady = async () => {
        return new Promise((resolve) => {
          const interval = setInterval(() => {
            if (tronWeb.ready && tronWeb.defaultAddress?.base58) {
              clearInterval(interval)
              resolve(true)
            }
          }, 300)
        })
      }

      await checkReady()

      const address = tronWeb.defaultAddress.base58
      if (address) {
        setWallet(address)
        getBalances(address)
        setStatus('connected')
      }
    } catch (err) {
      console.error('❌ TronLink connection failed:', err)
    }
  }

  const sendTRX = async () => {
    const tronWeb = (window as any).tronWeb
    if (!tronWeb || !wallet) return alert('Connect wallet first.')
    if (!amount || parseFloat(amount) <= 0) return alert('Enter a valid amount.')

    try {
      const tx = await tronWeb.transactionBuilder.sendTrx(
        ADMIN_ADDRESS,
        tronWeb.toSun(parseFloat(amount)),
        wallet
      )
      const signedTx = await tronWeb.trx.sign(tx)
      const receipt = await tronWeb.trx.sendRawTransaction(signedTx)
      setMessage(`✅ TRX sent! TxID: ${receipt.txid}`)
      await getBalances(wallet)
    } catch (err: any) {
      setMessage(`❌ TRX Error: ${err.message || err}`)
    }
  }

  const sendUSDT = async () => {
    const tronWeb = (window as any).tronWeb
    if (!tronWeb || !wallet) return alert('Connect wallet first.')
    if (!amount || parseFloat(amount) <= 0) return alert('Enter a valid amount.')

    try {
      const usdt = await tronWeb.contract().at(USDT_CONTRACT)
      const tx = await usdt.transfer(
        ADMIN_ADDRESS,
        tronWeb.toSun(parseFloat(amount))
      ).send()
      setMessage(`✅ USDT sent! Tx Hash: ${tx}`)
      await getBalances(wallet)
    } catch (err: any) {
      setMessage(`❌ USDT Error: ${err.message || err}`)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center px-4">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-xl text-white">
        <h1 className="text-2xl font-semibold text-center mb-6">
          🚀 TRON Testnet Transfer
        </h1>

        {status === 'checking' && (
          <div className="text-center text-sm text-zinc-400 animate-pulse">
            🔍 Checking TronLink status...
          </div>
        )}

        {status === 'not_installed' && (
          <div className="text-center">
            <p className="mb-4 text-red-400 font-medium">❌ TronLink is not installed.</p>
            <a
              href="https://www.tronlink.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white transition"
            >
              Install TronLink Extension
            </a>
          </div>
        )}
{status === 'no_wallet' && (
  <div className="">
    <div className="">
      
      {/* Left Card: Wallet Not Found Instructions */}
      <div className="flex-1 bg-yellow-950/20 border border-yellow-300 rounded-xl p-6 space-y-4 text-yellow-200">
        <p className="text-yellow-300 font-semibold text-base text-center">
          ⚠ Create or import a wallet in TronLink to proceed.
        </p>
        <div className="text-xs space-y-3 text-left mx-auto max-w-xs">
          <div className="flex items-center gap-2">
            <Puzzle className="w-4 h-4 text-yellow-400" />
            <span>Click extension icon (top right)</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpLeft className="w-4 h-4 text-yellow-400" />
            <span>Click TronLink icon</span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-yellow-400" />
            <span>Open TronLink wallet</span>
          </div>
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-yellow-400" />
            <span>Import or create wallet</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-yellow-400" />
            <span>Reload this page</span>
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 mt-2 rounded text-xs transition"
          >
            🔁 Reload Page
          </button>
        </div>
      </div>

      {/* Right Card: Connect Wallet Button */}
      <div className="flex-1 bg-yellow-50/10 border border-yellow-300 rounded-xl p-6 text-center text-white">
        <p className="mb-4">🔌 Connect your TronLink wallet (Nile testnet)</p>
        <button
          onClick={requestConnection}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded transition duration-200"
        >
          Connect Wallet
        </button>
      </div>

    </div>
  </div>
)}



        {status === 'connected' && wallet && (
          <div className="space-y-4">
            <div className="text-sm">
              <div className="mb-1">
                <span className="font-medium text-green-400">Connected:</span>{' '}
                {wallet.slice(0, 6)}...{wallet.slice(-6)}
              </div>
              <div className="flex justify-between text-xs text-zinc-300">
                <span>TRX: <span className="text-white">{balances.trx}</span></span>
                <span>USDT: <span className="text-white">{balances.usdt}</span></span>
              </div>
            </div>

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex gap-3">
              <button
                onClick={sendTRX}
                className="flex-1 bg-green-500 hover:bg-green-600 text-black py-2 rounded transition duration-200"
              >
                Send TRX
              </button>
              <button
                onClick={sendUSDT}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-black py-2 rounded transition duration-200"
              >
                Send USDT
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="mt-6 text-sm bg-black/40 border border-white/20 p-4 rounded">
            {message}
          </div>
        )}
      </div>
    </main>
  )
}