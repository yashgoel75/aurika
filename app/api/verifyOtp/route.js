import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request) {
    const email = request.nextUrl.searchParams.get("email");
    const otp = request.nextUrl.searchParams.get("otp");

  if (!email || !otp) {
    return NextResponse.json(
      { error: "Missing email or OTP" },
      { status: 400 }
    );
  }

  try {
    const { data } = await resend.emails.send({
      from: "Aurika <connect@yashgoel.me>",
      to: email,
      subject: "Welcome to Aurika! OTP Verification",
      html: `
      <img src="https://res.cloudinary.com/dqwjvwb8z/image/upload/v1750499026/Aurika_Logo_veyj9z.png" alt="Aurika Logo" style="width: 150px; height: auto; margin-bottom: 20px;">
        <h1>Welcome to Aurika!</h1>
        <p>Thank you for registering with Aurika. Please use this OTP to verify your email:</p>
        <h2 style="font-size: 24px; font-weight: bold;">${otp}</h2>
        <p>This OTP is valid for <strong>10 minutes.</strong></p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br>Aurika Team</p>
      `,
    });
    
    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
