import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const Payments = () => {
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const payments = [
    { id: 'PAY001', vendor: 'TechGadgets', amount: '$2,450.00', date: '2024-01-20', status: 'Paid', method: 'Bank Transfer' },
    { id: 'PAY002', vendor: 'AudioTech', amount: '$1,890.50', date: '2024-01-19', status: 'Pending', method: 'PayPal' },
    { id: 'PAY003', vendor: 'PowerUp', amount: '$3,120.75', date: '2024-01-18', status: 'Failed', method: 'Bank Transfer' },
    { id: 'PAY004', vendor: 'GameZone', amount: '$980.25', date: '2024-01-17', status: 'Processing', method: 'Stripe' },
    { id: 'PAY005', vendor: 'MobileTech', amount: '$1,560.00', date: '2024-01-16', status: 'Paid', method: 'PayPal' },
  ]

  const filteredPayments = payments.filter(p => {
    if (filterStatus === 'all') return true
    return p.status.toLowerCase() === filterStatus
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)

  const stats = {
    totalPaid: '$4010.00',
    pending: '$5761.05',
    thisMonth: '$8,950.25',
    vendorCount: 6
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="w-3.5 h-3.5 text-green-600" />
      case 'Pending': return <Clock className="w-3.5 h-3.5 text-yellow-600" />
      case 'Failed': return <XCircle className="w-3.5 h-3.5 text-red-600" />
      case 'Processing': return <Clock className="w-3.5 h-3.5 text-blue-600" />
      default: return null
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-4 bg-background text-foreground">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage vendor payments
          </p>
        </div>
      </div>

      {/* ✅ Stats Cards FIXED */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">

        <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] text-muted-foreground">Total Paid</p>
              <p className="text-base font-semibold text-green-600">{stats.totalPaid}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <DollarSign className="w-3.5 h-3.5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] text-muted-foreground">Pending</p>
              <p className="text-base font-semibold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <Clock className="w-3.5 h-3.5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] text-muted-foreground">This Month</p>
              <p className="text-base font-semibold">{stats.thisMonth}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] text-muted-foreground">Active Vendors</p>
              <p className="text-base font-semibold">{stats.vendorCount}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <Users className="w-3.5 h-3.5 text-purple-600" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Filters */}
      <Card className="mb-4 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-11 text-sm rounded-2xl border border-slate-200 bg-white shadow-sm">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Button
  variant="outline"
  size="sm"
  className="h-11 rounded-2xl border border-slate-200 bg-white shadow-sm"
>
              <Filter className="w-3.5 h-3.5 mr-1" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm">
        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle className="text-base font-semibold">Payment History</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            {filteredPayments.length} transactions
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-0">
          <div className="space-y-2">

            {currentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-5 bg-slate-50 hover:bg-slate-100 rounded-3xl border border-slate-100 transition"
              >

                <div className="flex flex-col">
                  <p className="text-sm font-medium">{payment.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {payment.vendor} • {payment.method}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <p className="text-sm font-semibold">{payment.amount}</p>

                  <span className="text-xs text-muted-foreground">
                    {payment.date}
                  </span>

                  <div className="flex items-center gap-1">
                    {getStatusIcon(payment.status)}
                    <Badge className="rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm">
                      {payment.status}
                    </Badge>
                  </div>

                  <Button
  size="sm"
  variant="ghost"
  className="h-10 w-10 rounded-2xl border border-slate-200 bg-white"
>
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                </div>

              </div>
            ))}

          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPayments.length)} of {filteredPayments.length}
            </p>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                className="h-10 w-10 p-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <span className="text-sm">{currentPage} / {totalPages}</span>

              <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                className="h-10 w-10 p-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default Payments