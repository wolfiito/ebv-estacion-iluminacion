import { z } from 'zod';

export type RegistrationFormData = {
  childName: string;
  age: number;
  gender: 'niño' | 'niña';
  parentName: string;
  invitedBy?: string;
};

export const registrationSchema = z.object({
  childName: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  age: z.coerce
    .number({ message: 'Ingresa un número válido' })
    .min(3, 'La edad mínima es de 3 años')
    .max(16, 'La edad máxima es de 16 años'),
  gender: z.enum(['niño', 'niña'] as const, {
    message: 'Debes seleccionar el género',
  }),
  parentName: z
    .string()
    .min(3, 'El nombre del tutor debe tener al menos 3 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  invitedBy: z
    .string()
    .max(100, 'El nombre es demasiado largo')
    .optional()
    .or(z.literal('')),
}) satisfies z.ZodType<RegistrationFormData>; // Aseguramos que el esquema cumple con el tipo