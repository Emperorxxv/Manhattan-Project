'use client'

import { useEffect, useState } from 'react'
import { TerminalWindow } from './TerminalWindow'
import { StatusIndicator } from './StatusIndicator'
import { ProgressBar } from './ProgressBar'

interface EmergencyStatus {
  internetConnection: 'online' | 'offline' | 'unstable'
  bunkerBlocksQueued: number
  emergencyBroadcastActive: boolean
  meshNetworkNodes: number
  satelliteUplink: 'connected' | 'disconnected' | 'searching'
  lastEmergencyBroadcast: string
  broadcastRange: number
  emergencyProtocolLevel: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED'
}

interface BunkerBlock {
  id: string
  type: 'TRANSACTION' | 'CONSENSUS' | 'EMERGENCY' | 'STATUS'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  timestamp: string
  size: number
  status: 'QUEUED' | 'BROADCASTING' | 'CONFIRMED' | 'FAILED'
}

export function EmergencyBroadcastPanel(): JSX.Element {
  const [emergencyStatus, setEmergencyStatus] = useState<EmergencyStatus>({
    internetConnection: 'unstable',
    bunkerBlocksQueued: 7,
    emergencyBroadcastActive: false,
    meshNetworkNodes: 3,
    satelliteUplink: 'searching',
    lastEmergencyBroadcast: '23:12:45',
    broadcastRange: 45.7,
    emergencyProtocolLevel: 'YELLOW'
  })

  const [bunkerBlocks, setBunkerBlocks] = useState<BunkerBlock[]>([
    {
      id: 'BB001',
      type: 'TRANSACTION',
      priority: 'HIGH',
      timestamp: '23:14:15',
      size: 2.4,
      status: 'QUEUED'
    },
    {
      id: 'BB002',
      type: 'CONSENSUS',
      priority: 'MEDIUM',
      timestamp: '23:14:18',
      size: 1.2,
      status: 'BROADCASTING'
    },
    {
      id: 'BB003',
      type: 'EMERGENCY',
      priority: 'CRITICAL',
      timestamp: '23:14:22',
      size: 0.8,
      status: 'QUEUED'
    }
  ])

const [emergencyLog, setEmergencyLog] = useState<string[]>([
    '> EMERGENCY PROTOCOLS ACTIVE',
    '> INTERNET CONNECTION: UNSTABLE',
    '> BUNKER BLOCKS QUEUED: 7',
    '> MESH NETWORK: 3 NODES ACTIVE'
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setEmergencyStatus(prev => {
        const newStatus = { ...prev }

      // Simulate internet connection status
        if (Math.random() < 0.1) {
          const connections: Array<'online' | 'offline' | 'unstable'> = ['online', 'offline', 'unstable']
          newStatus.internetConnection = connections[Math.floor(Math.random() * connections.length)]
        }
        
        // Simulate satellite uplink status
        if (Math.random() < 0.08) {
          const uplinkStates: Array<'connected' | 'disconnected' | 'searching'> = 
            ['connected', 'disconnected', 'searching']
          newStatus.satelliteUplink = uplinkStates[Math.floor(Math.random() * uplinkStates.length)]
        }
        
        // Emergency broadcast activation
        if (newStatus.internetConnection === 'offline' && Math.random() < 0.2) {
          newStatus.emergencyBroadcastActive = true
          newStatus.lastEmergencyBroadcast = new Date().toLocaleTimeString().slice(0, 8)
        } else if (newStatus.internetConnection === 'online') {
          newStatus.emergencyBroadcastActive = false
        }
        
        // Mesh network nodes fluctuation
        newStatus.meshNetworkNodes = Math.max(0, Math.min(8, 
          newStatus.meshNetworkNodes + Math.floor((Math.random() - 0.5) * 2)
        ))
        
        // Broadcast range based on power and conditions
        newStatus.broadcastRange = Math.max(20, Math.min(80, 
          45.7 + (Math.random() - 0.5) * 10
        )) 

        // Emergency protocol level based on conditions
        if (newStatus.internetConnection === 'offline' && newStatus.satelliteUplink === 'disconnected') {
          newStatus.emergencyProtocolLevel = 'RED'
        } else if (newStatus.internetConnection === 'unstable') {
          newStatus.emergencyProtocolLevel = 'YELLOW'
        } else if (newStatus.meshNetworkNodes < 2) {
          newStatus.emergencyProtocolLevel = 'ORANGE'
        } else {
          newStatus.emergencyProtocolLevel = 'GREEN'
        }
        
        return newStatus
      })

       // Update bunker blocks
      setBunkerBlocks(prev => {
        return prev.map(block => {
          // Simulate block status changes
          if (block.status === 'QUEUED' && Math.random() < 0.1) {
            return { ...block, status: 'BROADCASTING' as const }
          }
          if (block.status === 'BROADCASTING' && Math.random() < 0.2) {
            return { ...block, status: Math.random() < 0.8 ? 'CONFIRMED' as const : 'FAILED' as const }
          }
          return block
        })
      })
      
       // Add new bunker blocks occasionally
      if (Math.random() < 0.1) {
        const newBlock: BunkerBlock = {
          id: `BB${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          type: ['TRANSACTION', 'CONSENSUS', 'EMERGENCY', 'STATUS'][Math.floor(Math.random() * 4)] as BunkerBlock['type'],
          priority: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)] as BunkerBlock['priority'],
          timestamp: new Date().toLocaleTimeString().slice(0, 8),
          size: Math.random() * 3 + 0.5,
          status: 'QUEUED'
        }       

      setBunkerBlocks(prev => [...prev.slice(-4), newBlock])
      }

      // Update emergency log
      if (Math.random() < 0.15) {
        const logMessages = [
          `> INTERNET STATUS: ${emergencyStatus.internetConnection.toUpperCase()}`,
          `> EMERGENCY BROADCAST: ${emergencyStatus.emergencyBroadcastActive ? 'ACTIVE' : 'STANDBY'}`,
          `> SATELLITE UPLINK: ${emergencyStatus.satelliteUplink.toUpperCase()}`,
          `> MESH NODES: ${emergencyStatus.meshNetworkNodes} ACTIVE`,
          `> BROADCAST RANGE: ${emergencyStatus.broadcastRange.toFixed(1)} KM`,
          `> PROTOCOL LEVEL: ${emergencyStatus.emergencyProtocolLevel}`
        ]
        
        setEmergencyLog(prev => {
          const newLog = [...prev, logMessages[Math.floor(Math.random() * logMessages.length)]]
          return newLog.slice(-6)
        })
      }
    }, 2500)

    return () => clearInterval(interval)
  }, [emergencyStatus])

  const getConnectionStatus = (): 'online' | 'offline' | 'warning' | 'error' => {
    if (emergencyStatus.internetConnection === 'online') return 'online'
    if (emergencyStatus.internetConnection === 'unstable') return 'warning'
    return 'error'
  }

  const getProtocolColor = (): string => {
    switch (emergencyStatus.emergencyProtocolLevel) {
      case 'GREEN': return 'text-green-400'
      case 'YELLOW': return 'text-amber-400'
      case 'ORANGE': return 'text-orange-400'
      case 'RED': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-400'
      case 'HIGH': return 'text-orange-400'
      case 'MEDIUM': return 'text-amber-400'
      case 'LOW': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'CONFIRMED': return 'text-green-400'
      case 'BROADCASTING': return 'text-blue-400'
      case 'QUEUED': return 'text-amber-400'
      case 'FAILED': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <TerminalWindow title="EMERGENCY BROADCAST SYSTEM" height="h-96" glowColor="red">
      <div className="space-y-4">
        {/* Connection Status */}
        <div className="space-y-2">
          <StatusIndicator 
            status={getConnectionStatus()} 
            label={`INTERNET [${emergencyStatus.internetConnection.toUpperCase()}]`} 
          />
        <StatusIndicator 
            status={emergencyStatus.satelliteUplink === 'connected' ? 'online' : 'error'} 
            label={`SATELLITE [${emergencyStatus.satelliteUplink.toUpperCase()}]`} 
          />
          <StatusIndicator 
            status={emergencyStatus.emergencyBroadcastActive ? 'transmitting' : 'online'} 
            label={`EMERGENCY BROADCAST [${emergencyStatus.emergencyBroadcastActive ? 'ACTIVE' : 'STANDBY'}]`} 
          />
        </div>

        {/* Broadcast Range */}
        <ProgressBar
          label="BROADCAST RANGE"
          value={emergencyStatus.broadcastRange}
          max={80}
          unit="KM"
          color="red"
          showPercentage={false}
        />

        {/* Emergency Stats */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-red-300">QUEUED BLOCKS</div>
            <div className="text-red-400 font-bold">{bunkerBlocks.filter(b => b.status === 'QUEUED').length}</div>
          </div>
          <div>
            <div className="text-red-300">MESH NODES</div>
            <div className="text-red-400 font-bold">{emergencyStatus.meshNetworkNodes}</div>
          </div>
          <div>
            <div className="text-red-300">PROTOCOL</div>
            <div className={`font-bold ${getProtocolColor()}`}>{emergencyStatus.emergencyProtocolLevel}</div>
          </div>
          <div>
            <div className="text-red-300">LAST BCAST</div>
            <div className="text-red-400 font-bold">{emergencyStatus.lastEmergencyBroadcast}</div>
          </div>
        </div>

        {/* Bunker Blocks Queue */}
        <div className="border-t border-red-800 pt-2">
          <div className="text-red-300 text-xs mb-2">BUNKER BLOCKS QUEUE:</div>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {bunkerBlocks.slice(-5).map((block, index) => (
              <div key={index} className="text-xs font-mono flex justify-between">
                <span className="text-red-400">
                  {block.id} [{block.type}]
                </span>
                <span className="flex space-x-2">
                  <span className={getPriorityColor(block.priority)}>
                    {block.priority}
                  </span>
                  <span className={getStatusColor(block.status)}>
                    {block.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Log */}
        <div className="border-t border-red-800 pt-2">
          <div className="text-red-300 text-xs mb-2">EMERGENCY LOG:</div>
          <div className="space-y-1 max-h-16 overflow-y-auto">
            {emergencyLog.map((log, index) => (
              <div key={index} className="text-red-400 text-xs font-mono">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </TerminalWindow>
  )
  
