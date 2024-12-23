import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from "react-native";


import Commoncolor from "../../CommonFolder/CommonColor";
import { Commonwidth } from "../../Utils/ResponsiveWidget";
import CommonStyles from "../../CommonFolder/CommonStyles";
import { Icon1, Icon2 } from "../../CommonFolder/CommonIcons";
import { GlobalContext } from "../../../App";

const NeedHelpPage = ({ navigation }) => {
  const [Expanded, setExpanded] = useState(false);
  const [Expanded1, setExpanded1] = useState(false);
  const [Expanded2, setExpanded2] = useState(false);

  const context = useContext(GlobalContext);
  const { cstate, cdispatch } = context;

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  const backAction = () => {
    navigation.goBack();
    return true;
  };

  const Adjustview = (val) => {
    if (val == 1) {
      setExpanded(!Expanded);
      setExpanded1(false);
      setExpanded2(false);
    } else if (val == 2) {
      setExpanded(false);
      setExpanded1(!Expanded1);
      setExpanded2(false);
    } else if (val == 3) {
      setExpanded(false);
      setExpanded1(false);
      setExpanded2(!Expanded2);
    }
  };

  return (
    <View style={CommonStyles.CommonFlex}>
      <View style={[CommonStyles.CommonHeaderView2, { backgroundColor: Commoncolor.CommonAppColor }]}>
        <TouchableOpacity
          onPress={() => backAction()}
          style={CommonStyles.CommonHeaderViewTouch}
        >
          <Icon1
            name={"arrowleft"}
            size={Commonsize(23)}
            style={CommonStyles.CommonHeaderViewIcon}
          />
        </TouchableOpacity>
        <Text
          style={[
            CommonStyles.CommonHeaderViewText,
            { marginLeft: Commonwidth(0) },
          ]}
        >
          Back
        </Text>
      </View>
      <View style={CommonStyles.CommonHeaderView3}>
        <View style={[CommonStyles.CommonFlex, {}]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={CommonStyles.NeedHelpHeading}>Need For Help ?</Text>

            <View style={CommonStyles.NeedHelpAccordianView1}>
              <Text style={CommonStyles.NeedHelpAccordianView1Text1}>
                1. How do I submit a complaint using the ADIB IFMS Self Service?
              </Text>
              <TouchableOpacity
                onPress={() => Adjustview(1)}
                style={CommonStyles.NeedHelpAccordianView1Touch}
              >
                {Expanded == true ? (
                  <Icon2
                    size={20}
                    style={CommonStyles.NeedHelpIconCenter}
                    name="chevron-thin-up"
                  />
                ) : (
                  <Icon2
                    size={20}
                    style={CommonStyles.NeedHelpIconCenter}
                    name="chevron-thin-down"
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={CommonStyles.NeedHelpDivider}></View>

            {Expanded == true ? (
              <View
                style={{
                  width: "90%",
                  height: "auto",
                  alignSelf: "center",
                }}
              >
                <ScrollView>
                  <Text
                    style={{
                      color: "black",
                      fontWeight: "300",
                      textAlign: "justify",
                      fontSize: Commonheight(14),
                    }}
                  >{"\n"}
                    <Text>
                      Open the ADIB IFMS Self Service Mobile app.
                    </Text>{"\n"} {"\n"}
                    <Text>
                      Login using your credentials.
                    </Text>{"\n"} {"\n"}
                    <Text>
                      In The Home page click on the “Submit Request” Button and follow the steps
                    </Text>{"\n"} {"\n"}
                    <Text style={CommonStyles.NeedHelpViewPage}>
                      Submitting a complaint or service request is easy by following 3 steps
                    </Text>{"\n"} {"\n"}

                    <Text style={CommonStyles.NeedHelpViewPageExtension}>
                      <Text>
                        1. Adding Property Details
                      </Text>{"\n"}

                      <Text>
                        2. Adding Complaint Details
                      </Text>{"\n"}

                      <Text>
                        3. add the images, Video, sign, and submit
                      </Text>
                    </Text>{"\n"} {"\n"}

                    <Text style={CommonStyles.NeedHelpViewPageExtension}>
                      <Text>
                        Your property details like Contract, Location, Building, Floor, and spot will be automatically filled in this step and if required can be changed by clicking the respective fields.
                      </Text>{"\n"} {"\n"}
                      <Text >
                        If it’s an asset-related task. Scan the barcode / QR code from the property selection page’s top right corner and the information will be auto-filled upon scanning the correct asset.
                      </Text>{"\n"} {"\n"}
                      <Text >
                        Click Next for step 2
                      </Text>{"\n"} {"\n"}
                    </Text>

                    <Text style={CommonStyles.NeedHelpViewPage}>
                      Step 2: Complaint Details
                    </Text>{"\n"} {"\n"}
                    <Text style={CommonStyles.NeedHelpViewPageExtension}>
                      <Text >
                        Select the nature of the complaints
                      </Text>{"\n"} {"\n"}
                      <Text >
                        If the related nature of complaint is not available, the new nature of complaint can be entered in a search box and click on the save button, then select a related division
                      </Text> {"\n"} {"\n"}
                      <Text >
                        Enter the details about your service request or complaint. There is an option to add the text using voice (Speech to text)
                      </Text>{"\n"} {"\n"}
                      <Text >
                        Click next to Step 3
                      </Text>{"\n"} {"\n"}
                    </Text>

                    <Text style={CommonStyles.NeedHelpViewPage}>
                      Step 3: Details
                    </Text>{"\n"} {"\n"}
                    <Text style={CommonStyles.NeedHelpViewPageExtension}>
                      <Text >Capture/add the images.</Text>{"\n"} {"\n"}
                      <Text >Also, you can record a voice note of your complaint description You can also record a video of your complaint for our brief understanding.</Text>{"\n"} {"\n"}
                      <Text >Select a preferred date & time for our team to attend to you</Text>{"\n"} {"\n"}
                      <Text >
                        Click on submit button your complaint/service request will be successfully registered
                      </Text>{"\n"} {"\n"}
                    </Text>
                  </Text>
                </ScrollView>
              </View>
            ) : null}

            <View style={CommonStyles.NeedHelpAccordianView1}>
              <Text style={CommonStyles.NeedHelpAccordianView1Text1}>
                2. How do I track my submitted complaints using the ADIB IFMS Self
                Service?
              </Text>
              <TouchableOpacity
                onPress={() => Adjustview(2)}
                style={CommonStyles.NeedHelpAccordianView1Touch}
              >
                {Expanded1 == true ? (
                  <Icon2
                    size={20}
                    style={CommonStyles.NeedHelpIconCenter}
                    name="chevron-thin-up"
                  />
                ) : (
                  <Icon2
                    size={20}
                    style={CommonStyles.NeedHelpIconCenter}
                    name="chevron-thin-down"
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={CommonStyles.NeedHelpDivider}></View>

            {Expanded1 == true ? (
              <View style={CommonStyles.NeedHelpAccordianView2}>
                <ScrollView>
                  <Text
                    style={[
                      CommonStyles.NeedHelpViewPageExtension,
                      { marginTop: Commonheight(10) },
                    ]}
                  >
                    <Text >In the Home page, Click on the “Track button” from the menu and app will list the requests registered and the option to filter by date and details (Keywords)</Text>{"\n"}{"\n"}
                    <Text >Users can also click the requests and view the details and track the status</Text>{"\n"}{"\n"}
                  </Text>
                </ScrollView>
              </View>
            ) : null}

            <View style={CommonStyles.NeedHelpAccordianView1}>
              <Text style={CommonStyles.NeedHelpAccordianView1Text1}>
                3. Can I submit a feedback for any complaint that is completed?
              </Text>
              <TouchableOpacity
                onPress={() => Adjustview(3)}
                style={CommonStyles.NeedHelpAccordianView1Touch}
              >
                {Expanded2 == true ? (
                  <Icon2
                    size={20}
                    style={CommonStyles.NeedHelpIconCenter}
                    name="chevron-thin-up"
                  />
                ) : (
                  <Icon2
                    size={20}
                    style={CommonStyles.NeedHelpIconCenter}
                    name="chevron-thin-down"
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={CommonStyles.NeedHelpDivider}></View>

            {Expanded2 == true ? (
              <View style={CommonStyles.NeedHelpAccordianView3}>
                <ScrollView>
                  <Text
                    style={[
                      CommonStyles.NeedHelpViewPageExtension,
                      { marginTop: Commonheight(10) },
                    ]}
                  >
                    <Text >In the Home page, Click on “Feedback” from the menu and it will list the completed/closed requests</Text>{"\n"}{"\n"}
                    <Text >Select the request and click on “Rate Our Service”. Select the stars to be given and enter your feedback and click on submit</Text>{"\n"}{"\n"}
                  </Text>
                </ScrollView>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default NeedHelpPage;
