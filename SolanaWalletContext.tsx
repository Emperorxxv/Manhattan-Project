'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Keypair,
  clusterApiUrl
} from '@solana/web3.js'
import bs58 from 'bs58'

interface WalletContextType {
  // Wallet State
  publicKey: PublicKey | null
  connected: boolean
  connecting: boolean
  
  // Balance & Network
  balance: number
  connection: Connection
  
  // Transaction Functions
  sendTransaction: (to: string, amount: number) => Promise<string>
  
  // Wallet Management
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  
  // Transaction History
  transactionHistory: SolanaTransaction[]
  
  // RF Encoding
  rfEncodedTransactions: RFEncodedTransaction[]
  encodeTransactionForRF: (transaction: string) => Promise<RFEncodedTransaction>
}

interface SolanaTransaction {
  signature: string
  type: 'SEND' | 'RECEIVE' | 'STAKE' | 'VOTE'
  amount: number
  status: 'PENDING' | 'CONFIRMED' | 'FAILED'
  timestamp: Date
  fromAddress?: string
  toAddress?: string
  blockTime?: number
}

interface RFEncodedTransaction {
  id: string
  originalSignature: string
  encodedData: string
  frequency: number
  timestamp: Date
  status: 'ENCODING' | 'TRANSMITTED' | 'RECEIVED' | 'DECODED'
  packetSize: number
}

const SolanaWalletContext = createContext<WalletContextType | null>(null)

