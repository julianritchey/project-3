import { useQuery } from "@tanstack/react-query";
import strategiesService from "../services/strategy-service";
import Backtest from "../entities/Backtest";

const useBacktest = (backtest: Backtest) => {
  return useQuery({
    queryKey: [
      "strategies",
      backtest.slug,
      "backtest",
      backtest.symbol,
      backtest.start_date,
      backtest.end_date,
    ],
    queryFn: () =>
      strategiesService.backtest(backtest.slug, {
        params: {
          slug: backtest.slug,
          symbol: backtest.symbol,
          start_date: backtest.start_date,
          end_date: backtest.end_date,
        },
      }),
  });
};

export default useBacktest;
