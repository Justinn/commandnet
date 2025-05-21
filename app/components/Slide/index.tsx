import React from "react";
import { SlideWrapper, SlideView } from "./Slide.styles";

export interface SlideProps {
  children: React.ReactNode[];
  activeIndex: number;
  direction?: 'left' | 'right';
  className?: string;
}

type SlideViewProps = React.ComponentProps<typeof SlideView>;

function isSlideViewElement(
  child: React.ReactNode
): child is React.ReactElement<SlideViewProps> {
  return (
    React.isValidElement(child) &&
    // @ts-expect-error styled-components displayName
    (child.type === SlideView || child.type.displayName === SlideView.displayName)
  );
}

/**
 * Generic Slide component for animated tab/page transitions.
 * Usage:
 * <Slide activeIndex={0} direction="right">
 *   <SlideView>...</SlideView>
 *   <SlideView>...</SlideView>
 * </Slide>
 */
export function Slide({ children, activeIndex, direction = 'right', className }: SlideProps) {
  return (
    <SlideWrapper className={className}>
      {React.Children.map(children, (child, idx) =>
        isSlideViewElement(child)
          ? React.cloneElement(child, {
              $active: idx === activeIndex,
              $direction: direction,
            })
          : child
      )}
    </SlideWrapper>
  );
}

export { SlideWrapper, SlideView }; 