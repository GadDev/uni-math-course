import type { RequestAuth } from './lib/auth/server';
declare global {
  namespace App {
    interface Locals {
      auth: RequestAuth | null;
    }
  }
}
export {};
