import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Card, 
  CardContent, 
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  Eye,
  XCircle,
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Package, 
  DollarSign,
  Calendar,
  AlertTriangle,
  Store,
  User,
  MapPin,
  FileText,
  Clock,
  Utensils,
  Building2,
  Briefcase,
  Hash
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface Vendor {
  id: number
  // Owner Information
  ownerName: string
  businessName: string
  businessType: string
  businessLogo?: string
  description: string
  
  // Contact Information
  email: string
  phone: string
  password?: string
  shopAddress: string
  
  // Registration Details
  gstNumber?: string
  yearsOfOperation?: number
  shopLicense?: string
  udyamRegistration?: string
  fssaiLicense?: string
  tradeLicense?: string
  
  // Business Statistics
  products: number
  joinDate: string
  revenue: string
  rating: number
  totalSales?: number
}

const Vendors = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [vendorToCancel, setVendorToCancel] = useState<Vendor | null>(null)
  const itemsPerPage = 10

  const vendors: Vendor[] = [
    { 
      id: 1,
      ownerName: 'John Smith',
      businessName: 'TechGadgets Inc.',
      businessType: 'Electronics Retailer',
      businessLogo: 'https://via.placeholder.com/50',
      description: 'Leading retailer of consumer electronics and gadgets.',
      email: 'contact@techgadgets.com', 
      phone: '+1-555-0123',
      password: 'encrypted_password',
      shopAddress: '123 Tech Street, Silicon Valley, CA 94025',
      gstNumber: 'GSTIN1234567890',
      yearsOfOperation: 5,
      shopLicense: 'SL-2023-001234',
      udyamRegistration: 'UDYAM-TN-01-0012345',
      fssaiLicense: 'FSSAI-1234567890',
      tradeLicense: 'TL-2023-567890',
      products: 45, 
      joinDate: '2023-06-15', 
      revenue: '$45,230', 
      rating: 4.8,
      totalSales: 1234
    },
    { 
      id: 2,
      ownerName: 'Sarah Johnson',
      businessName: 'AudioTech Solutions',
      businessType: 'Audio Equipment',
      businessLogo: 'https://via.placeholder.com/50',
      description: 'Premium audio equipment provider.',
      email: 'info@audiotech.com', 
      phone: '+1-555-0124',
      password: 'encrypted_password',
      shopAddress: '456 Sound Avenue, Nashville, TN 37201',
      gstNumber: 'GSTIN0987654321',
      yearsOfOperation: 3,
      shopLicense: 'SL-2023-001235',
      udyamRegistration: 'UDYAM-TN-01-0012346',
      fssaiLicense: undefined,
      tradeLicense: 'TL-2023-567891',
      products: 28, 
      joinDate: '2023-08-22', 
      revenue: '$32,450', 
      rating: 4.6,
      totalSales: 892
    },
    { 
      id: 3,
      ownerName: 'Mike Chen',
      businessName: 'PowerUp Electronics',
      businessType: 'Electronic Components',
      businessLogo: 'https://via.placeholder.com/50',
      description: 'Wholesale distributor of electronic components.',
      email: 'sales@powerup.com', 
      phone: '+1-555-0125',
      password: 'encrypted_password',
      shopAddress: '789 Power Lane, Austin, TX 78701',
      gstNumber: 'GSTIN1122334455',
      yearsOfOperation: 2,
      shopLicense: 'SL-2023-001236',
      udyamRegistration: 'UDYAM-TN-01-0012347',
      fssaiLicense: undefined,
      tradeLicense: 'TL-2023-567892',
      products: 67, 
      joinDate: '2024-01-05', 
      revenue: '$12,890', 
      rating: 4.2,
      totalSales: 345
    },
    { 
      id: 4,
      ownerName: 'Emily Wilson',
      businessName: 'GameZone Studios',
      businessType: 'Gaming Accessories',
      businessLogo: 'https://via.placeholder.com/50',
      description: 'Your one-stop shop for gaming accessories.',
      email: 'support@gamezone.com', 
      phone: '+1-555-0126',
      password: 'encrypted_password',
      shopAddress: '321 Gaming Blvd, Los Angeles, CA 90001',
      gstNumber: 'GSTIN5566778899',
      yearsOfOperation: 4,
      shopLicense: 'SL-2023-001237',
      udyamRegistration: 'UDYAM-TN-01-0012348',
      fssaiLicense: undefined,
      tradeLicense: 'TL-2023-567893',
      products: 32, 
      joinDate: '2023-11-10', 
      revenue: '$28,760', 
      rating: 4.9,
      totalSales: 1567
    },
    { 
      id: 5,
      ownerName: 'David Brown',
      businessName: 'MobileTech',
      businessType: 'Mobile Accessories',
      businessLogo: 'https://via.placeholder.com/50',
      description: 'Specialized in mobile phone accessories.',
      email: 'hello@mobiletech.com', 
      phone: '+1-555-0127',
      password: 'encrypted_password',
      shopAddress: '654 Mobile Road, Chicago, IL 60601',
      gstNumber: 'GSTIN9988776655',
      yearsOfOperation: 1,
      shopLicense: 'SL-2023-001238',
      udyamRegistration: 'UDYAM-TN-01-0012349',
      fssaiLicense: undefined,
      tradeLicense: 'TL-2023-567894',
      products: 23, 
      joinDate: '2023-09-18', 
      revenue: '$15,430', 
      rating: 3.8,
      totalSales: 678
    },
  ]

  // No search filtering - show all vendors
  const filteredVendors = vendors

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentVendors = filteredVendors.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage)

  const stats = {
    totalVendors: vendors.length,
    totalProducts: vendors.reduce((acc, v) => acc + v.products, 0),
    totalRevenue: vendors.reduce((acc, v) => acc + parseFloat(v.revenue.replace('$', '').replace(',', '')), 0).toFixed(0)
  }

  const viewVendorDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setViewDialogOpen(true)
  }

  const confirmCancelShop = (vendor: Vendor) => {
    setVendorToCancel(vendor)
    setCancelDialogOpen(true)
  }

  const cancelShop = () => {
    if (vendorToCancel) {
      toast.success(`${vendorToCancel.businessName}'s shop has been cancelled`)
      setCancelDialogOpen(false)
      setVendorToCancel(null)
    }
  }

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header */}
       <div className="mb-4">
      <h1 className="text-2xl font-bold text-foreground">Vendors</h1>
      <p className="text-sm text-muted-foreground mt-0.5">
        Manage all registered vendors
      </p>
    </div>

      {/* Stats Cards */}
      {/* Stats Cards - FIXED */}
