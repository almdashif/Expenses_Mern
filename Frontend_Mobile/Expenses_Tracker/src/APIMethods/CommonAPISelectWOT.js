import AsyncStorage from "@react-native-async-storage/async-storage";
import { decryptData } from "../Utils/DECODE";
import logger from "../Utils/logger";



export default async function CommonAPISelectWOT(url, data) {

    const xAccessToken = await AsyncStorage.getItem("xAccessToken");
    const xRefreshToken = await AsyncStorage.getItem("xRefreshToken");

    let tokenid = await AsyncStorage.getItem("TokenID");
    let sessionid = await AsyncStorage.getItem("SessionID");
    let userid = await AsyncStorage.getItem("UserID");
    let Decrypted_SessionID = decryptData(sessionid)
    let Decrypted_userid = decryptData(userid)
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-tokenid": tokenid,
        "x-sessionid": Decrypted_SessionID,
        "x-userid": Decrypted_userid,
        'x-access-token': xAccessToken,
    }

    return fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(res => {
            return res;
        })
        .catch((error) => {
            logger.log(error, 'error')
        });
}