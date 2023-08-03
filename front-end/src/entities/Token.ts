export default interface Token {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  totalSupply: {
    formatted: string;
    value: bigint;
  };
}
