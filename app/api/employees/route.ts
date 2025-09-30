import { NextResponse } from "next/server"
import { list, create } from "../_db"
import type { Employee } from "@/lib/types"

export async function GET() {
  // Optional: in a real DB we’d accept query params for filtering/pagination
  return NextResponse.json(list())
}

export async function POST(req: Request) {
  const body = (await req.json()) as Omit<Employee, "id" | "createdAt" | "updatedAt">
  const created = create(body)
  return NextResponse.json(created, { status: 201 })
}
