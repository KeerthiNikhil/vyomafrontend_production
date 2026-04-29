import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Star, 
  Eye, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from 'lucide-react'

const Reviews = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const reviews = [
    { id: 1, product: 'Wireless Headphones', rating: 5, comment: 'Great sound quality! Highly recommended.', customer: 'John Doe', date: '2024-01-20' },
    { id: 2, product: 'Smart Watch Pro', rating: 4, comment: 'Good battery life but a bit pricey.', customer: 'Jane Smith', date: '2024-01-19' },
    { id: 3, product: 'USB-C Charger', rating: 3, comment: 'Average performance, works as expected.', customer: 'Mike Johnson', date: '2024-01-18' },
    { id: 4, product: 'Gaming Mouse', rating: 5, comment: 'Perfect for gaming! Very responsive.', customer: 'Sarah Wilson', date: '2024-01-17' },
    { id: 5, product: 'Bluetooth Speaker', rating: 4, comment: 'Good sound, portable size.', customer: 'Tom Brown', date: '2024-01-16' },
    { id: 6, product: '4K Monitor', rating: 5, comment: 'Amazing display quality!', customer: 'Emily Davis', date: '2024-01-15' },
    { id: 7, product: 'Mechanical Keyboard', rating: 5, comment: 'Best keyboard I ever used!', customer: 'Alex Lee', date: '2024-01-14' },
    { id: 8, product: 'Webcam HD', rating: 4, comment: 'Good quality for video calls.', customer: 'Nina Patel', date: '2024-01-13' },
  ]

  const filteredReviews = reviews

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)

  const stats = {
    totalReviews: reviews.length,
    averageRating: (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1),
    fiveStar: reviews.filter(r => r.rating === 5).length,
    fourStar: reviews.filter(r => r.rating === 4).length,
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-4 bg-background text-foreground">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Product Reviews</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage all customer reviews
          </p>
        </div>
        <Button
  variant="outline"
  className="w-full sm:w-auto mt-4 sm:mt-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <MessageSquare className="w-4 h-4 mr-2" />
          Export Reviews
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        
        <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-[11px] text-muted-foreground">Total Reviews</p>
            <p className="text-base font-semibold">{stats.totalReviews}</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-[11px] text-muted-foreground">Average Rating</p>
            <div className="flex items-center gap-1">
              <p className="text-base font-semibold">{stats.averageRating}</p>
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-[11px] text-muted-foreground">5 Star Reviews</p>
            <p className="text-base font-semibold text-blue-600">{stats.fiveStar}</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-[11px] text-muted-foreground">4 Star Reviews</p>
            <p className="text-base font-semibold text-purple-600">{stats.fourStar}</p>
          </CardContent>
        </Card>

      </div>

      {/* Reviews List */}
      <Card className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm">
        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle className="text-base font-semibold">Customer Reviews</CardTitle>
          <CardDescription className="mt-0.5 text-xs text-muted-foreground">
            {filteredReviews.length} reviews found
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-0">
          <div className="space-y-2">
            {currentReviews.map((review) => (
              
              <div 
                key={review.id} 
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-5 bg-slate-50 hover:bg-slate-100 rounded-3xl border border-slate-100 transition"
              >

                {/* LEFT */}
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{review.product}</p>
                  <p className="text-xs text-muted-foreground">
                    {review.customer} • {review.comment.slice(0, 30)}...
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex items-center justify-between sm:justify-end gap-3">

                  {/* Rating */}
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Date */}
                  <span className="text-xs text-muted-foreground">
                    {review.date}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-1">
                    <Button
  size="sm"
  variant="ghost"
  className="h-10 w-10 rounded-2xl border border-slate-200 bg-white"
>
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button
  size="sm"
  variant="ghost"
  className="h-10 w-10 rounded-2xl border border-red-200 bg-white text-red-600"
>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                </div>
              </div>

            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredReviews.length)} of {filteredReviews.length} reviews
            </p>

            <div className="flex items-center gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-10 w-10 p-0 rounded-2xl border border-slate-200 bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <span className="text-sm">
                {currentPage} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-10 w-10 p-0 rounded-2xl border border-slate-200 bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default Reviews