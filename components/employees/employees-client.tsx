"use client"

import { useMemo, useState, useRef } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useEmployees } from "../../hooks/use-employees"
import { EmployeesTable } from "./employees-table"
import { EmployeeForm } from "./employee-form"
import type { Employee } from "../../lib/types"
import { cn } from "../../lib/utils"
import { Download, Upload } from "lucide-react"
import { toast } from "../ui/use-toast"

const DEPARTMENTS = ["Engineering", "Design", "Sales", "Marketing", "HR", "Operations"]
const ROLES = ["Engineer", "Designer", "Manager", "Director", "Analyst", "Coordinator"]
const STATUSES = ["Active", "Inactive"] as const

export default function EmployeesClient() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, isLoading, refresh, importEmployees } = useEmployees()

  // UI state
  const [query, setQuery] = useState("")
  const [department, setDepartment] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")
  const [role, setRole] = useState<string>("all")
  const [sortBy, setSortBy] = useState<keyof Employee>("name")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Employee | null>(null)

  const fileRef = useRef<HTMLInputElement | null>(null)

  async function handleImport(file: File) {
    const text = await file.text()
    const res = await importEmployees(text, file.type)
    if (res.ok) {
      toast({ title: "Imported employees", description: `${res.count} records` })
    } else {
      toast({ title: "Import failed", description: res.error ?? "Invalid file", variant: "destructive" })
    }
  }

  const onCreate = async (data: Omit<Employee, "id" | "createdAt" | "updatedAt">) => {
    await addEmployee(data)
    setIsFormOpen(false)
  }

  const onEdit = async (id: string, updates: Partial<Employee>) => {
    await updateEmployee(id, updates)
    setEditing(null)
  }

  const onDelete = async (id: string) => {
    await deleteEmployee(id)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = employees ?? []

    if (q) {
      list = list.filter((e) => [e.name, e.email, e.department, e.role].some((v) => v.toLowerCase().includes(q)))
    }
    if (department !== "all") list = list.filter((e) => e.department === department)
    if (role !== "all") list = list.filter((e) => e.role === role)
    if (status !== "all") list = list.filter((e) => e.status === status)

    list = [...list].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1
      const av = a[sortBy]
      const bv = b[sortBy]
      if (typeof av === "string" && typeof bv === "string") {
        return av.localeCompare(bv) * dir
      }
      // fallback string compare
      return String(av).localeCompare(String(bv)) * dir
    })
    return list
  }, [employees, query, department, role, status, sortBy, sortDir])

  const handleHeaderSort = (key: keyof Employee) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(key)
      setSortDir("asc")
    }
  }

  return (
    <Card className="border bg-card">
      <CardHeader className="gap-2">
        <CardTitle className="text-pretty text-xl">Team Directory</CardTitle>
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex w-full flex-col gap-3 md:flex-row">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name, email, dept, role"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className={cn("grid w-full grid-cols-1 gap-3 md:grid-cols-3", "md:max-w-lg")}>
              <div>
                <Label className="sr-only">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="sr-only">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="sr-only">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setQuery("")
                setDepartment("all")
                setRole("all")
                setStatus("all")
              }}
            >
              Reset Filters
            </Button>
            <Button onClick={() => setIsFormOpen(true)}>Add Employee</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleImport(f)
            }}
          />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload className="mr-2 size-4" /> Import CSV/JSON
          </Button>
          <Button asChild variant="outline" size="sm" onClick={() => refresh()}>
            <a href="#">Refresh</a>
          </Button>
          <Button asChild size="sm">
            <a href="/api/employees/export">
              <Download className="mr-2 size-4" /> Export JSON
            </a>
          </Button>
        </div>

        <EmployeesTable
          isLoading={isLoading}
          employees={filtered}
          onEdit={(e) => setEditing(e)}
          onDelete={onDelete}
          onSort={handleHeaderSort}
          sortBy={sortBy}
          sortDir={sortDir}
        />
      </CardContent>

      {/* Create */}
      <EmployeeForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={onCreate}
        departments={DEPARTMENTS}
        roles={ROLES}
      />

      {/* Edit */}
      {editing && (
        <EmployeeForm
          open={!!editing}
          onOpenChange={(open) => {
            if (!open) setEditing(null)
          }}
          mode="edit"
          initialEmployee={editing}
          onSubmit={async (data) => {
            await onEdit(editing.id, data)
          }}
          departments={DEPARTMENTS}
          roles={ROLES}
        />
      )}
    </Card>
  )
}
