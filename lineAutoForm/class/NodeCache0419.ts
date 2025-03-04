/**
 * MyNodeCache0419.ts
 *
 * name：CACHE
 * function：CACHE operation
 * updated: 2024/04/19
 **/

// define modules
import log4js from "log4js"; // logger
import NodeCache from "node-cache"; // node-cache

const DEFAULT_TTL: number = 1800; // 30 second

// logger setting
log4js.configure({
  appenders: {
    out: { type: "stdout" },
    system: { type: "file", filename: "../logs/access.log" },
  },
  categories: {
    default: { appenders: ["out", "system"], level: "debug" },
  },
});
const logger: any = log4js.getLogger();

// CacheService
class CacheService {
  private static instance: NodeCache;

  constructor() {
    if (typeof CacheService.instance === "undefined") {
      CacheService.instance = new NodeCache();
    }
  }

  set(key: string, value: any) {
    CacheService.instance.set(key, value, DEFAULT_TTL);
  }

  get(key: string) {
    const value = CacheService.instance.get(key);
    if (value === "undefined") {
      return null;
    }
    return value;
  }

  del(keys: string[]) {
    CacheService.instance.del(keys);
  }

  getKeys() {
    return CacheService.instance.keys();
  }
}

export default new CacheService();
