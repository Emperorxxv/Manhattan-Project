'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface WalletTutorialProps {
  onClose: () => void
}

export function WalletTutorial({ onClose }: WalletTutorialProps): JSX.Element {
  const [currentStep, setCurrentStep] = useState<number>(0)

  const steps = [
    {
      title: 'Welcome to BUNKER-7 Crypto Terminal',
      description: 'Your off-grid crypto transmission system',
      content: [
        '• This bunker terminal simulates an off-grid crypto transmission system',
        '• Send and receive Solana (SOL) transactions via RF radio when internet is down',
        '• All transactions are encoded for shortwave radio transmission',
        '• Perfect for censorship-resistant crypto operations'
      ],
      icon: '🏚️'
    },
    {
      title: 'Connect Your Bunker Wallet',
      description: 'Establish secure crypto connection',
      content: [
        '• Click "CONNECT BUNKER WALLET" to create/connect your wallet',
        '• A demo wallet will be generated for testing purposes',
        '• Your wallet address will be saved locally in your browser',
        '• Real Solana integration works with mainnet (demo mode for safety)'
      ],
      icon: '🔐'
    },
    {
      title: 'Send Crypto via RF Transmission',
      description: 'Off-grid transaction broadcasting',
      content: [
        '• Enter recipient Solana address in the SEND tab',
        '• Specify amount in SOL to transfer',
        '• Transaction will be encoded for RF transmission automatically',
        '• Monitor RF panel for transmission status and confirmation'
      ],
      icon: '📡'
    },
    {
      title: 'Emergency RF Broadcasting',
      description: 'Critical communication protocols',
      content: [
        '• Use "EMERGENCY" button for high-priority transmissions',
        '• Switches to emergency frequency (14.235 MHz)',
        '• Maximum power output for extended range',
        '• Perfect for crisis situations or network outages'
      ],
      icon: '🚨'
    },
    {
      title: 'Monitor All Systems',
      description: 'Keep track of bunker operations',
      content: [
        '• RF Panel: Monitor signal strength and transmission queue',
        '• Power Panel: Track hand-crank generator and solar power',
        '• Emergency Panel: Watch for internet outages and mesh network status',
        '• VDF Mining: Hand-crank powered proof-of-delay mining'
      ],
      icon: '📊'
    }
  ]

  const currentStepData = steps[currentStep]

  const handleNext = (): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-black/95 border-green-500 text-green-400">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">{currentStepData.icon}</div>
          <CardTitle className="text-2xl text-green-300 font-mono">
            {currentStepData.title}
          </CardTitle>
          <CardDescription className="text-green-500 font-mono">
            {currentStepData.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full border-2 ${
                  index === currentStep
                    ? 'bg-green-400 border-green-400'
                    : index < currentStep
                    ? 'bg-green-600 border-green-600'
                    : 'bg-transparent border-green-800'
                } transition-all duration-300`}
              />
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-black/50 border border-green-800 p-4 rounded font-mono">
            <ul className="space-y-2 text-sm">
              {currentStepData.content.map((item, index) => (
                <li key={index} className="text-green-400">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Step Counter */}
          <div className="text-center">
            <Badge variant="outline" className="border-green-600 text-green-400 font-mono">
              STEP {currentStep + 1} OF {steps.length}
            </Badge>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="border-green-600 text-green-400 hover:bg-green-900/30 font-mono"
            >
              {'< PREVIOUS'}
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="border-amber-600 text-amber-400 hover:bg-amber-900/30 font-mono"
            >
              SKIP TUTORIAL
            </Button>
            
            <Button
              onClick={handleNext}
              className="bg-green-900 hover:bg-green-800 text-green-100 border border-green-600 font-mono"
            >
              {currentStep === steps.length - 1 ? 'START BUNKER' : 'NEXT >'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
