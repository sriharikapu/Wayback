var waybacktestContract = artifacts.require("./Wayback.sol");

contract("Wayback", function(accounts) {
  it("Launch the contract, write initial Record", async function() {
    let instance = await waybacktestContract.deployed();
    let tx = await instance.AddRecord(0, "text", {
      from: accounts[0]
    });
    assert.equal(tx.logs[0].event, "ActionAddRecord");
    assert.equal(tx.logs[0].args.projectId, 0);
  });

  it("Second test, subsequent record, should pass", async function() {
    let instance = await waybacktestContract.deployed();
    let tx = await instance.AddRecord(0, "2text", { from: accounts[0] });
    assert.equal(tx.logs[0].event, "ActionAddRecord");
  });

  async function AddRecordTransaction(instance) {
    let tx = await instance.AddRecord(0, "2text", { from: accounts[0] });
    return tx.logs[0].transactionHash;
  }

  it("Call write and approve", async function() {
    let instance = await waybacktestContract.deployed();
    let th = await AddRecordTransaction(instance);
    let tx = await instance.AddRecordAndApprove(0, "3text", th, 0, {
      from: accounts[0]
    });
    assert.equal(tx.logs[0].event, "ActionAddRecordAndApprove");
  });

  it("Call sign", async function() {
    let instance = await waybacktestContract.deployed();
    let auditor = accounts[1];
    let th = await AddRecordTransaction(instance);
    let tx2 = await instance.AddRecordAndApprove(0, "3text", th, auditor, {
      from: accounts[0]
    });
    let tx = await instance.SignRecord(0, "3text", th, { from: auditor });
    assert.equal(tx.logs[0].event, "ActionSignRecord");
  });
});
