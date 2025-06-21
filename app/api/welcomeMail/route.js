import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request) {
  const name = request.nextUrl.searchParams.get("name");
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Missing email" },
      { status: 400 }
    );
  }

  try {
    const { data } = await resend.emails.send({
      from: "Aurika <connect@yashgoel.me>",
      to: email,
      subject: "Welcome to Aurika - Your Journey into Digital Gold Starts Now!",
      html: `
      <img src="https://res.cloudinary.com/dqwjvwb8z/image/upload/v1750499026/Aurika_Logo_veyj9z.png" alt="Aurika Logo" style="width: 150px; height: auto; margin-bottom: 20px;">
      <h1>Hi ${name},</h1>
      <p>Welcome to <strong>Aurika</strong> – we're thrilled to have you onboard!</p>
      <p>You’ve just taken the first step toward experiencing a smarter, decentralized way of buying and holding <strong>digital gold</strong> using blockchain technology.</p>
        <p>Here’s what you can now do:
        <ul><li>Buy & hold digital gold securely on-chain</li>
        <li>Track your portfolio in real time
</li>
        <li>Enjoy complete control over your assets with your own wallet
</li></ul>
        <p>If you have any questions or suggestions, feel free to reach out. We’re constantly evolving — and your feedback matters.</p>
        <p>Wishing you golden success,
<br>Team Aurika</p>
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
