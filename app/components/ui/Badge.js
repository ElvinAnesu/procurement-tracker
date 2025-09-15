'use client';

import { CheckCircle, Clock, UserCheck, Search, FileText, DollarSign, Shield, CreditCard, Truck, XCircle, X, AlertTriangle, ArrowUp, Minus, ArrowDown, HelpCircle } from 'lucide-react';

const iconMap = {
  CheckCircle,
  Clock,
  UserCheck,
  Search,
  FileText,
  DollarSign,
  Shield,
  CreditCard,
  Truck,
  XCircle,
  X,
  AlertTriangle,
  ArrowUp,
  Minus,
  ArrowDown,
  HelpCircle
};

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  icon, 
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800',
    teal: 'bg-teal-100 text-teal-800'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  const IconComponent = icon ? iconMap[icon] : null;
  
  return (
    <span className={classes}>
      {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
      {children}
    </span>
  );
};

export default Badge;