<div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">

  <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm">
    <CardContent className="p-5 flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="text-[11px] text-muted-foreground">Total Vendors</p>
        <p className="text-base font-semibold">{stats.totalVendors}</p>
      </div>
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
        <Store className="w-3.5 h-3.5 text-blue-600" />
      </div>
    </CardContent>
  </Card>

  <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm">
    <CardContent className="p-5 flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="text-[11px] text-muted-foreground">Total Products</p>
        <p className="text-base font-semibold text-blue-600">{stats.totalProducts}</p>
      </div>
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
        <Package className="w-3.5 h-3.5 text-blue-600" />
      </div>
    </CardContent>
  </Card>

  <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm">
    <CardContent className="p-5 flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="text-[11px] text-muted-foreground">Total Revenue</p>
        <p className="text-base font-semibold text-purple-600">${stats.totalRevenue}</p>
      </div>
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
        <DollarSign className="w-3.5 h-3.5 text-purple-600" />
      </div>
    </CardContent>
  </Card>


      </div>

      {/* Vendors List - SINGLE LINE CARDS */}
      <div className="space-y-2 sm:space-y-3">
        {currentVendors.map((vendor) => (
          <Card
  key={vendor.id}
  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition"
>
            <CardContent className="p-5">
              {/* Single Line Layout */}
              <div className="flex items-center gap-2">
                {/* Logo */}
                <div className="flex-shrink-0">
                  {vendor.businessLogo ? (
                    <img src={vendor.businessLogo} alt={vendor.businessName} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted  rounded-full flex items-center justify-center">
                      <Store className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Business Info - 1 line */}
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-xs sm:text-sm truncate">{vendor.businessName}</h3>
                    <div className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-xs text-muted-foreground">
                      <span className="truncate">{vendor.ownerName}</span>
                      <span>•</span>
                      <span className="truncate">{vendor.businessType}</span>
                    </div>
                  </div>

                  {/* Contact - hide on mobile, show on tablet/desktop */}
                  <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">{vendor.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{vendor.phone}</span>
                    </div>
                  </div>

                  {/* Stats - show on all devices */}
                  <div className="flex items-center gap-2 sm:gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Package className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium">{vendor.products}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium">{vendor.revenue}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{vendor.rating}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-10 w-10 p-0 rounded-2xl border border-slate-200 bg-white shadow-sm"
                      onClick={() => viewVendorDetails(vendor)}
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-10 w-10 p-0 rounded-2xl border border-red-200 bg-white text-red-600 shadow-sm hover:bg-red-50"
                      onClick={() => confirmCancelShop(vendor)}
                    >
                      <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {filteredVendors.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 sm:mt-8">
          <p className="text-[10px] sm:text-sm text-muted-foreground order-2 sm:order-1">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredVendors.length)} of {filteredVendors.length}
          </p>
          <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-10 w-10 p-0 rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <span className="text-[10px] sm:text-sm">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-10 w-10 p-0 rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Vendor Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
            <DialogDescription>
              Complete information about the vendor and their business
            </DialogDescription>
          </DialogHeader>
          
          {selectedVendor && (
            <div className="space-y-6 py-4">
              {/* Business Logo and Name */}
              <div className="flex items-center gap-4">
                {selectedVendor.businessLogo ? (
                  <img src={selectedVendor.businessLogo} alt={selectedVendor.businessName} className="w-16 h-16 rounded-full" />
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Store className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold">{selectedVendor.businessName}</h3>
                </div>
              </div>

              {/* Owner Information */}
              <div className="border border-slate-200 rounded-3xl bg-white shadow-sm p-5">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Owner Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Owner Name</p>
                    <p className="font-medium">{selectedVendor.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Business Type</p>
                    <p className="font-medium">{selectedVendor.businessType}</p>
                  </div>
                </div>
              </div>

              {/* Business Description */}
              <div className="border border-slate-200 rounded-3xl bg-white shadow-sm p-5">
                <h4 className="font-semibold mb-2">Business Description</h4>
                <p className="text-sm text-gray-700">{selectedVendor.description}</p>
              </div>

              {/* Contact Information */}
              <div className="border border-slate-200 rounded-3xl bg-white shadow-sm p-5">
                <h4 className="font-semibold mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground ">Email</p>
                      <p className="font-medium">{selectedVendor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedVendor.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Shop Address</p>
                      <p className="font-medium">{selectedVendor.shopAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Details */}
              <div className="border border-slate-200 rounded-3xl bg-white shadow-sm p-5">
                <h4 className="font-semibold mb-3">Registration Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedVendor.gstNumber && (
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">GST Number</p>
                        <p className="font-medium">{selectedVendor.gstNumber}</p>
                      </div>
                    </div>
                  )}
                  {selectedVendor.yearsOfOperation && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Years of Operation</p>
                        <p className="font-medium">{selectedVendor.yearsOfOperation} years</p>
                      </div>
                    </div>
                  )}
                  {selectedVendor.shopLicense && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Shop License</p>
                        <p className="font-medium">{selectedVendor.shopLicense}</p>
                      </div>
                    </div>
                  )}
                  {selectedVendor.udyamRegistration && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Udyam Registration</p>
                        <p className="font-medium">{selectedVendor.udyamRegistration}</p>
                      </div>
                    </div>
                  )}
                  {selectedVendor.fssaiLicense && (
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">FSSAI License</p>
                        <p className="font-medium">{selectedVendor.fssaiLicense}</p>
                      </div>
                    </div>
                  )}
                  {selectedVendor.tradeLicense && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Trade License</p>
                        <p className="font-medium">{selectedVendor.tradeLicense}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Statistics */}
              <div className="border border-slate-200 rounded-3xl bg-white shadow-sm p-5">
                <h4 className="font-semibold mb-3">Business Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedVendor.products}</p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedVendor.totalSales || 0}</p>
                    <p className="text-xs text-muted-foreground">Total Sales</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{selectedVendor.revenue}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{selectedVendor.rating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Joined on {selectedVendor.joinDate}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Shop Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Cancel Shop
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this vendor's shop? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {vendorToCancel && (
            <div className="py-4">
              <p className="font-medium">{vendorToCancel.businessName}</p>
              <p className="text-sm text-muted-foreground">Owner: {vendorToCancel.ownerName}</p>
              <p className="text-sm text-muted-foreground">Email: {vendorToCancel.email}</p>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Shop
            </Button>
            <Button variant="destructive" onClick={cancelShop}>
              Yes, Cancel Shop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Vendors