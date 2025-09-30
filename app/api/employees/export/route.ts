import { NextResponse } from "next/server"
import { exportAll } from "../../_db"

export async function GET() {
  const data = exportAll()
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="employees.json"',
    },
  })
}
