import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SupportTicket from "@/lib/models/SupportTicket";

/**
 * [POST] /api/tickets - Create a new support ticket
 * [GET] /api/tickets - Retrieve all tickets with optional filtering
 */

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();

    // Mongoose validation will handle field requirements
    const ticket = await SupportTicket.create(data);

    return NextResponse.json(
      { success: true, ticket },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/tickets]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create ticket" },
      { status: 400 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    // Optional filtering logic
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tickets = await SupportTicket.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("[GET /api/tickets]:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
