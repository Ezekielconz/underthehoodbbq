// app/layout.js
import './globals.css';
import { Barlow_Condensed, Gaegu } from 'next/font/google';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400','600','700','800'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});
const gaegu = Gaegu({
  subsets: ['latin'],
  weight: ['400','700'],
  variable: '--font-gaegu',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${barlowCondensed.className} ${barlowCondensed.variable} ${gaegu.variable}`}>
        <Nav />
        {children}
        <Footer /> 
      </body>
    </html>
  );
}