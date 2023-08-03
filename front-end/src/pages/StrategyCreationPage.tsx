import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  Show,
} from "@chakra-ui/react";
import { useState } from "react";
import PageHeading from "../components/PageHeading";
import PlotlyChart from "../components/PlotlyChart";
import StrategiesSidebar from "../components/StrategiesSidebar";
import StrategyCreationForm from "../components/StrategyCreationForm";
import StrategyCreationList from "../components/StrategyCreationList";
import Backtest from "../entities/Backtest";
import StrategyBacktester from "../components/StrategyBacktester";

const CreateStrategyPage = () => {
  const [dependencies, setDependencies] = useState([
    {
      id: 1,
      condition1: "RSI",
      condition2: undefined,
      condition3: undefined,
    },
    {
      id: 2,
      condition1: "Volume",
      condition2: undefined,
      condition3: undefined,
    },
    {
      id: 3,
      condition1: "7-day EMA",
      condition2: "Crosses",
      condition3: "3-month EMA",
    },
  ]);
  const backtestData = {} as Backtest;
  const [plotlyData, setPlotlyData] = useState(backtestData);
  const onSubmit = (backtestData: any) => {
    setPlotlyData({ ...backtestData, slug: "kdj-strategy-2" });
  };
  return (
    <Grid
      templateAreas={{
        base: `"main"`,
        lg: `"aside main"`,
      }}
      templateColumns={{
        base: "1fr",
        lg: "200px 1fr",
      }}
    >
      <Show above="lg">
        <GridItem area="aside">
          <StrategiesSidebar />
        </GridItem>
      </Show>
      <GridItem area="main" paddingX={5}>
        <PageHeading pageName="Create strategy" />
        <Box>
          {Object.keys(plotlyData).length !== 0 && (
            <PlotlyChart backtestData={plotlyData} />
          )}
        </Box>
        <StrategyBacktester onSubmit={onSubmit} />
        <Card marginBottom={5}>
          <CardHeader>
            <Heading fontSize="lg">Dependency creation</Heading>
          </CardHeader>
          <CardBody>
            <StrategyCreationForm />
          </CardBody>
        </Card>
        <Card marginBottom={5}>
          <CardHeader>
            <Heading fontSize="lg">Dependencies</Heading>
          </CardHeader>
          <CardBody>
            <StrategyCreationList
              dependencies={dependencies}
              onDelete={(id) =>
                setDependencies(dependencies.filter((e) => e.id !== id))
              }
            />
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};

export default CreateStrategyPage;
