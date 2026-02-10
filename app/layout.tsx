import "./globals.css";
import Header from "./components/Header";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"]
});

export const metadata = {
    title: "Eva Intelligence Hub",
    description: "Documentation and resources for Eva E-Commerce Intelligence"
};

import { LanguageProvider } from "../lib/i18n";
import { ThemeProvider } from "../lib/theme";
import Footer from "./components/Footer";
import { InternalThemeWatcher } from "./components/InternalThemeWatcher";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={poppins.className}>
            <head>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
            </head>
            <body className="flex flex-col min-h-screen">
                <ThemeProvider>
                    <InternalThemeWatcher />
                    <LanguageProvider>
                        <Header />
                        <main className="flex-grow">
                            {children}
                        </main>
                        <Footer />
                    </LanguageProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
