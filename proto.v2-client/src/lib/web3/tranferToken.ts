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
    JSON.stringify(TokenContractABI.abi),
    signer
  );

  console.log("userAccount", userAccount);
  console.log("poolAddress", poolAddress);
  console.log("amount", amount);
  console.log("signer", signer);
  const _amount = ethers.formatEther(amount);

  const transaction = await contract.transfer(poolAddress, _amount);
  console.log("transaction", transaction);
  const receipt = await transaction.wait();
  console.log("receipt", receipt);
  return {
    transaction,
    receipt,
  };
};
