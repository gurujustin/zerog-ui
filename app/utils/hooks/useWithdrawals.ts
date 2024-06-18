import { useAccount, useChainId, useReadContract, useReadContracts } from "wagmi";
import { Abi, Hash, erc20Abi } from "viem";
import { contracts, hubChainId } from "../constants";
import { withdrawalManagerAbi } from "../abis";

const useWithdrawals = () => {
  const chainId = useChainId()
  const { address } = useAccount();
  const isWithdrawSupported = chainId == hubChainId;
  //   const { isEthereumChain, unsupported } = useDappChain();

  const ETHX = "ETHx";
  const STETH = "stETH";
  const SFRXETH = "sfrxETH";

  const tokensObj = {
    [STETH]: {
      address: "0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034",
      abi: erc20Abi,
      symbol: "stETH",
      decimals: 18,
    },
  };
  const tokens = Object.keys(tokensObj).map((token) => tokensObj[token]);

  const { data: withdrawalDelayBlocks } = useReadContract({
    address: contracts.withdrawalManager,
    abi: withdrawalManagerAbi,
    functionName: "withdrawalDelayBlocks",
    chainId: hubChainId,
    query: {
      enabled: !!address && !!tokens.length && isWithdrawSupported,
    },
  });

  const {
    data: tokensAssociatedNonces,
    refetch: refetchAssociatedNonces,
    isFetching: fetchingAssociatedNonces,
  } = useReadContracts({
    contracts: tokens.map((token) => ({
      address: contracts.withdrawalManager,
      abi: withdrawalManagerAbi as Abi,
      functionName: "userAssociatedNonces",
      args: [token.address, address],
      chainId: hubChainId,
    })),
    query: {
      enabled: !!address && !!tokens.length && isWithdrawSupported,
      refetchInterval: 10_000,
    },
  });

  const {
    data: nextLockedNonces,
    refetch: refetchNextLockedNonces,
    isFetching: fetchingNextLockedNonces,
  } = useReadContracts({
    contracts: tokens.map((token) => ({
      address: contracts.withdrawalManager,
      abi: withdrawalManagerAbi as Abi,
      functionName: "nextLockedNonce",
      args: [token.address],
      chainId: hubChainId
    })),
    query: {
      enabled: !!tokens.length && isWithdrawSupported,
      refetchInterval: 10_000,
    },
  });

  const nextLockedNoncesByAssests: { [x: string]: bigint } = nextLockedNonces
    ? tokens.reduce(
        (acc, curr, index) => ({
          ...acc,
          [curr.address.toLowerCase()]: nextLockedNonces?.[index].result,
        }),
        {}
      )
    : {};

  const associatedNoncesHasError =
    tokensAssociatedNonces?.some((req) => req.error) || false;

  const associatedNoncesPerAsset: { [x: string]: number[] } = tokens.reduce(
    (acc, curr, index) => ({
      ...acc,
      [curr.symbol]:
        tokensAssociatedNonces && !associatedNoncesHasError
          ? {
              associatedNonces: (
                tokensAssociatedNonces[index].result as bigint[]
              )?.map((val: bigint) => Number(val)) || [0, 0],
              count: Number(
                (tokensAssociatedNonces[index].result as bigint[])[1] -
                  (tokensAssociatedNonces[index].result as bigint[])[0]
              ),
            }
          : { associatedNonces: [0, 0], count: 0 },
    }),
    {}
  );

  const tokensWithAssociatedNonces = Object.keys(associatedNoncesPerAsset).map(
    (key) => ({
      ...tokensObj[key],
      ...associatedNoncesPerAsset[key],
    })
  );

  const filteredTokenWithWithdrawals = tokensWithAssociatedNonces.filter(
    (token: any) => token.count
  );

  const contractCallsToFetchWithdrawals = filteredTokenWithWithdrawals
    .map((token: any) => {
      let calls = [];
      const end = token.associatedNonces[1] - token.associatedNonces[0];

      for (let i = 0; i < end; i++) {
        calls.push({
          address: contracts.withdrawalManager,
          abi: withdrawalManagerAbi as Abi,
          functionName: "getUserWithdrawalRequest",
          args: [token.address, address, i],
          symbol: token.symbol,
          index: i,
          chainId: hubChainId
        });
      }

      return calls;
    })
    .flat();

  const { data: userWithdrawalRequests, isFetching: fetchingRequests } =
    useReadContracts({
      contracts: contractCallsToFetchWithdrawals,
      query: {
        enabled:
          !!address &&
          !!filteredTokenWithWithdrawals.length &&
          isWithdrawSupported,
      },
    });

  const withdrawalRequestsHasError =
    userWithdrawalRequests?.some((req) => req.error) || false;

  const finalWithdrawalDelay = 79200n // 79200n; // 11 days block
  const initialWithdrawalDelay = finalWithdrawalDelay - 21600n //finalWithdrawalDelay - 21600n; // subtracting 3 days to get the initial value of the range

  const userWithdrawals =
    userWithdrawalRequests &&
    // withdrawalDelayBlocks &&
    nextLockedNonces &&
    !withdrawalRequestsHasError
      ? contractCallsToFetchWithdrawals.map((call, index) => ({
          asset: tokensObj[call.symbol].address,
          symbol: call.symbol,
          index: call.index,
          rsETHAmount: (
            userWithdrawalRequests[index].result as bigint[]
          )?.[0] as bigint,
          nonce: (
            userWithdrawalRequests[index].result as bigint[]
          )?.[3] as bigint,
          nextLockedNonce:
            nextLockedNoncesByAssests[
              tokensObj[call.symbol].address.toLowerCase()
            ],
          isUnlocked:
            ((
              userWithdrawalRequests[index].result as bigint[]
            )?.[3] as bigint) <
            nextLockedNoncesByAssests[
              tokensObj[call.symbol].address.toLowerCase()
            ],
          expectedAssetAmount: (
            userWithdrawalRequests[index].result as bigint[]
          )?.[1] as bigint,
          startTime: Number(
            (userWithdrawalRequests[index].result as bigint[])?.[2]
          ),
          unlockedOnBlockNumber: Number(
            ((userWithdrawalRequests[index].result as bigint[])?.[2] || 0n) +
              // (withdrawalDelayBlocks as bigint)
              finalWithdrawalDelay
          ),
          initialUnlockDay: Number(
            ((userWithdrawalRequests[index].result as bigint[])?.[2] || 0n) +
              // (withdrawalDelayBlocks as bigint)
              initialWithdrawalDelay
          ),
        }))
      : [];

  const firstAvailableWithdrawalNonce: { [x: Hash]: bigint } =
    userWithdrawals.reduce((acc, curr) => {
      const existingEntry = acc[curr.asset];
      if (!existingEntry || curr.nonce < existingEntry) {
        acc = { ...acc, [curr.asset]: curr.nonce };
      }
      return acc;
    }, {} as { [x: Hash]: bigint });

  const refetchWithdrawals = () => {
    refetchAssociatedNonces();
    refetchNextLockedNonces();
  };

  return {
    userWithdrawals,
    refetchWithdrawals,
    firstAvailableWithdrawalNonce,
    isFetching:
      fetchingAssociatedNonces || fetchingRequests || fetchingNextLockedNonces,
  };
};

export default useWithdrawals;
