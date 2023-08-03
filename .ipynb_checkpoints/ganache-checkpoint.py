from web3 import Web3

def get_balance(ganache_rpc_url, address):
    try:
        # Connect to Ganache
        web3 = Web3(Web3.HTTPProvider(ganache_rpc_url))

        # Check if connected to Ganache
        if web3.isConnected():
            # Convert address to a checksum address
            checksum_address = web3.toChecksumAddress(address)

            # Get the balance of the address
            balance_wei = web3.eth.getBalance(checksum_address)

            # Convert the balance from Wei to Ether
            balance_eth = web3.fromWei(balance_wei, 'ether')

            return balance_eth
        else:
            print("Error: Unable to connect to Ganache.")
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None

# Example testing Andrea's ganache account 
ganache_rpc_url = 'HTTP://127.0.0.1:7545'
user_address = '0x04d607c2844cC024e98D56AEF09a9F64eC74f1B7'  # Replace with the user's address
balance = get_balance(ganache_rpc_url, user_address)

if balance is not None:
    print(f"Balance of address {user_address}: {balance} ETH")
