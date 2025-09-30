import { NextResponse } from "next/server"
import { importMany } from "../../_db"
import type { Employee } from "@/lib/types"

function parseCSV(text: string): Omit<Employee, "id" | "createdAt" | "updatedAt">[] {
  const lines = text.trim().split(/\r?\n/)
  const [header, ...rows] = lines
  const cols = header.split(",").map((s) => s.trim().toLowerCase())
  const req = ["name", "email", "department", "role", "status", "startdate"]
  if (!req.every((c) => cols.includes(c))) return []
  return rows.filter(Boolean).map((row) => {
    const parts = row.split(",")
    const obj: any = {}
    cols.forEach((c, i) => {
      obj[c] = (parts[i] ?? "").trim()
    })
    return {
      name: obj.name,
      email: obj.email,
      department: obj.department,
      role: obj.role,
      status: (obj.status === "Inactive" ? "Inactive" : "Active") as "Active" | "Inactive",
      startDate: obj.startdate,
    }
  })
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || ""
  let count = 0
  if (contentType.includes("application/json")) {
    const data = await req.json()
    if (Array.isArray(data)) count = importMany(data as any)
  } else {
    const text = await req.text()
    const items = parseCSV(text)
    if (items.length === 0) return NextResponse.json({ error: "Invalid CSV" }, { status: 400 })
    count = importMany(items)
  }
  return NextResponse.json({ count })
}
