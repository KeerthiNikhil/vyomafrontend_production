import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {Card,CardContent,CardDescription,CardHeader,CardTitle
} from '@/components/ui/card'
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger,} from '@/components/ui/dialog'
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from '@/components/ui/select'
import { Plus, Edit,Trash2, Eye, EyeOff, Upload,X,ChevronLeft, ChevronRight,Save} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'

// Form schema validation
const bannerFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }).max(50, {
    message: "Title must not exceed 50 characters.",
  }),
  priority: z.string().min(1, {
    message: "Priority is required.",
  }),
  status: z.enum(['Active', 'Inactive'], {
    message: "Please select a status.",
  }),
})

type BannerFormValues = z.infer<typeof bannerFormSchema>

interface Banner {
  id: number
  title: string
  status: 'Active' | 'Inactive'
  image: string
  priority: number
}

const Banners = () => {
  const [banners, setBanners] = useState<Banner[]>([
    { id: 1, title: 'Summer Sale', status: 'Active', image: 'https://picsum.photos/400/200?random=1', priority: 1 },
    { id: 2, title: 'New Arrivals', status: 'Active', image: 'https://picsum.photos/400/200?random=2', priority: 2 },
    { id: 3, title: 'Winter Collection', status: 'Inactive', image: 'https://picsum.photos/400/200?random=3', priority: 3 },
    { id: 4, title: 'Flash Sale', status: 'Active', image: 'https://picsum.photos/400/200?random=4', priority: 4 },
    { id: 5, title: 'Spring Collection', status: 'Active', image: 'https://picsum.photos/400/200?random=5', priority: 5 },
    { id: 6, title: 'Clearance Sale', status: 'Inactive', image: 'https://picsum.photos/400/200?random=6', priority: 6 },
    { id: 7, title: 'Holiday Special', status: 'Active', image: 'https://picsum.photos/400/200?random=7', priority: 7 },
    { id: 8, title: 'Weekend Deal', status: 'Active', image: 'https://picsum.photos/400/200?random=8', priority: 8 },
  ])

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)
  
  // Image states
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Form for Add/Edit
  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      title: "",
      priority: "",
      status: undefined,
    },
  })

  // Edit form with different default values
  const editForm = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      title: "",
      priority: "",
      status: undefined,
    },
  })
  
  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentBanners = banners.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(banners.length / itemsPerPage)

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove image
  const removeImage = () => {
    setImagePreview(null)
    setImageFile(null)
    const input = document.getElementById('banner-image') as HTMLInputElement
    if (input) input.value = ''
  }

  // Handle Add Banner
  const onAddSubmit = (data: BannerFormValues) => {
    const newBanner: Banner = {
      id: banners.length + 1,
      title: data.title,
      status: data.status,
      priority: parseInt(data.priority),
      image: imagePreview || `https://picsum.photos/400/200?random=${banners.length + 1}`,
    }

    setBanners([...banners, newBanner])
    toast.success('Banner added successfully!')
    setAddDialogOpen(false)
    form.reset({
      title: "",
      priority: "",
      status: undefined,
    })
    removeImage()
  }

  // Handle Edit Banner
  const onEditSubmit = (data: BannerFormValues) => {
    if (!selectedBanner) return

    const updatedBanners = banners.map(banner => 
      banner.id === selectedBanner.id 
        ? { 
            ...banner, 
            title: data.title,
            status: data.status,
            priority: parseInt(data.priority),
            image: imagePreview || banner.image,
          }
        : banner
    )

    setBanners(updatedBanners)
    toast.success('Banner updated successfully!')
    setEditDialogOpen(false)
    setSelectedBanner(null)
    editForm.reset()
    removeImage()
  }

  // Open Edit Dialog with banner data
  const openEditDialog = (banner: Banner) => {
    setSelectedBanner(banner)
    editForm.reset({
      title: banner.title,
      priority: banner.priority.toString(),
      status: banner.status,
    })
    setImagePreview(banner.image)
    setEditDialogOpen(true)
  }

  // Toggle status
  const toggleStatus = (id: number) => {
    setBanners(banners.map(banner => 
      banner.id === id 
        ? { ...banner, status: banner.status === 'Active' ? 'Inactive' : 'Active' }
        : banner
    ))
    toast.success('Banner status updated!')
  }

  // Delete banner
  const deleteBanner = (id: number) => {
    setBanners(banners.filter(banner => banner.id !== id))
    toast.success('Banner deleted successfully!')
  }

  // Handle dialog close
  const handleAddDialogChange = (open: boolean) => {
    setAddDialogOpen(open)
    if (!open) {
      form.reset({
        title: "",
        priority: "",
        status: undefined,
      })
      removeImage()
    }
  }

  const handleEditDialogChange = (open: boolean) => {
    setEditDialogOpen(open)
    if (!open) {
      setSelectedBanner(null)
      editForm.reset()
      removeImage()
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-4 bg-background text-foreground">
      {/* Header Section */}
     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Banners</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage homepage banners and promotions</p>
        </div>
        
        {/* Add Banner Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={handleAddDialogChange}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto mt-4 sm:mt-0">
              <Plus className="w-4 h-4" />
              <span>Add Banner</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] w-[95%] sm:w-full p-0 gap-0 rounded-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onAddSubmit)}>
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[80vh]">
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl sm:text-2xl">Add New Banner</DialogTitle>
                    <DialogDescription className="text-sm sm:text-base text-gray-600">
                      Create a new banner to display on the homepage.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 sm:space-y-6">
                    {/* Title Field */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Banner Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Summer Sale 2024" 
                              {...field} 
                              value={field.value || ''}
                              className="text-sm sm:text-base h-10 sm:h-11"
                            />
                          </FormControl>
                          <FormDescription className="text-xs sm:text-sm text-gray-500">
                            This will be displayed on the banner.
                          </FormDescription>
                          <FormMessage className="text-xs sm:text-sm text-red-600" />
                        </FormItem>
                      )}
                    />

                    {/* Priority Field */}
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Priority</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value || ''}
                          >
                            <FormControl>
                              <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11">
                                <SelectValue placeholder="Select priority level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">High (1)</SelectItem>
                              <SelectItem value="2">Medium (2)</SelectItem>
                              <SelectItem value="3">Low (3)</SelectItem>
                              <SelectItem value="4">Very Low (4)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-xs sm:text-sm text-gray-500">
                            Higher priority banners appear first.
                          </FormDescription>
                          <FormMessage className="text-xs sm:text-sm text-red-600" />
                        </FormItem>
                      )}
                    />

                    {/* Status Field */}
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value || ''}
                          >
                            <FormControl>
                              <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11">
                                <SelectValue placeholder="Select banner status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-xs sm:text-sm text-gray-500">
                            Only active banners will be displayed.
                          </FormDescription>
                          <FormMessage className="text-xs sm:text-sm text-red-600" />
                        </FormItem>
                      )}
                    />

                    {/* Image Upload Field */}
                    <div className="space-y-2">
                      <FormLabel className="text-sm sm:text-base">Banner Image</FormLabel>
                      <div className="space-y-2">
                        {!imagePreview ? (
                          <div
                            onClick={() => document.getElementById('banner-image')?.click()}
                            className="w-full h-28 sm:h-32 bg-gray-50 rounded-lg flex flex-col items-center justify-center gap-1 sm:gap-2 hover:bg-gray-100 transition-colors cursor-pointer p-4"
                          >
                            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                            <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">
                              Click to upload image
                            </span>
                            <span className="text-xs text-gray-400 text-center">
                              PNG, JPG, GIF up to 2MB
                            </span>
                          </div>
                        ) : (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-32 sm:h-40 object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 h-8 w-8 sm:h-9 sm:w-9"
                              onClick={removeImage}
                            >
                              <X className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        )}
                        <input
                          id="banner-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Recommended size: 1200x400px. Max size: 2MB.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 mt-6">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setAddDialogOpen(false)}
                        className="w-full sm:w-auto h-10 sm:h-11"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={!form.formState.isValid || !imagePreview}
                        className="w-full sm:w-auto h-10 sm:h-11"
                      >
                        Add Banner
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Banner Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={handleEditDialogChange}>
          <DialogContent className="sm:max-w-[500px] w-[95%] sm:w-full p-0 gap-0 rounded-lg">
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)}>
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[80vh]">
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl sm:text-2xl">Edit Banner</DialogTitle>
                    <DialogDescription className="text-sm sm:text-base text-gray-600">
                      Update banner information.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 sm:space-y-6">
                    {/* Title Field */}
                    <FormField
                      control={editForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Banner Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Summer Sale 2024" 
                              {...field} 
                              value={field.value || ''}
                              className="text-sm sm:text-base h-10 sm:h-11"
                            />
                          </FormControl>
                          <FormDescription className="text-xs sm:text-sm text-gray-500">
                            This will be displayed on the banner.
                          </FormDescription>
                          <FormMessage className="text-xs sm:text-sm text-red-600" />
                        </FormItem>
                      )}
                    />

                    {/* Priority Field */}
                    <FormField
                      control={editForm.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Priority</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value || ''}
                          >
                            <FormControl>
                              <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11">
                                <SelectValue placeholder="Select priority level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">High (1)</SelectItem>
                              <SelectItem value="2">Medium (2)</SelectItem>
                              <SelectItem value="3">Low (3)</SelectItem>
                              <SelectItem value="4">Very Low (4)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-xs sm:text-sm text-gray-500">
                            Higher priority banners appear first.
                          </FormDescription>
                          <FormMessage className="text-xs sm:text-sm text-red-600" />
                        </FormItem>
                      )}
                    />

                    {/* Status Field */}
                    <FormField
                      control={editForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value || ''}
                          >
                            <FormControl>
                              <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11">
                                <SelectValue placeholder="Select banner status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-xs sm:text-sm text-gray-500">
                            Only active banners will be displayed.
                          </FormDescription>
                          <FormMessage className="text-xs sm:text-sm text-red-600" />
                        </FormItem>
                      )}
                    />

                    {/* Image Upload Field */}
                    <div className="space-y-2">
                      <FormLabel className="text-sm sm:text-base">Banner Image</FormLabel>
                      <div className="space-y-2">
                        {!imagePreview ? (
                          <div
                            onClick={() => document.getElementById('edit-banner-image')?.click()}
                            className="w-full h-28 sm:h-32 bg-gray-50 rounded-lg flex flex-col items-center justify-center gap-1 sm:gap-2 hover:bg-gray-100 transition-colors cursor-pointer p-4"
                          >
                            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                            <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">
                              Click to upload image
                            </span>
                            <span className="text-xs text-gray-400 text-center">
                              PNG, JPG, GIF up to 2MB
                            </span>
                          </div>
                        ) : (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-28 sm:h-32 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 h-8 w-8 sm:h-9 sm:w-9"
                              onClick={removeImage}
                            >
                              <X className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        )}
                        <input
                          id="edit-banner-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Recommended size: 1200x400px. Max size: 2MB.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 mt-6">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setEditDialogOpen(false)}
                        className="w-full sm:w-auto h-10 sm:h-11"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={!editForm.formState.isValid}
                        className="w-full sm:w-auto h-10 sm:h-11"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Update Banner
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banner List */}
      <Card className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm">
        <CardHeader className="px-6 pt-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Banner List</CardTitle>
              <CardDescription className="text-xs  text-muted-foreground mt-0.5">
                Manage all banners displayed on the homepage
              </CardDescription>
            </div>
            <div className="mt-2 sm:mt-0">
              <Badge
  variant="outline"
  className="rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-medium"
