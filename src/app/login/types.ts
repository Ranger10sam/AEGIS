// Shared so the server action and the client form agree on the shape, without
// exporting a non-function from the "use server" module.
export interface LoginState {
  error: string | null;
}
