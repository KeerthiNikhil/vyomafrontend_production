import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  Search,
  Star,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";

import {
  inputStyle,
  cardStyle,
} from "@/styles/uiStyles";

const Reviews = () => {

  const token = localStorage.getItem("token");

  const [reviews, setReviews] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* FETCH REVIEWS */
  useEffect(() => {

    const fetchReviews = async () => {

      try {

        setLoading(true);

        const res = await axios.get(
          "http://localhost:8000/api/v1/reviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReviews(res.data.data || []);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }
    };

    fetchReviews();

  }, []);

  /* FILTER */
  const filteredReviews = useMemo(() => {

    return reviews.filter((review) => {

      const customer =
        review.user?.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const comment =
        review.comment
          ?.toLowerCase()
          .includes(search.toLowerCase());

      return customer || comment;
    });

  }, [reviews, search]);

  /* SUMMARY */
  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce(
            (acc, r) => acc + (r.rating || 0),
            0
          ) / totalReviews
        ).toFixed(1)
      : "0";

  const positiveFeedback =
    totalReviews > 0
      ? Math.round(
          (reviews.filter(
            (r) => r.rating >= 4
          ).length /
            totalReviews) *
            100
        )
      : 0;

  /* GRAPH DATA */
  const ratingData = [5, 4, 3, 2, 1].map((star) => ({
    rating: `${star}★`,
    count: reviews.filter(
      (r) => r.rating === star
    ).length,
  }));

  /* LOADING */
  if (loading) {

    return (

      <div className="
      min-h-screen
      flex items-center justify-center
      bg-slate-50
      ">

        <p className="
        text-slate-500
        text-lg
        ">
          Loading reviews...
        </p>

      </div>
    );
  }

  return (

    <div className="
    p-6
    space-y-8
    bg-slate-50
    min-h-screen
    ">

      {/* HEADER */}
      <div className="
      flex
      items-center
      justify-between
      flex-wrap
      gap-4
      ">

        <div>

          <h1 className="
          text-3xl
          md:text-4xl
          font-extrabold
          tracking-tight
          text-slate-900
          ">
            Reviews & Ratings
          </h1>

          <p className="
          text-slate-500
          mt-1
          text-sm
          ">
            Customer feedback and satisfaction overview
          </p>

        </div>

        <div className="
        px-5 py-3
        rounded-2xl
        bg-yellow-100
        text-yellow-700
        font-semibold
        text-sm
        flex items-center gap-2
        ">

          <Star size={18} />

          Customer Reviews

        </div>

      </div>

      {/* SUMMARY */}
      <div className="
      grid
      grid-cols-1
      md:grid-cols-3
      gap-5
      ">

        {/* AVERAGE */}
        <Card
          className={`
          ${cardStyle}
          rounded-3xl
          border border-slate-200
          shadow-sm
          hover:shadow-lg
          transition-all
          `}
        >

          <CardContent className="p-6">

            <div className="
            flex
            items-center
            justify-between
            ">

              <div>

                <p className="
                text-sm
                text-slate-500
                ">
                  Average Rating
                </p>

                <h2 className="
                text-4xl
                font-bold
                text-yellow-500
                mt-2
                ">
                  {averageRating}
                </h2>

                <p className="
                text-yellow-500
                text-lg
                mt-1
                ">
                  ★★★★★
                </p>

              </div>

              <div className="
              w-14 h-14
              rounded-2xl
              bg-yellow-100
              flex items-center justify-center
              ">

                <Star
                  className="text-yellow-500"
                  size={28}
                />

              </div>

            </div>

          </CardContent>

        </Card>

        {/* TOTAL */}
        <Card
          className={`
          ${cardStyle}
          rounded-3xl
          border border-slate-200
          shadow-sm
          hover:shadow-lg
          transition-all
          `}
        >

          <CardContent className="p-6">

            <div className="
            flex
            items-center
            justify-between
            ">

              <div>

                <p className="
                text-sm
                text-slate-500
                ">
                  Total Reviews
                </p>

                <h2 className="
                text-4xl
                font-bold
                text-slate-900
                mt-2
                ">
                  {totalReviews}
                </h2>

              </div>

              <div className="
              w-14 h-14
              rounded-2xl
              bg-blue-100
              flex items-center justify-center
              ">

                <MessageSquare
                  className="text-blue-600"
                  size={28}
                />

              </div>

            </div>

          </CardContent>

        </Card>

        {/* POSITIVE */}
        <Card
          className={`
          ${cardStyle}
          rounded-3xl
          border border-slate-200
          shadow-sm
          hover:shadow-lg
          transition-all
          `}
        >

          <CardContent className="p-6">

            <div className="
            flex
            items-center
            justify-between
            ">

              <div>

                <p className="
                text-sm
                text-slate-500
                ">
                  Positive Feedback
                </p>

                <h2 className="
                text-4xl
                font-bold
                text-green-600
                mt-2
                ">
                  {positiveFeedback}%
                </h2>

              </div>

              <div className="
              w-14 h-14
              rounded-2xl
              bg-green-100
              flex items-center justify-center
              ">

                <ThumbsUp
                  className="text-green-600"
                  size={28}
                />

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* CHART */}
      <Card
        className={`
        ${cardStyle}
        rounded-3xl
        border border-slate-200
        `}
      >

        <CardContent className="p-6">

          <div className="mb-5">

            <h2 className="
            text-xl
            font-bold
            text-slate-800
            ">
              Rating Distribution
            </h2>

            <p className="
            text-sm
            text-slate-500
            mt-1
            ">
              Breakdown of customer ratings
            </p>

          </div>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart data={ratingData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="rating" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="count"
                fill="#f59e0b"
                radius={[10, 10, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </CardContent>

      </Card>

      {/* SEARCH */}
      <div className="
      relative
      w-full
      sm:w-[320px]
      ">

        <Search
          size={18}
          className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-400
          "
        />

        <Input
          placeholder="Search reviews..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className={`
          ${inputStyle}
          pl-11
          `}
        />

      </div>

      {/* TABLE */}
      <Card
        className={`
        ${cardStyle}
        rounded-3xl
        border border-slate-200
        overflow-hidden
        `}
      >

        <CardContent className="p-0 overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-slate-100">

              <tr className="text-left">

                <th className="
                px-6 py-4
                font-semibold
                text-slate-700
                ">
                  Customer
                </th>

                <th className="
                px-6 py-4
                font-semibold
                text-slate-700
                ">
                  Email
                </th>

                <th className="
                px-6 py-4
                font-semibold
                text-slate-700
                ">
                  Rating
                </th>

                <th className="
                px-6 py-4
                font-semibold
                text-slate-700
                ">
                  Comment
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredReviews.map((review) => (

                <tr
                  key={review._id}
                  className="
                  border-t
                  hover:bg-slate-50
                  transition
                  "
                >

                  <td className="
                  px-6 py-4
                  font-semibold
                  text-slate-800
                  ">
                    {review.user?.name ||
                      "Customer"}
                  </td>

                  <td className="
                  px-6 py-4
                  text-slate-600
                  ">
                    {review.user?.email ||
                      "No Email"}
                  </td>

                  <td className="
                  px-6 py-4
                  ">

                    <span className="
                    px-3 py-1
                    rounded-full
                    bg-yellow-100
                    text-yellow-700
                    text-xs
                    font-semibold
                    ">
                      ⭐ {review.rating || 0}/5
                    </span>

                  </td>

                  <td className="
                  px-6 py-4
                  text-slate-600
                  max-w-md
                  ">
                    {review.comment ||
                      "No comment"}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* EMPTY */}
          {filteredReviews.length === 0 && (

            <div className="
            py-20
            text-center
            ">

              <div className="
              w-20 h-20
              mx-auto
              rounded-full
              bg-slate-100
              flex items-center justify-center
              text-4xl
              mb-5
              ">
                ⭐
              </div>

              <h2 className="
              text-xl
              font-semibold
              text-slate-800
              ">
                No Reviews Found
              </h2>

              <p className="
              text-slate-500
              mt-2
              ">
                Customer reviews will appear here
              </p>

            </div>

          )}

        </CardContent>

      </Card>

    </div>
  );
};

export default Reviews;