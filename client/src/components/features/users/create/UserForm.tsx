import Field from "@/components/common/Field";
import TextField from "@/components/common/TextField";
import { userFormSchema } from "@/validation/userFormSchema";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@/hooks/useDebounce";
import UserService from "@/services/UserService";
import { boolean } from "zod/v4-mini";
import useValidateUserId from "@/hooks/useValidateUserId";

const statuses = [
  {
    name: "Activo",
    value: "ACTIVE",
  },
  {
    name: "Inactivo",
    value: "INACTIVE",
  },
];

const sector = { name: "4000", value: "4000" };

type UserFormData = z.infer<typeof userFormSchema>;

const UserForm = ({ onCancel }: { onCancel: () => void }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    mode: "all",
    defaultValues: {
      id: "",
      usuario: "",
      estado: "",
      sector: sector,
    },
  });

  const id = watch("id");

  const idAvailable = useValidateUserId(id);

  const onSubmit = (data: UserFormData) => {
    console.log("DATA", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-column mt-4 gap-2"
    >
      <TextField
        id="id"
        label="ID"
        placeholder="Ingrese el ID del usuario"
        leftIcon="pi pi-hashtag"
        helperText="El ID debe ser númerico"
        keyfilter="num"
        showCheck={!errors.id && dirtyFields.id && idAvailable == true}
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
          onChange={(e) => setValue("estado", e.value)}
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
          value="4000"
        />
      </Field>

      <div className="flex justify-content-between mt-3">
        <Button
          label="Cancelar"
          severity="secondary"
          type="reset"
          onClick={onCancel}
        />
        <Button label="Confirmar" type="submit" />
      </div>
    </form>
  );
};

export default UserForm;
