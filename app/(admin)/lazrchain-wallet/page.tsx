'use client'

import { useState, useMemo } from 'react'
import { DollarSign, TrendingUp, Coins } from 'lucide-react'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const generateWalletHistory = (count = 10, type = 'deposit') => {
  const result = []
  for (let i = 0; i < count; i++) {
    const entry = {
      date: type === 'deposit' ? '6/25/2025' : '3/20/2025',
      amount: type === 'deposit' ? 4.0081 : 2.5934,
      type,
    }
    result.push(entry)
  }
  return result
}

const WalletPage = () => {
  const [autoWithdraw, setAutoWithdraw] = useState(false)
  const [amount, setAmount] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [activeYieldType, setActiveYieldType] = useState<'auto' | 'custom'>('auto')
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals'>('deposits')

  const depositHistory = useMemo(() => generateWalletHistory(10, 'deposit'), [])
  const withdrawalHistory = useMemo(() => generateWalletHistory(10, 'withdrawal'), [])

  const currentHistory = activeTab === 'deposits' ? depositHistory : withdrawalHistory

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-crypto border-0 overflow-hidden hover:card-glow">
          <CardHeader className="bg-gradient-primary text-primary-foreground relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardTitle className="flex items-center text-base sm:text-lg relative z-10">
              <DollarSign className="w-5 h-5 mr-2 bg-white/20 p-1 rounded-full" />
              USDT Balance
            </CardTitle>
            <CardDescription className="text-sm text-primary-foreground/80 relative z-10">
              Current USDT in Your Wallet Address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="text-center bg-gradient-to-r from-muted/50 to-muted rounded-xl p-4">
              <div className="text-3xl font-bold text-foreground">$250.75</div>
              <div className="text-sm text-muted-foreground">USDT Balance</div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveYieldType('auto')}
                className={cn(
                  'w-full py-2 px-4 rounded-md border cursor-pointer text-sm font-medium',
                  activeYieldType === 'auto'
                    ? 'border-green-500 bg-white text-green-600'
                    : 'border border-muted bg-muted/30 text-muted-foreground'
                )}
              >
                Auto Yeild Generation
              </button>
              <button
                onClick={() => setActiveYieldType('custom')}
                className={cn(
                  'w-full py-2 px-4 rounded-md border cursor-pointer text-sm font-medium',
                  activeYieldType === 'custom'
                    ? 'border-green-500 bg-white text-green-600'
                    : 'border border-muted bg-muted/30 text-muted-foreground'
                )}
              >
                Custom Yeild Generation
              </button>
            </div>
            {activeYieldType === 'custom' && (
              <>
                <Input
                  placeholder="Amount to Deposit"
                  className="bg-white"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold">
                  Deposit USDT
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="card-crypto border-0 overflow-hidden hover:card-glow">
          <CardHeader className="bg-gradient-secondary text-secondary-foreground relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardTitle className="flex items-center text-base sm:text-lg relative z-10">
              <TrendingUp className="w-5 h-5 mr-2 bg-white/20 p-1 rounded-full" />
              USDT Yields
            </CardTitle>
            <CardDescription className="text-secondary-foreground/80 text-sm relative z-10">
              Current Yield
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="text-center bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl p-4">
              <div className="text-3xl font-bold text-foreground">$3.3164</div>
              <div className="text-sm text-muted-foreground font-medium">Daily Yields (USDT)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 overflow-hidden bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold">Withdraw USDT</div>
              <div className="text-white/80 text-sm">Withdraw USDT from your current Yeild</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="flex items-center gap-2">
                <Switch checked={autoWithdraw} onCheckedChange={setAutoWithdraw} />
                <div className="font-semibold text-white">{autoWithdraw ? 'On' : 'Off'}</div>
              </div>
              <div className="text-white/80 text-sm mt-1">Withdraw USDT from you Wallet Address</div>
            </div>
          </div>

          <Input
            placeholder="Amount to Withdraw"
            className="text-black bg-white"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Button className="w-full bg-white cursor-pointer text-green-600 font-semibold hover:bg-gray-100">
            <DollarSign className="w-4 h-4 mr-2" /> Withdraw USDT
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-foreground">
            <Coins className="w-5 h-5 mr-2 text-yellow-500" />
            History
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Detailed record of your Deposited and Withdrawal USDT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "deposits" | "withdrawals")}>
            <TabsList className="mb-4">
              <TabsTrigger className='cursor-pointer' value="deposits">Deposits</TabsTrigger>
              <TabsTrigger className='cursor-pointer' value="withdrawals">Withdrawals</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount (USDT)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentHistory.map((entry, idx) => (
                      <TableRow key={idx} className="hover:bg-muted/50">
                        <TableCell className="text-sm font-medium text-muted-foreground">{entry.date}</TableCell>
                        <TableCell className="text-right text-sm font-bold text-green-500">
                          ${entry.amount.toFixed(4)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default WalletPage
