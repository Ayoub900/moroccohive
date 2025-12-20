import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { checkRateLimit } from "@/lib/limiter";

// Validation helper
function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

function validatePhone(phone: string): boolean {
    // Basic phone validation - at least 10 digits
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
    return phoneRegex.test(phone)
}

export async function POST(request: NextRequest) {
    const rateLimitError = await checkRateLimit("strict");
    if (rateLimitError) return rateLimitError;

    try {
        const body = await request.json()

        // Validate required fields
        const requiredFields = [
            "travelStyle",
            "travelDates",
            "arrivalCity",
            "departureCity",
            "accommodation",
            "budget",
            "numberOfTravelers",
            "fullName",
            "email",
            "phone",
        ]

        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                )
            }
        }

        // Validate email format
        if (!validateEmail(body.email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
        }

        // Validate phone format
        if (!validatePhone(body.phone)) {
            return NextResponse.json({ error: "Invalid phone format" }, { status: 400 })
        }

        // Validate number of travelers
        if (isNaN(body.numberOfTravelers) || body.numberOfTravelers < 1) {
            return NextResponse.json(
                { error: "Number of travelers must be at least 1" },
                { status: 400 }
            )
        }

        // Create trip request
        const tripRequest = await prisma.tripRequest.create({
            data: {
                travelStyle: body.travelStyle,
                travelDates: body.travelDates,
                arrivalCity: body.arrivalCity,
                departureCity: body.departureCity,
                accommodation: body.accommodation,
                budget: body.budget,
                adventureActivities: body.adventureActivities || [],
                experiences: body.experiences || [],
                importantFactors: body.importantFactors || [],
                desiredExperiences: body.desiredExperiences,
                transportation: body.transportation,
                importantCriteria: body.importantCriteria,
                numberOfTravelers: parseInt(body.numberOfTravelers),
                travelerAges: body.travelerAges,
                extraDetails: body.extraDetails,
                fullName: body.fullName,
                email: body.email,
                phone: body.phone,
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: "Trip request submitted successfully",
                id: tripRequest.id,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error creating trip request:", error)
        return NextResponse.json(
            { error: "Failed to submit trip request" },
            { status: 500 }
        )
    }
}
