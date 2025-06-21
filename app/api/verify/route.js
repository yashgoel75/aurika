let storedEmail = "";
let storedOtp = 0;

export async function POST(request) {
  const { email, otp } = await request.json();

  if (!email || typeof otp !== "number") {
    return NextResponse.json(
      { error: "Missing or invalid email/OTP" },
      { status: 400 }
    );
  }

  storedEmail = email;
  storedOtp = otp;

  return NextResponse.json({ message: "OTP stored" });
}

export async function GET(request) {
  const email = request.nextUrl.searchParams.get("email");
  const otp = Number(request.nextUrl.searchParams.get("otp"));

  if (!email || isNaN(otp)) {
    return NextResponse.json(
      { error: "Missing or invalid email/OTP" },
      { status: 400 }
    );
  }

  const isValidOtp = email === storedEmail && otp === storedOtp;

  if (isValidOtp) {
    return NextResponse.json({ message: "OTP verified successfully" });
  } else {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }
}
