import { useEffect, useMemo, useState } from "react";
import axios from "@/lib/axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useLocation } from "react-router-dom";

import {
  MapPin,
  Bike,
  IndianRupee,
  Route,
  Phone,
  Star,
  CheckCircle2,
  Truck,
} from "lucide-react";

import {
  inputStyle,
  primaryButton,
  cardStyle,
  selectStyle,
} from "@/styles/uiStyles";

const Delivery = () => {

  const location = useLocation();

  const orderData: any = location.state;

  const token = localStorage.getItem("token");

  const [deliveryBoys, setDeliveryBoys] = useState<any[]>([]);
  const [selectedBoy, setSelectedBoy] = useState<any>(null);

  const [km, setKm] = useState(0);
  const [rate, setRate] = useState(0);

  const address =
    orderData?.address || "No address available";

  const lat =
    Number(orderData?.lat) || 12.9716;

  const lng =
    Number(orderData?.lng) || 77.5946;

  /* TOTAL */
  const total = useMemo(() => {
    return km * rate;
  }, [km, rate]);

  /* FETCH DELIVERY BOYS */
  useEffect(() => {

    const fetchDeliveryBoys = async () => {

      try {

        const res = await axios.get(
          "/delivery-boys",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDeliveryBoys(res.data.data || []);

      } catch {

        console.log(
          "Failed to fetch delivery boys"
        );
      }
    };

    fetchDeliveryBoys();

  }, []);

  /* ASSIGN DELIVERY */
  const handleAssignDelivery = async () => {

    try {

      await axios.put(
        "/delivery-boys/assign",
        {
          orderId: orderData?.orderId,
          deliveryBoyId: selectedBoy?._id,
          km,
          rate,
          total,
          address,
          lat,
          lng,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Delivery Assigned Successfully");

    } catch (err: any) {

      alert(
        err.response?.data?.message || "Error"
      );
    }
  };

  return (

    <div className="
    max-w-7xl
    mx-auto
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
            Delivery Assignment
          </h1>

          <p className="
          text-slate-500
          mt-1
          text-sm
          ">
            Assign delivery partner & calculate charges
          </p>

        </div>

        <div className="
        px-5 py-3
        rounded-2xl
        bg-blue-100
        text-blue-700
        font-semibold
        text-sm
        flex items-center gap-2
        ">
          <Bike size={18} />
          Delivery Management
        </div>

      </div>

      {/* ORDER INFO */}
      {orderData && (

        <div className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-5
        ">

          {/* ORDER CARD */}
          <div className={`
          ${cardStyle}
          rounded-3xl
          p-6
          border border-slate-200
          space-y-5
          `}>

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
                  Order ID
                </p>

                <h2 className="
                text-xl
                font-bold
                text-slate-900
                mt-1
                ">
                  #{orderData?.orderId?.slice(-6)}
                </h2>

              </div>

              <div className="
              w-14 h-14
              rounded-2xl
              bg-blue-100
              flex items-center justify-center
              ">

                <CheckCircle2
                  className="text-blue-600"
                  size={28}
                />

              </div>

            </div>

            <div className="
            border-t
            pt-4
            ">

              <p className="
              text-sm
              text-slate-500
              ">
                Order Amount
              </p>

              <h2 className="
              text-3xl
              font-bold
              text-emerald-600
              mt-1
              ">
                ₹{orderData?.amount || 0}
              </h2>

            </div>

          </div>

          {/* ADDRESS CARD */}
          <div className={`
          ${cardStyle}
          rounded-3xl
          p-6
          border border-slate-200
          lg:col-span-2
          `}>

            <div className="
            flex
            items-start
            gap-4
            ">

              <div className="
              w-14 h-14
              rounded-2xl
              bg-orange-100
              flex items-center justify-center
              shrink-0
              ">

                <MapPin
                  className="text-orange-500"
                  size={28}
                />

              </div>

              <div>

                <p className="
                text-sm
                text-slate-500
                ">
                  Delivery Address
                </p>

                <h2 className="
                text-lg
                font-semibold
                text-slate-800
                mt-1
                ">
                  {address}
                </h2>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* MAIN SECTION */}
      <div className="
      grid
      grid-cols-1
      xl:grid-cols-3
      gap-6
      ">

        {/* LEFT SIDE */}
        <div className="
        xl:col-span-2
        space-y-6
        ">

          {/* DELIVERY BOY */}
          <div className={`
          ${cardStyle}
          rounded-3xl
          border border-slate-200
          p-6
          space-y-5
          `}>

            <div>

              <h2 className="
              text-2xl
              font-bold
              text-slate-800
              ">
                Select Delivery Partner
              </h2>

              <p className="
              text-sm
              text-slate-500
              mt-1
              ">
                Assign an available delivery boy
              </p>

            </div>

            {/* SELECT */}
            <div className="relative">

              <select
                className={selectStyle}
                onChange={(e) =>
                  setSelectedBoy(
                    deliveryBoys.find(
                      (b) =>
                        b._id === e.target.value
                    )
                  )
                }
              >

                <option>
                  🚴 Select Delivery Boy
                </option>

                {deliveryBoys
                  .filter(
                    (b) =>
                      b.status === "Available"
                  )
                  .map((b) => (

                    <option
                      key={b._id}
                      value={b._id}
                    >
                      {b.name} ({b.phone})
                    </option>

                  ))}

              </select>

            </div>

            {/* SELECTED CARD */}
            {selectedBoy && (

              <div className="
              bg-slate-50
              border border-slate-200
              rounded-3xl
              p-5
              flex
              items-center
              gap-5
              ">

                <img
                  src={`http://localhost:8000${selectedBoy.image}`}
                  className="
                  w-20 h-20
                  rounded-2xl
                  object-cover
                  border border-slate-200
                  "
                />

                <div className="space-y-2">

                  <h2 className="
                  text-lg
                  font-bold
                  text-slate-800
                  ">
                    {selectedBoy.name}
                  </h2>

                  <div className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-slate-500
                  ">

                    <Phone size={15} />

                    {selectedBoy.phone}

                  </div>

                  <div className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-yellow-600
                  ">

                    <Star size={15} />

                    {selectedBoy.rating || 4.5}

                  </div>

                </div>

                <span className="
                ml-auto
                px-4 py-2
                rounded-full
                bg-green-100
                text-green-700
                text-xs
                font-semibold
                ">
                  {selectedBoy.status}
                </span>

              </div>

            )}

          </div>

          {/* MAP */}
          <div className={`
          ${cardStyle}
          rounded-3xl
          border border-slate-200
          overflow-hidden
          `}>

            <div className="
            p-6
            border-b
            ">

              <h2 className="
              text-2xl
              font-bold
              text-slate-800
              ">
                Delivery Location
              </h2>

              <p className="
              text-sm
              text-slate-500
              mt-1
              ">
                Customer delivery destination
              </p>

            </div>

            <iframe
              width="100%"
              height="350"
              className="border-0"
              src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
            />

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="
        space-y-6
        ">

          {/* COST CARD */}
          <div className={`
          ${cardStyle}
          rounded-3xl
          border border-slate-200
          p-6
          space-y-5
          `}>

            <div>

              <h2 className="
              text-2xl
              font-bold
              text-slate-800
              ">
                Delivery Charges
              </h2>

              <p className="
              text-sm
              text-slate-500
              mt-1
              ">
                Calculate total delivery cost
              </p>

            </div>

            {/* KM */}
            <div className="space-y-2">

              <label className="
              text-sm
              font-medium
              text-slate-700
              ">
                Distance (KM)
              </label>

              <div className="relative">

                <Route
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
                  placeholder="Enter KM"
                  type="number"
                  min="0"
                  value={km}
                  onChange={(e) =>
                    setKm(
                      Math.max(
                        0,
                        Number(e.target.value)
                      )
                    )
                  }
                  className={`
                  ${inputStyle}
                  pl-11
                  `}
                />

              </div>

            </div>

            {/* RATE */}
            <div className="space-y-2">

              <label className="
              text-sm
              font-medium
              text-slate-700
              ">
                Rate Per KM
              </label>

              <div className="relative">

                <IndianRupee
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
                  placeholder="Enter Rate"
                  type="number"
                  min="0"
                  value={rate}
                  onChange={(e) =>
                    setRate(
                      Math.max(
                        0,
                        Number(e.target.value)
                      )
                    )
                  }
                  className={`
                  ${inputStyle}
                  pl-11
                  `}
                />

              </div>

            </div>

            {/* TOTAL */}
            <div className="
            bg-blue-50
            border border-blue-200
            rounded-3xl
            p-5
            flex
            items-center
            justify-between
            ">

              <div>

                <p className="
                text-sm
                text-slate-500
                ">
                  Total Delivery Cost
                </p>

                <h2 className="
                text-3xl
                font-bold
                text-blue-700
                mt-1
                ">
                  ₹{total}
                </h2>

              </div>

              <div className="
              w-14 h-14
              rounded-2xl
              bg-blue-100
              flex items-center justify-center
              ">

                <Truck
                  className="text-blue-700"
                  size={28}
                />

              </div>

            </div>

            {/* BUTTON */}
            <Button
              disabled={
                !selectedBoy || total <= 0
              }
              onClick={handleAssignDelivery}
              className={`
              ${primaryButton}
              w-full
              h-14
              rounded-2xl
              text-base
              font-semibold
              disabled:opacity-50
              `}
            >
              🚚 Assign Delivery
            </Button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Delivery;