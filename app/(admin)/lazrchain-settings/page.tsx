'use client'

import { useState, useEffect } from 'react'
import { Gift, Wallet, Sliders } from 'lucide-react'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast' // ✅ toast hook

const rewardSettings = [
  {
    id: 'collect',
    label: 'Referral Reward Settings',
    description: 'How should referral rewards be managed?',
    icon: Gift,
    gradient: 'from-green-400 to-emerald-500',
    value: 'auto',
    options: ['auto', 'manual'],
    optionLabels: ['Auto Collect', 'Manual Collect'],
    optionDescriptions: {
      auto: 'Referral bonuses are automatically sent to user wallet address.',
      manual:
        'User must manually claim their referral earnings. If not claimed, they will be sent to the admin wallet.',
    },
  },
  {
    id: 'withdraw',
    label: 'Withdraw Method',
    description: 'Choose how user earnings are received',
    icon: Wallet,
    gradient: 'from-blue-400 to-indigo-500',
    value: 'direct',
    options: ['direct', 'request'],
    optionLabels: ['Deposit Directly', 'Request Withdraw'],
    optionDescriptions: {
      direct: "Earnings are deposited automatically to user's registered wallet.",
      request:
        'User must request withdrawal. A fixed amount will be emailed to admin, who will transfer it manually.',
    },
  },
]

export default function SettingsPage() {
  const { toast } = useToast() // ✅ Get toast
const [collectMode, setCollectMode] = useState<'auto' | 'manual'>(() => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('collectMode') as 'auto' | 'manual') || 'manual'
  }
  return 'manual'
})
  const [withdrawMode, setWithdrawMode] = useState<'direct' | 'request'>('direct')

  useEffect(() => {
  const savedCollect = localStorage.getItem('collectMode')
  const savedWithdraw = localStorage.getItem('withdrawMode')

  if (savedCollect === 'manual' || savedCollect === 'auto') {
    setCollectMode(savedCollect)
  }

  if (savedWithdraw === 'direct' || savedWithdraw === 'request') {
    setWithdrawMode(savedWithdraw)
  }
}, [])

  // ✅ Handler with toast
const handleOptionChange = (
  type: 'collect' | 'withdraw',
  value: 'auto' | 'manual' | 'direct' | 'request',
  label: string
) => {
  if (type === 'collect') {
    setCollectMode(value as 'auto' | 'manual')
    localStorage.setItem('collectMode', value)
  } else {
    setWithdrawMode(value as 'direct' | 'request')
    localStorage.setItem('withdrawMode', value)
  }

  toast({
    title: `${label} Updated`,
    description: `Set to ${
      value === 'auto'
        ? 'Auto Collect'
        : value === 'manual'
        ? 'Manual Collect'
        : value === 'direct'
        ? 'Deposit Directly'
        : 'Request Withdraw'
    }.`,
  })
}

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-semibold">
            <Sliders className="w-6 h-6 mr-3 text-yellow-500" />
            Reward & Withdrawal Controls
          </CardTitle>
          <CardDescription>Referral Rewards & Profit Withdrawal Settings</CardDescription>
        </CardHeader>
        <CardContent className="shadow-lg pb-20 rounded-b-[11px]">
          <div className="grid gap-4">
            {rewardSettings.map((reward, index) => {
              const isCollect = reward.id === 'collect'
              const currentValue = isCollect ? collectMode : withdrawMode

              return (
                <Card key={index} className={`pt-2 bg-gradient-to-r ${reward.gradient} dark:bg-gray-800`}>
                  <CardContent className="p-4 py-5 flex bg-white rounded-b-[11px] shadow-lg flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    {/* Left Section - Icon and Text */}
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${reward.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}
                      >
                        <reward.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <div className="font-bold text-base">{reward.description}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {reward.optionDescriptions[currentValue]}
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Buttons */}
                    <div className="flex-shrink-0">
                      <div className="inline-flex rounded-lg bg-gray-100 p-1">
                        {reward.options.map((opt, idx) => {
                          const active = currentValue === opt
                          const base = isCollect ? 'green' : 'blue'
                          const isDisabled =                                    ////////////////////////
                            (reward.id === 'collect' && opt === 'auto') ||      ////////////////////////
                            (reward.id === 'withdraw' && opt === 'request')     ////////////////////////
                          return (
                            // <button
                            //   key={idx}
                            //   onClick={() =>
                            //     handleOptionChange(reward.id as any, opt as any, reward.label)
                            //   }
                            //   className={`
                            //     px-4 py-2 text-sm font-medium
                            //     rounded-lg
                            //     transition
                            //     ${
                            //       active
                            //         ? `bg-${base}-500 text-white`
                            //         : `bg-transparent text-${base}-700 hover:bg-white`
                            //     }
                            //     focus:outline-none
                            //   `}
                            // >
                            //   {reward.optionLabels[idx]}
                            // </button>
                            <button
                              key={idx}
                              onClick={() =>
                                !isDisabled && handleOptionChange(reward.id as any, opt as any, reward.label)
                              }
                              disabled={isDisabled}
                              className={`px-4 py-2 text-sm font-medium rounded-lg transition focus:outline-none
                                ${active ? `bg-${base}-500 text-white` : `bg-transparent text-${base}-700 hover:bg-white`}
                                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                              `}
                            >
                              {reward.optionLabels[idx]}
                            </button>

                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
