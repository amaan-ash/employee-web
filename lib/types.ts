export type Employee = {
  id: string
  name: string
  email: string
  department: string
  role: string
  status: "Active" | "Inactive"
  startDate: string // YYYY-MM-DD
  createdAt: string
  updatedAt: string
}
