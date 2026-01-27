// utils/nftContractUtils.ts
import {
  createPublicClient,
  createWalletClient,
  http,
  custom,
  Address,
  Hex,
  BaseError,
  ContractFunctionRevertedError,
  defineChain,
} from "viem";
import { CONTRACT_ABI } from "./helpers";

// Define Base chain locally to avoid type mismatch issues
const baseChain = defineChain({
  id: 8453,
  name: 'Base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://mainnet.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://basescan.org' },
  },
});

// -------------------------
// Interfaces
// -------------------------
export interface DeployContractParams {
  name: string;
  symbol: string;
  baseURI: string;
  owner?: Address;
  maxSupply: number;
  bytecode: Hex;
  userAddress: Address;
}

export interface MintParams {
  contractAddress: Address;
  toAddress: Address;
  quantity: number;
  userAddress?: Address;
}

// -------------------------
// Clients
// -------------------------
export const getPublicClient = () => {
  return createPublicClient({
    chain: baseChain,
    transport: http(),
  });
};


interface EIP1193Provider {
  request(args: { method: string; params?: unknown[] | object }): Promise<unknown>;
}

export const getWalletMetamaskClient = async (expectedUserAddress?: Address) => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not available.');
  }

  // ✅ Request account access from MetaMask
  const [address] = await window.ethereum.request({
    method: 'eth_requestAccounts',
  }) as string[];

  // ✅ Initialize wallet client with MetaMask as provider
  const walletClient = createWalletClient({
    account: address as Address,
    chain: baseChain,
    transport: custom(window.ethereum),
  });

  return walletClient;
};
export const getWalletClient = async (provider: EIP1193Provider, expectedUserAddress?: Address) => {

  const walletClient = createWalletClient({
    account: expectedUserAddress,
    chain: baseChain,
    transport: custom(provider),
  });

  return walletClient;
};


// -------------------------
// Error handler
// -------------------------
const handleContractError = (error: unknown): string => {
  if (error instanceof BaseError) {
    const revertError = error.walk(
      (err) => err instanceof ContractFunctionRevertedError
    );
    if (revertError instanceof ContractFunctionRevertedError) {
      const errorName = revertError.data?.errorName ?? "UnknownRevert";
      console.error("⚠️ Contract revert:", errorName);
      return `Contract Reverted: ${errorName}`;
    }
  }
  return error instanceof Error ? error.message : "Unknown error occurred";
};

// -------------------------
// Deploy Contract
// -------------------------
export const deployNFTContract = async (params: DeployContractParams) => {
  const publicClient = getPublicClient();
  const walletClient = await getWalletMetamaskClient(params.userAddress);

  const account = walletClient.account;
  if (!account?.address) throw new Error("Wallet not connected or authorized.");

  console.log("🧩 Deploy params:", { ...params, account: account.address });

  try {
    console.log("🚀 Deploying NFT contract...");

    const hash = await walletClient.deployContract({
      abi: CONTRACT_ABI,
      bytecode: params.bytecode,
      chain: baseChain,
      account: account,
      args: [
        params.name,
        params.symbol,
        params.baseURI,
        BigInt(params.maxSupply),
      ],
    });

    console.log("📝 Deployment tx hash:", hash);

    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      timeout: 120_000,
    });

    if (!receipt.contractAddress)
      throw new Error("Contract deployment failed — no address in receipt.");

    console.log("✅ Contract deployed at:", receipt.contractAddress);

    return {
      success: true,
      contractAddress: receipt.contractAddress,
      transactionHash: hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    const msg = handleContractError(error);
    console.error("❌ Deployment error:", msg);
    throw new Error(`Deployment failed: ${msg}`);
  }
};

// -------------------------
// Mint NFT (with simulation)
// -------------------------
export const mintNFT = async (params: MintParams) => {
  const publicClient = getPublicClient();
  const walletClient = await getWalletMetamaskClient();

  try {
    const [account] = await walletClient.getAddresses();

    console.log(`🎨 Minting ${params.quantity} NFT(s) from ${account}...`);

    // Simulate the contract call first — ensures everything is valid
    const { request } = await publicClient.simulateContract({
      address: params.contractAddress,
      abi: CONTRACT_ABI,
      functionName: "mint",
      args: [BigInt(params.quantity)],
      account,
    });

    console.log("✅ Simulation OK — executing mint transaction...");

    // Write (send) the transaction to the blockchain
    const hash = await walletClient.writeContract(request);
    console.log("📝 Mint tx hash:", hash);

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      timeout: 120_000,
    });

    if (receipt.status !== "success") {
      throw new Error("Transaction failed or reverted.");
    }

    console.log("✅ Mint successful!");
    console.log(`🔗 Transaction: https://basescan.org/tx/${hash}`);

    return {
      success: true,
      transactionHash: hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    const msg = handleContractError(error);
    console.error("❌ Minting error:", msg);
    throw new Error(`Mint failed: ${msg}`);
  }
};

