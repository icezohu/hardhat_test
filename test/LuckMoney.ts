import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import "@nomicfoundation/hardhat-ethers";
import { toBigInt } from "ethers";

describe("luckyMoney", function () {
  const totalAmount = toBigInt("1000000000000000000");
  let luckyMoneyAddress: any;

  async function deployluckyMoneyFixture() {
    const [signer, signer1] = await ethers.getSigners();

    let signerBalance = await ethers.provider.getBalance(signer.address);
    console.log(`signer 0 ${signer.address} balance: ${signerBalance}`);

    const creator = await ethers.deployContract("LuckyMoneyCreator", signer);
    console.log('ethers.deployContract("LuckyMoneyCreator", signer);');

    logGas(
      "signer 0",
      signerBalance,
      await ethers.provider.getBalance(signer.address)
    );
    signerBalance = await ethers.provider.getBalance(signer.address);

    return { creator, signer, signer1 };
  }

  describe("1 participant", function () {
    it("Should create a new luckyMoney contract", async function () {
      const { creator, signer, signer1 } = await loadFixture(
        deployluckyMoneyFixture
      );
      let tx;

      let signerBalance = await ethers.provider.getBalance(signer.address);

      tx = await signer.sendTransaction({
        to: creator,
        value: totalAmount,
      });
      const receipt = await tx.wait();
      console.log("signer sendTransaction");

      logGas(
        "signer 0",
        signerBalance,
        (await ethers.provider.getBalance(signer.address)) + totalAmount
      );
      logGas2("signer 0", receipt);

      // {
      //   const queryResult = await creator.query(signer.address);
      //   console.log("queryResult: ", queryResult);
      // }

      {
        const signerBalance = await ethers.provider.getBalance(signer.address);
        console.log(`signer 0 ${signer.address} balance: ${signerBalance}`);
      }

      const max_participants = 1;
      tx = await creator.create(max_participants);
      await tx.wait();

      {
        const signerBalance = await ethers.provider.getBalance(signer.address);
        console.log(`signer 0 ${signer.address} balance: ${signerBalance}`);
      }

      luckyMoneyAddress = (await creator.query(signer.address))[0];
      expect(luckyMoneyAddress).not.empty;
      console.log("luckyMoneyAddress: ", luckyMoneyAddress);

      const luckyMoney = await ethers.getContractAt(
        "LuckyMoney",
        luckyMoneyAddress
      );

      {
        const participants = await luckyMoney.participants();
        console.log("participants: ", participants);
        expect(participants.length).to.equal(0);
      }

      {
        const luckyMoneyBalance = await ethers.provider.getBalance(
          luckyMoneyAddress
        );
        console.log(
          `luckyMoney ${luckyMoneyAddress} balance: ${luckyMoneyBalance}`
        );
        expect(luckyMoneyBalance).to.equal(totalAmount);
      }

      // stage 2
      console.warn("stage 2");

      const signer1Balance1 = await ethers.provider.getBalance(signer1.address);
      console.log(`signer 1 ${signer1.address} balance: ${signer1Balance1}`);

      // const luckyMoney = await ethers.getContractAt(
      //   "LuckyMoney",
      //   luckyMoneyAddress
      // );

      tx = await luckyMoney.connect(signer1).roll();
      await tx.wait();

      {
        const participants = await luckyMoney.participants();
        console.log("participants: ", participants);
        expect(participants.length).to.equal(1);
      }

      const luckyMoneyBalance = await ethers.provider.getBalance(
        luckyMoneyAddress
      );
      console.log(
        `luckyMoney ${luckyMoneyAddress} balance: ${luckyMoneyBalance}`
      );

      const signer1Balance2 = await ethers.provider.getBalance(signer1.address);
      console.log(`signer 1 ${signer1.address} balance: ${signer1Balance2}`);

      expect(luckyMoneyBalance + (signer1Balance2 - signer1Balance1)).to.equal(
        totalAmount
      );
    });

    // it("Should do a lucky draw with a different account", async function () {
    //   const { creator, signer, signer1 } = await loadFixture(
    //     deployluckyMoneyFixture
    //   );
    //   const tx;

    //   const signer1Balance1 = await ethers.provider.getBalance(signer1.address);
    //   console.log(`signer 1 ${signer1.address} balance: ${signer1Balance1}`);

    //   const luckyMoney = await ethers.getContractAt(
    //     "LuckyMoney",
    //     luckyMoneyAddress
    //   );

    //   // tx = await luckyMoney.connect(signer1).roll();
    //   // await tx.wait();

    //   // const participants = await luckyMoney.participants();
    //   // console.log("participants: ", participants);
    //   // expect(participants.length).to.equal(1);

    //   const luckyMoneyBalance = await ethers.provider.getBalance(
    //     luckyMoneyAddress
    //   );
    //   console.log(
    //     `luckyMoney ${luckyMoneyAddress} balance: ${luckyMoneyBalance}`
    //   );

    //   const signer1Balance2 = await ethers.provider.getBalance(signer1.address);
    //   console.log(`signer 1 ${signer1.address} balance: ${signer1Balance2}`);

    //   expect(
    //     luckyMoneyBalance + (signer1Balance2 - signer1Balance1) + gas
    //   ).to.equal(totalAmount);
    // });
  });
});

function logGas(account: string, before: bigint, after: bigint) {
  console.log(`gas used by ${account}: ${before - after}`);
}

function logGas2(account: string, receipt: any) {
  console.log(`gas used by ${account}: ${receipt.gasUsed}`);
}
