import AsyncStorage from "@react-native-async-storage/async-storage";
import { decryptData } from "../Utils/DECODE";
import logger from "../Utils/logger";



export default async function CommonAPISelectWT(url, data, XUID, tokenid, tokenname) {

    const xAccessToken = await AsyncStorage.getItem("xAccessToken");
    const xRefreshToken = await AsyncStorage.getItem("xRefreshToken");
    let xuid = await AsyncStorage.getItem("xuid")
    let sessionid = await AsyncStorage.getItem("SessionID");
    let Decrypted_SessionID = decryptData(sessionid)
    let Header = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-tokenid": tokenid,
        "x-sessionid": Decrypted_SessionID,
        "x-userid": XUID,
        'x-access-token': xAccessToken,
    }
    return fetch(url, {
        method: "POST",
        headers: Header,
        body: JSON.stringify(data)
       })
        .then(res => res.json())
        .then(res => {
            return res;
        })
        .catch((error) => {
            logger.log(error)
        });
}