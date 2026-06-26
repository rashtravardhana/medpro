import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: {
    default: 'MedCareer — Healthcare Jobs Platform',
    template: '%s | MedCareer',
  },
  description: 'Find the best medical and healthcare jobs in India. Connect doctors and hospitals on MedCareer.',
  keywords: ['medical jobs', 'healthcare hiring', 'doctor jobs', 'hospital recruitment', 'MBBS jobs', 'nursing jobs'],
  openGraph: {
    title: 'MedCareer — Healthcare Jobs Platform',
    description: 'Find the best medical and healthcare jobs in India.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
