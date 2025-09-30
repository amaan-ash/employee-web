import { NextResponse } from "next/server"
import { update, remove } from "../../_db"

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const updates = await _req.json()
  const next = update(params.id, updates)
  if (!next) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(next)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const ok = remove(params.id)
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ ok: true })
}
