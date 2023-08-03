import { Box, Flex, Grid, GridItem, HStack, Show } from "@chakra-ui/react";
import PageHeading from "../components/PageHeading";
import SortSelector from "../components/SortSelector";
import StrategiesSidebar from "../components/StrategiesSidebar";
import StrategyGrid from "../components/StrategyGrid";
import SearchInput from "../components/SearchInput";

const StrategyListPage = () => {
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
          <PageHeading pageName="Strategies" />
          <HStack marginBottom={5}>
            <Flex>
              <SortSelector />
            </Flex>
            <SearchInput />
          </HStack>
          <StrategyGrid />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default StrategyListPage;
