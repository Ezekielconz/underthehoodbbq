// app/layout.js
import './globals.css';
import { Barlow_Condensed, Gaegu } from 'next/font/google';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Under The Hood BBQ',
  description: 'Slow-smoked goodness.',
};

// Load both fonts and expose CSS variables
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['100','200','300','400','500','600','700','800','900'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

const gaegu = Gaegu({
  subsets: ['latin'],
  weight: ['300','400','700'],
  variable: '--font-gaegu',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* attach font vars to body */}
      <body className={`${barlowCondensed.variable} ${gaegu.variable}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
