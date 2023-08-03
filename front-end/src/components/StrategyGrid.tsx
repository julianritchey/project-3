import { SimpleGrid } from "@chakra-ui/react";
import useStrategies from "../hooks/useStrategies";
import StrategyCard from "./StrategyCard";
import StrategyCardContainer from "./StrategyCardContainer";
import StrategyCardSkeleton from "./StrategyCardSkeleton";
import Strategy from "../entities/Strategy";

const StrategyGrid = () => {
  const { data, error, isLoading } = useStrategies();
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
      {isLoading &&
        skeletons.map((skeleton) => (
          <StrategyCardContainer key={skeleton}>
            <StrategyCardSkeleton />
          </StrategyCardContainer>
        ))}
      {data?.results.map((strategy: Strategy) => (
        <StrategyCardContainer key={strategy.strategy_id}>
          <StrategyCard key={strategy.strategy_id + "1"} strategy={strategy} />
        </StrategyCardContainer>
      ))}
    </SimpleGrid>
  );
};

export default StrategyGrid;
