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
    const creator = await ethers.deployContract("LuckyMoneyCreator", signer);
    return { creator, signer, signer1 };
  }

  describe("1 participant", function () {
    it("Should create a new luckyMoney contract and do a lucky draw with a different account", async function () {
      const { creator, signer, signer1 } = await loadFixture(
        deployluckyMoneyFixture
      );
      let tx;
      let receipt;

      // stage 1

      tx = await signer.sendTransaction({
        to: creator,
        value: totalAmount,
      });
      receipt = await tx.wait();

      const max_participants = 1;
      tx = await creator.create(max_participants);
      receipt = await tx.wait();

      luckyMoneyAddress = (await creator.query(signer.address))[0];
      expect(luckyMoneyAddress).not.empty;

      const luckyMoney = await ethers.getContractAt(
        "LuckyMoney",
        luckyMoneyAddress
      );

      let luckyMoneyBalance = await ethers.provider.getBalance(
        luckyMoneyAddress
      );
      expect(luckyMoneyBalance).to.equal(totalAmount);

      // stage 2

      const signer1Balance1 = await ethers.provider.getBalance(signer1.address);

      tx = await luckyMoney.connect(signer1).roll();
      receipt = await tx.wait();

      const participants = await luckyMoney.participants();
      expect(participants.length).to.equal(1);

      luckyMoneyBalance = await ethers.provider.getBalance(luckyMoneyAddress);

      const signer1Balance2 = await ethers.provider.getBalance(signer1.address);

      expect(
        luckyMoneyBalance + (signer1Balance2 - signer1Balance1) + receipt?.fee!
      ).to.equal(totalAmount);

      tx = await luckyMoney.connect(signer).refund();
      receipt = await tx.wait();

      luckyMoneyBalance = await ethers.provider.getBalance(luckyMoneyAddress);
      expect(luckyMoneyBalance).to.equal(0);
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
