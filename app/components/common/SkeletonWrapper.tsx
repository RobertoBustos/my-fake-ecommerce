import Skeleton, { SkeletonLoading } from "expo-skeleton-loading";
import { FC, PropsWithChildren } from "react";
import { colors } from "../../constants/colors";

export type SkeletonWrapperPropsType = PropsWithChildren & {
  background?: string;
  highlight?: string;
};

export const Wrapper = Skeleton as FC<PropsWithChildren & SkeletonLoading>;

const SkeletonWrapper = ({
  children,
  background = colors.skeletonBackground,
  highlight = colors.white,
}: SkeletonWrapperPropsType) => {
  return (
    <Wrapper background={background} highlight={highlight}>
      {children}
    </Wrapper>
  );
};

export default SkeletonWrapper;