export const sendNFT = async (
  provider: EIP1193Provider,
  contractAddress: Address,
  toAddress: Address,
  quantity: number = 1,
) => {
  try {
    const walletClient = await getWalletClient(provider);
    const [account] = await walletClient.getAddresses();

    if (!account) throw new Error("Wallet not connected");

    // Owner mints NFT(s) directly to recipient
    const txHash = await walletClient.writeContract({
      address: contractAddress,
      abi: CONTRACT_ABI,
      functionName: "mint",
      args: [BigInt(quantity)],
      chain: undefined,
      account: account
    });

    console.log(`✅ NFT(s) sent to ${toAddress}, tx hash:`, txHash);

    return {
      success: true,
      transactionHash: txHash,
    };
  } catch (error) {
    const msg = handleContractError(error);
    console.error("❌ Sending NFT failed:", msg);
    return {
      success: false,
      error: msg,
    };
  }
};
// -------------------------
// Contract Info
// -------------------------
export const getContractInfo = async (contractAddress: Address) => {
  const publicClient = getPublicClient();

  try {
    const code = await publicClient.getBytecode({ address: contractAddress });
    if (!code || code === "0x") {
      throw new Error(`Address ${contractAddress} is not a deployed contract`);
    }

    // Try totalMinted first, then fallback to totalSupply
    let totalMinted: bigint | undefined;
    try {
      totalMinted = await publicClient.readContract({
        address: contractAddress,
        abi: CONTRACT_ABI,
        functionName: "totalMinted",
      });
    } catch {
      totalMinted = await publicClient.readContract({
        address: contractAddress,
        abi: CONTRACT_ABI,
        functionName: "totalSupply",
      });
    }

    // Get owner via ownerOf with token 1, or just skip owner fetching
    // since the ABI doesn't have an "owner" function
    const maxSupply = await publicClient.readContract({
      address: contractAddress,
      abi: CONTRACT_ABI,
      functionName: "maxSupply",
    });

    return {
      totalMinted: Number(totalMinted ?? 0n),
      owner: contractAddress, // Contract address as placeholder since no owner function
      maxSupply: Number(maxSupply),
    };
  } catch (error) {
    const msg = handleContractError(error);
    console.error("❌ Error fetching contract info:", msg);
    throw new Error(msg);
  }
};

// -------------------------
// User Balance
// -------------------------

export const getUserTokens = async (
  contractAddress: Address,
  userAddress: Address
): Promise<any> => {
  const publicClient = getPublicClient();

  try {
    // Step 1: Get number of tokens owned
    const data = await publicClient.readContract({
      address: contractAddress,
      abi: CONTRACT_ABI,
      functionName: "listnft",
      args: [contractAddress as Address, userAddress as Address],
    });

    return data;
  } catch (error) {
    const msg = handleContractError(error);
    console.error("❌ Error fetching tokens:", msg);
    throw new Error(msg);
  }
};


export const getUserWalletBalance = async (
  userAddress: Address
) => {

  try {
    const client = createPublicClient({
      chain: baseChain,
      transport: http(),
    });
    const bal = await client.getBalance({ address: userAddress });

    return bal;
  } catch (error) {
    const msg = handleContractError(error);
    console.error("❌ Error fetching balance:", msg);
    throw new Error(msg);
  }
};

// -------------------------
// Token URI
// -------------------------
export const getTokenURI = async (
  contractAddress: Address,
  tokenId: number
) => {
  const publicClient = getPublicClient();

  try {
    const uri = await publicClient.readContract({
      address: contractAddress,
      abi: CONTRACT_ABI,
      functionName: "tokenURI",
      args: [BigInt(tokenId)],
    });

    return uri;
  } catch (error) {
    const msg = handleContractError(error);
    console.error("❌ Error fetching token URI:", msg);
    throw new Error(msg);
  }
};
