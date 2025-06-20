import { useSearchParams } from "next/navigation";
import { Dialog } from "primereact/dialog";
import React, { useCallback, useMemo } from "react";

const UserCreateModal = () => {
  const searchParams = useSearchParams();

  const open = useMemo(() => {
    return searchParams.get("modal") == "create";
  }, [searchParams]);

  const onHide = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [searchParams]);
  return (
    <Dialog
      header="Nuevo Usuario"
      headerClassName="bg-blue-600 text-white dialog-header-primary"
      draggable={false}
      visible={open}
      style={{ width: "50vw" }}
      onHide={onHide}
    >
      <p className="m-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </Dialog>
  );
};

export default UserCreateModal;
