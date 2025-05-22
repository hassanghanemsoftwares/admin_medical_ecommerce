import { TableSearch } from "@/components/datatable/table-search";
import { RefreshButton } from "@/components/datatable/RefreshButton";
import { Button } from "@/components/ui/button";

export function StockAdjustmentsTableHeader({
  searchInput,
  onSearchInputChange,
  onSearch,
  onRefresh,
  onAddStockAdjustment,
  messages,
}: any) {
  return (
    <div className="flex items-center justify-between py-4 gap-2 flex-wrap">
      <TableSearch
        value={searchInput}
        onChange={onSearchInputChange}
        onSearch={onSearch}
        placeholder={messages("StockAdjustments.Search Logs")}
      />
      <div className="flex gap-2">
        <RefreshButton onRefresh={onRefresh} />
        <Button onClick={onAddStockAdjustment}>{messages("StockAdjustments.addStockAdjustment")}</Button>

      </div>
    </div>
  );
}
