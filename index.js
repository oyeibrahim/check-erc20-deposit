var axios = require('axios');

//to promisifying
const util = require('util');




//-----------------------------------------------------------------------------------------//
//ERC20 token deposit check using Ethplorer
/**
 * 
 * @param {String} address address you are checking
 * @param {String} startTx the Tx hash we are starting the check from
 * @param {*} callBack 
 */
function erc20DepositEthplorer(address, startTx, callBack) {

    //ethplorerKey is your Ethplorer API key visit https://ethplorer.io/ to get your key
    var url = "https://api.ethplorer.io/getAddressHistory/" + address + "?apiKey=" + ethplorerKey + "&type=transfer&limit=10";

    axios.get(url)
        .then(function (body) {

            //If the address has transactions
            if (body.data.operations.length > 0) {

                (async function () {
                    if (body.data.operations[0].transactionHash == startTx) {//if last tx is the startTx

                        //do something

                    } else {

                        //iterate through the fetched tx
                        for (var i = 0; i < body.data.operations.length; i++) {

                            //when we've not reach the startTx
                            //operate on the tx
                            if (body.data.operations[i].transactionHash != startTx) {

                                //if its not a deposit
                                if (body.data.operations[i].to.toLowerCase() != address.toLowerCase()) {

                                    //if not a deposit then continue to the next
                                    continue;
                                    
                                } else {//if a deposit

                                    //deposit amount
                                    let deposit_amount = body.data.operations[i].value / (Math.pow(10, body.data.operations[i].tokenInfo.decimals));

                                    //do something

                                    //if it is confirmed (12 confirmations)

                                    //since Ethplorer doesn't include confirmations in this transaction query,
                                    //then we must check for the confirmations independently using another function

                                    let check_tx = util.promisify(checkTxConfirmation);

                                    let confirmed = await check_tx(body.data.operations[i].transactionHash)

                                    if (confirmed == "yes") {//if confirmed

                                        //do something

                                    } else {//if not confirmed

                                        //do something

                                    }

                                }

                            } else {//if this is equal to startTx, end the loop
                                break;
                            }

                        }

                    }

                    return callBack(null, "success")


                })();

            } else {
                //no transaction for the address yet
                return callBack(null, "Address has no transactions yet")
            }

        })
        .catch(function (e) {
            return callBack(null, "error")
        });

}






function checkTxConfirmation(txHash, callBack) {

    //ethplorerKey is your Ethplorer API key visit https://ethplorer.io/ to get your key
    var url = "https://api.ethplorer.io/getTxInfo/" + txHash + "?apiKey=" + ethplorerKey;

    axios.get(url,)
        .then(function (body) {

            //if confirmations greater than the desired level return yes
            if (body.data.confirmations > 11) {
                callBack(null, "yes");
            } else {//if not, return no
                callBack(null, "no");
            }

        })
        .catch(function (e) {
            callBack(null, "no");
        });
}
//-----------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------//
