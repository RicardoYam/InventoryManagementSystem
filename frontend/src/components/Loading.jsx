import React from "react";
import { Oval } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
      <Oval
        height={50}
        width={50}
        color="#4891ff"
        visible={true}
        ariaLabel="oval-creating"
        secondaryColor="#4891ff"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
      <p className="ml-4">Loading...</p>
    </div>
  );
}
