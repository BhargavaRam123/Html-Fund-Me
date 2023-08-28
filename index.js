import { ethers } from "./ethers-5.1.es.min.js"
import { abi, contractaddress } from "./constants.js"
const connbtn = document.getElementById("connectbutton")
const fundbtn = document.getElementById("fundbutton")
const getbalancebtn = document.getElementById("getbalance")
const withdrawbtn = document.getElementById("withdraw")
connbtn.onclick = connect
fundbtn.onclick = fundf
getbalancebtn.onclick = getbalance
withdrawbtn.onclick = withdraw
async function connect() {

    if (typeof window.ethereum != "undefined") {
        // console.log("metask is there in your wallet")
        await window.ethereum.request({ method: "eth_requestAccounts" })
        document.getElementById("connectbutton").innerHTML = "connected!";
    } else {
        console.log("please install metamask")
    }
}
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const contract = new ethers.Contract(contractaddress, abi, signer)
async function fundf() {
    const ethamount = document.getElementById("inp").value
    if (typeof window.ethereum != "undefined") {
        try {

            const transactionresponse = await contract.fund({
                value: ethers.utils.parseEther(ethamount),
            })
            await listenforthetransaction(transactionresponse, provider)
            console.log("done!!!!!!")
            document.querySelectorAll(".i2>p")[0].innerHTML = `done!!!!!!`
        }
        catch (error) {
            console.log(error)
        }
    }
}
function listenforthetransaction(transactionresponse, provider) {
    console.log(`mining tx:${transactionresponse.hash}.......`)
    return new Promise((resolve, request) => {
        provider.once(transactionresponse.hash, (txreceipt) => {
            console.log(`completed with ${txreceipt.confirmations} confirmations`)
            resolve()
        })
    })
}
async function getbalance() {
    if (typeof window.ethereum != "undefined") {
        const balance = await provider.getBalance(contractaddress)
        console.log()
        document.querySelectorAll(".i3>p")[0].innerHTML = `Contract Balance:${ethers.utils.formatEther(balance)}`
    }
}
async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("withdrawing please await.....")
        const transactionresponse = await contract.withdraw()
        await listenforthetransaction(transactionresponse, provider)
    }
}