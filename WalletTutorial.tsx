'use client'

import React, { useState } from 'react'

interface WalletTutorialProps {
  onComplete: () => void
}

export function WalletTutorial({ onComplete }: WalletTutorialProps): JSX.Element {
  const [currentStep, setCurrentStep] = useState<number>(0)

  const steps = [
    {
      title: 'WELCOME TO BUNK',
      content: (
        <div className="space-y-4">
          <p className="text-green-300">
            {'Welcome to the BUNK Off-Grid Crypto Transmission System!'}
          </p>
          <p className="text-green-400">
            {'This terminal provides censorship-resistant Solana blockchain operations via RF transmission for survival scenarios.'}
          </p>
          <div className="border border-green-500 p-3 bg-green-900/20">
            <p className="text-yellow-400 text-sm">
              {'⚠️ SECURITY NOTICE: This is a demonstration system. Do not use with real funds.'}
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'BUNK WALLET SYSTEM',
      content: (
        <div className="space-y-4">
          <p className="text-green-300">
            {'The BUNK Wallet System generates demo Solana keypairs locally for testing crypto operations.'}
          </p>
          <ul className="list-disc list-inside text-green-400 space-y-2">
            <li>{'Generate secure wallet keypairs'}</li>
            <li>{'Send and receive SOL (demo mode)'}</li>
            <li>{'Monitor transaction history'}</li>
            <li>{'Encode transactions for RF transmission'}</li>
          </ul>
          <div className="border border-green-500 p-3 bg-green-900/20">
            <p className="text-green-300 text-sm">
              {'Click "CONNECT BUNK WALLET" to generate your demo keypair'}
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'RF TRANSMISSION ARRAY',
      content: (
        <div className="space-y-4">
          <p className="text-green-300">
            {'The RF Communication Array simulates off-grid transaction broadcasting via shortwave radio.'}
          </p>
          <ul className="list-disc list-inside text-green-400 space-y-2">
            <li>{'Normal operations: 14.230 MHz'}</li>
            <li>{'Emergency mode: 14.235 MHz'}</li>
            <li>{'Transaction encoding via base58'}</li>
            <li>{'Mesh network relay simulation'}</li>
          </ul>
          <div className="border border-amber-500 p-3 bg-amber-900/20">
            <p className="text-amber-300 text-sm">
              {'🔊 RF broadcasts maintain crypto operations when internet infrastructure fails'}
            </p>
          </div>
          </div>
      )
    },
    {
      title: 'POWER & MINING SYSTEMS',
      content: (
        <div className="space-y-4">
          <p className="text-green-300">
            {'BUNK features autonomous power generation and VDF-based proof-of-delay mining.'}
          </p>
          <ul className="list-disc list-inside text-green-400 space-y-2">
            <li>{'Hand-crank generator (15-40W bursts)'}</li>
            <li>{'Solar panel array with weather simulation'}</li>
            <li>{'Battery backup system'}</li>
            <li>{'VDF mining powered by manual labor'}</li>
          </ul>
          <div className="border border-blue-500 p-3 bg-blue-900/20">
            <p className="text-blue-300 text-sm">
              {'⚡ Click power buttons to simulate hand-cranking and manual operations'}
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'EMERGENCY PROTOCOLS',
      content: (
        <div className="space-y-4">
          <p className="text-green-300">
            {'Emergency systems activate during internet outages or infrastructure failures.'}
          </p>
          <ul className="list-disc list-inside text-green-400 space-y-2">
            <li>{'Bunker blocks for offline operations'}</li>
            <li>{'Satellite uplink backup'}</li>
            <li>{'Mesh node network relay'}</li>
            <li>{'Emergency RF frequency switching'}</li>
          </ul>
          <div className="border border-red-500 p-3 bg-red-900/20">
            <p className="text-red-300 text-sm">
              {'🚨 System automatically switches to emergency protocols when needed'}
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'BUNK OPERATIONAL',
      content: (
        <div className="space-y-4">
          <p className="text-green-300">
            {'BUNK is now ready for off-grid crypto operations!'}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="border border-green-500 p-2 bg-green-900/20">
              <p className="text-green-400 font-bold">{'CRYPTO OPS:'}</p>
              <p className="text-green-300">{'Connect wallet → Send/Receive SOL'}</p>
            </div>
            <div className="border border-blue-500 p-2 bg-blue-900/20">
              <p className="text-blue-400 font-bold">{'RF ARRAY:'}</p>
              <p className="text-blue-300">{'Monitor transmissions & signals'}</p>
            </div>
            <div className="border border-yellow-500 p-2 bg-yellow-900/20">
              <p className="text-yellow-400 font-bold">{'POWER:'}</p>
              <p className="text-yellow-300">{'Manage generators & batteries'}</p>
            </div>
            <div className="border border-red-500 p-2 bg-red-900/20">
              <p className="text-red-400 font-bold">{'EMERGENCY:'}</p>
              <p className="text-red-300">{'Monitor protocols & alerts'}</p>
            </div>
          </div>
          <p className="text-center text-green-400 font-bold">
            {'SURVIVE THE CRYPTO APOCALYPSE! 🏚️⚡🔥'}
          </p>
        </div>
      )
      }
  ]

  const nextStep = (): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-green-500 max-w-2xl w-full p-6 shadow-lg shadow-green-500/20">
        {/* Header */}
        <div className="border-b border-green-500 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-green-400 text-center">
            {steps[currentStep].title}
          </h2>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 ${index === currentStep ? 'bg-green-400' : 'bg-green-800'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8 min-h-[300px]">
          {steps[currentStep].content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-4 py-2 border ${
              currentStep === 0
                ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                : 'border-green-500 text-green-400 hover:bg-green-900/20'
            } transition-colors`}
          >
            {'◄ PREVIOUS'}
          </button>
          
          <span className="text-green-400 py-2">
            {`${currentStep + 1} / ${steps.length}`}
          </span>
          
          <button
            onClick={nextStep}
            className="px-4 py-2 border border-green-500 text-green-400 hover:bg-green-900/20 transition-colors"
          >
           {currentStep === steps.length - 1 ? 'START OPERATIONS ►' : 'NEXT ►'}
          </button>
        </div>
      </div>
    </div>
  )
} 
