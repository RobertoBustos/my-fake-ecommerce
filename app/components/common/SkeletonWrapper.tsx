import Skeleton, { SkeletonLoading } from "expo-skeleton-loading";
import { FC, ReactNode } from "react";

export type SkeletonWrapperPropsType = {
  children: ReactNode;
  background?: string;
  highlight?: string;
};

export const Wrapper = Skeleton as FC<
  SkeletonLoading & { children: ReactNode }
>;

const SkeletonWrapper = ({
  children,
  background = "#adadad",
  highlight = "#ffffff",
}: SkeletonWrapperPropsType) => {
  return (
    <Wrapper background={background} highlight={highlight}>
      {children}
    </Wrapper>
  );
};

export default SkeletonWrapper;
