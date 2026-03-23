import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SupportTicket from "@/lib/models/SupportTicket";
import mongoose from "mongoose";

/**
 * [GET] /api/tickets/:id - Get single ticket by ID
 * [PUT] /api/tickets/:id - Update ticket by ID
 * [DELETE] /api/tickets/:id - Delete ticket by ID
 */

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    await dbConnect();
    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error("[GET /api/tickets/:id]:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    await dbConnect();
    const ticket = await SupportTicket.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error("[PUT /api/tickets/:id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update ticket" },
      { status: 400 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    await dbConnect();
    const ticket = await SupportTicket.findByIdAndDelete(id);

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("[DELETE /api/tickets/:id]:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
