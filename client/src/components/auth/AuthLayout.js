'use client';

export function AuthLayout({ children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-base font-sans selection:bg-accent-primary/30">
      {/* Background: Minimal Dot Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #171717 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />
      
      {children}
    </div>
  );
}
