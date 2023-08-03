export default interface Strategy {
  strategy_id: number;
  creator_id: number;
  name: string;
  slug: string;
  description: string;
  date_created: string;
  subscribers: number;
  success: number;
}
