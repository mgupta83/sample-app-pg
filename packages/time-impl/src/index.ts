import type { TimeProvider } from "@app/interfaces";

export class ISOTimeProvider implements TimeProvider {
  getServerTime(): string {
    return new Date().toISOString();
  }
}
