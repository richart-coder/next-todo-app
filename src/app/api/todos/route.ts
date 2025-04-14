import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
	try {
		const todos = await prisma.todo.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		return NextResponse.json(todos);
	} catch {
		return NextResponse.json(
			{ error: "Failed to fetch todos" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const { title } = await request.json();
		const todo = await prisma.todo.create({
			data: {
				title,
				completed: false,
			},
		});
		return NextResponse.json(todo);
	} catch {
		return NextResponse.json(
			{ error: "Failed to create todo" },
			{ status: 500 }
		);
	}
}
