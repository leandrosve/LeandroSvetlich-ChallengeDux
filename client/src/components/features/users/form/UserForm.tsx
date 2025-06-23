import Field from "@/components/common/Field";
import TextField from "@/components/common/TextField";
import { userFormSchema } from "@/validation/userFormSchema";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useValidateUserId from "@/hooks/useValidateUserId";
import User from "@/models/User";
import Alert from "@/components/common/Alert";
import { useUserList } from "@/context/UserListContext";
import { createUser, updateUser } from "@/services/UserService.client";

const statuses = [
  {
    name: "Activo",
    value: "ACTIVO",
  },
  {
    name: "Inactivo",
    value: "INACTIVO",
  },
];

const sector = { name: "4000", value: 4000 };

interface Props {
  onCancel: () => void;
  mode: "create" | "edit";
  user?: User | null;
  onSuccess: (mode: "create" | "edit") => void;
}

const UserForm = ({ onCancel, mode = "create", onSuccess, user }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields, isValid },
  } = useForm<User>({
    resolver: zodResolver(userFormSchema),
    mode: "all",
    defaultValues: user ?? {
      id: "",
      usuario: "",
      estado: "",
      sector: 4000,
    },
  });

  const { actions } = useUserList();

  const id = watch("id");

  const [error, setError] = useState("");

  const { idAvailable, loading: validatingUserId } = useValidateUserId(
    id,
    user?.id
  );

  const onSubmit = useCallback(
    async (data: User) => {
      setError("");
      let res;
      if (mode == "create") {
        res = await createUser(data);
      } else if (mode == "edit" && user) {
        res = await updateUser(user.id, data);
      } else return;

      if (res.hasError) {
        setError("Se ha producido un error");
        return;
      }

      if (mode == "edit" && user) {
        actions.updateUser(user.id, res.data);
      }

      onSuccess(mode);
    },
    [mode, user, actions, onSuccess]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-column mt-4 gap-2"
    >
      {error && <Alert title={error} severity="error" />}
      <TextField
        id="id"
        label="ID"
        placeholder="Ingrese el ID del usuario"
        leftIcon="pi pi-hashtag"
        helperText={!user?.id ? "El ID debe ser númerico" : undefined}
        disabled={!!user?.id}
        keyfilter="num"
        showCheck={!errors.id && dirtyFields.id && idAvailable == true}
        loading={validatingUserId}
        {...register("id")}
        errorMessage={
          idAvailable == false
            ? "El ID ya se encuentra en uso"
            : errors.id?.message
        }
      />
      <TextField
        id="usuario"
        label="Nombre"
        placeholder="Ingrese el nombre del usuario"
        {...register("usuario")}
        errorMessage={errors.usuario?.message}
      />
      <Field htmlFor="estado" label="Estado">
        <Dropdown
          id="estado"
          options={statuses}
          optionLabel="name"
          placeholder="Seleccionar el estado"
          value={watch("estado")}
          onChange={(e) =>
            setValue("estado", e.value, { shouldValidate: true })
          }
          className="w-full"
        />
      </Field>
      <Field htmlFor="sector" label="Sector">
        <Dropdown
          id="sector"
          options={[sector]}
          disabled
          optionLabel="name"
          placeholder="Selecciona un sector"
          value={watch("sector")}
        />
      </Field>

      <div className="flex justify-content-between mt-3">
        <Button
          label="Cancelar"
          severity="secondary"
          onClick={(e) => {
            e.preventDefault();
            onCancel();
          }}
        />
        <Button
          label="Confirmar"
          type="submit"
          loading={isSubmitting}
          disabled={!isValid || !idAvailable}
        />
      </div>
    </form>
  );
};

export default UserForm;
