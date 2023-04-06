import { FC, memo, useCallback } from "react";
import { twMerge } from "tailwind-merge";

type LoaderProps = {
  className?: string;
  fullScreen?: boolean;
};

const Loader: FC<LoaderProps> = memo(({ className, fullScreen = false }) => {
  const InnerContent = useCallback(
    () => (
      <div
        className={twMerge(
          "relative inline-block w-20 h-20",
          fullScreen && "m-auto",
          className
        )}
      >
        <div className="absolute border-4 border-primary rounded-full opacity-0 animate-ripple" />
        <div className="absolute border-4 border-primary rounded-full opacity-0 animate-ripple-delay" />
      </div>
    ),
    [className, fullScreen]
  );

  if (!fullScreen) return <InnerContent />;
  return (
    <div className="z-50 fixed inset-0 flex bg-base-100 bg-opacity-40 backdrop-blur-sm">
      <InnerContent />
    </div>
  );
});

Loader.displayName = "Loader";
export { Loader };
