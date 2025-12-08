// utils/deploymentEncoder.ts
/**
 * ✅ Properly encode constructor arguments and append to bytecode
 * This is what was missing - the constructor params need to be encoded and appended
 */

import { AbiCoder } from "ethers";

export interface EncodedDeployment {
  deploymentData: string; // bytecode + encoded constructor args
}

/**
 * Encode constructor arguments for NFT contract
 * Constructor signature: constructor(string name, string symbol, string baseURI, address owner, uint256 maxSupply)
 */
export const encodeConstructorArgs = (params: {
  name: string;
  symbol: string;
  baseURI: string;
  owner: string;
  maxSupply: number;
}): string => {
  console.log("📦 Encoding constructor arguments...");

  // ✅ Using ethers.js AbiCoder (more reliable than viem for this)
  const coder = AbiCoder.defaultAbiCoder();

  try {
    const encoded = coder.encode(
      ["string", "string", "string", "address", "uint256"],
      [
        params.name,
        params.symbol,
        params.baseURI,
        params.owner,
        BigInt(params.maxSupply),
      ]
    );

    console.log("✅ Constructor args encoded successfully");
    console.log(`  Encoded data length: ${encoded.length} bytes`);
    console.log(`  Preview: ${encoded.slice(0, 66)}...`);

    return encoded;
  } catch (error: any) {
    console.error("❌ Failed to encode constructor args:", error.message);
    throw new Error(`Constructor encoding failed: ${error.message}`);
  }
};

/**
 * Combine bytecode + encoded constructor arguments
 */
export const createDeploymentData = (
  bytecode: string,
  constructorArgs: string
): string => {
  // Remove 0x prefix if present
  const cleanBytecode = bytecode.startsWith("0x") ? bytecode.slice(2) : bytecode;
  const cleanArgs = constructorArgs.startsWith("0x")
    ? constructorArgs.slice(2)
    : constructorArgs;

  const deploymentData = `0x${cleanBytecode}${cleanArgs}`;

  console.log("📋 Deployment data created:");
  console.log(`  Bytecode length: ${cleanBytecode.length / 2} bytes`);
  console.log(`  Args length: ${cleanArgs.length / 2} bytes`);
  console.log(`  Total length: ${deploymentData.length / 2} bytes`);

  return deploymentData;
};