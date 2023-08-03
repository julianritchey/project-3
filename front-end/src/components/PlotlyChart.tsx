import { Box, Spinner, Text } from "@chakra-ui/react";
import Plot from "react-plotly.js";
import Backtest from "../entities/Backtest";
import PlotEntity from "../entities/PlotEntity";
import useBacktest from "../hooks/useBacktest";

interface Props {
  backtestData: Backtest;
}

const PlotlyChart = ({ backtestData }: Props) => {
  const { data: backtestResults, isLoading, error } = useBacktest(backtestData);

  if (isLoading) return <Spinner />;

  if (error || !backtestResults) throw error;

  if (backtestResults.length > 0) {
    return (
      <Box>
        {backtestResults.map((plotEntity: PlotEntity) => (
          <Plot
            key={plotEntity.layout.title}
            data={plotEntity.data}
            layout={plotEntity.layout}
          />
        ))}
      </Box>
    );
  }
  return <Text paddingBottom={5}>No data to display.</Text>;
};

export default PlotlyChart;
