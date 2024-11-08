import { AppProgressBar } from "next-nprogress-bar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function ProgressBarProvider({ children }: Props) {
  return (
    <>
      {children}
      <AppProgressBar color="#FA2D6C" height="4px" options={{ showSpinner: false }} shallowRouting />
    </>
  );
}
