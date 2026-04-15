import React, { ElementType } from "react";

/**
 * AnimatedHeadline provides a headline with an animated underline on parent .group hover.
 *
 * @param {object} props - Props for the component
 * @param {string} [props.as] - The heading tag to render (h1, h2, p, etc.), defaults to h2
 * @param {React.ReactNode} props.children - The text or elements to display in the headline
 * @param {string} [props.extraClassName] - Additional Tailwind classes to add
*/
type AnimatedHeadlineProps = {
  as?: ElementType;
  children: React.ReactNode;
  extraClassName?: string;
};

const AnimatedHeadline: React.FC<AnimatedHeadlineProps> = ({
  as: Tag = "h2",
  children,
  extraClassName = "",
}) => {
  return (
    <Tag
      className={`relative font-playfair font-bold text-accent group-hover:text-accent/80 transition-colors duration-300 ${extraClassName}`.trim()}
    >
      {children}
      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-px bg-accent group-hover:w-full transition-all duration-500 ease-out"></span>
      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-px bg-accent/40 group-hover:w-3/4 transition-all duration-700 delay-100 ease-out"></span>
    </Tag>
  );
};

export default AnimatedHeadline;
