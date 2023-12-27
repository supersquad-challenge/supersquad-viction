import { ethers } from "ethers";
import TokenContractABI from "@/abi/VRC25Token.json";

interface ITokenTransfer {
  userAccount: string;
  poolAddress: string;
  amount: number;
  signer: ethers.Signer;
}

export const tokenTransfer = async ({
  userAccount,
  poolAddress,
  amount,
  signer,
}: ITokenTransfer) => {
  const contract = new ethers.Contract(
    userAccount,
    JSON.stringify(TokenContractABI),
    signer
  );

  const _amount = ethers.formatEther(amount);

  const transaction = await contract.transfer(poolAddress, _amount);
  const receipt = await transaction.wait();
  return {
    transaction,
    receipt,
  };
};
