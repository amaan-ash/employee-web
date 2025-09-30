/* Simple in-memory server DB with seed and helpers */
import type { Employee } from "@/lib/types"

const g = globalThis as any

if (!g.__EMP_DB__) {
  const now = new Date().toISOString()
  const seed: Employee[] = [
    {
      id: "emp_1",
      name: "Alice Johnson",
      email: "alice@company.com",
      department: "Engineering",
      role: "Engineer",
      status: "Active",
      startDate: now.slice(0, 10),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "emp_2",
      name: "Brian Lee",
      email: "brian@company.com",
      department: "Design",
      role: "Designer",
      status: "Active",
      startDate: now.slice(0, 10),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "emp_3",
      name: "Carmen Diaz",
      email: "carmen@company.com",
      department: "Sales",
      role: "Manager",
      status: "Inactive",
      startDate: now.slice(0, 10),
      createdAt: now,
      updatedAt: now,
    },
  ]
  g.__EMP_DB__ = new Map(seed.map((e) => [e.id, e] as const))
}

const store: Map<string, Employee> = g.__EMP_DB__

export function list(): Employee[] {
  return Array.from(store.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export function create(input: Omit<Employee, "id" | "createdAt" | "updatedAt">): Employee {
  const now = new Date().toISOString()
  const id = globalThis.crypto && "randomUUID" in globalThis.crypto ? crypto.randomUUID() : `emp_${Date.now()}`
  const emp: Employee = { ...input, id, createdAt: now, updatedAt: now }
  store.set(emp.id, emp)
  return emp
}

export function update(id: string, updates: Partial<Employee>): Employee | null {
  const cur = store.get(id)
  if (!cur) return null
  const next = { ...cur, ...updates, updatedAt: new Date().toISOString() }
  store.set(id, next)
  return next
}

export function remove(id: string): boolean {
  return store.delete(id)
}

export function importMany(items: Omit<Employee, "id" | "createdAt" | "updatedAt">[] | Employee[]): number {
  let count = 0
  for (const raw of items) {
    // allow either new items (no id) or full Employee objects
    const item = raw as any
    if (item.id) {
      const normalized: Employee = {
        ...item,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      store.set(normalized.id, normalized)
      count++
    } else {
      create(raw as Omit<Employee, "id" | "createdAt" | "updatedAt">)
      count++
    }
  }
  return count
}

export function exportAll(): Employee[] {
  return list()
}
