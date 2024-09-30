import { cn } from "@/lib/utils";


const Wrapper = ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) => {
  return (
    <div
      className={cn(
        'h-full mx-auto w-full max-w-screen-2xl px-4 md:px-20',
        className
      )}
    >
      {children}
    </div>
  )
}

export default Wrapper