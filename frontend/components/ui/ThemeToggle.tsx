'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9 opacity-0" aria-label="Theme toggle placeholder">
        <div className="w-5 h-5 rounded-full bg-border/40" />
      </Button>
    );
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-9 h-9 text-foreground hover:bg-secondary/50 rounded-xl transition-all"
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {currentTheme === 'dark' ? (
        <Sun className="h-5 w-5 transition-transform duration-500 hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-500 hover:-rotate-12" />
      )}
    </Button>
  );
}
