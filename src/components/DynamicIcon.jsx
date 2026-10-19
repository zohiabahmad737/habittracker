import React from 'react';
import * as LucideIcons from 'lucide-react';

export default function DynamicIcon({ name, size = 20, className = '', color }) {
  const IconComponent = LucideIcons[name] || LucideIcons.Sparkles;
  return <IconComponent size={size} className={className} color={color} />;
}
