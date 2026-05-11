import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
}

const WalletPage = () => {

  const [walletBalance, setWalletBalance] =
    useState(0);

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  /* LOAD WALLET DATA */

  useEffect(() => {

    // ✅ Get balance
    const savedBalance =
      localStorage.getItem("walletBalance");

    setWalletBalance(Number(savedBalance) || 0);

    // ✅ Get transactions
    const savedTransactions =
      localStorage.getItem("walletTransactions");

    if (savedTransactions) {

      setTransactions(
        JSON.parse(savedTransactions)
      );

    }

  }, []);

  return (

    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      <div className="max-w-3xl mx-auto space-y-6">

        {/* WALLET CARD */}

        <div
          className="
            bg-gradient-to-r
            from-blue-600
            to-blue-500
            rounded-3xl
            p-8
            text-white
            shadow-lg
          "
        >

          <div className="flex items-center gap-3 mb-6">

            <Wallet className="w-8 h-8" />

            <h1 className="text-3xl font-bold">
              Vyoma Wallet
            </h1>

          </div>

          <p className="text-blue-100 text-sm">
            Available Balance
          </p>

          <h2 className="text-5xl font-bold mt-2">
            ₹{walletBalance}
          </h2>

        </div>

        {/* TRANSACTIONS */}

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <h2 className="text-2xl font-bold mb-6">
            Recent Transactions
          </h2>

          {transactions.length === 0 ? (

            <div
              className="
                text-center
                py-14
                text-gray-500
              "
            >
              No wallet transactions yet
            </div>

          ) : (

            <div className="space-y-4">

              {transactions.map((item) => (

                <div
                  key={item.id}
                  className="
                    flex items-center justify-between
                    border rounded-2xl
                    p-4
                  "
                >

                  <div className="flex items-center gap-4">

                    <div
                      className={`
                        w-12 h-12 rounded-full
                        flex items-center justify-center
                        ${
                          item.amount > 0
                            ? "bg-green-100"
                            : "bg-red-100"
                        }
                      `}
                    >

                      {item.amount > 0 ? (

                        <ArrowDownCircle
                          className="text-green-600"
                        />

                      ) : (

                        <ArrowUpCircle
                          className="text-red-600"
                        />

                      )}

                    </div>

                    <div>

                      <h3 className="font-semibold">
                        {item.type}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {item.date}
                      </p>

                    </div>

                  </div>

                  <div
                    className={`
                      font-bold text-lg
                      ${
                        item.amount > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    `}
                  >

                    {item.amount > 0 ? "+" : ""}
                    ₹{item.amount}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );
};

export default WalletPage;