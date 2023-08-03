import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spacer,
} from "@chakra-ui/react";

const StrategyCreationForm = () => {
  const categories = ["Condition", "Indicator"];
  const indicators = ["EMA", "MA", "Price", "RSI", "SMA", "Volume"];
  const timeframes = ["Minute", "Hour", "Day", "Week", "Month", "Year"];
  return (
    <form>
      <HStack marginBottom={3}>
        <FormControl paddingBottom={3}>
          <FormLabel htmlFor="category" className="form-label" width="100px">
            Category
          </FormLabel>
          <Select id="category" className="form-select">
            <option value="">Select item</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl paddingBottom={3}>
          <FormLabel htmlFor="indicator" className="form-label" width="100px">
            Indicator
          </FormLabel>
          <Select id="indicator" className="form-select">
            <option value="">Select item</option>
            {indicators.map((indicator) => (
              <option key={indicator} value={indicator}>
                {indicator}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl paddingBottom={3}>
          <FormLabel
            htmlFor="timeframe-int"
            className="form-label"
            width="100px"
          >
            Timeframe
          </FormLabel>
          <NumberInput min={1}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl paddingBottom={3}>
          <FormLabel
            htmlFor="timeframe-int"
            className="form-label"
            width="100px"
          >
            &nbsp;
          </FormLabel>
          <Select id="timeframe-str" className="form-select">
            <option value="">Select timeframe</option>
            {timeframes.map((timeframe) => (
              <option key={timeframe} value={timeframe}>
                {timeframe}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl paddingBottom={3}>
          <FormLabel htmlFor="category" className="form-label" width="100px">
            Category
          </FormLabel>
          <Button colorScheme="blue" variant="outline">
            Add to dependency
          </Button>
        </FormControl>
      </HStack>
      <Flex>
        <Button colorScheme="green" variant="outline">
          Add condition
        </Button>
        <Spacer />
        <Button colorScheme="blue">Submit dependency</Button>
      </Flex>
    </form>
  );
};

export default StrategyCreationForm;
