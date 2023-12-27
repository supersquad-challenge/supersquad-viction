"use client";
import Layout from "@/layout/Layout";
import GlobalStyle from "@/styles/global";
import Providers from "@/redux/provider";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import StyledComponentsRegistry from "@/styles/registry/registry";
import dotenv from "dotenv";
dotenv.config();

// 1. Get PROJECT_ID
const metadata = {
  name: "SuperSquad v2",
  description: "supersqaud challenge",
  url: "https://v2.supersquad.store",
  icons: "/src/app/favicon.ico",
};

// 3. Create modal
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = new QueryClient();
  return (
    <html lang="en">
      <body style={{ margin: "0px" }}>
        <QueryClientProvider client={client}>
          <StyledComponentsRegistry>
            <GlobalStyle />
            <Providers>
              <Layout>{children}</Layout>
            </Providers>
          </StyledComponentsRegistry>
        </QueryClientProvider>
      </body>
    </html>
  );
}
