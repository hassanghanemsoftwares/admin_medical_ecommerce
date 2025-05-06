import { Button } from "@/components/ui/button";
import { TableSearch } from "@/components/datatable/table-search";
import { RefreshButton } from "@/components/datatable/RefreshButton";

export function BrandsTableHeader({
  searchInput,
  onSearchInputChange,
  onSearch,
  onRefresh,
  onAddBrand,
  messages,
}: any) {
  return (
    <div className="flex items-center justify-between py-4 flex-wrap gap-2">
      <TableSearch
        value={searchInput}
        onChange={onSearchInputChange}
        onSearch={onSearch}
        placeholder={messages("Sidebar.Search_the_docs")}
      />
      <div className="flex items-center gap-2">
        <RefreshButton onRefresh={onRefresh} />
        <Button onClick={onAddBrand}>{messages("Brands.addBrand")}</Button>
      </div>
    </div>
  );
}
