export const initialState = {
    KeyUrl: '',
    UserID: '',
    UserGroupID: '',
    UserName: '',
    UserEmail: '',
    Password: '',
    SessionID: '',
    TokenID: '',
    TokenName: '',
    AdvertisementData: [],
    AnnouncementData: [],
    GuestAdvertisementDataDetails: [],
    GuestAnnouncementDataDetails: [],
    CCMComplaintDatas: [],
    CCMComplaintDetailDatas: [],
    CCMComplaintAnnouncementDetailDatas: [],
    SubmitPageImage: [],
    SubmitPageAudio: [],
    SubmitPageVideo: [],
    SubmitPageSign: [],
    SubmitMediaDatas: [],
    PlayAudioPath: "",
    TrackDetailsData: [],
    FeedBackDetailsData: [],
    CCMComplaintDatasOpen: [],
    CCMComplaintDatasClosed: [],
    IsVoiceLoader: false,
    FeedbackChanged: false,
    Offline: "",
    StartAudio: "",
    RecordedAudio: "",
    Scanresult: "",
    DecodedName: "",
    WebViewUrl: "",
    Home_page_count: [],
    Internet: true,
    Advertisement_audio: [],
    Advertisement_video: [],
    Advertisement_images: [],
    Announcement_audio: [],
    Announcement_video: [],
    Announcement_images: [],
    ShowAdvertisementCount: [],
    ShowAnnouncementCount: [],
    ShowTotalCount: "",
    CCMComplaintAdvertisementDetailImageDatas: [],
    CCMComplaintAdvertisementDetailAudioDatas: [],
    CCMComplaintAdvertisementDetailVideoDatas: [],
  
    CCMComplaintAnnouncementDetailImageDatas: [],
    CCMComplaintAnnouncementDetailAudioDatas: [],
    CCMComplaintAnnouncementDetailVideoDatas: [],
  
    TotalCombainedCountData: [],
    BottomNavigationTab: 0,
    NeedLocationUpdate: '',
    isServiceRequest: false,
    ServiceRequestData: [],
    ChangeLocation: false,
    ServiceRequestRoutingData: false,
  };
  
  export function AllReducer(cstate, action) {
    switch (action.type) {
      case 'TotalCombainedCountData': {
        return { ...cstate, TotalCombainedCountData: action.payload };
      }
      case 'CCMComplaintAnnouncementDetailImageDatas': {
        return { ...cstate, CCMComplaintAnnouncementDetailImageDatas: action.payload };
      }
      case 'CCMComplaintAnnouncementDetailAudioDatas': {
        return { ...cstate, CCMComplaintAnnouncementDetailAudioDatas: action.payload };
      }
      case 'CCMComplaintAnnouncementDetailVideoDatas': {
        return { ...cstate, CCMComplaintAnnouncementDetailVideoDatas: action.payload };
      }
      case 'CCMComplaintAdvertisementDetailImageDatas': {
        return { ...cstate, CCMComplaintAdvertisementDetailImageDatas: action.payload };
      }
      case 'CCMComplaintAdvertisementDetailAudioDatas': {
        return { ...cstate, CCMComplaintAdvertisementDetailAudioDatas: action.payload };
      }
      case 'CCMComplaintAdvertisementDetailVideoDatas': {
        return { ...cstate, CCMComplaintAdvertisementDetailVideoDatas: action.payload };
      }
      case 'ShowAdvertisementCount': {
        return { ...cstate, ShowAdvertisementCount: action.payload };
      }
      case 'ShowAnnouncementCount': {
        return { ...cstate, ShowAnnouncementCount: action.payload };
      }
      case 'ShowTotalCount': {
        return { ...cstate, ShowTotalCount: action.payload };
      }
      case 'Advertisement_audio': {
        return { ...cstate, Advertisement_audio: action.payload };
      }
      case 'Advertisement_video': {
        return { ...cstate, Advertisement_video: action.payload };
      }
      case 'Advertisement_images': {
        return { ...cstate, Advertisement_images: action.payload };
      }
      case 'Announcement_audio': {
        return { ...cstate, Announcement_audio: action.payload };
      }
      case 'Announcement_video': {
        return { ...cstate, Announcement_video: action.payload };
      }
      case 'Announcement_images': {
        return { ...cstate, Announcement_images: action.payload };
      }
      case 'Internet': {
        return { ...cstate, Internet: action.payload };
      }
      case 'Home_page_count': {
        return { ...cstate, Home_page_count: action.payload };
      }
      case 'WebViewUrl': {
        return { ...cstate, WebViewUrl: action.payload };
      }
      case 'DecodedName': {
        return { ...cstate, DecodedName: action.payload };
      }
      case 'KeyUrl': {
        return { ...cstate, KeyUrl: action.payload };
      }
      case 'UserID': {
        return { ...cstate, UserID: action.payload };
      }
      case 'UserGroupID': {
        return { ...cstate, UserGroupID: action.payload };
      }
      case 'UserName': {
        return { ...cstate, UserName: action.payload };
      }
      case 'Password': {
        return { ...cstate, Password: action.payload };
      }
      case 'SessionID': {
        return { ...cstate, SessionID: action.payload };
      }
      case 'TokenID': {
        return { ...cstate, TokenID: action.payload };
      }
      case 'TokenName': {
        return { ...cstate, TokenName: action.payload };
      }
      case 'AdvertisementData': {
        return { ...cstate, AdvertisementData: action.payload };
      }
      case 'AnnouncementData': {
        return { ...cstate, AnnouncementData: action.payload };
      }
      case 'GuestAdvertisementDataDetails': {
        return { ...cstate, GuestAdvertisementDataDetails: action.payload };
      }
      case 'GuestAnnouncementDataDetails': {
        return { ...cstate, GuestAnnouncementDataDetails: action.payload };
      }
      case 'CCMComplaintDatas': {
        return { ...cstate, CCMComplaintDatas: action.payload };
      }
      case 'CCMComplaintDetailDatas': {
        return { ...cstate, CCMComplaintDetailDatas: action.payload };
      }
      case 'CCMComplaintAnnouncementDetailDatas': {
        return { ...cstate, CCMComplaintAnnouncementDetailDatas: action.payload };
      }
      case 'SubmitPageImage': {
        return { ...cstate, SubmitPageImage: action.payload };
      }
      case 'SubmitPageAudio': {
        return { ...cstate, SubmitPageAudio: action.payload };
      }
      case 'SubmitPageVideo': {
        return { ...cstate, SubmitPageVideo: action.payload };
      }
      case 'SubmitPageSign': {
        return { ...cstate, SubmitPageSign: action.payload };
      }
      case 'SubmitMediaDatas': {
        return { ...cstate, SubmitMediaDatas: action.payload };
      }
      case 'PlayAudioPath': {
        return { ...cstate, PlayAudioPath: action.payload };
      }
      case 'TrackDetailsData': {
        return { ...cstate, TrackDetailsData: action.payload };
      }
      case 'FeedBackDetailsData': {
        return { ...cstate, FeedBackDetailsData: action.payload };
      }
      case 'CCMComplaintDatasOpen': {
        return { ...cstate, CCMComplaintDatasOpen: action.payload };
      }
      case 'CCMComplaintDatasClosed': {
        return { ...cstate, CCMComplaintDatasClosed: action.payload };
      }
      case 'IsVoiceLoader': {
        return { ...cstate, IsVoiceLoader: action.payload };
      }
      case 'FeedbackChanged': {
        return { ...cstate, FeedbackChanged: action.payload };
      }
      case 'Offline': {
        return { ...cstate, Offline: action.payload };
      }
      case 'StartAudio': {
        return { ...cstate, StartAudio: action.payload };
      }
      case 'RecordedAudio': {
        return { ...cstate, RecordedAudio: action.payload };
      }
      case 'Scanresult': {
        return { ...cstate, Scanresult: action.payload };
      }
      case 'BottomNavigationTab': {
        return { ...cstate, BottomNavigationTab: action.payload };
      }
      case 'UserEmail': {
        return { ...cstate, UserEmail: action.payload };
      }
      case 'NeedLocationUpdate': {
        return { ...cstate, NeedLocationUpdate: action.payload };
      }
      case 'isServiceRequest': {
        return { ...cstate, isServiceRequest: action.payload };
      }
      case 'ServiceRequestData': {
        return { ...cstate, ServiceRequestData: action.payload };
      }
      case 'ServiceRequestRoutingData': {
        return { ...cstate, ServiceRequestRoutingData: action.payload };
      }
      case 'ChangeLocation': {
        return { ...cstate, ChangeLocation: action.payload };
      }
      default: {
        throw new Error(`Unhandled action type: ${action.type}`);
      }
    }
  }
  