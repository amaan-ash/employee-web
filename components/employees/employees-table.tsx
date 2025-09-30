"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import type { Employee } from "../../lib/types"

type Props = {
  isLoading?: boolean
  employees: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (id: string) => void
  onSort: (key: keyof Employee) => void
  sortBy: keyof Employee
  sortDir: "asc" | "desc"
}

export function EmployeesTable({ isLoading, employees, onEdit, onDelete, onSort, sortBy, sortDir }: Props) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader className="bg-secondary/50">
          <TableRow>
            <SortableHead label="Name" column="name" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <SortableHead label="Email" column="email" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <SortableHead label="Department" column="department" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <SortableHead label="Role" column="role" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <SortableHead label="Status" column="status" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <SortableHead label="Start Date" column="startDate" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No employees found.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.name}</TableCell>
                <TableCell className="text-muted-foreground">{e.email}</TableCell>
                <TableCell>{e.department}</TableCell>
                <TableCell>{e.role}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                      e.status === "Active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                    aria-label={`status ${e.status}`}
                  >
                    {e.status}
                  </span>
                </TableCell>
                <TableCell>
                  <time dateTime={e.startDate}>{new Date(e.startDate).toLocaleDateString()}</time>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(e)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(e.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function SortableHead({
  label,
  column,
  sortBy,
  sortDir,
  onSort,
}: {
  label: string
  column: keyof Employee
  sortBy: keyof Employee
  sortDir: "asc" | "desc"
  onSort: (key: keyof Employee) => void
}) {
  const isActive = sortBy === column
  return (
    <TableHead>
      <button
        type="button"
        className="inline-flex items-center gap-1 hover:underline"
        onClick={() => onSort(column)}
        aria-label={`Sort by ${label} ${isActive ? `(${sortDir})` : ""}`}
      >
        <span>{label}</span>
        {isActive ? <span className="text-xs text-muted-foreground">{sortDir === "asc" ? "↑" : "↓"}</span> : null}
      </button>
    </TableHead>
  )
}
