import { TableSearch } from "@/components/datatable/table-search";
import { RefreshButton } from "@/components/datatable/RefreshButton";

export function StocksTableHeader({
  searchInput,
  onSearchInputChange,
  onSearch,
  onRefresh,
  messages,
}: any) {
  return (
    <div className="flex items-center justify-between py-4 gap-2 flex-wrap">
      <TableSearch
        value={searchInput}
        onChange={onSearchInputChange}
        onSearch={onSearch}
        placeholder={messages("Stocks.Search Logs")}
      />
      <div className="flex gap-2">
        <RefreshButton onRefresh={onRefresh} />
      </div>
    </div>
  );
}
