import { Accessor } from "solid-js";

import type { Client, User } from "@upryzing/upryzing.js";

import ClientController from "./Controller";

export type { default as ClientController } from "./Controller";

export { mapAnyError, mapAndRethrowError } from "./error";

/**
 * Global client controller
 */
export const clientController = new ClientController();

/**
 * Get the currently active client if one is available
 * @returns @upryzing/upryzing.js Client
 */
export function useClient(): Accessor<Client> {
  return () => clientController.getCurrentClient()!;
}

/**
 * Get the currently logged in user
 * @returns User
 */
export function useUser(): Accessor<User | undefined> {
  return () => clientController.getCurrentClient()!.user;
}

/**
 * Plain API client with no authentication
 * @returns API Client
 */
export function useApi() {
  return clientController.api;
}

export const IS_DEV = import.meta.env.DEV;
