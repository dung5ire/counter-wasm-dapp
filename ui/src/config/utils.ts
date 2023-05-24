import { ApiPromise, WsProvider } from "@polkadot/api";
import config from "."

let api: ApiPromise;

export async function getApi() {
  const { wssProvider } = config;

  const wsProvider = new WsProvider(wssProvider);

  if (!api) {
    api = await ApiPromise.create({ provider: wsProvider });
  }

  return api;
}