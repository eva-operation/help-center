import "./globals.css";
import Header from "./components/Header";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"]
});

export const metadata = {
    title: "Help Center",
    description: "Public help documentation"
};

import { LanguageProvider } from "../lib/i18n";
import Footer from "./components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={poppins.className}>
            <body className="flex flex-col min-h-screen">
                <LanguageProvider>
                    <Header />
                    <main className="flex-grow">
                        {children}
                    </main>
                    <Footer />
                </LanguageProvider>
            </body>
        </html>
    );
}
