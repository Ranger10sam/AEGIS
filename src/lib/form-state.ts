/** Shared shape for useActionState forms (kept out of "use server" files). */
export interface FormState {
  error: string | null;
  /** Name of the field that failed validation, for aria-invalid targeting. */
  field?: string;
  ok?: boolean;
}
