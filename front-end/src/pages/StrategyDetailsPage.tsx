import {
  Box,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  HStack,
  Show,
  Spacer,
  Spinner,
  Text,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useParams } from "react-router-dom";
import { Address, useAccount, useContractRead } from "wagmi";
import PageHeading from "../components/PageHeading";
import PlotlyChart from "../components/PlotlyChart";
import StrategiesSidebar from "../components/StrategiesSidebar";
import StrategyBacktester from "../components/StrategyBacktester";
import SubscriptionModal from "../components/SubscriptionModal";
import Backtest from "../entities/Backtest";
import useStrategy from "../hooks/useStrategy";
import useNotification from "../hooks/useNotification";
import { tokenAbi } from "../data/tokenAbi";

const StrategyDetailPage = () => {
  // const contractAddress = import.meta.env.VITE_IDT_TOKEN_ADDRESS;
  const backtestData = {} as Backtest;
  const { slug } = useParams();
  const { data: strategy, isLoading, error } = useStrategy(slug!);
  const { address: userAddress } = useAccount();
  const [plotlyData, setPlotlyData] = useState(backtestData);

  if (isLoading) return <Spinner />;

  if (error || !strategy) throw error;

  const creationDate = new Date(strategy.date_created);
  const onSubmit = (backtestData: any) => {
    setPlotlyData({ ...backtestData, slug: slug });
  };

  // const { data: userSubscriptionData } = useContractRead({
  //   address: contractAddress,
  //   abi: tokenAbi,
  //   functionName: "isUserSubscribed",
  //   args: [userAddress as Address],
  // });
  // console.log(userSubscriptionData);

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
        <Box>
          <PageHeading pageName={strategy.name} />
          <Box>
            {Object.keys(plotlyData).length !== 0 && (
              <PlotlyChart backtestData={plotlyData} />
            )}
          </Box>
          <StrategyBacktester onSubmit={onSubmit} />
          <Card marginBottom={5}>
            <CardBody>
              <Flex>
                <Box>
                  <HStack>
                    <Text as="b">Date created:</Text>
                    <Text>{creationDate.toDateString()}</Text>
                  </HStack>
                  <HStack>
                    <Text as="b">Creator:</Text>
                    <Text>{strategy.creator_id}</Text>
                  </HStack>
                  <HStack>
                    <Text as="b">Subscribers:</Text>
                    <Text>{strategy.subscribers}</Text>
                  </HStack>
                  <HStack>
                    <Text as="b">Success rate:</Text>
                    <Text>{strategy.success}</Text>
                  </HStack>
                </Box>
                <Spacer />
                <SubscriptionModal
                  strategySlug={slug!}
                  userAddress={userAddress!}
                />
              </Flex>
              <Text as="b">Description:</Text>
              <Markdown components={ChakraUIRenderer()}>
                {strategy.description}
              </Markdown>
            </CardBody>
          </Card>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default StrategyDetailPage;
