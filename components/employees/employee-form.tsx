"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import type { Employee } from "../../lib/types"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<Employee, "id" | "createdAt" | "updatedAt">) => Promise<void> | void
  mode?: "create" | "edit"
  initialEmployee?: Employee | null
  departments: string[]
  roles: string[]
}

export function EmployeeForm({
  open,
  onOpenChange,
  onSubmit,
  mode = "create",
  initialEmployee,
  departments,
  roles,
}: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [department, setDepartment] = useState<string>("")
  const [role, setRole] = useState<string>("")
  const [status, setStatus] = useState<"Active" | "Inactive">("Active")
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10))
  const title = useMemo(() => (mode === "edit" ? "Edit Employee" : "Add Employee"), [mode])

  useEffect(() => {
    if (open) {
      if (initialEmployee) {
        setName(initialEmployee.name)
        setEmail(initialEmployee.email)
        setDepartment(initialEmployee.department)
        setRole(initialEmployee.role)
        setStatus(initialEmployee.status)
        setStartDate(initialEmployee.startDate.slice(0, 10))
      } else {
        setName("")
        setEmail("")
        setDepartment("")
        setRole("")
        setStatus("Active")
        setStartDate(new Date().toISOString().slice(0, 10))
      }
    }
  }, [open, initialEmployee])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !department || !role || !startDate) return
    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      department,
      role,
      status,
      startDate,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-pretty">{title}</DialogTitle>
          <DialogDescription>Provide employee details and save.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="emp-name">Full name</Label>
            <Input
              id="emp-name"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="emp-email">Email</Label>
            <Input
              id="emp-email"
              type="email"
              placeholder="jane@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as "Active" | "Inactive")}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emp-start">Start date</Label>
              <Input
                id="emp-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-background"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{mode === "edit" ? "Save changes" : "Add employee"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
