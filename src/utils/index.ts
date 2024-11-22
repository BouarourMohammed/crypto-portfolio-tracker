export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    // Clear any existing timeout to reset the delay
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // Set a new timeout
    timeoutId = setTimeout(() => {
      func(...args); // Call the function after the delay
    }, delay);
  };
}

export function formatNumber(
  num: number,
  noSign: boolean = false,
  locale: string = "en-US"
): string {
  const absNum = Math.abs(num);
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    useGrouping: true,
    signDisplay: noSign ? "never" : "always", // This ensures + is shown for positive numbers (not working in iOS)
  };
  if (absNum < 0.01) {
    options.minimumFractionDigits = 4;
    options.maximumFractionDigits = 4;
  } else if (absNum < 1) {
    options.minimumFractionDigits = 3;
    options.maximumFractionDigits = 3;
  } else if (absNum < 10) {
    options.minimumFractionDigits = 2;
    options.maximumFractionDigits = 2;
  } else if (absNum < 100) {
    options.minimumFractionDigits = 1;
    options.maximumFractionDigits = 1;
  } else {
    options.minimumFractionDigits = 0;
    options.maximumFractionDigits = 0;
  }
  // TODO: check this for android and ios
  return num > 0 && !noSign
    ? "+" + num.toLocaleString(locale, options)
    : num.toLocaleString(locale, options);
}
