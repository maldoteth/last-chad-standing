// components/NFTDeployMintRefactored.tsx
import React, { useState } from "react";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import type { Address, Hex } from "viem";
import { useApi } from "@/Api/apiFunction";
import {
  deployNFTContract,
  mintNFT,
  getContractInfo,
} from "@/utils/nftContractUtils";
import { MyNFTsGallery } from "./nftGallery";

interface MetadataResponse {
  success: boolean;
  baseURI: string;
  ipfsHash: string;
  name: string;
  symbol: string;
  max_supply: number;
}

interface UIState {
  loading: boolean;
  deploymentTxHash: string | null;
  contractAddress: string | null;
  mintingTxHash: string | null;
  error: string | null;
  currentStep: "idle" | "metadata" | "deploying" | "minting" | "complete";
  successMessage: string | null;
}

export const NFTDeployMintRefactored: React.FC = () => {
  const { wallets } = useWallets();
  const { user } = usePrivy();
  const { get } = useApi();

  const [nftData, setNftData] = useState({
    name: "",
    description: "",
    image_url: "",
    max_supply: 1,
    category: "",
    rarity: "",
  });

  const [ui, setUi] = useState<UIState>({
    loading: false,
    deploymentTxHash: null,
    contractAddress: null,
    mintingTxHash: null,
    error: null,
    currentStep: "idle",
    successMessage: null,
  });

  const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
  const [contractInfo, setContractInfo] = useState<{ totalSupply: number; owner: Address } | null>(null);
  const contractBytecode: Hex = import.meta.env.VITE_SUPABASE_BYTECODE
  const resetError = () => setUi((prev) => ({ ...prev, error: null }));

  // Step 1: Generate metadata from backend
  const handleGenerateMetadata = async () => {
    resetError();
    try {
      setUi((prev) => ({
        ...prev,
        loading: true,
        currentStep: "metadata",
        successMessage: null,
      }));

      const APiData: MetadataResponse = {
        success: true,
        ipfsHash: `QmSxAi4pmi1R3E2qWgZMKoQymnUgMvrTMtKUf7m4zsDNPV`,
        baseURI: `ipfs://QmSxAi4pmi1R3E2qWgZMKoQymnUgMvrTMtKUf7m4zsDNPV/`,
        name: 'Rapz Gloves',
        symbol: 'RAPZ',
        max_supply: 100,
      }
      setMetadata(APiData);
      setUi((prev) => ({
        ...prev,
        loading: false,
        successMessage: "✅ Metadata generated successfully!",
      }));
    } catch (error) {
      setUi((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      }));
    }
  };

  // Step 2: Deploy contract
  const handleDeployContract = async () => {
    if (!metadata || !user?.wallet || !contractBytecode) {
      setUi((prev) => ({
        ...prev,
        error: "Missing metadata, wallet, or contract bytecode",
      }));
      return;
    }

    resetError();
    try {
      setUi((prev) => ({
        ...prev,
        loading: true,
        currentStep: "deploying",
        successMessage: null,
      }));

      const deployParams = {
        name: metadata.name,
        symbol: metadata.symbol,
        baseURI: metadata.baseURI,
        maxSupply: metadata.max_supply,
        bytecode: contractBytecode,
        userAddress: user.wallet.address as Address,
      };

      const result = await deployNFTContract(deployParams);
      console.log(result)
      setUi((prev) => ({
        ...prev,
        contractAddress: result.contractAddress,
        deploymentTxHash: result.transactionHash,
        loading: false,
        successMessage: "✅ Contract deployed successfully!",
      }));
    } catch (error) {
      console.error("Deployment error:", error);
      setUi((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Deployment failed",
        loading: false,
      }));
    }
  };
  const handleGetContractInfo = async () => {
    // Fetch contract info
    const info: any = await getContractInfo(ui.contractAddress as Address);
    console.log(info)
    setContractInfo(info);
  }

  // Step 3: Mint NFT
  const handleMintNFT = async () => {
    if (!ui.contractAddress || !user?.wallet) {
      setUi((prev) => ({
        ...prev,
        error: "Contract not deployed or wallet not connected",
      }));
      return;
    }

    resetError();
    try {
      setUi((prev) => ({
        ...prev,
        loading: true,
        currentStep: "minting",
        successMessage: null,
      }));

      const result = await mintNFT({
        contractAddress: ui.contractAddress as Address,
        toAddress: user.wallet.address as Address,
        userAddress: user.wallet.address as Address,
        quantity: 1
      });

      setUi((prev) => ({
        ...prev,
        mintingTxHash: result.transactionHash,
        loading: false,
        currentStep: "complete",
        successMessage: "🎉 NFT minted successfully!",
      }));
      handleGetContractInfo()
    } catch (error) {
      console.error("Minting error:", error);
      setUi((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Minting failed",
        loading: false,
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNftData((prev) => ({
      ...prev,
      [name]: name === "max_supply" ? parseInt(value) || 1 : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">NFT Deploy & Mint</h1>
        <p className="text-gray-400 mb-8">Create and deploy your NFT collection in 3 easy steps</p>

        {/* Success Message */}
        {ui.successMessage && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg text-green-400">
            {ui.successMessage}
          </div>
        )}

        {/* Error Message */}
        {ui.error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
            <div className="flex justify-between items-start">
              <span>{ui.error}</span>
              <button
                onClick={resetError}
                className="text-red-400 hover:text-red-300 font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Metadata */}
        <div className="mb-6 p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition">
          <div className="flex items-center mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${metadata ? "bg-green-500" : "bg-purple-500"
              }`}>
              1
            </div>
            <h2 className="text-xl font-semibold">Generate Metadata</h2>
            {metadata && <span className="ml-auto text-green-400">✓ Complete</span>}
          </div>

          {!metadata ? (
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Collection Name (e.g., My Awesome NFTs)"
                value={nftData.name}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 outline-none transition"
              />
              <textarea
                name="description"
                placeholder="Collection Description"
                value={nftData.description}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 outline-none transition"
                rows={3}
              />
              <input
                type="text"
                name="image_url"
                placeholder="IPFS Image CID (without ipfs://)"
                value={nftData.image_url}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 outline-none transition"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="max_supply"
                  placeholder="Max Supply"
                  value={nftData.max_supply}
                  onChange={handleInputChange}
                  min="1"
                  className="p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 outline-none transition"
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={nftData.category}
                  onChange={handleInputChange}
                  className="p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 outline-none transition"
                />
              </div>
              <input
                type="text"
                name="rarity"
                placeholder="Rarity"
                value={nftData.rarity}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 outline-none transition"
              />

              <button
                onClick={handleGenerateMetadata}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 p-3 rounded font-semibold transition"
              >
                {ui.loading && ui.currentStep === "metadata" ? "Generating..." : "Generate Metadata"}
              </button>
            </div>
          ) : (
            <div className="p-4 bg-gray-700 rounded border border-gray-600">
              <p className="text-sm text-gray-300">
                <strong>Name:</strong> {metadata.name}
              </p>
              <p className="text-sm text-gray-300 mt-2">
                <strong>Base URI:</strong> {metadata.baseURI.slice(0, 50)}...
              </p>
              <p className="text-sm text-gray-300 mt-2">
                <strong>Supply:</strong> {metadata.max_supply}
              </p>
            </div>
          )}
        </div>

        {/* Step 2: Deploy */}
        <div className="mb-6 p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition">
          <div className="flex items-center mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${ui.contractAddress ? "bg-green-500" : "bg-purple-500"
              }`}>
              2
            </div>
            <h2 className="text-xl font-semibold">Deploy Contract</h2>
            {ui.contractAddress && <span className="ml-auto text-green-400">✓ Complete</span>}
          </div>

          <button
            onClick={handleDeployContract}
            disabled={!metadata || !contractBytecode || ui.loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 p-3 rounded font-semibold transition"
          >
            {ui.loading && ui.currentStep === "deploying"
              ? "Deploying..."
              : "Deploy Contract"}
          </button>

          {ui.deploymentTxHash && (
            <p className="mt-3 text-sm text-gray-400">
              TX: <code className="bg-gray-700 px-2 py-1 rounded">{ui.deploymentTxHash.slice(0, 20)}...</code>
            </p>
          )}

          {ui.contractAddress && (
            <div className="mt-4 p-4 bg-gray-700 rounded border border-green-600">
              <p className="text-sm text-green-400 font-semibold">Contract Address:</p>
              <p className="text-sm mt-2 break-all font-mono">{ui.contractAddress}</p>
            </div>
          )}
          <button
            onClick={handleGetContractInfo}
            disabled={!metadata || !contractBytecode || ui.loading}
            className="w-full bg-purple-600 mt-4 hover:bg-purple-700 disabled:bg-gray-600 p-3 rounded font-semibold transition"
          >
            {ui.loading && ui.currentStep === "deploying"
              ? "Contract Info..."
              : "Contract Info"}
          </button>
        </div>

        {/* Step 3: Mint */}
        <div className="mb-6 p-6 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${ui.currentStep === "complete" ? "bg-green-500" : "bg-purple-500"
              }`}>
              3
            </div>
            <h2 className="text-xl font-semibold">Mint NFT</h2>
            {ui.currentStep === "complete" && <span className="ml-auto text-green-400">✓ Complete</span>}
          </div>

          <button
            onClick={handleMintNFT}
            disabled={!ui.contractAddress || ui.loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 p-3 rounded font-semibold transition"
          >
            {ui.loading && ui.currentStep === "minting"
              ? "Minting..."
              : "Mint NFT"}
          </button>

          {ui.mintingTxHash && (
            <p className="mt-3 text-sm text-gray-400">
              TX: <code className="bg-gray-700 px-2 py-1 rounded">{ui.mintingTxHash.slice(0, 20)}...</code>
            </p>
          )}

          {contractInfo && (
            <div className="mt-4 p-4 bg-gray-700 rounded">
              <p className="text-sm">
                <strong>Total Minted:</strong> {contractInfo.totalSupply}
              </p>
              <p className="text-sm mt-2">
                <strong>Owner:</strong> {contractInfo.owner.slice(0, 10)}...
              </p>
            </div>
          )}
        </div>
      </div>
      <MyNFTsGallery />
    </div>
  );
};
