import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { TableHeaderSort } from "@/components/datatable/table-header-sort";
import { useTranslation } from "react-i18next";
import { Product } from "@/types/api.interfaces";
import { useNavigate } from "react-router-dom";


type UseProductColumnsProps = {

  handleDelete: (product: Product) => void;

};

export function useProductColumns({ handleDelete }: UseProductColumnsProps): ColumnDef<Product>[] {
  const { t: messages } = useTranslation();
  const navigate = useNavigate();

  return useMemo(() => [
    {
      id: "image",
      header: messages("Public.Image"),
      cell: ({ row }) => (
        <div className="flex justify-center items-center w-20 h-20 overflow-hidden rounded-lg border border-gray-200">
          <img
            src={row.original.image}
            alt={row.original.name.en}
            className="object-cover w-full h-full"
          />
        </div>
      ),
    },
    {
      accessorKey: "barcode",
      header: ({ column }) => <TableHeaderSort column={column} title={messages("Public.Barcode")} />,
      enableSorting: true,
    }
    ,
    {
      accessorKey: "name",
      header: ({ column }) => <TableHeaderSort column={column} title={messages("Public.Name")} />,
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex flex-col space-y-1">
          <div >
            EN: <span >{row.original.name.en}</span>
          </div>
          <div >
            AR: <span >{row.original.name.ar}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category.name",
      header: messages("Public.Category"),
      cell: ({ row }) => row.original.category?.name?.en ?? "-",
    }, {
      accessorKey: "availability_status",
      header: messages("Public.Status"),
      cell: ({ row }) => {
        const status = row.original.availability_status;
        const statusColor = status === "available" ? "text-green-600" : "text-gray-500";
        return <span className={statusColor}>{messages(`Product.status.${status}`)}</span>;
      },
    },

    {
      accessorKey: "price",
      header: ({ column }) => (
        <TableHeaderSort column={column} title={messages("Public.Price")} />
      ),
      enableSorting: true,
      cell: ({ row }) => (
        <span>{row.original.price} $</span>
      ),
    }, {
      accessorKey: "discount",
      header: ({ column }) => (
        <TableHeaderSort column={column} title={messages("Public.Discount")} />
      ),
      enableSorting: true,
      cell: ({ row }) => {
        const discount = row.original.discount;
        return discount > 0 ? (
          <span className="text-red-500">{discount}%</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{messages("Public.Actions")}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate(`/products/${row.original.id}/edit`)}>
              {messages("Public.Edit")}

            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleDelete(row.original)} className="text-red-600 focus:text-red-600">
              {messages("Public.Delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [handleDelete, messages]);
}
