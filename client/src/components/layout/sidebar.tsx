import { Button } from "primereact/button";
import React from "react";

const Sidebar = () => {
  return (
    <div className="bg-bluegray-800 flex-column gap-2 w-4rem align-items-center py-3 hidden md:flex shadow-2">
      {[1, 2, 3, 4, 5, 6].map((key) => (
        <Button
          key={key}
          icon="pi pi-box"
          text
          className="text-white"
          aria-label={`Link ${key}`}
          link
        />
      ))}
    </div>
  );
};

export default Sidebar;
