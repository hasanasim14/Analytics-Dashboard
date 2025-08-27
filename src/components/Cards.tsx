import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Activity, BarChart, Calculator, DollarSign } from "lucide-react";
import { CardsData, DateRange } from "@/lib/types";
import { formatStringNumberWithCommas } from "@/lib/utils";

const Cards = ({ startDate, endDate }: DateRange) => {
  const [cardsData, setCardsData] = useState<CardsData | null>(null);

  useEffect(() => {
    const fetchCardsData = async () => {
      // calculating the current month and year
      const currentDate = new Date();
      const currentMonth = `${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${currentDate.getFullYear()}`;

      const startPeriod = startDate || currentMonth;
      const endPeriod = endDate || currentMonth;
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/Cards`);
        url.searchParams.append("startPeriod", startPeriod);
        url.searchParams.append("endPeriod", endPeriod);

        const response = await fetch(url.toString(), {
          method: "GET",
        });

        const data = await response.json();
        setCardsData(data?.data);
      } catch (error) {
        console.error("Error fetching cards data:", error);
      }
    };
    fetchCardsData();
  }, [startDate, endDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="transition-all font-mono hover:shadow-lg hover:border-orange-500/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <DollarSign className="h-6 w-6 text-orange-500" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Total Spent
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {cardsData?.totalCost
              ? `${formatStringNumberWithCommas(cardsData.totalCost)} PKR`
              : "Loading..."}
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all font-mono hover:shadow-lg hover:border-orange-500/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <Activity className="h-6 w-6 text-orange-500" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Sessions
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {formatStringNumberWithCommas(cardsData?.Sessions) || "Loading..."}
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all font-mono hover:shadow-lg hover:border-orange-500/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <Calculator className="h-6 w-6 text-orange-500" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Avg Cost/Session
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {cardsData?.["Average Cost"] || "Loading..."}
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all font-mono hover:shadow-lg hover:border-orange-500/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <BarChart className="h-6 w-6 text-orange-500" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Avg Sessions/Day
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {cardsData?.AverageSession || "Loading..."}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cards;
