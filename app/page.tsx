import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import EmployeesClient from "../components/employees/employees-client"
import { KpiCards } from "@/components/employees/kpi-cards"
import { DepartmentChart } from "@/components/employees/department-chart"

export default function Page() {
  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="size-6 rounded-md bg-primary" aria-hidden />
            <span className="text-sm font-semibold">Acme Employees</span>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton data-active>Dashboard</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Departments</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Settings</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-pretty text-xl font-semibold tracking-tight">Employee Management</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <a href="/api/employees/export" download>
                  Export JSON
                </a>
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6">
          <section className="mb-6">
            <KpiCards />
          </section>
          <section className="mb-6">
            <Card className="p-4">
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">Employees by Department</h2>
              <DepartmentChart />
            </Card>
          </section>
          <section>
            <EmployeesClient />
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
