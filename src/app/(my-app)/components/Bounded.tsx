import { CSSProperties, ElementType, ReactNode } from "react";
import clsx from "clsx";
import React from "react";

interface BoundedProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export const Bounded = React.forwardRef<HTMLElement, BoundedProps>(
  ({ as: Comp = "div", className, children, ...restProps }, ref) => {
    return (
      <Comp
        ref={ref}
        className={clsx(
          "px-6 ~py-4/8 [.header+&]:pt-44 [.header+&]:md:pt-32",
          className
        )}
        {...restProps}
      >
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </Comp>
    );
  }
);

Bounded.displayName = "Bounded";
