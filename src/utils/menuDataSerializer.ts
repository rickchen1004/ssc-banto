export interface AddonData {
  name: string;
  price: number;
}

/**
 * 序列化 optionGroups 為 JSON 字串
 * @param optionGroups - 選項組的巢狀陣列
 * @returns JSON 字串
 */
export function serializeOptionGroups(optionGroups: string[][]): string {
  return JSON.stringify(optionGroups);
}

/**
 * 反序列化 optionGroups JSON 字串
 * @param jsonString - JSON 字串
 * @returns 選項組的巢狀陣列
 */
export function deserializeOptionGroups(jsonString: string): string[][] {
  return JSON.parse(jsonString);
}

/**
 * 序列化 addons 為 JSON 字串
 * @param addons - 加購項目陣列
 * @returns JSON 字串
 */
export function serializeAddons(addons: AddonData[]): string {
  return JSON.stringify(addons);
}

/**
 * 反序列化 addons JSON 字串
 * @param jsonString - JSON 字串
 * @returns 加購項目陣列
 */
export function deserializeAddons(jsonString: string): AddonData[] {
  return JSON.parse(jsonString);
}
