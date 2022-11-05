const { network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat.config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  let vrfCoordinatorAddress, subId;
  if (developmentChains.includes(network.name)) {
    const coordinatorV2 = await deployments.get("VRFCoordinatorV2Mock");
    const vrfCoordinatorMock = await ethers.getContractAt(
      "VRFCoordinatorV2Mock",
      coordinatorV2.address
    );

    vrfCoordinatorAddress = vrfCoordinatorMock.address;
    const txResponse = await vrfCoordinatorMock.createSubscription();
    const txRecepit = await txResponse.wait(1);
    subId = txRecepit.events[0].args.subId;

    await vrfCoordinatorMock.fundSubscription(
      subId,
      ethers.utils.parseEther("2")
    );
  } else {
    vrfCoordinatorAddress = networkConfig[chainId]["vrfCoordinator"];
    subId = networkConfig[chainId]["subscriptionId"];
  }

  const entranceFee = networkConfig[chainId]["entranceFee"];
  const gasLane = networkConfig[chainId]["gasLane"];
  const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"];
  const interval = networkConfig[chainId]["interval"];

  const lottery = await deploy("Lottery", {
    from: deployer,
    args: [
      vrfCoordinatorAddress,
      entranceFee,
      gasLane,
      subId,
      callbackGasLimit,
      interval,
    ],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
};

module.exports.tags = ["all", "lottery"];
