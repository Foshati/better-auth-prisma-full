import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';

import { Wrapper, WrapperWithQuery } from '@/components/wrapper';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: {
    template: '%s | Better Auth',
    default: 'Better Auth',
  },
  description: 'The most comprehensive authentication library for typescript',
  metadataBase: new URL('https://demo.better-auth.com'),
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='icon' href='/favicon/favicon.ico' sizes='any' />
      </head>
      <body>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <Wrapper>
            <WrapperWithQuery>{children}</WrapperWithQuery>
          </Wrapper>
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
