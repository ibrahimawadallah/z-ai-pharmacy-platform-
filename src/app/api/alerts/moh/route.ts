import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "5")
    const activeOnly = searchParams.get("activeOnly") !== "false"
    
    const alerts = await db.mohDrugAlert.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { publishedAt: 'desc' },
      take: limit
    })
    
    return NextResponse.json({ alerts })
  } catch (error) {
    console.error("Failed to fetch MOH alerts:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Basic auth check would go here for admin endpoints
    
    const body = await req.json()
    
    const alert = await db.mohDrugAlert.create({
      data: {
        title: body.title,
        description: body.description,
        alertType: body.alertType,
        severity: body.severity,
        sourceUrl: body.sourceUrl,
        drugId: body.drugId,
        isActive: body.isActive ?? true,
      }
    })
    
    return NextResponse.json({ success: true, alert })
  } catch (error) {
    console.error("Failed to create MOH alert:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
