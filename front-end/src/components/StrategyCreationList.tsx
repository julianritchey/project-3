import {
  Button,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

interface Dependency {
  id: number;
  condition1: string;
  condition2?: string;
  condition3?: string;
}

interface Props {
  dependencies: Dependency[];
  onDelete: (id: number) => void;
}

const StrategyCreationList = ({ dependencies, onDelete }: Props) => {
  if (dependencies.length === 0) return null;

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Condition(s)</Th>
            <Th></Th>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {dependencies.map((dependency) => (
            <Tr key={dependency.id}>
              <Td>{dependency.condition1}</Td>
              <Td>{dependency.condition2}</Td>
              <Td>{dependency.condition3}</Td>
              <Td textAlign="end">
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => onDelete(dependency.id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default StrategyCreationList;
