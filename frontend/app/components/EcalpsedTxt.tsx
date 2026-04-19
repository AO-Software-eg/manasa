'use client';

import { useState } from 'react';

export default function ExpandableText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p
        className={`text-lg text-gray-300 py-6 ${!expanded ? 'truncate-text' : ''}`}
      >
        {text}
      </p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-400 hover:underline"
      >
        {expanded ? 'تقليص' : 'اقرأ المزيد'}
      </button>
    </div>
  );
}
