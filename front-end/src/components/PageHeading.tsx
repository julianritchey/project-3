import { Heading } from "@chakra-ui/react";

interface Props {
  pageName: string;
}

const StrategyHeading = ({ pageName }: Props) => {
  const heading = `${pageName}`;
  return (
    <Heading as="h1" marginY={5} fontSize="5xl">
      {heading}
    </Heading>
  );
};

export default StrategyHeading;
