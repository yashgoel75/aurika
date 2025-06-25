import { NextResponse } from "next/server";
import { Resend } from "resend";

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
  const avgPrice = request.nextUrl.searchParams.get("avgPrice");
  const quantity = request.nextUrl.searchParams.get("quantity");
    const totalPrice = request.nextUrl.searchParams.get("totalPrice");
    const hash = request.nextUrl.searchParams.get("hash");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  // Convert values
  const avgPriceEth = weiToEth(avgPrice) * 1000;
  const totalPriceEth = weiToEth(totalPrice);
  const { value: quantityValue, unit: quantityUnit } = formatQuantity(quantity);

  try {
    const { data } = await resend.emails.send({
      from: "Aurika <connect@yashgoel.me>",
      to: email,
      subject: "Aurika Sell Order Confirmation - Gold Sold Successfully",
      html: `
      <img src="https://res.cloudinary.com/dqwjvwb8z/image/upload/v1750499026/Aurika_Logo_veyj9z.png" alt="Aurika Logo" style="width: 150px; height: auto; margin-bottom: 20px;">
      <h1>Hi ${name},</h1>
      <p>We've successfully processed your <strong>sell order</strong> on <strong>Aurika</strong>.</p>
      <p>Here are the details of your transaction:</p>
      <ul>
        <li><strong>Average Price:</strong> ${avgPriceEth} ETH/g</li>
        <li><strong>Quantity Sold:</strong> ${quantityValue} ${quantityUnit}</li>
        <li><strong>Total Received:</strong> ${totalPriceEth} ETH</li>
      </ul>
      <br></br>
      <a target="_blank"
                                  href='https://sepolia.etherscan.io/tx/${hash}'>View on Etherscan</a>
      <p>The corresponding ETH has been securely recorded and transferred to your connected wallet.</p>
      <p>Thank you for using Aurika to manage your digital gold portfolio.</p>
      <p>If you need help or have questions, we're just a message away.</p>
      <p>Warm regards,<br>Team Aurika</p>
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
