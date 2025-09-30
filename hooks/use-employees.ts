"use client"

import useSWR from "swr"
import type { Employee } from "../lib/types"

type ImportResult = { ok: true; count: number } | { ok: false; error?: string }

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useEmployees() {
  const { data, mutate, isLoading } = useSWR<Employee[]>("/api/employees", fetcher, {
    revalidateOnFocus: false,
  })

  const employees = data ?? []

  async function refresh() {
    await mutate()
  }

  async function addEmployee(input: Omit<Employee, "id" | "createdAt" | "updatedAt">) {
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
    const created = await res.json()
    await mutate((cur) => (cur ? [created, ...cur] : [created]), { revalidate: false })
  }

  async function updateEmployee(id: string, updates: Partial<Employee>) {
    const res = await fetch(`/api/employees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    const updated = (await res.json()) as Employee
    await mutate((cur) => (cur ? cur.map((e) => (e.id === id ? updated : e)) : [updated]), { revalidate: false })
  }

  async function deleteEmployee(id: string) {
    await fetch(`/api/employees/${id}`, { method: "DELETE" })
    await mutate((cur) => (cur ? cur.filter((e) => e.id !== id) : cur), { revalidate: false })
  }

  async function importEmployees(text: string, mime?: string): Promise<ImportResult> {
    const res = await fetch(`/api/employees/import`, {
      method: "POST",
      headers: { "Content-Type": mime || "text/plain" },
      body: text,
    })
    if (!res.ok) return { ok: false, error: await res.text() }
    const data = (await res.json()) as { count: number }
    await mutate()
    return { ok: true, count: data.count }
  }

  return { employees, isLoading, addEmployee, updateEmployee, deleteEmployee, refresh, importEmployees }
}
