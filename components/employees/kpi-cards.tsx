"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useEmployees } from "@/hooks/use-employees"

export function KpiCards() {
  const { employees, isLoading } = useEmployees()
  const total = employees.length
  const active = employees.filter((e) => e.status === "Active").length
  const depts = new Set(employees.map((e) => e.department)).size

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <KpiBox label="Total Employees" value={isLoading ? "…" : total} />
      <KpiBox label="Active" value={isLoading ? "…" : active} />
      <KpiBox label="Departments" value={isLoading ? "…" : depts} />
    </div>
  )
}

function KpiBox({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="border bg-card">
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  )
}
