interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className = "", children }: CardProps) {
  return (
    <div className={`rounded-xl backdrop-blur-md bg-white/5 border border-white/10 ${className}`}>
      {children}
    </div>
  );
} 