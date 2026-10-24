import { NextResponse } from "next/server";
import { initialMenus } from "@/data/gadoGadoData";

export async function GET() {
  return NextResponse.json({
    total: initialMenus.length,
    menus: initialMenus,
  });
}
