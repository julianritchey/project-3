import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiFillBell, AiFillCheckCircle } from "react-icons/ai";
import {
  Address,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useToken,
  useWaitForTransaction,
} from "wagmi";
import { tokenAbi } from "../data/tokenAbi";
import useNotification from "../hooks/useNotification";
import { isError } from "ethers";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  strategySlug: string;
  userAddress: Address;
}

const schema = z.object({
  subscriptionPeriod: z.string(),
});

type TokenFormData = z.infer<typeof schema>;

const SubscriptionModal = ({ strategySlug, userAddress }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    reset,
    setValue,
  } = useForm<TokenFormData>({ resolver: zodResolver(schema) });

  const [subscriptionPeriod, setSubscriptionPeriod] = useState("");
  const [notification, setNotification] = useState(false);
  const [strategySlug1, setStrategySlug1] = useState("");
  const [userAddress1, setuserAddress1] = useState(`0x`);

  if (notification && strategySlug1 && userAddress1 && subscriptionPeriod) {
    console.log("called");
    useNotification(strategySlug, userAddress, subscriptionPeriod);
  }

  const { config: unsubscribeConfig, error: unsubscribeError } =
    usePrepareContractWrite({
      address: import.meta.env.VITE_IDT_TOKEN_ADDRESS,
      abi: tokenAbi,
      functionName: "unsubscribe",
      gas: 3000000n,
      chainId: 0,
    });

  const { write: writeUnsubscribe } = useContractWrite(unsubscribeConfig);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: userIsSubscribed } = useContractRead({
    address: import.meta.env.VITE_IDT_TOKEN_ADDRESS,
    abi: tokenAbi,
    functionName: "isUserSubscribed",
    args: [userAddress],
  });

  const { data: monthlySubscriptionData } = useContractRead({
    address: import.meta.env.VITE_IDT_TOKEN_ADDRESS,
    abi: tokenAbi,
    functionName: "monthlySubscriptionFee",
  });

  const { data: yearlySubscriptionData } = useContractRead({
    address: import.meta.env.VITE_IDT_TOKEN_ADDRESS,
    abi: tokenAbi,
    functionName: "yearlySubscriptionFee",
  });

  const { data: tokenData } = useToken({
    address: import.meta.env.VITE_IDT_TOKEN_ADDRESS,
  });

  const { config: monthlyConfig, error: monthlyError } =
    usePrepareContractWrite({
      address: import.meta.env.VITE_IDT_TOKEN_ADDRESS,
      abi: tokenAbi,
      functionName: "subscribeMonthly",
      gas: 3000000n,
      chainId: 0,
    });

  const {
    write: writeMonthly,
    isError: isErrorMonthly,
    isSuccess: isSuccessMonthly,
  } = useContractWrite(monthlyConfig);

  const { config: yearlyConfig, error: yearlyError } = usePrepareContractWrite({
    address: import.meta.env.VITE_IDT_TOKEN_ADDRESS,
    abi: tokenAbi,
    functionName: "subscribeYearly",
    gas: 3000000n,
    chainId: 0,
  });

  const {
    write: writeYearly,
    isError: isErrorYearly,
    isSuccess: isSuccessYearly,
  } = useContractWrite(yearlyConfig);

  if (!userIsSubscribed) {
    return (
      <>
        <Button colorScheme="teal" leftIcon={<AiFillBell />} onClick={onOpen}>
          Subscribe
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <form
            onSubmit={handleSubmit((data) => {
              if (data) {
                data.subscriptionPeriod === "monthly" && writeMonthly?.();
                data.subscriptionPeriod === "yearly" && writeYearly?.();
                setNotification(true);
                setStrategySlug1(strategySlug);
                setuserAddress1(userAddress);
                console.log(data);
                onClose();
                // reset();
              }
            })}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Select subscription period</ModalHeader>
              <ModalCloseButton />
              <ModalBody paddingY={5}>
                <SimpleGrid columns={2} spacing={5}>
                  <Card textAlign="center">
                    <CardHeader>
                      <Heading size="lg">Monthly</Heading>
                    </CardHeader>
                    <CardBody>
                      <Text as="b">Price</Text>
                      <Text>
                        {Number(monthlySubscriptionData) /
                          10 **
                            (tokenData?.decimals ? tokenData?.decimals : 18)}
                        &nbsp;
                        {tokenData?.symbol ? tokenData.symbol : "IDT"}&nbsp;/
                        month
                      </Text>
                      <Box paddingY={5}>
                        <Button
                          colorScheme="teal"
                          onClick={() =>
                            setValue("subscriptionPeriod", "monthly")
                          }
                          type="submit"
                          variant="outline"
                        >
                          Subscribe
                        </Button>
                      </Box>
                    </CardBody>
                  </Card>
                  <Card textAlign="center">
                    <CardHeader>
                      <Heading size="lg">Yearly</Heading>
                    </CardHeader>
                    <CardBody>
                      <Text as="b">Price</Text>
                      <Text>
                        {Number(yearlySubscriptionData) /
                          10 **
                            (tokenData?.decimals ? tokenData?.decimals : 18)}
                        &nbsp;
                        {tokenData?.symbol ? tokenData.symbol : "IDT"}&nbsp;/
                        year
                      </Text>
                      <Box paddingY={5}>
                        <Button
                          colorScheme="teal"
                          onClick={() =>
                            setValue("subscriptionPeriod", "yearly")
                          }
                          type="submit"
                          variant="outline"
                        >
                          Subscribe
                        </Button>
                      </Box>
                    </CardBody>
                  </Card>
                </SimpleGrid>
                <Input
                  {...register("subscriptionPeriod")}
                  id="subscriptionPeriod"
                  type="hidden"
                  value={subscriptionPeriod}
                />
                {((isErrorYearly && yearlyError) ||
                  (isErrorMonthly && monthlyError)) && (
                  <>
                    <Text color="red.300" paddingTop={3}>
                      You do not have enought IDT for this subscription plan.
                    </Text>
                  </>
                )}
              </ModalBody>
            </ModalContent>
          </form>
        </Modal>
      </>
    );
  }
  return (
    <>
      <Button
        colorScheme="green"
        isDisabled={true}
        leftIcon={<AiFillCheckCircle />}
        marginRight={5}
        variant="ghost"
      >
        Subscribed
      </Button>
      {userIsSubscribed && (
        <Button colorScheme="red" onClick={writeUnsubscribe} variant="outline">
          Unsubscribe
        </Button>
      )}
    </>
  );
};

export default SubscriptionModal;