>
                Total: {banners.length} banners
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-1">
          {banners.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-gray-600">No banners found.</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Click "Add Banner" to create one.</p>
            </div>
          ) : (
            <>
              {/* Banner Grid - 4 cards per row on desktop, 2 on mobile */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {currentBanners.map((banner) => (
                  <div
  key={banner.id}
  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
>
                    <div className="relative">
                      <img 
                        src={banner.image} 
                        alt={banner.title} 
                        className="w-full h-32 sm:h-40 object-cover"
                      />
                      <div className="absolute top-1 right-1">
                        <Badge 
                          variant={banner.status === 'Active' ? 'default' : 'secondary'}
                          className="text-[10px] sm:text-xs px-1.5 py-0.5"
                        >
                          {banner.status}
                        </Badge>
                      </div>
                    </div>
                   <div className="p-4 border-t border-slate-100">
                      <h3 className="font-medium text-xs sm:text-sm text-gray-900 line-clamp-1">{banner.title}</h3>
                      <p className="text-[10px] sm:text-xstext-muted-foreground mb-0.5">
                        Priority: {banner.priority}
                      </p>
                      <div className="flex flex-col xs:flex-row gap-0.5 xs:items-center xs:justify-between">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full rounded-2xl border border-slate-200 h-10"
                          onClick={() => openEditDialog(banner)}
                        >
                          <Edit className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                          Edit
                        </Button>
                        <div className="flex gap-1 justify-end xs:justify-start">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleStatus(banner.id)}
                            className="text-[10px] sm:text-xs px-1.5 sm:px-2 h-7 sm:h-8"
                          >
                            {banner.status === 'Active' ? (
                              <EyeOff className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            ) : (
                              <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 text-[10px] sm:text-xs px-1.5 sm:px-2 h-7 sm:h-8"
                            onClick={() => deleteBanner(banner.id)}
                          >
                            <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 sm:mt-8">
                  <p className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, banners.length)} of {banners.length} banners
                  </p>
                  <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                    >
                      <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <span className="text-xs sm:text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                    >
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Banners