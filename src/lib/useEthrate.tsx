import { useEffect, useState } from "react";

const useEthToUsdRate = () => {
  const [rate, setRate] = useState<number>(0);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const resp = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const json = await resp.json();
        // Example result: { ethereum: { usd: 3884.94 } }
        const usdRate = json.ethereum.usd;
        setRate(usdRate);
      } catch (err) {
        console.error("Failed to fetch ETH → USD rate:", err);
      }
    };

    fetchRate();
    // option: set interval to update periodically
  }, []);

  return rate;
};

export default useEthToUsdRate