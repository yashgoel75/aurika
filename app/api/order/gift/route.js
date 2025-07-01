import { NextResponse } from "next/server";
import { Resend } from "resend";
export const runtime = "nodejs";
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper functions
const weiToEth = (wei) => (parseFloat(wei) / 1e18).toFixed(6);
const formatQuantity = (mg) => {
  const q = parseFloat(mg);
  return q >= 1000
    ? { value: (q / 1000).toFixed(3), unit: "g" }
    : { value: q.toFixed(0), unit: "mg" };
};

export async function GET(request) {
  const name = request.nextUrl.searchParams.get("name");
  const email = request.nextUrl.searchParams.get("email");
  const receiversAddress = request.nextUrl.searchParams.get("receiversAddress");
  const avgPrice = request.nextUrl.searchParams.get("avgPrice");
  const quantity = request.nextUrl.searchParams.get("quantity");
  const totalPrice = request.nextUrl.searchParams.get("totalPrice");
  const hash = request.nextUrl.searchParams.get("hash");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  // Convert values
  const avgPriceEth = (weiToEth(avgPrice) * 1000).toFixed(3);
  const totalPriceEth = weiToEth(totalPrice);
  const { value: quantityValue, unit: quantityUnit } = formatQuantity(quantity);

  try {
    const { data } = await resend.emails.send({
      from: "Aurika <connect@yashgoel.me>",
      to: email,
      subject: "Aurika Gift Order Confirmation - Digital Gold Secured",
      html: `
      <img src="https://res.cloudinary.com/dqwjvwb8z/image/upload/v1750499026/Aurika_Logo_veyj9z.png" alt="Aurika Logo" style="width: 150px; height: auto; margin-bottom: 20px;">
      <h1>Hi ${name},</h1>
      <p>Thank you for your recent <strong>gift order</strong> on <strong>Aurika</strong>!</p>
      <p>Here are the details of your transaction:</p>
      <ul>
      <li><strong>Receiver's Wallet Address</strong> ${receiversAddress}</li>
        <li><strong>Average Price:</strong> ${avgPriceEth} ETH/g</li>
        <li><strong>Quantity:</strong> ${quantityValue} ${quantityUnit}</li>
        <li><strong>Total Value:</strong> ${totalPriceEth} ETH</li>
      </ul>
      <br></br>
      <a target="_blank"
                                  href='https://sepolia.etherscan.io/tx/${hash}'>View on Etherscan</a>
      <p>Your gold is now securely recorded on the blockchain and added to your portfolio.</p>
      <p>You can:</p>
      <ul>
        <li>Track your portfolio in real time</li>
        <li>Access full transparency with on-chain records</li>
        <li>Maintain full control of your assets with your wallet</li>
      </ul>
      <p>If you have any questions, our team is here to help.</p>
      <p>Wishing you golden success,<br>Team Aurika</p>
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
