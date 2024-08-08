// //SPDX-License-Identifier: MIT
// pragma solidity ^0.8.17;

// import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
// import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

// /**
//  * Request testnet LINK and ETH here: https://faucets.chain.link/
//  * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
//  */

// /**
//  * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
//  */

// contract Test256 is ChainlinkClient, ConfirmedOwner {
//     using Chainlink for Chainlink.Request;

//     address private oracleAddress;
//     bytes32 private jobId;
//     uint256 private fee;

//     constructor(
//         address chainLinkToken,
//         address oraclyAddy,
//         string memory jobID
//     ) ConfirmedOwner(msg.sender) {
//         _setChainlinkToken(chainLinkToken);
//         setOracleAddress(oraclyAddy);
//         setJobId(jobID);
//         setFeeInHundredthsOfLink(0); // 0 LINK
//     }

//     // Send a request to the Chainlink oracle
//     function request() public {
//         Chainlink.Request memory req = _buildOperatorRequest(
//             jobId,
//             this.fulfill.selector
//         );

//         // DEFINE THE REQUEST PARAMETERS (example)
//         req._add("method", "POST");
//         req._add(
//             "url",
//             "https://xpzyihmcunwwykjpfdgy.supabase.co/functions/v1/rsi-price-query"
//         );
//         req._add(
//             "headers",
//             '["accept", "application/json", "Authorization","Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwenlpaG1jdW53d3lranBmZGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI0MjU3ODIsImV4cCI6MjAzODAwMTc4Mn0.mgu_pc2fGZgAQPSlMTY_FPLcsIvepIZb3geDXA7au-0"]'
//         );
//         req._add("body", '{"symbol": 0, "period": 14}');
//         req._add("contact", ""); // PLEASE ENTER YOUR CONTACT INFO. this allows us to notify you in the event of any emergencies related to your request (ie, bugs, downtime, etc.). example values: 'derek_linkwellnodes.io' (Discord handle) OR 'derek@linkwellnodes.io' OR '+1-617-545-4721'

//         // The following curl command simulates the above request parameters:
//         // curl 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD,EUR' --request 'GET' --header 'content-type: application/json' --header 'set-cookie: sid=14A52'

//         // PROCESS THE RESULT (example)
//         req._add("path", "price;rsi");
//         req._addInt("multiplier", 10 ** 18);

//         // Send the request to the Chainlink oracle
//         _sendOperatorRequest(req, fee);
//     }

//     uint256[] public response;

//     // Receive the result from the Chainlink oracle
//     event RequestFulfilled(bytes32 indexed requestId);

//     function fulfill(
//         bytes32 requestId,
//         uint256[] memory data
//     ) public recordChainlinkFulfillment(requestId) {
//         // Process the oracle response
//         // emit RequestFulfilled(requestId);    // (optional) emits this event in the on-chain transaction logs, allowing Web3 applications to listen for this transaction
//         response = data; // example value: 1875870000000000000000 (1875.87 before "multiplier" is applied)
//     }

//     function getResponse() public view returns (uint256[] memory) {
//         return response;
//     }

//     // Update oracle address
//     function setOracleAddress(address _oracleAddress) public onlyOwner {
//         oracleAddress = _oracleAddress;
//         _setChainlinkOracle(_oracleAddress);
//     }

//     function getOracleAddress() public view returns (address) {
//         return oracleAddress;
//     }

//     // Update jobId
//     function setJobId(string memory _jobId) public onlyOwner {
//         jobId = bytes32(bytes(_jobId));
//     }

//     function getJobId() public view returns (string memory) {
//         return string(abi.encodePacked(jobId));
//     }

//     // Update fees
//     function setFeeInJuels(uint256 _feeInJuels) public onlyOwner {
//         fee = _feeInJuels;
//     }

//     function setFeeInHundredthsOfLink(
//         uint256 _feeInHundredthsOfLink
//     ) public onlyOwner {
//         setFeeInJuels((_feeInHundredthsOfLink * LINK_DIVISIBILITY) / 100);
//     }

//     function getFeeInHundredthsOfLink()
//         public
//         view
//         onlyOwner
//         returns (uint256)
//     {
//         return (fee * 100) / LINK_DIVISIBILITY;
//     }

//     function withdrawLink() public onlyOwner {
//         LinkTokenInterface link = LinkTokenInterface(_chainlinkTokenAddress());
//         require(
//             link.transfer(msg.sender, link.balanceOf(address(this))),
//             "Unable to transfer"
//         );
//     }
// }
