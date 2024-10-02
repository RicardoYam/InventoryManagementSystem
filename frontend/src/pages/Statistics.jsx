import SalesReport from "../components/SalesReport";
import StockReport from "../components/StockReport";

export default function Statistics() {
  return (
    <div className="px-4">
      <div className="flex justify-between items-center mt-4 font-semibold">
        <h1 className="text-3xl">Statistics</h1>
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        <StockReport />
        <SalesReport />
      </div>
    </div>
  );
}
