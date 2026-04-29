import { DollarSign, Package, Star, Users, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip
} from "recharts"

const Dashboard = () => {

  const stats = [
    { title: 'Total Revenue', value: '$24,580', icon: DollarSign, change: '+12%' },
    { title: 'Active Products', value: '1,248', icon: Package, change: '+8%' },
    { title: 'Total Reviews', value: '4,872', icon: Star, change: '+23%' },
    { title: 'Active Vendors', value: '342', icon: Users, change: '+5%' },
  ]

  const donutData = [
    { name: "Sales", value: 85 },
    { name: "Remaining", value: 15 },
  ]

  const COLORS = ["#6366F1", "#E5E7EB"]

  const lineData = [
    { name: "Jan", sales: 400 },
    { name: "Feb", sales: 300 },
    { name: "Mar", sales: 500 },
    { name: "Apr", sales: 400 },
    { name: "May", sales: 600 },
    { name: "Jun", sales: 550 },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-4 bg-background text-foreground">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, Admin! Here's what's happening.
          </p>
        </div>
        <Button className="mt-4 sm:mt-0">
          <TrendingUp className="w-4 h-4 mr-2" />
          View Reports
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {stats.map((stat, index) => (
          <Card
  key={index}
  className="rounded-3xl border border-slate-200 shadow-sm bg-white"
>
            <CardContent className="p-2 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[11px] text-muted-foreground">{stat.title}</p>
                <p className="text-base font-semibold">{stat.value}</p>
                <p className="text-[11px] text-green-600">{stat.change}</p>
              </div>
              <div className="p-1.5 bg-muted rounded-full">
                <stat.icon className="w-3.5 h-3.5 text-green-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Activity */}
        <Card className="h-72 rounded-3xl border border-slate-200 shadow-sm bg-white">
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Latest updates from your store
            </CardDescription>
          </CardHeader>

          <CardContent className="p-2 pt-0 space-y-2 overflow-y-auto">
            {[
              { activity: 'New product added by Vendor A', time: '2 min ago', icon: Package },
              { activity: 'Payment received for Order #1234', time: '15 min ago', icon: DollarSign },
              { activity: 'New vendor approved', time: '1 hour ago', icon: Users },
              { activity: 'Banner updated', time: '2 hours ago', icon: Star },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between px-4 py-4 bg-slate-100 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-background rounded-md">
                    <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <p className="text-sm">{item.activity}</p>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="h-72 rounded-3xl border border-slate-200 shadow-sm bg-white">
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-base">Quick Stats</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Overview
            </CardDescription>
          </CardHeader>

          <CardContent className="p-3 pt-0">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Pending Reviews", value: 12, color: "text-yellow-600" },
                { label: "Unpaid Vendors", value: 8, color: "text-orange-600" },
                { label: "Banners", value: 5, color: "text-green-600" },
                { label: "Low Stock", value: 12, color: "text-red-600" },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-slate-100 rounded-2xl">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className={`text-sm font-semibold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Charts */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Donut */}
        <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm h-78">
          <CardHeader className="p-3">
            <CardTitle className="text-base">Total Bill</CardTitle>
          </CardHeader>

          <CardContent className="p-6 pt-0 flex items-center gap-6">

            <div className="text-xs space-y-2 text-muted-foreground">
              <p>Received Amount: 1,523,151</p>
              <p>Ordered Amount: 3,124,213</p>
              <p>Refund Amount: 9,482</p>
              <p>Due Amount: 9,482</p>
            </div>

            <div className="relative w-40 h-40 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} dataKey="value" innerRadius={40} outerRadius={60}>
                    {donutData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-muted-foreground">85%</span>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Line */}
        <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm h-78">
          <CardHeader className="p-3 flex justify-between items-center">
            <CardTitle className="text-base">Statistics</CardTitle>
            <span className="text-xs text-muted-foreground">Mar 2026</span>
          </CardHeader>

          <CardContent className="p-3 pt-0">
            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#6366F1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Audience */}
      <Card className="mt-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle className="text-sm text-muted-foreground">Audience</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Customers have visited website
            </CardDescription>
          </div>
          <span className="text-xs text-muted-foreground">March 2026</span>
        </CardHeader>

        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* LEFT */}
          <div className="w-full md:w-[65%] space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">New Users</p>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full w-[70%] bg-gradient-to-r from-purple-500 to-blue-500"></div>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Returning Users</p>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full w-[50%] bg-gradient-to-r from-indigo-400 to-purple-500"></div>
              </div>
            </div>
          </div>

          {/* RIGHT - BIG CIRCLE */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">

              <circle
                cx="80"
                cy="80"
                r="60"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                fill="transparent"
              />

              <circle
                cx="80"
                cy="80"
                r="60"
                stroke="#8B5CF6"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="377"
                strokeDashoffset="203"
                strokeLinecap="round"
              />
            </svg>

            <span className="absolute text-lg font-semibold text-muted-foreground">
              46%
            </span>
          </div>

        </CardContent>
      </Card>

    </div>
  )
}

export default Dashboard