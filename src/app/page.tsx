import type { Metadata } from 'next';
import { Generator } from '@/components/generator/Generator';

export const metadata: Metadata = {
  title: 'GenPass - Secure & Memorable Password Generator',
  description: 'Generate strong, memorable passwords locally and securely in your browser.',
};

export default function HomePage() {
  return <Generator />;
}
