import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  onSubmit: (data: BacktestFormData) => void;
}

const schema = z.object({
  symbol: z.string().min(1, { message: "Asset symbol is required" }).max(50),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
});

type BacktestFormData = z.infer<typeof schema>;

const StrategyBacktester = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<BacktestFormData>({ resolver: zodResolver(schema) });

  const [symbol, setSymbol] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [startDateMax, setStartDateMax] = useState("");

  const handleEndDateChange = (event: any) => {
    setStartDateMax(event.target.value);
    setEndDate(event.target.value);
  };

  const handleStartDateChange = (event: any) => {
    setStartDate(event.target.value);
  };

  const toInputUppercase = (event: any) => {
    event.target.value = ("" + event.target.value).toUpperCase();
    setSymbol(event.target.value);
  };

  return (
    <Card marginBottom={5}>
      <CardHeader>
        <Heading fontSize="lg">Backtest</Heading>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <Flex>
              <FormControl paddingRight={3}>
                <FormLabel htmlFor="symbol">Asset symbol</FormLabel>
                <Input
                  {...register("symbol")}
                  onInput={toInputUppercase}
                ></Input>
                {errors.symbol && (
                  <Text color="red">{errors.symbol.message}</Text>
                )}
              </FormControl>
              <FormControl paddingRight={3}>
                <FormLabel htmlFor="start_date">Start date</FormLabel>
                <Input
                  {...register("start_date")}
                  type="date"
                  max={
                    startDateMax ? startDateMax : moment().format("YYYY-MM-DD")
                  }
                  onChange={handleStartDateChange}
                ></Input>
                {errors.start_date && (
                  <Text color="red">{errors.start_date.message}</Text>
                )}
              </FormControl>
              <FormControl paddingRight={3}>
                <FormLabel htmlFor="end_date">End date</FormLabel>
                <Input
                  {...register("end_date")}
                  type="date"
                  max={moment().format("YYYY-MM-DD")}
                  onChange={handleEndDateChange}
                ></Input>
                {errors.end_date && (
                  <Text color="red">{errors.end_date.message}</Text>
                )}
              </FormControl>
              <Spacer />
              <VStack alignItems="end">
                <Spacer />
                <Button
                  colorScheme="blue"
                  isDisabled={
                    symbol === "" || startDate === "" || endDate === ""
                      ? true
                      : false
                  }
                  type="submit"
                >
                  Submit
                </Button>
              </VStack>
            </Flex>
          </FormControl>
        </form>
      </CardBody>
    </Card>
  );
};

export default StrategyBacktester;
