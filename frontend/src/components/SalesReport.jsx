import { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { fetchSales } from "../api/sales";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function SalesReport() {
  const [totalSales, setTotalSales] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [chartOptions, setChartOptions] = useState({
    xaxis: {
      show: true,
      categories: [],
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: true,
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
        },
        formatter: function (value) {
          return "$" + value;
        },
      },
    },
    series: [],
    chart: {
      height: "60%",
      width: "100%",
      type: "area",
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: "#1C64F2",
        gradientToColors: ["#1C64F2"],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 4,
      curve: "smooth",
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
  });

  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSales();
        const { categories, series, total, percentage_change } =
          response.weekly;

        setChartOptions((prevOptions) => ({
          ...prevOptions,
          xaxis: {
            ...prevOptions.xaxis,
            categories: categories,
          },
          series: [
            {
              name: "Daily Sales",
              data: series[0].data,
              color: "#1A56DB",
            },
          ],
        }));

        setTotalSales(total);
        setPercentageChange(percentage_change);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef.current && typeof ApexCharts !== "undefined") {
      const chart = new ApexCharts(chartRef.current, chartOptions);
      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [chartOptions]);

  return (
    <div className="w-full min-h-56 max-h-72 bg-white rounded-3xl shadow border border-gray-200">
      <div className="flex justify-between p-4 md:p-6 pb-0">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900">
            ${totalSales}
          </h5>
          <p className="text-base font-normal text-gray-500">Last 7 days</p>
        </div>
        <div
          className={`flex items-center px-2.5 py-0.5 text-base font-semibold gap-2 ${
            percentageChange > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {percentageChange}%
          {percentageChange > 0 ? <TrendingUp /> : <TrendingDown />}
        </div>
      </div>
      <div ref={chartRef} id="labels-chart" className="px-4 h-48"></div>
    </div>
  );
}
