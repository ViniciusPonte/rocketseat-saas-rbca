export function price(number: number) {
  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}
