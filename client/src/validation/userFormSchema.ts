import { z } from "zod";

export const userFormSchema = z.object({
  id: z
    .string({
      required_error: "El ID es obligatorio",
      invalid_type_error: "El ID debe ser texto",
    })
    .nonempty("El ID es obligatorio")
    .min(3, "El ID debe tener al menos 3 caracteres")
    .max(10, "El ID no puede tener más de 10 caracteres")
    .regex(/^\d+$/, "El ID debe ser numérico"),

  usuario: z
    .string()
    .nonempty("El nombre es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),

  estado: z.string().nonempty("El estado es obligatorio"),
  sector: z.number(),
});
