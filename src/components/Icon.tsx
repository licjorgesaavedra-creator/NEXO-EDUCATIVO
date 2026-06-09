/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  GraduationCap,
  Sparkles,
  HeartHandshake,
  Compass,
  BookOpen,
  Heart,
  Smartphone,
  Users,
  Palette,
  CheckSquare,
  Users2,
  Clock,
  Target,
  ArrowRight,
  X,
  Send,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Mail,
  Phone,
  ArrowRightCircle,
  Award,
  ChevronRight,
  Sparkle,
  MessagesSquare,
  Check,
  Download,
  FileText,
  Eye,
  Shield
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Sparkles,
  HeartHandshake,
  Compass,
  BookOpen,
  Heart,
  Smartphone,
  Users,
  Palette,
  CheckSquare,
  Users2,
  Clock,
  Target,
  ArrowRight,
  X,
  Send,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Mail,
  Phone,
  ArrowRightCircle,
  Award,
  ChevronRight,
  Sparkle,
  MessagesSquare,
  Check,
  Download,
  FileText,
  Eye,
  Shield
};

interface IconProps {
  name: string;
  className?: string;
}

export default function Icon({ name, className }: IconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    // Fallback icon
    return <Sparkles className={className} />;
  }
  return <IconComponent className={className} />;
}
