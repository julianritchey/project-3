import {
  Avatar,
  Divider,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Address } from "viem";
import { useBalance, useContractRead, useDisconnect, useToken } from "wagmi";
import { tokenAbi } from "../data/tokenAbi";

interface Props {
  userAddress: Address | undefined;
}

const UserMenu = ({ userAddress }: Props) => {
  const contractAddress = import.meta.env.VITE_IDT_TOKEN_ADDRESS;
  const { disconnect } = useDisconnect();
  const { data, isError, isLoading } = useBalance({
    address: userAddress,
  });
  const { data: tokenData } = useToken({
    address: contractAddress,
  });
  const { data: tokenBalanceData } = useContractRead({
    address: contractAddress,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: [userAddress as Address],
  });

  return (
    <Menu>
      <Avatar
        size="sm"
        name={userAddress
          ?.substring(0)
          .concat(" ", userAddress.substring(userAddress.length - 1))}
        src=""
        as={MenuButton}
      />
      <MenuList>
        <VStack alignItems="start" color="gray" padding={3}>
          <Text>
            Account:{" "}
            {userAddress
              ?.substring(0, 5)
              .concat(
                " . . . ",
                userAddress.substring(
                  userAddress.length - 5,
                  userAddress.length
                )
              )}
          </Text>
          <Divider />
          {isLoading ? (
            <Text>Fetching balance…</Text>
          ) : isError ? (
            <Text>Error fetching balance</Text>
          ) : (
            <>
              <Text as="b">Balances</Text>
              <Text>
                {data?.symbol}
                {": "}
                {parseFloat(data?.formatted as string).toPrecision(10)}
              </Text>
              <Text>
                {tokenData?.symbol}
                {": "}
                {(Number(tokenBalanceData) / 10 ** 18).toLocaleString()}
              </Text>
            </>
          )}
        </VStack>
        <MenuDivider />
        <MenuItem>Account settings</MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => disconnect()}>Disconnect</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
