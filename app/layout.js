import "./globals.css";
import App from "./providers";
import { ThemeProvider } from "./context/ThemeContext";

export const metadata = {
  title: "Aurika - Digital Gold on the Blockchain",
  description: "Purchasing Digital Gold Made Easy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <App><ThemeProvider>{children}</ThemeProvider></App>
      </body>
    </html>
  );
}
