'use client'

import { useEffect, useState } from 'react'
import { useSolanaWallet } from '@/contexts/SolanaWalletContext'
import { TerminalWindow } from './TerminalWindow'
import { StatusIndicator } from './StatusIndicator'
import { ProgressBar } from './ProgressBar'
import { Button } from '@/components/ui/button'

interface RFTransmissionData {
  id: string
  type: 'TRANSACTION' | 'EMERGENCY' | 'HEARTBEAT' | 'BUNKER_BLOCK'
  frequency: number
  power: number
  dataSize: number
  status: 'QUEUED' | 'ENCODING' | 'TRANSMITTING' | 'TRANSMITTED' | 'CONFIRMED'
  timestamp: Date
  recipient?: string
  retryCount: number
}

interface RFReceptionData {
  id: string
  frequency: number
  signalStrength: number
  dataIntegrity: number
  decodedTransaction?: string
  timestamp: Date
  source: 'MESH_NODE' | 'SATELLITE' | 'DIRECT_RF' | 'BUNKER_RELAY'
}

export function EnhancedRFPanel(): JSX.Element {
  const { 
    connected, 
    rfEncodedTransactions, 
    transactionHistory,
    encodeTransactionForRF 
  } = useSolanaWallet()

  // RF Status
  const [rfStatus, setRfStatus] = useState({
    antennaAlignment: 95,
    signalStrength: 78,
    frequency: 14.230,
    powerOutput: 45,
    encodingProgress: 0,
    emergencyMode: false
  })

  // Transmission Queue
  const [transmissionQueue, setTransmissionQueue] = useState<RFTransmissionData[]>([])
  const [receptionLog, setReceptionLog] = useState<RFReceptionData[]>([])
  
  // Activity Log
  const [rfActivityLog, setRfActivityLog] = useState<string[]>([
    '> RF TRANSCEIVER SYSTEM ONLINE',
    '> SHORTWAVE ANTENNA ALIGNED',
    '> FREQUENCY LOCKED: 14.230 MHz',
    '> AWAITING CRYPTO TRANSMISSION DATA...'
  ])

  // Auto-transmit encoded transactions
  useEffect(() => {
    rfEncodedTransactions.forEach(rfTx => {
      const existingTx = transmissionQueue.find(tx => tx.id === rfTx.id)
      if (!existingTx && rfTx.status === 'TRANSMITTED') {
        const newTransmission: RFTransmissionData = {
          id: rfTx.id,
          type: 'TRANSACTION',
          frequency: rfTx.frequency,
          power: Math.floor(Math.random() * 50) + 30,
          dataSize: rfTx.packetSize,
          status: 'QUEUED',
          timestamp: rfTx.timestamp,
          retryCount: 0
        }

      setTransmissionQueue(prev => [newTransmission, ...prev.slice(0, 9)])
        setRfActivityLog(prev => [
          ...prev,
          `> CRYPTO TX QUEUED FOR RF: ${rfTx.id}`,
          `> PACKET SIZE: ${rfTx.packetSize} BYTES`,
          `> FREQUENCY: ${rfTx.frequency.toFixed(3)} MHz`
        ])
      }
    })
  }, [rfEncodedTransactions, transmissionQueue])

  // RF Transmission Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Update RF status
      setRfStatus(prev => ({
        ...prev,
        signalStrength: Math.max(20, Math.min(100, prev.signalStrength + (Math.random() - 0.5) * 15)),
        frequency: 14.230 + (Math.random() - 0.5) * 0.005,
        antennaAlignment: Math.max(70, Math.min(100, prev.antennaAlignment + (Math.random() - 0.5) * 5)),
        powerOutput: Math.max(20, Math.min(100, prev.powerOutput + (Math.random() - 0.5) * 10))
      }))

      // Process transmission queue
      setTransmissionQueue(prev => 
        prev.map(tx => {
          if (tx.status === 'QUEUED' && Math.random() < 0.3) {
            return { ...tx, status: 'ENCODING' as const }
          }
          if (tx.status === 'ENCODING' && Math.random() < 0.4) {
            return { ...tx, status: 'TRANSMITTING' as const }
          }
          if (tx.status === 'TRANSMITTING' && Math.random() < 0.5) {
            return { ...tx, status: 'TRANSMITTED' as const }
          }
          if (tx.status === 'TRANSMITTED' && Math.random() < 0.2) {
            return { ...tx, status: 'CONFIRMED' as const }
          }
          return tx
        })
      )

       // Simulate incoming RF data
      if (Math.random() < 0.1) {
        const sources: Array<'MESH_NODE' | 'SATELLITE' | 'DIRECT_RF' | 'BUNKER_RELAY'> = 
          ['MESH_NODE', 'SATELLITE', 'DIRECT_RF', 'BUNKER_RELAY']
        
        const newReception: RFReceptionData = {
          id: `RX${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          frequency: 14.230 + (Math.random() - 0.5) * 0.02,
          signalStrength: Math.floor(Math.random() * 80) + 20,
          dataIntegrity: Math.floor(Math.random() * 40) + 60,
          source: sources[Math.floor(Math.random() * sources.length)],
          timestamp: new Date()
        }

        setReceptionLog(prev => [newReception, ...prev.slice(0, 9)])
      }

      // Update activity log
      if (Math.random() < 0.2) {
        const logMessages = [
          `> SIGNAL STRENGTH: ${rfStatus.signalStrength.toFixed(1)}%`,
          `> ANTENNA ALIGNMENT: ${rfStatus.antennaAlignment.toFixed(1)}%`,
          `> POWER OUTPUT: ${rfStatus.powerOutput.toFixed(1)}W`,
          `> FREQUENCY DRIFT: ${(rfStatus.frequency - 14.230).toFixed(4)} MHz`,
          '> RF PACKET BUFFER: READY',
          '> EMERGENCY BROADCAST STANDBY',
          '> CRYPTO ENCODING MODULE: ACTIVE'
        ]
        
        setRfActivityLog(prev => {
          const newLog = [...prev, logMessages[Math.floor(Math.random() * logMessages.length)]]
          return newLog.slice(-8)
        })
      }
    }, 2500)

    return () => clearInterval(interval)
  }, [rfStatus.signalStrength, rfStatus.antennaAlignment, rfStatus.powerOutput, rfStatus.frequency])

  const handleEmergencyBroadcast = (): void => {
    const emergencyTx: RFTransmissionData = {
      id: `EMG${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      type: 'EMERGENCY',
      frequency: 14.235, // Emergency frequency
      power: 100,
      dataSize: 128,
      status: 'QUEUED',
      timestamp: new Date(),
      retryCount: 0
    }

    setTransmissionQueue(prev => [emergencyTx, ...prev])
    setRfStatus(prev => ({ ...prev, emergencyMode: true }))
    
    setRfActivityLog(prev => [
      ...prev,
      '> EMERGENCY BROADCAST INITIATED',
      `> SWITCHING TO EMERGENCY FREQ: ${emergencyTx.frequency} MHz`,
      '> MAXIMUM POWER OUTPUT ENGAGED',
      '> BUNKER STATUS: CRITICAL'
    ])

    // Clear emergency mode after 10 seconds
    setTimeout(() => {
      setRfStatus(prev => ({ ...prev, emergencyMode: false }))
    }, 10000)
  }

  const handleBroadcastLatestTransaction = (): void => {
    const latestTx = transactionHistory[0]
    if (!latestTx) {
      setRfActivityLog(prev => [...prev, '> ERROR: NO TRANSACTIONS TO BROADCAST'])
      return
    }

    encodeTransactionForRF(latestTx.signature)
    setRfActivityLog(prev => [
      ...prev,
      `> ENCODING LATEST TRANSACTION FOR RF`,
      `> TX: ${latestTx.signature.substring(0, 8)}...`,
      '> PREPARING FOR OFF-GRID BROADCAST'
    ])
  }

  const getTransmissionStatusColor = (status: string): string => {
    switch (status) {
      case 'CONFIRMED': return 'text-green-400'
      case 'TRANSMITTED': return 'text-blue-400'
      case 'TRANSMITTING': return 'text-amber-400'
      case 'ENCODING': return 'text-cyan-400'
      case 'QUEUED': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

const getRFStatusIndicator = (): 'online' | 'offline' | 'warning' | 'error' | 'transmitting' => {
    if (rfStatus.emergencyMode) return 'error'
    if (transmissionQueue.some(tx => tx.status === 'TRANSMITTING')) return 'transmitting'
    if (rfStatus.signalStrength > 60) return 'online'
    if (rfStatus.signalStrength > 30) return 'warning'
    return 'error'
  }

  return (
    <TerminalWindow title="RF CRYPTO TRANSMISSION ARRAY" height="h-[600px]" glowColor="green">
      <div className="space-y-4 h-full overflow-y-auto">
        {/* RF Status */}
        <div className="space-y-2">
          <StatusIndicator 
            status={getRFStatusIndicator()} 
            label={`RF TRANSCEIVER [${rfStatus.frequency.toFixed(3)} MHz]`} 
          />
          <StatusIndicator 
            status={connected ? 'online' : 'offline'} 
            label={`CRYPTO ENCODER: ${connected ? 'READY' : 'STANDBY'}`} 
          />
          {rfStatus.emergencyMode && (
            <StatusIndicator 
              status="error" 
              label="EMERGENCY MODE ACTIVE" 
            />
          )}
        </div>

        {/* Signal Metrics */}
        <ProgressBar
          label="SIGNAL STRENGTH"
          value={rfStatus.signalStrength}
          max={100}
          unit="%"
          color={rfStatus.signalStrength > 60 ? 'green' : rfStatus.signalStrength > 30 ? 'amber' : 'red'}
        />

        <ProgressBar
          label="ANTENNA ALIGNMENT"
          value={rfStatus.antennaAlignment}
          max={100}
          unit="%"
          color={rfStatus.antennaAlignment > 80 ? 'green' : 'amber'}
        />

        <ProgressBar
          label="POWER OUTPUT"
          value={rfStatus.powerOutput}
          max={100}
          unit="W"
          color="green"
        />

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={handleBroadcastLatestTransaction}
            disabled={!connected || transactionHistory.length === 0}
            className="bg-green-900 hover:bg-green-800 text-green-100 border border-green-600 font-mono text-xs"
          >
            BROADCAST TX
          </Button>
          <Button 
            onClick={handleEmergencyBroadcast}
            className="bg-red-900 hover:bg-red-800 text-red-100 border border-red-600 font-mono text-xs"
          >
            EMERGENCY
          </Button>
        </div>

        {/* Transmission Queue */}
        <div className="border border-green-800 p-2 rounded">
          <div className="text-green-300 text-xs mb-2">TRANSMISSION QUEUE:</div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {transmissionQueue.length === 0 ? (
              <div className="text-green-400 text-xs font-mono">
                {'> QUEUE EMPTY - AWAITING CRYPTO DATA'}
              </div>
            ) : (
              transmissionQueue.map((tx, index) => (
                <div key={index} className="text-xs font-mono flex justify-between items-center">
                  <span className="text-green-400">
                    {tx.id} [{tx.type}] {tx.dataSize}B
                  </span>
                  <span className={getTransmissionStatusColor(tx.status)}>
                    {tx.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reception Log */}
        <div className="border border-green-800 p-2 rounded">
          <div className="text-green-300 text-xs mb-2">RF RECEPTION LOG:</div>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {receptionLog.length === 0 ? (
              <div className="text-green-400 text-xs font-mono">
                {'> NO INCOMING RF DATA'}
              </div>
            ) : (
              receptionLog.map((rx, index) => (
                <div key={index} className="text-xs font-mono">
                  <span className="text-green-400">
                    {rx.id} [{rx.source}] {rx.signalStrength}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Log */}
        <div className="border-t border-green-800 pt-2">
          <div className="text-green-300 text-xs mb-2">RF ACTIVITY LOG:</div>
          <div className="space-y-1 max-h-16 overflow-y-auto">
            {rfActivityLog.slice(-6).map((log, index) => (
              <div key={index} className="text-green-400 text-xs font-mono">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </TerminalWindow>
  )
}
