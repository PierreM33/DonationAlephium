import { Deployer, DeployFunction, Network } from "@alephium/cli";
import { Settings } from "../alephium.config";
import {Donations} from "../artifacts/ts";
import {testNodeWallet} from "@alephium/web3-test";
import {CallContractParams, ONE_ALPH} from "@alephium/web3";

const deployContract: DeployFunction<Settings> = async (
    deployer: Deployer,
    network: Network<Settings>
): Promise<void> => {
    const result = await deployer.deployContract(Donations, {
      initialFields: {}
    });
    
    console.log('contract id:' + result.contractInstance.contractId);
    console.log("contract address: " + result.contractInstance.address);
    
    const signer = await testNodeWallet();
    const adddresses = await signer.getAccounts();
    const address = adddresses[0];
    
    console.log('signer address: ' + adddresses);
    const amount = BigInt(10) //ALPH Tokens
  
    const params : CallContractParams<{donor: string}> = {
      args: {donor: address.address},
    }
  
    const contract = result.contractInstance;
    let getDonorTotal = await contract.view.getDonorTotal(params);
    
    console.log("///")
    console.log('mon adresse ===: ', address.address);
    console.log("contract balance before == ", Number(getDonorTotal.returns));
    
    await contract.transact.depositTouser({
      signer,
      args: {recipient: address.address, amount},
      attoAlphAmount: ONE_ALPH * amount
    })
    getDonorTotal = await contract.view.getDonorTotal(params);
    
  console.log("///")
  console.log('mon adresse ===: ', address.address);
  console.log("contract balance after == ", Number(getDonorTotal.returns));
}

export default deployContract;
