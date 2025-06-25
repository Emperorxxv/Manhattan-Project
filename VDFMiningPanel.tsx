'use client'

import { useEffect, useState } from 'react'
import { TerminalWindow } from './TerminalWindow'
import { StatusIndicator } from './StatusIndicator'
import { ProgressBar } from './ProgressBar'

interface VDFStatus {
  isMinig: boolean
  currentDifficulty: number
  hashRate: number
  delayProgress: number
  proofsGenerated: number
  challengesSolved: number
  energyPerProof: number
  handCrankPower: number
  estimatedTimeToProof: number
  currentChallenge: string
}

interface MiningProof {
  id: string
  timestamp: string
  difficulty: number
  delayTime: number
  energyUsed: number
  status: 'GENERATING' | 'VERIFIED' | 'SUBMITTED' | 'CONFIRMED'
}

export function VDFMiningPanel(): JSX.Element {
  const [vdfStatus, setVdfStatus] = useState<VDFStatus>({
    isMinig: false,
    currentDifficulty: 256,
    hashRate: 12.5,
    delayProgress: 0,
    proofsGenerated: 23,
    challengesSolved: 18,
    energyPerProof: 2.4,
    handCrankPower: 0,
    estimatedTimeToProof: 0,
    currentChallenge: 'vdf_0x7a8b9c2e...'
  })

  const [miningProofs, setMiningProofs] = useState<MiningProof[]>([
    {
      id: 'PROOF_001',
      timestamp: '23:13:45',
      difficulty: 256,
      delayTime: 127.5,
      energyUsed: 2.4,
      status: 'CONFIRMED'
    },
    {
      id: 'PROOF_002',
      timestamp: '23:14:12',
      difficulty: 256,
      delayTime: 134.2,
      energyUsed: 2.6,
      status: 'GENERATING'
    }
  ])

  const [miningLog, setMiningLog] = useState<string[]>([
    '> VDF MINING SYSTEM INITIALIZED',
    '> CHALLENGE DIFFICULTY: 256',
    '> HAND CRANK POWER: REQUIRED',
    '> PROOF GENERATION: STANDBY'
  ])

useEffect(() => {
    const interval = setInterval(() => {
      setVdfStatus(prev => {
        const newStatus = { ...prev }
        
        // Simulate hand crank power input
        if (Math.random() < 0.15) {
          newStatus.handCrankPower = Math.random() < 0.3 ? Math.random() * 30 + 10 : 0
        } else {
          newStatus.handCrankPower = Math.max(0, newStatus.handCrankPower - 2)
        }
        
        // Mining only happens with sufficient hand crank power
        newStatus.isMinig = newStatus.handCrankPower > 15
        
        if (newStatus.isMinig) {
          // Hash rate depends on hand crank power
          newStatus.hashRate = (newStatus.handCrankPower / 40) * 20 + 5

        // Progress delay function based on power
          const progressRate = (newStatus.handCrankPower / 100) * 2
          newStatus.delayProgress = Math.min(100, newStatus.delayProgress + progressRate)
          
          // Estimate time to complete proof
          if (progressRate > 0) {
            newStatus.estimatedTimeToProof = ((100 - newStatus.delayProgress) / progressRate) * 2
          }
          
          // Complete proof when progress reaches 100%
          if (newStatus.delayProgress >= 100) {
            newStatus.delayProgress = 0
            newStatus.proofsGenerated += 1
            newStatus.challengesSolved += Math.random() < 0.8 ? 1 : 0
            newStatus.currentChallenge = `vdf_0x${Math.random().toString(16).slice(2, 10)}...`
            
            // Create new proof
            const newProof: MiningProof = {
              id: `PROOF_${String(newStatus.proofsGenerated).padStart(3, '0')}`,
              timestamp: new Date().toLocaleTimeString().slice(0, 8),
              difficulty: newStatus.currentDifficulty,
              delayTime: Math.random() * 50 + 100,
              energyUsed: newStatus.energyPerProof,
              status: 'VERIFIED'
            }
            
            setMiningProofs(prev => [...prev.slice(-4), newProof])
          }
        } else {
          // Reset progress when not mining
          newStatus.delayProgress = Math.max(0, newStatus.delayProgress - 1)
          newStatus.estimatedTimeToProof = 0
        }
        
        // Adjust difficulty occasionally
        if (Math.random() < 0.02) {
          newStatus.currentDifficulty = Math.max(128, Math.min(512, 
            newStatus.currentDifficulty + (Math.random() < 0.5 ? -16 : 16)
          ))
        }
        
        // Energy per proof varies with difficulty
        newStatus.energyPerProof = (newStatus.currentDifficulty / 256) * 2.5 + 1.5
        
        return newStatus
      })

      // Update mining proofs status
      setMiningProofs(prev => {
        return prev.map(proof => {
          if (proof.status === 'GENERATING' && Math.random() < 0.1) {
            return { ...proof, status: 'VERIFIED' as const }
          }
          if (proof.status === 'VERIFIED' && Math.random() < 0.08) {
            return { ...proof, status: 'SUBMITTED' as const }
          }
          if (proof.status === 'SUBMITTED' && Math.random() < 0.06) {
            return { ...proof, status: 'CONFIRMED' as const }
          }
          return proof
        })
      })

       // Update mining log
      if (Math.random() < 0.2) {
        const logMessages = [
          `> HAND CRANK POWER: ${vdfStatus.handCrankPower.toFixed(1)}W`,
          `> HASH RATE: ${vdfStatus.hashRate.toFixed(1)} H/s`,
          `> DIFFICULTY: ${vdfStatus.currentDifficulty}`,
          vdfStatus.isMinig ? '> MINING: ACTIVE' : '> MINING: STANDBY - NEED POWER',
          `> PROOFS GENERATED: ${vdfStatus.proofsGenerated}`,
          `> DELAY PROGRESS: ${vdfStatus.delayProgress.toFixed(1)}%`,
          `> CHALLENGE: ${vdfStatus.currentChallenge}`
        ]
        
        setMiningLog(prev => {
          const newLog = [...prev, logMessages[Math.floor(Math.random() * logMessages.length)]]
          return newLog.slice(-6)
        })
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [vdfStatus])

const getMiningStatus = (): 'online' | 'offline' | 'warning' | 'transmitting' => {
    if (vdfStatus.isMinig) return 'transmitting'
    if (vdfStatus.handCrankPower > 10) return 'warning'
    return 'offline'
  }

  const getProofStatusColor = (status: string): string => {
    switch (status) {
      case 'CONFIRMED': return 'text-green-400'
      case 'SUBMITTED': return 'text-blue-400'
      case 'VERIFIED': return 'text-amber-400'
      case 'GENERATING': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <TerminalWindow title="VDF PROOF-OF-DELAY MINING" height="h-80" glowColor="green">
      <div className="space-y-4">
        {/* Mining Status */}
        <div className="space-y-2">
          <StatusIndicator 
            status={getMiningStatus()} 
            label={`VDF MINER [${vdfStatus.isMinig ? 'MINING' : 'STANDBY'}]`} 
          />
      <StatusIndicator 
            status={vdfStatus.handCrankPower > 15 ? 'online' : 'error'} 
            label={`HAND CRANK [${vdfStatus.handCrankPower.toFixed(1)}W]`} 
          />
        </div>

        {/* Mining Progress */}
        {vdfStatus.isMinig && (
          <ProgressBar
            label="DELAY FUNCTION PROGRESS"
            value={vdfStatus.delayProgress}
            max={100}
            unit="%"
            color="green"
            showPercentage={true}
          />
        )}    

        {/* Hash Rate */}
        <ProgressBar
          label="HASH RATE"
          value={vdfStatus.hashRate}
          max={25}
          unit=" H/s"
          color={vdfStatus.hashRate > 15 ? 'green' : 'amber'}
          showPercentage={false}
        />

        {/* Mining Stats */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-green-300">PROOFS</div>
            <div className="text-green-400 font-bold">{vdfStatus.proofsGenerated}</div>
          </div>
          <div>
            <div className="text-green-300">SOLVED</div>
            <div className="text-green-400 font-bold">{vdfStatus.challengesSolved}</div>
          </div>
          <div>
            <div className="text-green-300">DIFFICULTY</div>
            <div className="text-green-400 font-bold">{vdfStatus.currentDifficulty}</div>
          </div>
          <div>
            <div className="text-green-300">ENERGY/PROOF</div>
            <div className="text-green-400 font-bold">{vdfStatus.energyPerProof.toFixed(1)}Wh</div>
          </div>
        </div>

        {/* ETA Display */}
        {vdfStatus.isMinig && (
          <div className="border-t border-green-800 pt-2">
            <div className="text-green-300 text-xs">TIME TO PROOF:</div>
            <div className="text-green-400 font-bold">
              {vdfStatus.estimatedTimeToProof > 0 ? `${vdfStatus.estimatedTimeToProof.toFixed(1)}min` : 'CALCULATING...'}
            </div>
          </div>
        )}

        {/* Recent Proofs */}
        <div className="border-t border-green-800 pt-2">
          <div className="text-green-300 text-xs mb-2">RECENT PROOFS:</div>
          <div className="space-y-1 max-h-16 overflow-y-auto">
            {miningProofs.slice(-3).map((proof, index) => (
              <div key={index} className="text-xs font-mono flex justify-between">
                <span className="text-green-400">
                  {proof.id}
                </span>
                <span className={getProofStatusColor(proof.status)}>
                  {proof.status} [{proof.delayTime.toFixed(1)}s]
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mining Log */}
        <div className="border-t border-green-800 pt-2">
          <div className="text-green-300 text-xs mb-2">MINING LOG:</div>
          <div className="space-y-1 max-h-12 overflow-y-auto">
            {miningLog.slice(-4).map((log, index) => (
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
