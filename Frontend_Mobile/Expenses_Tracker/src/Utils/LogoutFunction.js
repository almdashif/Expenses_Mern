import AsyncStorage from "@react-native-async-storage/async-storage";
import CommonAPISelectWOT from "../APIMethods/CommonAPISelectWOT";
import logger from "./logger";


export default LogoutFunction = async (cstate, navigation) => {

    const SetEntityKey = await AsyncStorage.getItem("SetEntityKey");

    let Url = cstate.KeyUrl + "FPU17S3/";

    let params =
    {
        "data": {
            "p1": cstate.UserID,
            "p2": cstate.SessionID
        }
    }

    await CommonAPISelectWOT(Url, params)
        .then(async (res) => {
            const status = res.Output.status;
            if (status.code == 200) {
                AsyncStorage.setItem("UserID", "");
                AsyncStorage.setItem("SessionID", "");
                AsyncStorage.setItem("UserName", "");
                AsyncStorage.setItem("UserEmail", "");

                navigation.navigate("WebViewPage", { "EntityKey": SetEntityKey });
         
                // CommonToast.showToast("Successfully Logged Out");
            } else {
                // CommonToast.showToast("Something went worng, try again");
            }
        })
        .catch((error) => {
            logger.log(error);
        });
};