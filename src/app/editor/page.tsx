import type { Metadata } from 'next';
import { Editor } from '@/components/editor/Editor';

export const metadata: Metadata = {
  title: 'Word List Editor - GenPass',
  description: 'Customize and manage your dictionary of words for personalized password generation.',
};

export default function EditorPage() {
  return <Editor />;
}
