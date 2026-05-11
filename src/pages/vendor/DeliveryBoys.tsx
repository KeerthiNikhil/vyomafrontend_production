import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
} from "recharts";

const inputStyle =
  "h-12 rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-500";

const DeliveryBoys = () => {

  const [deliveryBoys, setDeliveryBoys] = useState<any[]>([]);
  const [selectedBoy, setSelectedBoy] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const [image, setImage] = useState<File | null>(null);

  const [newBoy, setNewBoy] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const fetchDeliveryBoys = async () => {
    try {
      const res = await axios.get("/delivery-boys", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDeliveryBoys(res.data.data);
    } catch {
      toast.error("Failed to load delivery boys");
    }
  };

  const handleAddBoy = async () => {
    if (!newBoy.name || !newBoy.phone) return;

    try {
      const formData = new FormData();
      formData.append("name", newBoy.name);
      formData.append("phone", newBoy.phone);
      formData.append("email", newBoy.email);

      if (image) formData.append("image", image);

      await axios.post("/delivery-boys", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Added");

      setNewBoy({ name: "", phone: "", email: "" });
      setImage(null);

      fetchDeliveryBoys();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-8">

        <h1 className="text-3xl font-bold">Delivery Boys</h1>

        {/* ADD */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-5">
          <h2 className="font-semibold">Add Delivery Boy</h2>

          <div className="grid md:grid-cols-4 gap-3">
            <label className="block cursor-pointer">
  <div
    className="
      h-12 px-4
      rounded-2xl
      border border-slate-200
      bg-gradient-to-b from-white to-slate-50
      shadow-sm
      hover:border-blue-300
      hover:bg-blue-50/30
      transition
      flex items-center
      text-sm text-slate-500
    "
  >
    📷 Upload Profile Image
  </div>

  <input
    type="file"
    className="hidden"
    onChange={(e)=>
      setImage(e.target.files?.[0] || null)
    }
  />
</label>

            <Input 
            className={inputStyle}
            placeholder="Phone"
              value={newBoy.phone}
              onChange={(e)=>setNewBoy({...newBoy,phone:e.target.value})}
            />

            <Input
            className={inputStyle}
            placeholder="Email"
              value={newBoy.email}
              onChange={(e)=>setNewBoy({...newBoy,email:e.target.value})}
            />

            <input
            className={inputStyle}
            type="file"
              onChange={(e)=>setImage(e.target.files?.[0] || null)}
              
            />
          </div>

          <Button 
  className="
    h-12 px-8
    rounded-2xl
    bg-blue-600
    hover:bg-blue-700
    text-white
    font-semibold
    shadow-md
    transition-all duration-200
  "
  onClick={handleAddBoy}
>
  + Add Delivery Boy
</Button>
        </div>

        {/* LIST */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">

          {deliveryBoys.map((boy) => (

            <div key={boy._id} className="bg-white rounded-lg shadow p-4 space-y-3">

              <div className="flex items-center gap-2">
                <img
                  src={boy.image ? `http://localhost:8000${boy.image}` : "/user.png"}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="text-sm font-semibold">{boy.name}</h2>
                  <p className="text-xs text-gray-500">⭐ {boy.rating || 4.5}</p>
                </div>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <p className="flex gap-1 items-center">
                  <Phone size={12}/> {boy.phone}
                </p>
                <p className="flex gap-1 items-center">
                  <Mail size={12}/> {boy.email}
                </p>
              </div>

              <div className="flex justify-between text-xs">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                  {boy.status || "Available"}
                </span>
                <span>Orders: {boy.completedOrders || 0}</span>
              </div>

              {/* MINI CHART */}
              <div className="h-[60px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "P", value: boy.attendance || 0 },
                      { name: "A", value: 30 - (boy.attendance || 0) },
                    ]}
                  >
                    <Bar dataKey="value" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between text-xs">
                <button
                  className="text-blue-600"
                  onClick={() => {
                    setSelectedBoy(boy);
                    setShowModal(true);
                  }}
                >
                  View
                </button>

                <button className="text-red-600">Delete</button>
              </div>

            </div>

          ))}

        </div>
      </div>

      {/* ✅ MODAL */}
      {showModal && selectedBoy && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[400px] rounded-xl p-6 space-y-5 shadow-xl relative">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-400 text-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <img
                src={`http://localhost:8000${selectedBoy.image}`}
                className="w-12 h-12 rounded-full"
              />

              <div>
                <h2 className="font-semibold text-lg">
                  {selectedBoy.name}
                </h2>
                <p className="text-sm text-gray-500">
                  ⭐ {selectedBoy.rating || 4.5}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p>Orders</p>
                <p className="font-bold">{selectedBoy.completedOrders || 0}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p>Attendance</p>
                <p className="font-bold">{selectedBoy.attendance || 0}</p>
              </div>
            </div>

            <div className="space-y-2">

  {/* HEADING */}
  <p className="text-sm text-gray-500">
    Monthly Attendance (Days)
  </p>

  {/* % DISPLAY */}
  <p className="text-xs text-gray-400">
    Attendance:{" "}
    <span className="font-semibold text-gray-700">
      {Math.round(((selectedBoy.attendance || 0) / 30) * 100)}%
    </span>
  </p>

  {/* CHART */}
  <div className="h-[180px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={[
          {
            name: "Present Days",
            value: selectedBoy.attendance || 0,
          },
          {
            name: "Absent Days",
            value: 30 - (selectedBoy.attendance || 0),
          },
        ]}
      >
        <XAxis dataKey="name" />
        <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>

</div>

          </div>
        </div>
      )}

    </>
  );
};

export default DeliveryBoys;