export function SolanaWalletProvider({ children }: { children: ReactNode }): JSX.Element {
  // Wallet State
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [connected, setConnected] = useState<boolean>(false)
  const [connecting, setConnecting] = useState<boolean>(false)
  const [balance, setBalance] = useState<number>(0)
  
  // Network Connection (using mainnet for real data, switch to devnet for testing)
  const connection = new Connection(clusterApiUrl('mainnet-beta'))
  
  // Transaction State
  const [transactionHistory, setTransactionHistory] = useState<SolanaTransaction[]>([])
  const [rfEncodedTransactions, setRfEncodedTransactions] = useState<RFEncodedTransaction[]>([])

  // For demo purposes, we'll create a simulated wallet
  // In production, you'd integrate with Phantom, Solflare, etc.
  const connectWallet = async (): Promise<void> => {
    setConnecting(true)
    
    try {
    // In real implementation, this would connect to actual wallet
      // For demo, we'll generate a keypair and simulate wallet connection
      
      // Check if we have a saved wallet in localStorage
      let keypair: Keypair
      const savedWallet = localStorage.getItem('bunker_wallet')
      
      if (savedWallet) {
        const secretKey = bs58.decode(savedWallet)
        keypair = Keypair.fromSecretKey(secretKey)
      } else {
        // Generate new wallet for demo
        keypair = Keypair.generate()
        localStorage.setItem('bunker_wallet', bs58.encode(keypair.secretKey))
      }
      
      setPublicKey(keypair.publicKey)
      setConnected(true)
      
      // Fetch balance
      const balanceResult = await connection.getBalance(keypair.publicKey)
      setBalance(balanceResult / LAMPORTS_PER_SOL)
      
    } catch (error) {
      console.error('Wallet connection failed:', error)
    } finally {
      setConnecting(false)
    }
  }

const disconnectWallet = (): void => {
    setPublicKey(null)
    setConnected(false)
    setBalance(0)
    setTransactionHistory([])
  }

  const sendTransaction = async (to: string, amount: number): Promise<string> => {
    if (!publicKey || !connected) {
      throw new Error('Wallet not connected')
    }

    try {
      // Get wallet keypair from localStorage for demo
      const savedWallet = localStorage.getItem('bunker_wallet')
      if (!savedWallet) throw new Error('No wallet found')
      
      const secretKey = bs58.decode(savedWallet)
      const fromKeypair = Keypair.fromSecretKey(secretKey)
      const toPublicKey = new PublicKey(to)
      
      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: toPublicKey,
          lamports: amount * LAMPORTS_PER_SOL,
        }),
      )
      
      // Send transaction (this will fail in demo without actual SOL, but we'll simulate)
      // const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair])
      
      // For demo, generate a fake signature
      const signature = `${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 8)}`
      
      // Add to transaction history
      const newTransaction: SolanaTransaction = {
        signature,
        type: 'SEND',
        amount,
        status: 'PENDING',
        timestamp: new Date(),
        fromAddress: fromKeypair.publicKey.toString(),
        toAddress: to,
      }
      
      setTransactionHistory(prev => [newTransaction, ...prev])
      
      // Simulate confirmation after delay
      setTimeout(() => {
        setTransactionHistory(prev => 
          prev.map(tx => 
            tx.signature === signature 
              ? { ...tx, status: 'CONFIRMED' as const }
              : tx
          )
        )
        // Update balance
        setBalance(prev => prev - amount)
      }, 3000)
      
      return signature

    } catch (error) {
      console.error('Transaction failed:', error)
      throw error
    }
  }

  const encodeTransactionForRF = async (transactionSignature: string): Promise<RFEncodedTransaction> => {
    // Simulate RF encoding of transaction data
    const transaction = transactionHistory.find(tx => tx.signature === transactionSignature)
    if (!transaction) throw new Error('Transaction not found')
    
    // Create RF-encoded version
    const rfTransaction: RFEncodedTransaction = {
      id: `RF${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      originalSignature: transactionSignature,
      encodedData: bs58.encode(Buffer.from(JSON.stringify({
        type: transaction.type,
        amount: transaction.amount,
        from: transaction.fromAddress,
        to: transaction.toAddress,
        timestamp: transaction.timestamp.getTime()
      }))),
      frequency: 14.230 + (Math.random() - 0.5) * 0.01,
      timestamp: new Date(),
      status: 'ENCODING',
      packetSize: Math.floor(Math.random() * 512) + 256
    }

    setRfEncodedTransactions(prev => [rfTransaction, ...prev])
    
    // Simulate encoding process
    setTimeout(() => {
      setRfEncodedTransactions(prev => 
        prev.map(rf => 
          rf.id === rfTransaction.id 
            ? { ...rf, status: 'TRANSMITTED' as const }
            : rf
        )
      )
    }, 2000)
    
    return rfTransaction
  }

  // Fetch transaction history on connection
  useEffect(() => {
    if (connected && publicKey) {
      // In real implementation, fetch actual transaction history from Solana
      // For demo, we'll simulate some historical transactions
      const simulatedHistory: SolanaTransaction[] = [
        {
          signature: `${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 8)}`,
          type: 'RECEIVE',
          amount: 5.2,
          status: 'CONFIRMED',
          timestamp: new Date(Date.now() - 300000),
          toAddress: publicKey.toString()
        },
        {
          signature: `${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 8)}`,
          type: 'SEND',
          amount: 1.8,
          status: 'CONFIRMED',
          timestamp: new Date(Date.now() - 600000),
          fromAddress: publicKey.toString()
        }
      ]
      
      setTransactionHistory(simulatedHistory)
    }
  }, [connected, publicKey])

  const contextValue: WalletContextType = {
    publicKey,
    connected,
    connecting,
    balance,
    connection,
    sendTransaction,
    connectWallet,
    disconnectWallet,
    transactionHistory,
    rfEncodedTransactions,
    encodeTransactionForRF
  }

  return (
    <SolanaWalletContext.Provider value={contextValue}>
      {children}
    </SolanaWalletContext.Provider>
  )
}

export function useSolanaWallet(): WalletContextType {
  const context = useContext(SolanaWalletContext)
  if (!context) {
    throw new Error('useSolanaWallet must be used within a SolanaWalletProvider')
  }
  return context
}
