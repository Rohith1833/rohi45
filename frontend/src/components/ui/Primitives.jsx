import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-[background-color,transform] text-sm font-medium shadow-sm',
    secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition-[background-color,transform] text-sm font-medium',
    accent: 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-[background-color,transform] text-sm font-medium shadow-sm',
    ghost: 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm font-medium',
    danger: 'bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors text-sm font-medium'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 rounded-xl',
    lg: 'px-6 py-3 text-base rounded-2xl'
  };
  
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none transform-gpu',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

export const Badge = ({ children, variant = 'gray', className }) => {
  const variants = {
    gray: 'bg-slate-100 text-slate-600 border-slate-200',
    brand: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    danger: 'bg-rose-50 text-rose-600 border-rose-100'
  };
  
  return (
    <span className={cn(
      'px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border leading-none inline-flex items-center gap-1.5',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-slate-100 rounded-lg", className)} />
);

export const EmptyState = ({ title, description, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 max-w-sm mx-auto">
     <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
        <Icon size={24} />
     </div>
     <div className="space-y-1">
        <h3 className="text-base font-semibold tracking-tight text-slate-900">{title}</h3>
        <p className="text-sm font-normal text-slate-500 leading-relaxed">{description}</p>
     </div>
  </div>
);
