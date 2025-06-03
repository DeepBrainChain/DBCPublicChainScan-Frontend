/**
 * 格式化大数字为千分位表示，保留单位后缀（如 %、ETH）
 * @param value 字符串、数字或 BigInt（支持带单位）
 * @param separator 分隔符，默认逗号
 * @returns 格式化后的字符串
 */
export function formatWithThousandSeparator(value, separator = ',') {
  if (value === null || value === undefined) return '';

  // 先将 value 转为字符串
  const raw = typeof value === 'bigint' ? value.toString() : String(value).trim();

  // 使用正则提取前面的数字部分和后缀单位
  const match = raw.match(/^(-?\d*\.?\d*)(.*)$/);

  if (!match) return raw; // 无法解析就原样返回

  const [, numberPart, unit] = match;

  // 如果是空字符串或非有效数字，返回原始值
  if (!numberPart || isNaN(Number(numberPart))) return raw;

  // 拆分整数与小数部分
  const [integerPart, decimalPart] = numberPart.split('.');

  // 格式化整数部分
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  // 拼接格式化结果
  const result = decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;

  return `${result}${unit}`;
}
