import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"
import { Search, Plus, MoreHorizontal, ArrowUpDown } from "lucide-react"

export default function UsersPage() {
    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = useState([])
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState("")
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const querySnapshot = await getDocs(collection(db, "users"));
          const users = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log(users);
          setData(users);
        } catch (error) {
          console.error("Error fetching users:", error);
          setData([]);
        }
        setLoading(false);
      };
      fetchUsers();
    }, []);
  
    const columns = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 hover:bg-transparent font-medium text-gray-500 dark:text-gray-400"
          >
            Name
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {row.getValue("name").charAt(0)}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">{row.getValue("name") || "No Name"}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{row.original.email}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const role = row.getValue("role")
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                role === "Instructor"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              }`}
            >
              {role}
            </span>
          )
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status")
          return (
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  status === "active" 
                    ? "bg-green-500 dark:bg-green-400" 
                    : "bg-red-500 dark:bg-red-400"
                }`}
              />
              <span className="text-sm capitalize text-gray-700 dark:text-gray-300">{status}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "coursesEnrolled",
        header: "Courses",
        cell: ({ row }) => (
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {row.getValue("coursesEnrolled")}
          </span>
        ),
      },
      {
        accessorKey: "joinedDate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 hover:bg-transparent font-medium text-gray-500 dark:text-gray-400"
          >
            Joined
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(row.getValue("joinedDate")).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const user = row.original

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem>Edit User</DropdownMenuItem>
                {user.role === "Student" && (
                  <DropdownMenuItem>View Progress</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className={user.status === "active" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
                  {user.status === "active" ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ]
  
    const table = useReactTable({
      data,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onRowSelectionChange: setRowSelection,
      onGlobalFilterChange: setGlobalFilter,
      globalFilterFn: "includesString",
      state: {
        sorting,
        columnFilters,
        rowSelection,
        globalFilter,
      },
    })
  
    if (loading) {
      return <div>Loading users...</div>;
    }

    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto p-2">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Users</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your team members and students</p>
          </div>
  
          {/* Actions Bar */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                
                {Object.keys(rowSelection).length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {Object.keys(rowSelection).length} selected
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Bulk Actions
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
  
          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          row.getIsSelected() ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
                        }`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="text-gray-400 dark:text-gray-500 mb-2">
                            <Search className="h-8 w-8" />
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">No users found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
  
          {/* Pagination */}
          <div className="flex items-center justify-between pt-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {table.getRowModel().rows.length} of {data.length} users
              {Object.keys(rowSelection).length > 0 && (
                <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                  • {Object.keys(rowSelection).length} selected
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }