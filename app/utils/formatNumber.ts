export const formatNumber = (value: number, maximumFractionDigits: number) => {
  return Intl.NumberFormat('en-US', {
    maximumFractionDigits: maximumFractionDigits,
  }).format(value)
}
