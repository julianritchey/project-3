import {
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Strategy from "../entities/Strategy";

interface Props {
  strategy: Strategy;
}

const StrategyCard = ({ strategy }: Props) => {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <Link to={"/strategies/" + strategy.slug}>
      <Card>
        <CardHeader>
          <Heading fontSize="2xl">{strategy.name}</Heading>
        </CardHeader>
        <CardBody>
          <VStack alignItems="start">
            <HStack>
              <Text as="b">Date created:</Text>
              <Text>
                {strategy.date_created.substring(
                  0,
                  strategy.date_created.length - 13
                )}
              </Text>
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
          </VStack>
        </CardBody>
      </Card>
    </Link>
  );
};

export default StrategyCard;
