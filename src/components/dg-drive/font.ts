import { Montserrat } from "next/font/google";

// Shared by every DG Drive page so the font is only declared once.
export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});
