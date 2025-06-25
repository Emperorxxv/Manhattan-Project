'use client'

import { useEffect, useState } from 'react'
import { useSolanaWallet } from '@/contexts/SolanaWalletContext'
import { TerminalWindow } from './TerminalWindow'
import { StatusIndicator } from './StatusIndicator'
import { ProgressBar } from './ProgressBar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function EnhancedSolanaPanel(): JSX.Element {
  const { 
    publicKey, 
    connected, 
    connecting, 
    balance, 
    connectWallet, 
    disconnectWallet,
    sendTransaction,
    transactionHistory,
    encodeTransactionForRF
  } = useSolanaWallet()

  // Send Transaction State
  const [recipientAddress, setRecipientAddress] = useState<string>('')
  const [sendAmount, setSendAmount] = useState<string>('')
  const [sending, setSending] = useState<boolean>(false)
  const [sendError, setSendError] = useState<string>('')

  // Network status simulation
  const [networkHealth, setNetworkHealth] = useState<number>(87)
  const [blockHeight, setBlockHeight] = useState<number>(287459832)

  // Activity log
  const [activityLog, setActivityLog] = useState<string[]>([
    '> SOLANA WALLET SYSTEM INITIALIZED',
    '> AWAITING WALLET CONNECTION...'
  ])

  useEffect(() => {
    // Simulate network updates
    const interval = setInterval(() => {
      setNetworkHealth(prev => Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 5)))
      setBlockHeight(prev => prev + Math.floor(Math.random() * 3))
    }, 3000)

      return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Update activity log based on connection status
    if (connected && publicKey) {
      setActivityLog(prev => [
        ...prev,
        `> WALLET CONNECTED: ${publicKey.toString().substring(0, 8)}...`,
        `> BALANCE: ${balance.toFixed(4)} SOL`,
        '> TRANSACTION MONITORING ACTIVE'
      ])
    } else if (!connected) {
      setActivityLog(prev => [
        ...prev.slice(0, 2),
        '> CONNECTION STATUS: DISCONNECTED',
        '> AWAITING WALLET CONNECTION...'
      ])
    }
  }, [connected, publicKey, balance])

  const handleSendTransaction = async (): Promise<void> => {
    if (!recipientAddress || !sendAmount) {
      setSendError('Please fill in all fields')
      return
    }

    if (parseFloat(sendAmount) > balance) {
      setSendError('Insufficient balance')
      return
    }

    setSending(true)
    setSendError('')

    try {
      const signature = await sendTransaction(recipientAddress, parseFloat(sendAmount))
      
      setActivityLog(prev => [
        ...prev,
        `> TRANSACTION INITIATED: ${signature.substring(0, 8)}...`,
        `> AMOUNT: ${sendAmount} SOL`,
        `> RECIPIENT: ${recipientAddress.substring(0, 8)}...`
      ])

      // Clear form
      setRecipientAddress('')
      setSendAmount('')

      // Encode for RF transmission
      setTimeout(() => {
        encodeTransactionForRF(signature)
        setActivityLog(prev => [
          ...prev,
          `> TRANSACTION ENCODED FOR RF TRANSMISSION`,
          `> PACKET READY FOR BUNKER BROADCAST`
        ])
      }, 1000)

  } catch (error) {
      setSendError(error instanceof Error ? error.message : 'Transaction failed')
      setActivityLog(prev => [
        ...prev,
        `> TRANSACTION FAILED: ${error instanceof Error ? error.message : 'Unknown error'}`
      ])
    } finally {
      setSending(false)
    }
  }

  const getWalletStatusColor = (): 'online' | 'offline' | 'warning' | 'transmitting' => {
    if (connecting) return 'transmitting'
    if (connected) return 'online'
    return 'offline'
  }

  const truncateAddress = (address: string): string => {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
  }

  return (
    <TerminalWindow title="SOLANA CRYPTO TERMINAL" height="h-[600px]" glowColor="blue">
      <div className="space-y-4 h-full overflow-y-auto">
        {/* Wallet Status */}
        <div className="space-y-2">
          <StatusIndicator 
            status={getWalletStatusColor()} 
            label={connected 
              ? `WALLET: ${publicKey ? truncateAddress(publicKey.toString()) : 'UNKNOWN'}`
              : 'WALLET: DISCONNECTED'
            } 
          />
          {connected && (
            <StatusIndicator 
              status="online" 
              label={`BALANCE: ${balance.toFixed(4)} SOL`} 
            />
          )}
        </div>

        {/* Network Health */}
        <ProgressBar
          label="NETWORK HEALTH"
          value={networkHealth}
          max={100}
          unit="%"
          color={networkHealth > 80 ? 'blue' : networkHealth > 50 ? 'amber' : 'red'}
        />

        {/* Wallet Connection */}
        {!connected ? (
          <div className="space-y-2 border border-blue-800 p-3 rounded">
            <div className="text-blue-300 text-sm font-bold">WALLET CONNECTION REQUIRED</div>
            <Button 
              onClick={connectWallet}
              disabled={connecting}
              className="w-full bg-blue-900 hover:bg-blue-800 text-blue-100 border border-blue-600 font-mono text-xs"
            >
              {connecting ? 'CONNECTING...' : 'CONNECT BUNKER WALLET'}
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="send" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black border border-blue-800">
              <TabsTrigger value="send" className="text-blue-400 data-[state=active]:bg-blue-900 data-[state=active]:text-blue-100 font-mono text-xs">
                SEND
              </TabsTrigger>
              <TabsTrigger value="receive" className="text-blue-400 data-[state=active]:bg-blue-900 data-[state=active]:text-blue-100 font-mono text-xs">
                RECEIVE
              </TabsTrigger>
              <TabsTrigger value="history" className="text-blue-400 data-[state=active]:bg-blue-900 data-[state=active]:text-blue-100 font-mono text-xs">
                HISTORY
              </TabsTrigger>
            </TabsList>

            {/* Send Tab */}
            <TabsContent value="send" className="space-y-3 mt-4">
              <div className="border border-blue-800 p-3 rounded space-y-3">
                <div className="text-blue-300 text-sm font-bold mb-2">OUTBOUND TRANSACTION</div>
                
                <div className="space-y-2">
                  <Label className="text-blue-400 text-xs font-mono">RECIPIENT ADDRESS:</Label>
                  <Input
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="Enter Solana address..."
                    className="bg-black border-blue-800 text-blue-100 font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-blue-400 text-xs font-mono">AMOUNT (SOL):</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    placeholder="0.0000"
                    className="bg-black border-blue-800 text-blue-100 font-mono text-xs"
                  />
                </div>

                {sendError && (
                  <div className="text-red-400 text-xs font-mono p-2 border border-red-800 rounded bg-red-900/20">
                    ERROR: {sendError}
                  </div>
                )}

                <Button 
                  onClick={handleSendTransaction}
                  disabled={sending || !recipientAddress || !sendAmount}
                  className="w-full bg-green-900 hover:bg-green-800 text-green-100 border border-green-600 font-mono text-xs"
                >
                  {sending ? 'TRANSMITTING...' : 'INITIATE TRANSFER'}
                </Button>
              </div>
            </TabsContent>

            {/* Receive Tab */}
            <TabsContent value="receive" className="space-y-3 mt-4">
              <div className="border border-blue-800 p-3 rounded space-y-3">
                <div className="text-blue-300 text-sm font-bold mb-2">RECEIVE ADDRESS</div>
                
                <div className="bg-black border border-blue-700 p-3 rounded">
                  <div className="text-blue-400 text-xs font-mono mb-1">YOUR BUNKER WALLET:</div>
                  <div className="text-blue-100 text-xs font-mono break-all">
                    {publicKey?.toString()}
                  </div>
                </div>

                <div className="text-blue-400 text-xs font-mono">
                  {'> SHARE THIS ADDRESS TO RECEIVE SOL'}
                  <br />
                  {'> ALL INCOMING TRANSACTIONS MONITORED'}
                  <br />
                  {'> RF ENCODING AVAILABLE FOR OFF-GRID OPERATIONS'}
                </div>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-3 mt-4">
              <div className="border border-blue-800 p-3 rounded space-y-2">
                <div className="text-blue-300 text-sm font-bold mb-2">TRANSACTION HISTORY</div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {transactionHistory.length === 0 ? (
                    <div className="text-blue-400 text-xs font-mono">
                      {'> NO TRANSACTIONS FOUND'}
                    </div>
                  ) : (
                    transactionHistory.map((tx, index) => (
                      <div key={index} className="border border-blue-700 p-2 rounded text-xs font-mono">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-bold ${
                            tx.type === 'SEND' ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {tx.type} {tx.amount.toFixed(4)} SOL
                          </span>
                          <span className={`text-xs ${
                            tx.status === 'CONFIRMED' ? 'text-green-400' : 
                            tx.status === 'PENDING' ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                        <div className="text-blue-400 text-xs">
                          {truncateAddress(tx.signature)}
                        </div>
                        <div className="text-blue-500 text-xs">
                          {tx.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Activity Log */}
        <div className="border-t border-blue-800 pt-2">
          <div className="text-blue-300 text-xs mb-2">BUNKER ACTIVITY LOG:</div>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {activityLog.slice(-6).map((log, index) => (
              <div key={index} className="text-blue-400 text-xs font-mono">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Disconnect Button */}
        {connected && (
          <Button 
            onClick={disconnectWallet}
            className="w-full bg-red-900 hover:bg-red-800 text-red-100 border border-red-600 font-mono text-xs"
          >
            DISCONNECT WALLET
          </Button>
        )}
      </div>
    </TerminalWindow>
  )
}    
