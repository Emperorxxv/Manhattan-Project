'use client'

import { useEffect, useState } from 'react'
import { TerminalWindow } from './TerminalWindow'
import { StatusIndicator } from './StatusIndicator'

interface SystemOverview {
  overallStatus: 'OPERATIONAL' | 'DEGRADED' | 'CRITICAL' | 'OFFLINE'
  uptime: number
  systemLoad: number
  temperature: number
  humidity: number
  airPressure: number
  bunkerIntegrity: number
  operationalSystems: number
  totalSystems: number
  lastMaintenance: string
  nextMaintenance: string
}

interface SystemAlert {
  id: string
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  system: string
  message: string
  timestamp: string
}

export function SystemStatusPanel(): JSX.Element {
  const [systemStatus, setSystemStatus] = useState<SystemOverview>({
    overallStatus: 'OPERATIONAL',
    uptime: 14.7,
    systemLoad: 68,
    temperature: 22.5,
    humidity: 45,
    airPressure: 1013.2,
    bunkerIntegrity: 94,
    operationalSystems: 12,
    totalSystems: 14,
    lastMaintenance: '2024-06-20',
    nextMaintenance: '2024-07-20'
  })

const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([
    {
      id: 'ALT001',
      level: 'INFO',
      system: 'POWER',
      message: 'Solar panel efficiency optimal',
      timestamp: '23:14:15'
    },
    {
      id: 'ALT002',
      level: 'WARNING',
      system: 'NETWORK',
      message: 'Internet connection unstable',
      timestamp: '23:14:18'
    },
    {
      id: 'ALT003',
      level: 'INFO',
      system: 'MINING',
      message: 'VDF proof generated successfully',
      timestamp: '23:14:22'
    }
  ])

const [diagnostics, setDiagnostics] = useState<string[]>([
    '> SYSTEM DIAGNOSTICS RUNNING...',
    '> ALL CRITICAL SYSTEMS: NOMINAL',
    '> BUNKER SEAL INTEGRITY: 94%',
    '> ENVIRONMENTAL CONTROLS: ACTIVE'
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => {
        const newStatus = { ...prev }
        
        // Update uptime
        newStatus.uptime += 0.01
        
        // Simulate system load fluctuation
        newStatus.systemLoad = Math.max(30, Math.min(95, 
          prev.systemLoad + (Math.random() - 0.5) * 8
        ))
        
        // Environmental readings
        newStatus.temperature = Math.max(18, Math.min(28, 
          22.5 + (Math.random() - 0.5) * 2
        ))

     newStatus.humidity = Math.max(35, Math.min(65, 
          45 + (Math.random() - 0.5) * 8
        ))
        
        newStatus.airPressure = Math.max(1005, Math.min(1025, 
          1013.2 + (Math.random() - 0.5) * 4
        ))
        
        // Bunker integrity degrades very slowly
        if (Math.random() < 0.02) {
          newStatus.bunkerIntegrity = Math.max(85, newStatus.bunkerIntegrity - 0.1)
        }
        
        // System status changes based on various factors
        const operationalPercent = (newStatus.operationalSystems / newStatus.totalSystems) * 100
        
        if (operationalPercent >= 85 && newStatus.systemLoad < 85) {
          newStatus.overallStatus = 'OPERATIONAL'
        } else if (operationalPercent >= 70 || newStatus.systemLoad < 90) {
          newStatus.overallStatus = 'DEGRADED'
        } else if (operationalPercent >= 50) {
          newStatus.overallStatus = 'CRITICAL'
        } else {
          newStatus.overallStatus = 'OFFLINE'
        }
        
        // Randomly change operational systems count
        if (Math.random() < 0.05) {
          newStatus.operationalSystems = Math.max(8, Math.min(14, 
            newStatus.operationalSystems + (Math.random() < 0.7 ? 1 : -1)
          ))
        }

        return newStatus
      })

      // Generate system alerts
      if (Math.random() < 0.1) {
        const alertTypes = ['INFO', 'WARNING', 'ERROR', 'CRITICAL'] as const
        const systems = ['POWER', 'NETWORK', 'MINING', 'RF', 'EMERGENCY', 'LIFE_SUPPORT', 'SECURITY']
        const messages = {
          INFO: [
            'System check completed successfully',
            'Backup systems tested OK',
            'Maintenance cycle completed',
            'Performance optimization applied'
          ],
          WARNING: [
            'System load elevated',
            'Environmental readings fluctuating',
            'Backup system activation required',
            'Maintenance due soon'
          ],
          ERROR: [
            'System component failure detected',
            'Connection timeout occurred',
            'Critical threshold exceeded',
            'Backup system malfunction'
          ],
          CRITICAL: [
            'Emergency protocols activated',
            'System failure imminent',
            'Life support systems compromised',
            'Immediate attention required'
          ]
        }
        
        const level = alertTypes[Math.floor(Math.random() * alertTypes.length)]
        const system = systems[Math.floor(Math.random() * systems.length)]
        const message = messages[level][Math.floor(Math.random() * messages[level].length)]
        
        const newAlert: SystemAlert = {
          id: `ALT${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          level,
          system,
          message,
          timestamp: new Date().toLocaleTimeString().slice(0, 8)
        }
        
        setSystemAlerts(prev => [...prev.slice(-4), newAlert])
      }

      // Update diagnostics
      if (Math.random() < 0.15) {
        const diagnosticMessages = [
          `> SYSTEM LOAD: ${systemStatus.systemLoad.toFixed(1)}%`,
          `> UPTIME: ${systemStatus.uptime.toFixed(1)} HOURS`,
          `> TEMPERATURE: ${systemStatus.temperature.toFixed(1)}°C`,
          `> OPERATIONAL SYSTEMS: ${systemStatus.operationalSystems}/${systemStatus.totalSystems}`,
          `> BUNKER INTEGRITY: ${systemStatus.bunkerIntegrity.toFixed(1)}%`,
          `> OVERALL STATUS: ${systemStatus.overallStatus}`,
          `> HUMIDITY: ${systemStatus.humidity.toFixed(1)}%`,
          `> AIR PRESSURE: ${systemStatus.airPressure.toFixed(1)} hPa`
        ]
        
        setDiagnostics(prev => {
          const newDiag = [...prev, diagnosticMessages[Math.floor(Math.random() * diagnosticMessages.length)]]
          return newDiag.slice(-6)
        })
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [systemStatus])

  const getOverallStatus = (): 'online' | 'warning' | 'error' | 'offline' => {
    switch (systemStatus.overallStatus) {
      case 'OPERATIONAL': return 'online'
      case 'DEGRADED': return 'warning'
      case 'CRITICAL': return 'error'
      case 'OFFLINE': return 'offline'
      default: return 'offline'
    }
  }

  const getAlertColor = (level: string): string => {
    switch (level) {
      case 'INFO': return 'text-blue-400'
      case 'WARNING': return 'text-amber-400'
      case 'ERROR': return 'text-orange-400'
      case 'CRITICAL': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusColor = (): string => {
    switch (systemStatus.overallStatus) {
      case 'OPERATIONAL': return 'text-green-400'
      case 'DEGRADED': return 'text-amber-400'
      case 'CRITICAL': return 'text-orange-400'
      case 'OFFLINE': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <TerminalWindow title="SYSTEM STATUS OVERVIEW" height="h-96" glowColor="blue">
      <div className="space-y-4">
        {/* Overall Status */}
        <div className="space-y-2">
          <StatusIndicator 
            status={getOverallStatus()} 
            label={`BUNKER STATUS [${systemStatus.overallStatus}]`} 
          />
          <StatusIndicator 
            status="online" 
            label={`UPTIME: ${systemStatus.uptime.toFixed(1)} HOURS`} 
          />
        </div>

        {/* System Stats Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-blue-300">LOAD</div>
            <div className="text-blue-400 font-bold">{systemStatus.systemLoad.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-blue-300">TEMP</div>
            <div className="text-blue-400 font-bold">{systemStatus.temperature.toFixed(1)}°C</div>
          </div>
          <div>
            <div className="text-blue-300">HUMIDITY</div>
            <div className="text-blue-400 font-bold">{systemStatus.humidity.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-blue-300">PRESSURE</div>
            <div className="text-blue-400 font-bold">{systemStatus.airPressure.toFixed(0)} hPa</div>
          </div>
        </div>

        {/* System Health */}
        <div className="border-t border-blue-800 pt-2">
          <div className="text-blue-300 text-xs mb-2">SYSTEM HEALTH:</div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-blue-400">OPERATIONAL SYSTEMS</span>
              <span className="text-blue-400 font-bold">
                {systemStatus.operationalSystems}/{systemStatus.totalSystems}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-blue-400">BUNKER INTEGRITY</span>
              <span className="text-blue-400 font-bold">
                {systemStatus.bunkerIntegrity.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-blue-400">OVERALL STATUS</span>
              <span className={`font-bold ${getStatusColor()}`}>
                {systemStatus.overallStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="border-t border-blue-800 pt-2">
          <div className="text-blue-300 text-xs mb-2">SYSTEM ALERTS:</div>
          <div className="space-y-1 max-h-16 overflow-y-auto">
            {systemAlerts.slice(-4).map((alert, index) => (
              <div key={index} className="text-xs font-mono">
                <div className="flex justify-between">
                  <span className={getAlertColor(alert.level)}>
                    [{alert.level}] {alert.system}
                  </span>
                  <span className="text-gray-500">{alert.timestamp}</span>
                </div>
                <div className="text-gray-400 text-xs">
                  {alert.message}
                </div>
              </div>
            ))}
            </div>
        </div>

        {/* Diagnostics */}
        <div className="border-t border-blue-800 pt-2">
          <div className="text-blue-300 text-xs mb-2">DIAGNOSTICS:</div>
          <div className="space-y-1 max-h-12 overflow-y-auto">
            {diagnostics.slice(-4).map((diag, index) => (
              <div key={index} className="text-blue-400 text-xs font-mono">
                {diag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </TerminalWindow>
  )
}
