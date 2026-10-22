import type { Metadata } from 'next';
import { Generator } from '@/components/generator/Generator';

export const metadata: Metadata = {
  title: 'Password Generator - GenPass',
  description: 'Generate customizable, high-entropy, memorable passwords securely in your browser.',
};

export default function GeneratorPage() {
  return <Generator />;
}
