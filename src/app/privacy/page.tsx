import type { Metadata } from 'next';
import { PrivacyStatement } from '@/components/privacy/PrivacyStatement';

export const metadata: Metadata = {
  title: 'Privacy Statement - GenPass',
  description: 'Learn about GenPass privacy policy and 100% client-side security architecture.',
};

export default function PrivacyPage() {
  return <PrivacyStatement />;
}
