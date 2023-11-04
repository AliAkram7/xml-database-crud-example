import "@mantine/core/styles.css";
import '@mantine/code-highlight/styles.css';
import '@mantine/dates/styles.css';
import React from "react";
import { MantineProvider, ColorSchemeScript, Flex, Transition } from "@mantine/core";
import { theme } from "../theme";
import { NavbarSimple } from "../components/navbar";
import { Providers } from "./providers";
import { Button } from "@nextui-org/react";
import { Footer } from "../components/footer";

export const metadata = {
  title: "Mantine Next.js template",
  description: "I am using Mantine with Next.js!",
};



export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" className="dark">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <Providers >
          <MantineProvider defaultColorScheme="dark" theme={theme}>
            <Flex pt={50} gap={'xs'} justify={'space-around'} >
              <NavbarSimple />
              <div style={{ width: '90%', paddingRight: '20px' }}>
                {children}
              </div>
            </Flex>
            <Footer />
          </MantineProvider>
        </Providers>
      </body>
    </html>
  );
}
