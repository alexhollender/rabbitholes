"use client";

import * as React from "react";
import * as Ui from "@/ui";

export default function Home() {
  return (
    <div className="max-w-[600px] mx-auto mt-6 px-4">
      <Ui.Form />
      <Ui.NodesList />
    </div>
  );
}
