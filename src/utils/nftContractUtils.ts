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
  type WalletClient
} from "viem";
import { base } from "viem/chains";
import { CONTRACT_ABI } from "./helpers";
import { deployContract, waitForTransactionReceipt } from "viem/actions";
// -------------------------
// Interfaces
// -------------------------
export interface DeployContractParams {
  provider: EIP1193Provider;
  name: string;
  symbol: string;
  baseURI: string;
  owner: Address;
  maxSupply: number;
  bytecode: Hex;
  userAddress: Address;
}

export interface MintParams {
  contractAddress: Address;
  toAddress: Address;
  provider: EIP1193Provider;
  quantity: number;
  userAddress?: Address;
}

// -------------------------
// Clients
// -------------------------
export const getPublicClient = () => {
  return createPublicClient({
    chain: base,
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
  });

  // ✅ Initialize wallet client with MetaMask as provider
  const walletClient = createWalletClient({
    account: address as Address,
    chain: base,
    transport: custom(window.ethereum),
  });

  return walletClient;
};
export const getWalletClient = async (provider: EIP1193Provider, expectedUserAddress?: Address) => {

  const walletClient = createWalletClient({
    account: expectedUserAddress,
    chain: base,
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
  // BUG FIX: Use the provided provider instead of hardcoded MetaMask
  const walletClient = await getWalletClient(params.provider, params.userAddress);

  const account = walletClient.account;
  if (!account?.address) throw new Error("Wallet not connected or authorized.");

  console.log("🧩 Deploy params:", { ...params, account: account.address });

  try {
    console.log("🚀 Deploying NFT contract...");

    // Format bytecode: Ensure it has 0x prefix
    const formattedBytecode = params.bytecode.startsWith('0x')
      ? params.bytecode
      : `0x${params.bytecode}` as Hex;

    console.log("📦 Bytecode length:", formattedBytecode.length);

    // Manually set gas to avoid "intrinsic gas too low" error
    const hash = await walletClient.deployContract({
      abi: CONTRACT_ABI,
      bytecode: formattedBytecode,
      account: account.address,
      chain: base,
      args: [
        params.name,
        params.symbol,
        params.baseURI,
        BigInt(params.maxSupply),
      ],
      gas: BigInt(3_000_000), // Manual gas limit for large contracts
      // Let the network auto-calculate gas price for Base (very cheap)
    } as any);

    console.log("📝 Deployment tx hash:", hash);

    const receipt = await (publicClient as any).waitForTransactionReceipt({
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
// Transfer Ownership
// -------------------------
export const transferOwnershipNFT = async (
  provider: any,
  contractAddress: Address,
  newOwner: Address,
  userAddress: Address
) => {
  const publicClient = getPublicClient();
  const walletClient = await getWalletClient(provider, userAddress);

  try {
    console.log(`🔄 Transferring ownership of ${contractAddress} to ${newOwner}...`);

    const { request } = await (publicClient as any).simulateContract({
      address: contractAddress,
      abi: CONTRACT_ABI,
      functionName: "transferOwnership",
      args: [newOwner],
      account: userAddress,
    });

    const hash = await (walletClient as any).writeContract(request);
    console.log("📝 Transfer ownership tx hash:", hash);

    const receipt = await (publicClient as any).waitForTransactionReceipt({
      hash,
      timeout: 120_000,
    });

    if (receipt.status !== "success") {
      throw new Error("Transaction failed or reverted.");
    }

    console.log("✅ Ownership transferred successfully!");

    return {
      success: true,
      transactionHash: hash,
    };
  } catch (error) {
    const msg = handleContractError(error);
    console.error("❌ Ownership transfer error:", msg);
    throw new Error(`Ownership transfer failed: ${msg}`);
  }
};

// -------------------------
// Mint NFT (with simulation)
// -------------------------
export const mintNFT = async (params: MintParams) => {
  const publicClient = getPublicClient();
  // BUG FIX: Use provided provider instead of MetaMask
  const walletClient = await getWalletClient(params.provider, params.userAddress);

  try {
    const [account] = await walletClient.getAddresses();

    console.log(`🎨 Minting ${params.quantity} NFT(s) from ${account}...`);

    // Simulate the contract call first — ensures everything is valid
    const { request } = await (publicClient as any).simulateContract({
      address: params.contractAddress,
      abi: CONTRACT_ABI,
      functionName: "mint",
      args: [BigInt(params.quantity)],
      account,
    });

    console.log("✅ Simulation OK — executing mint transaction...");

    // Write (send) the transaction to the blockchain
    const hash = await (walletClient as any).writeContract(request);
    console.log("📝 Mint tx hash:", hash);

    // Wait for confirmation
    const receipt = await (publicClient as any).waitForTransactionReceipt({
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

    let totalMinted: bigint | undefined;
    try {
      totalMinted = await (publicClient as any).readContract({
        address: contractAddress,
        abi: CONTRACT_ABI,
        functionName: "totalMinted",
      });
    } catch {
      totalMinted = await (publicClient as any).readContract({
        address: contractAddress,
        abi: CONTRACT_ABI,
        functionName: "totalSupply",
      });
    }

    const [owner, maxSupply] = await Promise.all([
      (publicClient as any).readContract({
        address: contractAddress,
        abi: CONTRACT_ABI,
        functionName: "owner",
      }),
      (publicClient as any).readContract({
        address: contractAddress,
        abi: CONTRACT_ABI,
        functionName: "maxSupply",
      }),
    ]);

    return {
      totalMinted: Number(totalMinted ?? 0n),
      owner,
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
    const data = await (publicClient as any).readContract({
      address: contractAddress,
      abi: CONTRACT_ABI,
      functionName: "listnft",
      args: [contractAddress as Address, userAddress as Address],
    });

    // const tokenCount = Number(balance);
    // const tokenIds: any[] = [];
    // // Step 2: Fetch each token ID by index
    // for (let i = 0; i < tokenCount; i++) {
    //   const tokenId = await publicClient.readContract({
    //     address: contractAddress,
    //     abi: CONTRACT_ABI,
    //     functionName: "tokenByIndex",
    //     args: [BigInt(i + 1)],
    //     authorizationList: undefined
    //   });
    //   tokenIds.push(tokenId);
    // }
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
      chain: base,
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
    const uri = await (publicClient as any).readContract({
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
