import React from "react";
import ReactLoading from "react-loading";
export default function Loading() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6 bg-background">
      <ReactLoading
        type="bars"
        color="currentColor"
        height={64}
        width={64}
        className="text-primary"
      />
    </div>
  );
}
