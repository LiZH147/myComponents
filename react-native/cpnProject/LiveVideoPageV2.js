
import React from 'react';
import { Dimensions, Animated, PanResponder, Easing, ScrollView, FlatList, Linking } from "react-native";

import { Package, Device, Service, Host, PackageEvent, System, DarkMode, DeviceEvent, API_LEVEL, UserExpPlanEvent ,USER_EXP_PLAN_EVENT_TYPES } from 'miot';
import { Permissions } from "miot/system/permission";
import { NativeModules, StatusBar, DeviceEventEmitter, Platform, BackHandler, PermissionsAndroid, Image, StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { MISSCommand, MISSConnectState, MISSError } from "miot/service/miotcamera";
import CameraRenderView, { MISSCodec } from 'miot/ui/CameraRenderView';
import { MISSDataBits, MISSAudioChannel } from 'miot/ui/CameraRenderView';
import { Base64 } from '../util/Base64';
import base64js from 'base64-js';
import Orientation from 'react-native-orientation';
import ImageButton from "miot/ui/ImageButton";
import { HostEvent } from 'miot/Host';

import LinearGradient from 'react-native-linear-gradient';
import { SingleChoseDialog, TouchableView } from "miot/ui";
import DeviceOfflineDialog from "../ui/DeviceOfflineDialog";
import NoNetworkDialog from "../ui/NoNetworkDialog";
import PanoramaViewDialog from "../ui/PanoramaViewDialog";
import CommonMsgDialog from "../ui/CommonMsgDialog";
import RPC from '../util/RPC';
import LogUtil from '../util/LogUtil';
import DirectionView, { DirectionViewConstant } from '../ui/DirectionView';
import DirectionHorizontalView from '../ui/DirectionHorizontalView';

import RectAngleView from '../ui/RectAngleView';
import OverAllControlView from "../ui/OverAllControlView";

import { TouchableHighlight } from "react-native";

import { localStrings as LocalizedStrings } from '../MHLocalizableString';
import CameraPlayer, { MISSCommand_ECO } from '../util/CameraPlayer';
import StorageKeys from '../StorageKeys';
import API from '../API';

import VersionUtil from '../util/VersionUtil';
import AlbumHelper from "../util/AlbumHelper";

import Toast from '../components/Toast';
import CameraConfig from '../util/CameraConfig';
import AlarmUtil from '../util/AlarmUtil';

import { ChoiceDialog, AbstractDialog } from 'miot/ui/Dialog';
import { InputDialog, MessageDialog } from "mhui-rn";
import NumberUtil from '../util/NumberUtil';
import TrackUtil from '../util/TrackUtil';
import LoadingView from '../ui/LoadingView';
import Util, { EvMap, GermanCluster } from "../util2/Util";
import { CldDldTypes } from "../framework/CloudEventLoader";
import { CAMERA_CONTROL_SEPC_PARAMS, DescriptionConstants, devOpen } from '../Constants';
import TrackConnectionHelper from '../util/TrackConnectionHelper';
import { feedbackLogUploaderStatus, fetchLogUploaderStatus } from '../util/LogUploader';

import MHLottieVoiceButton, { MHLottieVoiceBtnDisplayState } from '../ui/animation/lottie-view/MHLottieVoiceButton';
import MHLottieSnapButton, { MHLottieSnapBtnDisplayState } from '../ui/animation/lottie-view/MHLottieSnapButton';
import MHLottieRecordButton, { MHLottieRecordBtnDisplayState } from '../ui/animation/lottie-view/MHLottieRecordButton';
import MHLottieControlButton, { MHLottieControlBtnDisplayState } from '../ui/animation/lottie-view/MHLottieControlButton';

import MHLottieSleepToolButton, { MHLottieSleepToolBtnDisplayState } from '../ui/animation/lottie-view/MHLottieSleepToolButton';
import MHLottieAudioToolButton, { MHLottieAudioToolBtnDisplayState } from '../ui/animation/lottie-view/MHLottieAudioToolButton';
import MHLottieQulityToolButton, { MHLottieQulityToolBtnDisplayState } from '../ui/animation/lottie-view/MHLottieQulityToolButton';
import MHLottieFullScreenToolButton from '../ui/animation/lottie-view/MHLottieFullScreenToolButton';

import MHLottieSnapLandscapeButton, { MHLottieSnapLandscapeBtnDisplayState } from '../ui/animation/lottie-view/MHLottieSnapLandscapeButton';
import MHLottieRecordLandscapeButton, { MHLottieRecordLandscapeBtnDisplayState } from '../ui/animation/lottie-view/MHLottieRecordLandscapeButton';
import MHLottieVoiceLandscapeButton, {
  MHLottieVoiceLandscapeBtnDisplayState
} from '../ui/animation/lottie-view/MHLottieVoiceLandscapeButton';
import OfflineHelper from '../util/OfflineHelper';
import StatusBarUtil from '../util/StatusBarUtil';
import PinCodeUtil from '../util/PinCodeUtil';
import { isStartUpPush } from '../index';
import NetInfo from '@react-native-community/netinfo';
import DldMgr from '../framework/DldMgr';
import VipUtil from '../util/VipUtil';
import SpecUtil from '../util/SpecUtil';
import PrivacySDKUtil from '../util/PrivacySDKUtil';
import { removeDarkListener } from '../setting/SettingStyles';
import dayjs from 'dayjs';
import SdcardEventLoader from '../framework/sdcard/SdcardEventLoader';
import { PAD_SCROLL_STRATEGY } from 'miot/Host';
import AlarmUtilV2, {
  PIID_ASLEEP_WAKEUP_SWITCH,
  PIID_EXPRESSION_SWITCH, PIID_FENCE_SWITCH,
  PIID_LOCAL_MODE,
  PIID_MOTION_DETECTION, PIID_MOUTH_NORSE_SWITCH, PIID_MOVE_SWITCH, PIID_PEOPLE_SWITCH, PIID_PRIVATE_AREA_SWITCH,
  PIID_SCREEN_BIND_CMD, PIID_SCREEN_LAN_POP,
  PIID_SCREEN_STATUS,
  PIID_SCREEN_WORK_STATUS, SIID_AI_CUSTOM, SIID_AI_DETECTION, SIID_FENCE_DETECTION, SIID_LOCAL_MODE,
  SIID_MOTION_DETECTION,
  SIID_SCREEN_CONTROL
} from '../util/AlarmUtilV2';
import { Event } from '../config/base/CfgConst';
import CareScreenSetting from "../setting/eco_v2/CareScreenSetting";
import ParsedText from "react-native-parsed-text";
import LocalModeDialog from "../ui/LocalModeDialog";
import FunnyVideoUtil from "../util/FunnyVideoUtil";
import { borderColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

// import NetInfo from "@react-native-community/netinfo";

const kBpsDataReceiveCallbackName = "bpsDataReceiveCallback";
const kRecordTimeCallbackName = "recordTimeCallback";
const kRDTDataReceiveCallBackName = 'rdtDataReceiveCallBack';
const KFirstFrameOverExposedResultCallBackName = 'overExposedResultCallBack';
const kWindowHeight = Math.max(Dimensions.get("screen").height, Dimensions.get("screen").width);
const kWindowWidth = Math.min(Dimensions.get("screen").height, Dimensions.get("screen").width);// use this.winPortraitWidth instead
const navigationBarHeightFat = 53; // 导航栏高度，有副标题
const iconSize = 50; // 图标尺寸
const iconButtonSize = 50;
const fixControlBarHeight = kWindowHeight > 600 ? 128 : 90;
const MAX_ANGLE = 101;
const MIN_ANGLE = 1;
const MAX_ELEVATION = 101;
const MIN_ELEVATION = 1;
const kIsCN = Util.isLanguageCN();

const TAG = "LiveVideoPageV2";

export default class LiveVideoPageV2 extends React.Component {
  static navigationOptions = (navigation) => {
    // if (true) {//不要导航条
    //   return null;
    // }
    return {
      headerTransparent: true,
      header:
        null
    };
  };
  state = {
    eventStatisticsList: [],
    attentionDlg: false,
    prePositionNameTooLong: false,
    isCruising: false,
    inputPrePositionName: false,
    showPostionLetter: false,
    pstate: -1,
    error: -1,
    bps: 0,
    showPlayToolBar: true,
    useLenCorrent: true, // 畸变纠正
    darkMode: false,
    fullScreen: false,
    isCalling: false,
    isRecording: false,
    isMute: CameraConfig.getUnitMute(),
    isSleep: false,
    resolution: 0,
    isFlip: false,
    rotation: 0,
    showDirectCtr: false,
    controlViewHeight: new Animated.Value(fixControlBarHeight),
    optionCoverAlpha: new Animated.Value(0.0),
    videoHeightScale: 1,
    angle: 51,
    elevation: 51,
    videoScale: 1.0,
    angleViewShowScale: false,
    showCameraAngleView: false,
    showPanoView: false,
    showTargetPushView: false,
    isNewDevice: false,
    panoViewStatus: 1,
    editPonoView: false,
    panoDialogVisibility: false,
    savedVideoScale: 1.0,
    isOverExposed: false,

    dialogVisibility: false,
    screenshotVisiblity: false,
    screenshotPath: "",
    showDefaultBgView: true,
    whiteTitleBg: true,
    showErrorView: false,
    showLoadingView: false,
    showPoweroffView: false,
    showCloudVipBuyTip: false,
    errTextString: "",
    showPauseView: false,
    lastOfflineTime: "",
    isInternationServer: true, // 是否为国际服
    showRedDot: false,
    showNasRedDot: false,
    isWatermarkEnable: true,
    bannerId: 0,
    bannerShortKey: "0",
    clickedBannerShortKey: 0,
    recordTimeSeconds: 0,
    isWhiteVideoBackground: true,
    isNoneChinaLand: false,
    restoreOriFinished: true, // correct for 
    restoreOriFinished2: true,

    showLogDialog: false,
    logDialogContent: "",

    permissionRequestState: 0,
    showPermissionDialog: false,
    showPinCodeWarningDialog: false,

    showGlobalLoading: false,// 全局的loading
    showTimeoutDialog: false,
    enableAIFrame: false,
    lastMonitorEvent: null,
    // hasMonitorEventInAWeek:null,
    showGBFDialog: false,
    showVipCloudOpenDialog: false,
    showScreenBindDialog: false,
    screenBindStatus: -1,
    showOneKeyCallDialog: false,
    isAudioBtnDisabled: false,
    sdcardFormatDialog: false,
    sdcardFullDialog: false,
    sdcardSmallDialog: false,
    bgImgUri: null,
    funnySwitch: false,
    memorySwitch: false,
    showShadow: false,
    showUpdateAppDialog: false,
    lanConfigDialog: false,
    showClosePrivateDialog: false,
    doubleVideoScale: 1
  }

  constructor(props) {
    super(props);
    this.pickedFreeCloud = false;
    StorageKeys.FREE_CLOUD.then((res) => {
      typeof (res) === 'boolean' ? this.pickedFreeCloud = res : this.pickedFreeCloud = false;
      LogUtil.logOnAll("StorageKeys.FREE_CLOUD res======", this.pickedFreeCloud);
    });
    TrackConnectionHelper.trackLivePageEnter();
    this.isIOS = Platform.OS == "ios";
    this.isKrServer = false;
    this.isEuropeServer=CameraConfig.getIsEuropeServer();
    this.fromOneKeyCall = props.navigation.getParam("fromOneKeyCall");
    this.startCallFlag = props.navigation.getParam("startCallFlag");
    this.isCloudServer=CameraConfig.getIsCloudServer();

    this.shouldShowVipCloudOpenDialog = false;
    this.privacyDialogPoped = false;
    this.needCheckUserExp = false;
    this.putedSD_STATUS_EJECTED = -1;
    this.isPageForeGround = true;// 默认当前page在前台, 页面在后，plugin可前可后；plugin在后，页面可前可后。
    this.isPluginForeGround = true;// 默认当前插件在前台
    this.isAppForeround = true;// 米家app是否在前台
    this._createPanResponder();
    this.videoPanResponder = null;
    this.createVideoPanResponder();
    this._createScalePanResponder();
    this.freeHomeSurExpireTime = ''; // 免费看家结束时间
    this.freeHomSurStatus = '';
    this.todayFunnyMemoryEvents = [];
    this.todayEmotionEventCount = 0;
    this.todayStoryCount = 0;
    // see https://blog.csdn.net/u011068702/article/details/83218639
    console.log("+++++++++++++++==============mode",CameraPlayer.RUNTIME_LOCAL_MODE);
    this.isLocalMode = CameraPlayer.RUNTIME_LOCAL_MODE;
    this.didFocusListener = this.props.navigation.addListener(// 回到当前页面 或者第一次进来
      'didFocus',
      () => {
        console.log("test will focus")
        if (Platform.OS == "ios" && !this.isPluginForeGround) { // 如果是ios，插件跳到了原生页面，同时调用到了popToTop，package.willDisappear和didFocus都会被调用到，原来的逻辑就有问题。
          this.isPageForeGround = true;
          return;
        }
        console.log("landingpush 2", isStartUpPush());
        if (Platform.OS == "ios" && isStartUpPush() && !Host.isPad) { // ios pad 不退出插件，避免从push点过来，跳到原生播放页，原生播放页是小画面。
          Package.exit();
          return;
        }
        this.isPageForeGround = true;
        this.isPluginForeGround = true;
        this.isAppForeround = true;
        console.log('testaaa', 'didFocusListener', 'page: ', this.isPageForeGround, ' plugin: ', this.isPluginForeGround);
        Host.setPadScrollDealStrategy({strategy: PAD_SCROLL_STRATEGY.AUTO});
        this.getRuntimeMode();
        this._onResume();
      }
    );

    // didBlur在ios上调的时间晚，会在其他页面的onResume之后，换成willBlur
    this.willBlurListener = this.props.navigation.addListener(// //去往其他rn页面  相邻页面跳转 前面一个页面的onBlur先执行，后面一个页面的onFocus后执行
      'willBlur',
      () => {
        this.state.darkMode ? StatusBar.setBarStyle('light-content') : StatusBar.setBarStyle('dark-content');//去往了其他页面，要主动刷新状态栏 为黑色
        this.isPageForeGround = false;
        // LogUtil.logOnAll("CameraPlayer.getInstance().bindOneKeyCallReceived(null) by wilBlur");
        // CameraPlayer.getInstance().bindOneKeyCallReceived(null);
        this._onPause();
        if (this.cameraGLView != null && !this.isCheckingPermission) {
          this.cameraGLView.hidesSurfaceView();
        }
        Host.setPadScrollDealStrategy({strategy: PAD_SCROLL_STRATEGY.AUTO});
      }
    );

    // 操作系统栏时，ios会调用packageDidResume 和 packageWillPause，android不会，所以android不会有pause和resume流程
    this.didResumeListener = PackageEvent.packageDidResume.addListener(() => {
      LogUtil.logOnAll(TAG, "did resume, this.isPageForeground:" + this.isPageForeGround + " this.isPluginForeground:" + this.isPluginForeGround + " isAppForeround:" + this.isAppForeround + " isOnRequestingPincode:" + this.isOnRequestingPincode + " isPowerOn:" + this.isPowerOn + " this.glview:" + (this.cameraGLView == null) + " isFirstEnter:" + this.isFirstEnter);
      if (!this.isPageForeGround) { // app进入前台，ios/android都会调用。对android，从native页面返回也会调用这个页面
        return;
      }
      if (!this.isPluginForeGround && Platform.OS != "android") {
        return;// ios 插件不在前台 App从后台回到前台也会收到这个通知，
      }
      this.isAppForeround = true;// rnactivity调用了onresume
      // console.log('testaaa', 'didResumeListener', 'page: ', this.isPageForeGround, ' plugin: ', this.isPluginForeGround);
      if (Platform.OS == "android" && this.evenLockScreen > 0) {
        this.setState({ restoreOriFinished: false });
      }
      this.restoreOri(2);
      if (Host.isAndroid) {
        if (this.isOnRequestingPincode) {
          this.pinCodeSwitchChangedListener && this.pinCodeSwitchChangedListener.remove();
          this.isOnRequestingPincode = false;// 下一次走过来，就不用处理了。
          LogUtil.logOnAll("PincodeUtil", this.isOnRequestingPincode + " " + this.isPinCodeSet);
          // 如果是从密码输入页面回来的，此时要判断pincodeSwitchChangeEvent里返回的值。
          if (this.isPinCodeSet || !this.isKrServer) {
            // this.checkPrivacyDialog();// 开始处理隐私弹框 调用流程改了，这里不用再去处理密码弹框了
          } else {
            // 没有开启密码，退出插件。
            Package.exit();
            return;//这里是android
          }

        }
      }
      this.getRuntimeMode();
      this._onResume();
    });

    this.willPauseListener = PackageEvent.packageWillPause.addListener(() => {
      Toast._hideLastToast();
      if (!this.isPageForeGround) { // app进入后台，ios/android都会调用。对android，进入native页面也会调用这个页面
        return;
      }
      if (!this.isPluginForeGround && Platform.OS != "android") {
        return;// ios平台回到后台，默认都会发这个消息，如果插件不在前台，就不处理。
      }
      this.isAppForeround = false;// rnactivity调用了onpause
      // console.log('testaaa', 'willPauseListener', 'page: ', this.isPageForeGround, ' plugin: ', this.isPluginForeGround);
      this._onPause();

      if (Platform.OS == "android" && this.state.fullScreen) {
        this.evenLockScreen = 2;// lock screen or go home
      }


    });

    if (Platform.OS == "ios") {
      this.willAppearListener = PackageEvent.packageViewWillAppear.addListener(() => {// RN插件

        // if (!this.isPluginForeGround) { // 从native页回来后，ios只进入这一个状态，但是android还要走packageDidResume，所以这里要为ios调用onResume
        //   // CHUANGMI-9510，从Native页面返回需要在其他函数中onResume
        //   this.isPluginForeGround = true;
        //   return;
        // }
        if (!this.isPageForeGround) {
          return;
        }
        if (isStartUpPush()) {
          Package.exit();
          return;
        }
        // this.isPageForeGround = true;// only for ios jump to native view, statusbar control
        this.isPluginForeGround = true;// rnactivity调用了onresume
        // console.log('testaaa', 'willAppearListener', 'page: ', this.isPageForeGround, ' plugin: ', this.isPluginForeGround);
        if (!Host.isAndroid) {
          if (this.isOnRequestingPincode) {
            this.pinCodeSwitchChangedListener && this.pinCodeSwitchChangedListener.remove();
            this.isOnRequestingPincode = false;// 下一次走过来，就不用处理了。
            LogUtil.logOnAll("PincodeUtil", this.isOnRequestingPincode + " " + this.isPinCodeSet);
            // 如果是从密码输入页面回来的，此时要判断pincodeSwitchChangeEvent里返回的值。
            if (this.isPinCodeSet || !this.isKrServer) {
              // this.checkPrivacyDialog();// 开始处理隐私弹框 调用流程改了，这里不用再去处理密码弹框了
            } else {
              // 没有开启密码，退出插件。
              Package.exit();
              return;//这里是android
            }

          }
        }
        this.getRuntimeMode();
        this._onResume();
      });

      this.willDisappearListener = PackageEvent.packageViewWillDisappearIOS.addListener(() => {
        if (!this.isPageForeGround) { // 进入native页面，ios只调用这个页面。
          return;
        }

        // this.toPortrait();// ios强制切换到竖屏去
        setTimeout(() => {
          this.isPluginForeGround = false;// rnactivity调用了onpause
          // console.log('testaaa', 'willDisappearListener', 'page: ', this.isPageForeGround, ' plugin: ', this.isPluginForeGround);
          this._onPause();

        }, 0);
      });

      this.lastRecordTime = "00:00";
    } else {
      // TODO 10048中打开
      if (PackageEvent.packageWillStopAndroid) {
        this.wllStopListener = PackageEvent.packageWillStopAndroid.addListener(() => {
          if (this.cameraGLView != null && !this.destroyed) {
          }
        });
      }
    }
    this.prePositions = [];
    this.prePositionItems = [];
    this.PreSetCTRL = "ctrl";
    this.PreSetADD = "set";
    this.PreSetDELETE = "del";
    this.preSetPositionImg = "preSetPosition_";
    let timeStamp = Date.now();
    this.preSetPositionImgTime = [timeStamp, timeStamp, timeStamp];
    this.ctrlCurrentLocation = [0, 0, 0];
    this.preSetPositionExist = false;
    this.addPreSetIndex = 1;
    this.addPreSetLocation = 1;
    this.angleData = { "ret": 0, "angle": 0, "elevation": 0 };
    this.currentNetworkState = -1;
    this.isChangingNetwork = false;
    this.skipDataWarning = false;// 默认不跳过流量控制
    // this.checkIsInternationalServer();
    this.sdcardCode = -1;
    this.isFirstEnter = true;
    this.connRetry = 2;// only for first connection
    this.startVideoRetry = false;
    this.cloudVipEndTime = 0;
    this.cloudVipWillEndDays = 0;
    this.enablePtzRotation = true; // 云台手势转动
    this.videoRecordPath = null;

    this.voiceBtn = null;
    this.snapBtn = null;
    this.recordBtn = null;
    this.controlBtn = null;

    this.exitListener = PackageEvent.packageWillExit.addListener(() => {
      this.exitListener.remove();
      Service.miotcamera.disconnectToDevice();// 只调用一次。
      removeDarkListener();//退出插件的时候，移除监听器。
    });
    this.cancelAuthListener = PackageEvent.packageAuthorizationCancel.addListener(() => {
      StorageKeys.PANORAMA_IMAGE_PATH = "";
      this.cancelAuthListener.remove();
      Service.miotcamera.disconnectToDevice();
      StorageKeys.IS_PRIVACY_NEEDED = true;// 撤销授权后 应该重置状态为需要弹框
      StorageKeys.OPERATION_CLICKED_KEY = 0;
      Package.exit();
    });

    this.isAudioMuteTmp = CameraConfig.getUnitMute();

    this.cameraGLView = null;
    this.sleepDialog = null;

    this.angleView = null;
    this.isConnecting = false;

    this.isClickSleep = false;
    this.isClickCall = false;
    this.mOri = "PORTRAIT";
    this.isCheckingPermission = false;
    this.iconAnimatedValue = new Animated.Value(0);
    this.panoramaType = 1;// 整型，0代表360°、1代表270°、2代表180°
    this.event_type_mode = -1;
    StorageKeys.LAST_PANO_ANGLE.then((res) => {
      if (typeof (res) == "string" || res == null) {
        res = 1;
        StorageKeys.LAST_PANO_ANGLE = 1;
      }
      this.panoramaType = res;
    })
    this.isAllViewRpc = false;// 是否在绘制中


    this.showPanoAfterReceivedRotateAngle = false;
    this.minSelectPositionLeft = 0;
    this.maxSelectPositionRight = 0;
    this.panoramaImgStoreUrl = null;
    this.isPtz = CameraConfig.isPTZCamera(Device.model);
    this.isHorizontalPTZ = CameraConfig.isHorizontalPTZ(Device.model);
    this.isNewChuangmi = CameraConfig.isNewChuangmi(Device.model);
    this.isSupportPhysicalCover = CameraConfig.isSupportPhysicalCover(Device.model);

    this.isSupport2K = CameraConfig.isSupport2K(Device.model);
    this.isSupport25K = CameraConfig.isSupport25K(Device.model);
    this.isSupport3K = CameraConfig.isSupport3K(Device.model);

    this.hideBgBpsCount = 0;

    this.detectionSwitch = false; // 看家设置是否打开
    this.evenLockScreen = 0;
    this.startScaleTime = 0;
    this.startScaleReportTime = 0;

    this.directionEndHintTimeout = null;
    this.loadingRetryTimer = 0;

    this.isHandlingSdcard = false;

    this.isSendingRdtCmd = false;
    this.enterLiveVideoTime = 0;
    this.enterCallTime = 0;
    this.delayPauseTimer = 0;
    this.destroyed = false;
    this.mFirmwareSupportCloud = VersionUtil.isFirmwareSupportCloud(Device.model); // 是指该设备的是否有能力支持云存：固件是否能支持云存或者是支持云存的地区

    this.videoPortraitScale = 1;
    this.isOnRequestingPincode = false;
    this.isPinCodeset = false;// 默认密码没有设置，需要配合isOnRequstingPinCode使用。

    AlbumHelper.fetchDeviceAlbumName(); // 提前刷新nativeAlbumName
    this.isIphone12 = this._isIphone12();
    this.lastTimeRecordBtnClicked = 0;

    this.videoQualityFetched = false;// videoquality is fetched
    this.lastTimeRecordBtnClicked = 0;

    this.privacySDKUtil = new PrivacySDKUtil();
    this.isFirmwareUpdating = false;

    this.isPrivacyAuthed = false;

    this.isFirstFrameReceived = false;

    this.selectedIndexArray = [0];

    DldMgr.addLdrs(SdcardEventLoader.getInstance());// 进来的时候调用一次 绑定sdcard下载器

    this.itemWidthP = kWindowWidth / 3;
    this.itemWidth = kWindowWidth * 0.28;
    this.itemHeight = this.itemWidth * 0.65;
    this.jianju = (this.itemWidthP - this.itemWidth) / 4.1;
    this.shouldRequestScreenState = false;
    this.sleepPower = 0;
    this.wakePower = 0;
  }

  _isIphone12() {
    let vv = Host.systemInfo;
    console.log("currentSystemInfo:" + JSON.stringify(vv));
    let isiPhone12 = (vv.mobileModel.indexOf('iPhone13') == 0);
    return isiPhone12;
  }

  _getFunnyMemorySetting() {
    // 每日故事开关
    AlarmUtil.getAlarmConfig().then((res) => {
      console.log("getAlarmConfig",res);
      if (res.code != 0) {
        console.log("getdailyStorySwitch:", JSON.stringify(-1));
        return;
      }
      // 趣拍回忆开关
      let dailyStorySwitch = res.data.dailyStorySwitch;
      StorageKeys.FUNNY_TAKE.then((res) => {
        console.log("=========FUNNY_TAKE",res)
        let funnySwitch = typeof (res) === 'boolean' ? res : false;
        this.setState({ memorySwitch: dailyStorySwitch,funnySwitch: funnySwitch });
      });
    }).catch((err) => {
      console.log("getdailyStorySwitch:", JSON.stringify(err));
      StorageKeys.FUNNY_TAKE.then((res) => {
        let funnySwitch = typeof (res) === 'boolean' ? res : false;
        this.setState({ funnySwitch: funnySwitch });
      });
    });
  }
  _getKanjiaSetting() {
    if (VersionUtil.isUsingSpec(Device.model)) {
      AlarmUtil.getSpecAlarmConfig(2).then((result) => {
        LogUtil.logOnAll("-=-=-=-=-=-=-=-=_getKanjiaSetting==", JSON.stringify(result));
        if (result instanceof Array) {
          if (result.length > 0 && result[0].code == 0) {
            this.detectionSwitch = result[0].value;
            this.getedDetectionSwitch = true;
            this.forceUpdate();
          }
        }
      }).catch((err) => {
        console.log(`getSpecAlarmConfig err=${JSON.stringify(err)}`);
      });
    } else {
      // API.get('/miot/camera/app/v1/get/alarmSwitch', 'business.smartcamera').then((res) => {
      AlarmUtil.getAlarmConfig().then((res) => {
        if (res.code == 0) {
        } else {
          console.log("get alarmconfig:", JSON.stringify(-1));
          return;
        }
        this.detectionSwitch = res.data.motionDetectionSwitch.detectionSwitch;
      }).catch((err) => {
        console.log("get alarmconfig err:", JSON.stringify(err));
      });
    }
  }
  
  async loadMonitoringDetail_rn(from) {
    try {
      let data = await Util.getEventList(new Date(), "Default", false, 20, null, CldDldTypes.Events);
      // console.log('loadMonitoringDetail_rn', data);
      this.todayEvents = null;
      if (data && data.items.length > 0) {
        this.todayEvents = data.items.filter((item, index) => index < 3);
        this.todayEvents.map((item) => {
          Service.miotcamera.getFileIdImage(item.imgStoreId.toString()).then((res) => {
            item.imgStoreUrl = res;
            this.forceUpdate();
          }).catch((err) => {
            console.log("loadMonitoringDetail_rn getFileIdImage err=", JSON.stringify(err));
          });
          return item;
        });
        this.setState({ lastMonitorEvent: `${data.items[0].eventTime} ${data.items[0].desc}` });
      } else {
        this.setState({ lastMonitorEvent: null });
      }
    } catch (exception) {
      
    }
    
    // let timeStamp = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
    // let data1 = await Util.getEventListRange(new Date(timeStamp), "Default", false, 5, null, CldDldTypes.Events)
    // if (data1 && data1.items.length > 0) {
    //   this.setState({ hasMonitorEventInAWeek: true });
    // } else {
    //   this.setState({ hasMonitorEventInAWeek: this.mFirmwareSupportCloud ? false : true });
    // }

    this.loadEventSortStatics();
    this.loadFunnyMemoryStatics();
  }
  loadEventSortStatics() {
    // AlarmUtilV2.getEventSort().then((res) => {
    //   let data = res.data;
    //   this.eventTypeAttentionList = data.eventTypeAttentionList;
    // }).catch((err) => {
    //   LogUtil.logOnAll(TAG, "getEventSort err=", JSON.stringify(err));
    // });
    this.eventSortList = [];
    AlarmUtilV2.getEventStatistics().then((res) => {
      let data = res.data;
      this.todayEventSize = data.count;
      let list = data.eventStatisticsList;
      this.eventSortList.push(...list);
      AlarmUtilV2.getALLAISettings().then(() => {
        let closedItems = [];
        list = list.filter((item, index) => {
          // if (item.eventType == Event.Wakeup || item.eventType == Event.Asleep) {
          //   return false;
          // }
          // // @20200309 暂时下掉口鼻遮挡
          // if (item.eventType == Event.CoveredFace) {
          //   return false;
          // }
          let descItem = EvMap[item.eventType];
          item.des = item.eventType == Event.AI ? LocalizedStrings["ai_desc"] : descItem.des;
          item.icon = descItem.icon.big;
          item.icon_dis = descItem.icon.big_dis;
          item.realIndex = index;
          if (item.eventType == Event.Face && !this.isVip) {
            closedItems.push(item);
            return false;
          }
          if (!AlarmUtilV2.AI_EVENT_SETTING_MAP[item.eventType] && item.eventType != Event.AI) {
            closedItems.push(item);
            return false;
          }
          return true;
        });
        list.push(...closedItems);
        this.setState({ attentionDlg: false, eventStatisticsList: list });
      }).catch(() => {
        let resList = list.filter((item, index) => {
          // if (item.eventType == Event.Wakeup || item.eventType == Event.Asleep) {
          //   return false;
          // }
          // // @20200309 暂时下掉口鼻遮挡
          // if (item.eventType == Event.CoveredFace) {
          //   return false;
          // }
          let descItem = EvMap[item.eventType];
          item.des = item.eventType == Event.AI ? LocalizedStrings["ai_desc"] : descItem.des;
          item.icon = descItem.icon.big;
          item.icon_dis = descItem.icon.big_dis;
          item.realIndex = index;
          return true;
        });
        this.setState({ attentionDlg: false, eventStatisticsList: resList });
      });
    }).catch((err) => {
      LogUtil.logOnAll(TAG, "getEventStatistics err=", JSON.stringify(err));
    });
  }

  async loadFunnyMemoryStatics() {


    try {
      let paramsEmo = {
        "did": Device.deviceID,
        "timestamp": new Date().getTime()
      }
      let emoData = await  API.get('/common/app/get/event/emostatiscs', 'business.smartcamera', paramsEmo);
      // 表情识别 EmotionRecognition
      let data = await Util.getEventList(new Date(), "EmotionRecognition", false, 5, null, CldDldTypes.Events);
      // 回忆->每日故事
      let params = { "did": Device.deviceID, "category": 0, "model": Device.model, "endTime": new Date().getTime(), "limit": 1, "region": Host.locale.language.includes("en") ? "US" : "CN" };
      AlarmUtil.getDailyStoryList(params).then((res) => {
        console.log(`getDailyStoryList ${JSON.stringify(res)}`);
        if (data && data.items.length > 0) {
          this.todayFunnyMemoryEvents = data.items.filter((item, index) => index < 3);
        } else {
          this.todayFunnyMemoryEvents = [];
        }
        if (emoData.code == 0) {
          this.todayEmotionEventCount = emoData.data.count;
        } else {
          this.todayEmotionEventCount = 0;
        }
        this.todayStoryCount = 0;
        if (res.code == 0) {
          // 今天有无每日故事
          let storyItems = [...res.data.playUnits];
          if (storyItems.length > 0) {
            let isUseful = storyItems[0].fileId == "" || storyItems[0].imgStoreId == "";
            // 此条每日故事是不是，今天的
            if (!isUseful && new Date(storyItems[0].createTime).toDateString() === new Date().toDateString()) {
              console.log("=======回忆当天有一个");
              // item.fileId == "" || item.imgStoreId == ""
              this.todayStoryCount = 1;
              // 表情识别数量如果大于2个，不需要显示这1个每日故事
              if (this.todayFunnyMemoryEvents.length < 3){
                let item = storyItems[0];
                item.isStory = true;
                this.todayFunnyMemoryEvents.push(item);
              }
            }
          }
        }
        this.downloadImage();
      }).catch((err) => {
        this.todayStoryCount = 0;
        if (data && data.items.length > 0) {
          this.todayFunnyMemoryEvents = data.items.filter((item, index) => index < 3);
          // this.todayEmotionEventCount = this.todayFunnyMemoryEvents.length;
        } else {
          this.todayFunnyMemoryEvents = [];
        }
        console.log(`getDailyStoryList ${JSON.stringify(err)}`);
        LogUtil.logOnAll(TAG, `getDailyStoryList ${JSON.stringify(err)}`);
        this.downloadImage();
      });
    } catch (exception) {
      console.log("=======趣拍 error========",exception);
    }

  }

  async downloadImage() {
    // this.todayFunnyMemoryEvents.map((item) => {
    //   Service.miotcamera.getFileIdImage(item.imgStoreId.toString()).then((res) => {
    //     item.imgStoreUrl = res;
    //     this.forceUpdate();
    //   }).catch((err) => {
    //     console.log("downloadImage err=", JSON.stringify(err));
    //   });
    //   return item;
    // });
    for (let i = 0; i < this.todayFunnyMemoryEvents.length; ++i) {
      try {
        let item = this.todayFunnyMemoryEvents[i];
        item.imgStoreUrl = await Service.miotcamera.getFileIdImage(item.imgStoreId.toString());
        this.forceUpdate();
      } catch (err) {
        console.log("getThumb", err);
        LogUtil.logOnAll(TAG, `downloadImag()${JSON.stringify(err)}`);
      }
    }
    this.setState({});
  }
  _loadWaterMarkInfoFromCache() {
    // if (!VersionUtil.judgeIsV1(Device.model)) {
    //   return;
    // }
    StorageKeys.IS_WATERMARK_OPEN.then((res) => {
      if (res === "" || res == null) {
        res = true;
        StorageKeys.IS_WATERMARK_OPEN = true;
      }
      this.setState({
        isWatermarkEnable: res
      });
    }).catch(() => {
      this.setState({
        isWatermarkEnable: false
      });
    });
  }

  componentDidMount() {
    this.checkIsInternationalServer();
    // StorageKeys.IS_PINCODE_SETTING_FORCE = true;

    if (this.isLocalMode) {
      this.setState({ showPlayToolBar: false, isRecording: false, isCalling: false, showLoadingView: false, showPauseView: false, showPoweroffView: false, showErrorView: true, errTextString: LocalizedStrings[''] });
      // return;
    }
    if (this.fromOneKeyCall) {
      this.onPrivacyAuthed();
    } else {
      // this.checkPrivacyDialog();
      this.onPrivacyAuthed();
    }
    Dimensions.addEventListener('change', this.dimensionListener);
    Service.smarthome.reportLog(Device.model, "com.xiaomi.cardcamera begin to init; rn package version: 28 ");

    Host.ui.keepScreenNotLock(true);

    this.restoreOri(3);

    this.isVip = false;
    this.mVipStatus = 2;

    this.isPowerOn = null;
    this.isInWindow = false;
    CameraPlayer.getInstance().bindOneKeyCallReceived(this._receivedOneKeyCall.bind(this));
    CameraPlayer.getInstance().bindConnectionCallback(this._connectionHandler);// 连接
    CameraPlayer.getInstance().bindP2pCommandCallback(this._p2pCommandHandler);// p2p连接
    CameraPlayer.getInstance().bindNetworkInfoCallback(this._networkChangeHandler);
    CameraPlayer.getInstance().bindPauseAllCallback(() => { this._stopAll(false, false)});
    CameraPlayer.getInstance().bindPowerOffCallback(this._powerOffHandler);
    CameraPlayer.getInstance().bindScreenIsCallCallback(this._screenIsCallIPC);
    CameraPlayer.getInstance().bindLocalModeCallback(this._localModeChange);
    this.add_often_look_position = DeviceEventEmitter.addListener('ADD_OFTEN_LOOK_POSITION', (msg) => {
      this._showDirectionViewAnimated(true);
      if (!this.state.showPanoView) this._toggleSwitch();
    });
    this.goBackSubScription = DeviceEventEmitter.addListener('goBack', (message) => {
      console.log("test will focus");
      this.sdCardabnormal();// sd卡异常监测
      if (Platform.OS == "ios" && !this.isPluginForeGround) { // 如果是ios，插件跳到了原生页面，同时调用到了popToTop，package.willDisappear和didFocus都会被调用到，原来的逻辑就有问题。
        this.isPageForeGround = true;
        return;
      }
      console.log("landingpush 2", isStartUpPush());
      if (Platform.OS == "ios" && isStartUpPush() && !Host.isPad) { // ios pad 不退出插件，避免从push点过来，跳到原生播放页，原生播放页是小画面。
        Package.exit();
        return;
      }
      this.isPageForeGround = true;
      this.isPluginForeGround = true;
      this.isAppForeround = true;
      console.log('testaaa', 'didFocusListener', 'page: ', this.isPageForeGround, ' plugin: ', this.isPluginForeGround);
      Host.setPadScrollDealStrategy({ strategy: PAD_SCROLL_STRATEGY.ALWAYS_PLUGIN_DEAL });
      this.getRuntimeMode();
      this._onResume();
    });
    this.bpsListener = DeviceEventEmitter.addListener(kBpsDataReceiveCallbackName, ({ data }) => {
      if (!this.props.navigation.isFocused()) {
        return;
      }
      if (!this.isPageForeGround) {
        return;// 直播页不在前面就不展示
      }
      if (!this.isAppForeround) {
        return;
      }
      if (!this.isPluginForeGround) {
        return;
      }

      if (data > 0 && (this.state.showDefaultBgView || this.state.showLoadingView)) {
        this.hideBgBpsCount += 1;
        if (this.hideBgBpsCount >= 8) {
          this.setState({ showDefaultBgView: false, whiteTitleBg: false, showLoadingView: false });
        }
      }
      this.setState({ bps: data });
    });
    this.recordListener = DeviceEventEmitter.addListener(kRecordTimeCallbackName, (data) => {
      if (!this.props.navigation.isFocused()) {
        return;
      }
      if (!this.isPageForeGround || data == null) {
        return;
      }
      let time = Number.parseInt(data.recordTime);
      this.setState({ recordTimeSeconds: time });
      console.log(data);// 录制时长。
    });

    this.frameQualityListener = DeviceEventEmitter.addListener(KFirstFrameOverExposedResultCallBackName, (data) => {
      LogUtil.logOnAll(TAG, "receive over exposed event", data);
      if (!this.props.navigation.isFocused()) {
        LogUtil.logOnAll("frameQualityListener isFocused = false");
        return;
      }
      // result=1 过度曝光 2 图片非常黑 无有效信息  3 图片像灰度图 4 正常
      let result = Number.parseInt(data.result);
      this.setState({ isOverExposed: result == "1" ? true : false });
      if (CameraConfig.isNewChuangmi(Device.model)) {
        LogUtil.logOnAll(`AlarmUtil.status_ejected=${ AlarmUtil.status_ejected }`);
        if (AlarmUtil.status_ejected != -1) {
          this._getTargetPush(AlarmUtil.status_ejected == 1);
        } else {
          AlarmUtilV2.getSD_STATUS_EJECTED().then((result) => {
            LogUtil.logOnAll("getSD_STATUS_EJECTED by frameQualityListener=", JSON.stringify(result));
            if (result.length > 0 && result[0].code == 0) {
              AlarmUtil.status_ejected = result[0].value ? 0 : 1;
              this._getTargetPush(!result[0].value);
            } else {
              this._getTargetPush(true);
            }
          }).catch((err) => {
            LogUtil.logOnAll("getSD_STATUS_EJECTED by frameQualityListener err =", JSON.stringify(err));
            this._getTargetPush(true);
          });
        }
      }
    });

    Service.miotcamera.bindBPSReceiveCallback(kBpsDataReceiveCallbackName);

    // this.restoreOri();
    Orientation.addOrientationListener(this._orientationListener);

    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", this.onBackHandler);
    }

    StorageKeys.LIVE_VIDEO_RESOLUTION.
      then((result) => {
        if (typeof (result) == "string" || result == null || result == undefined) {
          if (Device.model == CameraConfig.Model_chuangmi_069a01) {
            StorageKeys.LIVE_VIDEO_RESOLUTION = 3;// 设置默认sp
            result = 3;
          } else {
            StorageKeys.LIVE_VIDEO_RESOLUTION = 0;// 设置默认sp
            result = 0;
          }
        }
        this.videoQualityFetched = true;
        if (CameraPlayer.getInstance().isConnected()) { // sp缓存取回的时候，如果已经连接，就发送video-quality
          this._changeResolution(result);
        }
        this._setIndexOfResolution(result);
        this.setState({ resolution: result });
      })
      .catch((err) => {
        console.log(err);
        this.videoQualityFetched = true;
        let result = 0;
        if (Device.model == CameraConfig.Model_chuangmi_069a01) {
          result = 3;
        }
        this._setIndexOfResolution(result);
        this.setState({ resolution: result });
      });
    setTimeout(() => {
      this.loadLocalSetttings();
    }, 500);// 延迟执行。

    if (this.isPtz) {
      this.bindRdtListener();
    }

    this.language = Host.locale.language || "en";
    let isNoneChinaLand = this.language != "zh" && this.language != "zh_tw" && this.language != "zh_hk";
    this.setState({ isNoneChinaLand: isNoneChinaLand, isZH: this.language == 'zh' });
    AlbumHelper.fetchDeviceAlbumName();
    // AlbumHelper.checkStoragePermission();

    this._loadMonitoringDetailTimer = setTimeout(() => {
      this._getKanjiaSetting();
      this._getFunnyMemorySetting();
      this.loadMonitoringDetail_rn('didmount');
    }, 1000);

    this.bannerItem = null;
    this.bannerImg = null;
    this.targetpushItem = null;


    this.isReadonlyShared = Device.isReadonlyShared;

    let version = Device.lastVersion;
    let verNumber = VersionUtil.calculateVersionValue(version);
    this.panoParam = CameraConfig.getPanoramaParam(Device.model, verNumber);

    if (VersionUtil.isFirmwareSupportColloctPrivacyLog(Device.model)) {
      this.startCheckLogTimer = setTimeout(() => {
        this.startCheckLog();
      }, 2000);// 延迟rpc，避免跟其他rpc一起打架
    }

    TrackUtil.reportClickEvent("Camera_Connect_Num");// Camera_Connect_Num 直播页访问人数/次数

    //查看共享设备
    console.log(Device.permitLevel, Device.model, 'permitLevel')
    //16是自己的
    //4是被分享的
    //36是仅可查看
    //用本地存储 记得判断是021 029



    this._fetchVipStatus();

    let colorScheme = DarkMode.getColorScheme();

    if (colorScheme == 'dark') {
      this.setState({ darkMode: true });
    } else {
      this.setState({ darkMode: false });
    }

    StorageKeys.NEED_SHOW_PRE_POSITION_DIALOG.then((res) => {
      console.log("NEED_SHOW_PRE_POSITION_DIALOG res:", res);
      if (!res) {
        this.setState({ showPostionLetter: true });
        StorageKeys.NEED_SHOW_PRE_POSITION_DIALOG = true;
      }
    }).catch((err) => {
      console.log("NEED_SHOW_PRE_POSITION_DIALOG err:", err);
    });
    LogUtil.logOnAll("----=-=-=-=-=-=-=-=-=", JSON.stringify(Package.entryInfo));
    // Package.entryInfo={"open_plugin_api_std_try_check":"1650024897435","open_plugin_cached":"true","open_plugin_api_get_available_cost":"1","process_reuse_enter_type":"0","open_plugin_api_plugin_ready":"1650024897437","core_ready_to_plugin_cache_ready_cost":"0","open_plugin_click_start_time":"1650024897434","open_plugin_api_send_message_internal":"1650024897437","open_plugin_plugin_process_open_activity":"1650024897453","openTime":"1650024897457","extra_click_device_time":"1650024897457","ensure_service_success_to_ensure_service_main_thread_cost":"0","open_plugin_plugin_process_load_rn":"1650024897453","did":"1070202740","package_msgType":"2","time":"1650024897","type":"ScenePush","event":"12.1","open_plugin_downloaded":"true","extra":"[]","model":"chuangmi.camera.051a01","work_thread_to_ensure_service_start_cost":"2","plugin_cache_ready_to_work_thread_cost":"0","rev_message_to_core_ready_cost":"1","open_plugin_plugin_process_rev_message":"1650024897449","open_plugin_api_sdk_check_background":"false","isNotified":"false","ensure_service_start_to_ensure_service_success_cost":"0","open_plugin_plugin_process_init_rn_device_start":"1650024897457","open_plugin_plugin_process_init_rn_device":"true","open_plugin_api_send_message_type":"11","open_plugin_main_process_send_message_inner":"1650024897446","open_plugin_main_process_send_message_proxy":"1650024897446","pageParams":"{}"}
    // if (VersionUtil.Model_chuangmi_051a01 == Device.model) {
    //   if (Package.entryInfo.type == "ScenePush" && Package.entryInfo.event == CameraPlayer.oneKeyCallEvent_051a01) {
    //     LogUtil.logOnAll("----=-=-=-=-=-=-=-=-= received onekeycall ");
    //     AlarmUtil.getOneKeyCallStatus().then((res) => {
    //       LogUtil.logOnAll("received onekeycall res=", JSON.stringify(res));
    //       if (res[0].value == 1) {
    //         LogUtil.logOnAll("received onekeycall 111");
    //         this._showOneKeyCallDialog();
    //       } else if (res[0].value == 2) {
    //         Toast._showToast(LocalizedStrings["one_key_call_talking"]);
    //       } else {
    //         Toast._showToast(LocalizedStrings["one_key_call_talkend"]);
    //       }
    //     }).catch((err) => {
    //       LogUtil.logOnAll("received onekeycall err=", JSON.stringify(err));
    //     });
    //   }
    // }
    // CameraPlayer.getInstance().receivedOneKeyCall();
    AlarmUtil.loadAutomaticScenes(Device.deviceID).then(() => {
      console.log("LiveVideoPageV2 loadAutomaticScenes res==", AlarmUtil.sceneSize);
    }).catch((err) => {
      console.log("LiveVideoPageV2 loadAutomaticScenes err==", JSON.stringify(err));
    });
    AlarmUtil.status_ejected = -1;
    AlarmUtilV2.getHideAlarmSetting();
    AlarmUtilV2.checkPushNotice();
  }

  _showOneKeyCallDialog() {
    // this.setState({ showOneKeyCallDialog: true });
    // this.oneKeyCallTimer && clearInterval(this.oneKeyCallTimer);
    // this.oneKeyCallTimer = setInterval(this._getOneKeyCallStatus.bind(this), 5000);
  }

  _getCruiseState() {
    if (!CameraPlayer.getInstance().isConnected()) return;

    Service.miotcamera.sendP2PCommandToDevice(MISSCommand.MISS_CMD_CRUISE_STATE_REQ, {}).then((result) => {
      console.log("send _getCruiseState cmd", JSON.stringify(result));
    }).catch((error) => {
      console.log("send _getCruiseState cmd err", JSON.stringify(error));
    });
  }

  _getOneKeyCallStatus() {
    // AlarmUtil.getOneKeyCallStatus().then((res) => {
    //   LogUtil.logOnAll("getOneKeyCallStatus res=", JSON.stringify(res));
    //   if (res[0].value != 1) {
    //     LogUtil.logOnAll("getOneKeyCallStatus clearInterval");
    //     this.oneKeyCallTimer && clearInterval(this.oneKeyCallTimer);
    //     this.setState({ showOneKeyCallDialog: false });
    //     if (res[0].value == 2) {
    //       Toast._showToast(LocalizedStrings["one_key_call_talking"]);
    //     } else {
    //       Toast._showToast(LocalizedStrings["one_key_call_talkend"]);
    //     }
    //   }
    // }).catch((err) => {
    //   LogUtil.logOnAll("getOneKeyCallStatus err=", JSON.stringify(err));
    // });
  }
  _getOneKeyCallStatusWithoutToast() {
    AlarmUtil.getOneKeyCallStatus().then((res) => {
      LogUtil.logOnAll("_getOneKeyCallStatusWithoutToast res=", JSON.stringify(res));
      if (res[0].value != 1) {
        LogUtil.logOnAll("_getOneKeyCallStatusWithoutToast showOneKeyCallDialog: false");
        this.setState({ showOneKeyCallDialog: false });
      }
    }).catch((err) => {
      LogUtil.logOnAll("_getOneKeyCallStatusWithoutToast err=", JSON.stringify(err));
    });
  }

  _receivedOneKeyCall() {
    this.fromOneKeyCall = this.props.navigation.getParam("fromOneKeyCall");
    this.startCallFlag = this.props.navigation.getParam("startCallFlag");
    LogUtil.logOnAll("_receivedOneKeyCall packageReceivedInformation6666", "startCallFlag=", this.startCallFlag);
    if (!CameraPlayer.getInstance().isConnected()) {
      LogUtil.logOnAll("_receivedOneKeyCall talk_for_push_connecting");
      // Toast.fail('talk_for_push_connecting');
      return;
    }
    // LogUtil.logOnAll(" one key call startCall ");
    // this._startCall();
    AlbumHelper.getCachedImage()
      .then((result) => {
        let bgImgUri = `file://${ Host.file.storageBasePath }/${ result }`;
        this.setState({ bgImgUri: bgImgUri });
      });
  }

  _showVisitInfo() {
    console.log('共享设备才会弹窗')
    StorageKeys.IS_VISIT_PUSH_SHOWN
      .then((res) => {
        if (typeof (res) === "string" || res == null) {
          this.setState({
            isVisitShow: true
          });
          StorageKeys.IS_VISIT_PUSH_SHOWN = true;
          console.log('没有显示过弹窗', res);
        } else {
          console.log('已经显示过弹窗', res);
          this.setState({
            isVisitShow: false
          });
        }

      })
      .catch((err) => {
        // isVisitShow = false
        console.log('显示弹窗出错了', err);
      });
  }

  _bindPinCodeSwitchChangedEvent() {
    this.pinCodeSwitchChangedListener = DeviceEvent.pinCodeSwitchChanged.addListener((device, result) => {
      LogUtil.logOnAll("PincodeUtil", "pinCodeSwitchChanged" + JSON.stringify(result));
      this.isPinCodeSet = result.isSetPinCode;// 密码发生了改变，通知到插件，插件里暂存；
      if (this.isPinCodeSet) {
        if (this.isKrServer) {
          PinCodeUtil.setPincodeSet();
        } else {
          StorageKeys.IS_PINCODE_SETTING_FORCE = true;
        }
      }
    });
  }

  _clearTimer(timer) {
    if (timer) {
      clearTimeout(timer);
    }
  }

  componentWillUnmount() {
    this.oneKeyCallTimer && clearInterval(this.oneKeyCallTimer);
    this.cruiseTimer && clearTimeout(this.cruiseTimer);
    try {
      this._stopAll(false, false);
    } catch (exception) {

    }
    this.privacySDKUtil.destroyPrivacyListener();
    clearTimeout(this.callTimeout);
    removeDarkListener();
    this.destroyed = true;
    OfflineHelper.resetLastOfflineTime();
    this._clearTimer(this.angleViewTimeout);
    clearInterval(this.logInterval);
    this._clearTimer(this.mFirmwareUpdatingTimer);
    this._clearTimer(this._loadMonitoringDetailTimer);
    this._clearTimer(this.startCheckLogTimer);
    this._clearTimer(this.showNetworkDisconnectTimeout);
    this._clearTimer(this.reconnectTimeout);
    this._clearTimer(this.showPlayToolBarTimer);
    this._clearTimer(this.longPressTimer);
    this._clearTimer(this.angleViewTimeout);
    this._clearTimer(this.mRpcCallTimer);
    this._clearTimer(this.mGetRotationTimer);
    this._clearTimer(this.longPressTimer);
    this._clearTimer(this.mSetAudioBtnStateTimer);
    this._clearTimer(this.snapshotTimeout);
    this._clearTimer(this.mRecordOkTimer);
    this.localModeDelayTimeout && clearTimeout(this.localModeDelayTimeout);
    Dimensions.removeEventListener('change', this.dimensionListener);
    if (this.isFirstFrameReceived || !Host.isAndroid) {
      StorageKeys.VIDEO_SCALE = this.videoPortraitScale;
    }

    this.toPortrait(3);
    if (Platform.OS === "android") {
      BackHandler.removeEventListener("hardwareBackPress", this.onBackHandler);
    }
    this.wllStopListener && this.wllStopListener.remove();
    Host.ui.keepScreenNotLock(true);
    this.didFocusListener && this.didFocusListener.remove();
    this.didBlurListener && this.didBlurListener.remove();
    this.willBlurListener && this.willBlurListener.remove();
    this.didResumeListener && this.didResumeListener.remove();
    this.willPauseListener && this.willPauseListener.remove();
    this.bpsListener && this.bpsListener.remove();
    if (this.willAppearListener) {
      this.willAppearListener.remove();
    }
    if (this.willDisappearListener) {
      this.willDisappearListener.remove();
    }
    this.recordListener && this.recordListener.remove();
    LogUtil.logOnAll("CameraPlayer.getInstance().bindOneKeyCallReceived(null) by componentWillUnmount");
    CameraPlayer.getInstance().bindOneKeyCallReceived(null);
    this.frameQualityListener && this.frameQualityListener.remove();
    CameraPlayer.getInstance().bindConnectionCallback(null);
    CameraPlayer.getInstance().bindP2pCommandCallback(null);
    CameraPlayer.getInstance().bindPowerOffCallback(null);
    CameraPlayer.getInstance().bindNetworkInfoCallback(null);
    CameraPlayer.getInstance().bindScreenIsCallCallback(null);
    CameraPlayer.getInstance().bindLocalModeCallback(null);

    Orientation.removeOrientationListener(this._orientationListener);
    this.delayWorkTimeout && clearTimeout(this.delayWorkTimeout);
    this.waterDelay && clearTimeout(this.waterDelay);
    this.logDelay && clearTimeout(this.logDelay);
    this.delayGetPreSetPosition && clearTimeout(this.delayGetPreSetPosition);
    this.delayUpdatePreSetImg && clearTimeout(this.delayUpdatePreSetImg);
    if (this.rdtListener) {
      this.rdtListener.remove();
      this.rdtListener = null;
    }
    TrackConnectionHelper.report();
    this.add_often_look_position && this.add_often_look_position.remove();
    DldMgr.clear(); // 退出的时候相关实例也都需要清空！！！
    DldMgr.removeLdrs(SdcardEventLoader.getInstance());
    SdcardEventLoader.destroyInstance();// 退出插件后  p2p就断开了，sdcard相关的监听都不需要存在。
    CameraPlayer.destroyInstance();
    // destroy的步骤尽量不要混乱，dldMgr持有sdcardEventLoader，SdcardEventLoader持有CameraPlayer，尽量一个一个按顺序的处理
    this.setState = () => false;
  }


  dimensionListener = (args) => {
    if (!this?.props?.navigation?.isFocused()) {
      return;
    }
    if (Platform.OS === "ios") {
      if (args && args.screen && args.window) {
        if (args.screen.width !== args.window.width || args.screen.height !== args.window.height) {
          setTimeout(() => Dimensions.set({ 'window': args.screen }), 10);
          Service.smarthome.reportLog(Device.model, `dimensionListener fullscreen? ${ this.state.fullScreen  }`);
          console.log('纠正========');
        }
      }
    }
  }

  _createPanResponder() {

    this._touchStartPageY = 0;
    this._touchStartCtrHeight = 0;
    this._controlViewHeight = this.state.showDirectCtr ? fixControlBarHeight + this._getDirectionContainerHeight() : fixControlBarHeight;
    this.state.controlViewHeight.addListener(({ value }) => this._controlViewHeight = value);

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true, // 刚开始的时候
      onMoveShouldSetPanResponder: () => true,
      onShouldBlockNativeResponder: () => false,
      onPanResponderTerminationRequest: () => false, // 不允许其他人抢占。
      onPanResponderGrant: (evt) => {
        // this.setState({ showDirectCtr: true });
      },

      onPanResponderMove: (evt) => {
        let y = evt.nativeEvent.locationY;
        let pageY = evt.nativeEvent.pageY;
        // if (this._touchStartPageY == 0 && y < (fixControlBarHeight - 20)) {
        //   return;
        // }

        if (this._touchStartPageY == 0) {
          this._touchStartPageY = pageY;
          this._touchStartCtrHeight = this._controlViewHeight;
        }

        let delta = pageY - this._touchStartPageY;
        let newHeight = this._touchStartCtrHeight + delta;

        if (newHeight > fixControlBarHeight + this._getDirectionContainerHeight()) {
          newHeight = fixControlBarHeight + this._getDirectionContainerHeight();
        }

        if (newHeight < fixControlBarHeight) {
          newHeight = fixControlBarHeight;
        }

        let newAlpha = (newHeight - fixControlBarHeight) / this._getDirectionContainerHeight();
        newAlpha = newAlpha * 0.5;

        this.state.controlViewHeight.setValue(newHeight);
        this.state.optionCoverAlpha.setValue(newAlpha);
      },

      onPanResponderRelease: () => {
        this._touchStartPageY = 0;
        let shouldShow = this._controlViewHeight >= fixControlBarHeight + this._getDirectionContainerHeight() / 2 ? true : false;
        this._showDirectionViewAnimated(shouldShow);
      },

      onPanResponderTerminate: () => { }
    });
  }

  _createScalePanResponder() {
    this._panStart = false;
    this._panStartLen = 1;
    this._panCurLen = 1;
    this.scalePanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        return true;
      },
      onMoveShouldSetPanResponder: () => true,
      onShouldBlockNativeResponder: () => false,
      onPanResponderTerminationRequest: () => false, // 不允许其他人抢占。
      onPanResponderGrant: (evt) => {
      },

      onPanResponderMove: (evt) => {
        if (evt && evt.nativeEvent && evt.nativeEvent.changedTouches) {
          if (evt.nativeEvent.changedTouches.length == 2) {
            let x1 = evt.nativeEvent.changedTouches[0].locationX;
            let y1 = evt.nativeEvent.changedTouches[0].locationX;
            let x2 = evt.nativeEvent.changedTouches[1].locationX;
            let y2 = evt.nativeEvent.changedTouches[1].locationX;
            let dx = Math.abs(x1 - x2);
            let dy = Math.abs(y1 - y2);
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (this._panStart == false) {
              this._panStart = true;
              this._panStartLen = dist;
            }
            this._panCurLen = dist;
            let videoHeightScale = this._panCurLen / this._panStartLen;
            if (videoHeightScale < 1) {
              videoHeightScale = 1;
              this._panStartLen = this._panStartLen;
            }
            this.setState({ videoHeightScale: videoHeightScale });
          } else {
            this._panStart = false;
            this._panStartLen = 1;
            this._panCurLen = 1;
          }
        }
      },

      onPanResponderRelease: () => {
        // this._touchStartPageY = 0;
        // let shouldShow = this._controlViewHeight >= fixControlBarHeight + this._getDirectionContainerHeight() / 2 ? true : false;
        // this._showDirectionViewAnimated(shouldShow);
      },

      onPanResponderTerminate: () => { }
    });
  }

  _setIndexOfResolution(resolution) {
    // if (Platform.OS == "ios") {
    let index = 0;
    switch (resolution) {
      case 1:
        index = 1;
        break;
      case 2:
        if (CameraConfig.suport2HigherResolution(Device.model)) {
          index = 1;
        } else {
          index = 2;
        }
        break;
      case 3:
        if (CameraConfig.suport3Resolution(Device.model)) {
          index = 3;
        } else {
          index = 2;
        }
        break;
      default:
        index = 0;
        break;
    }
    this.selectedIndexArray = [index];
    // }
  }

  _setStatusBarForNativeView() {
    // this.isPageForeGround = false;
    this.state.darkMode ? StatusBar.setBarStyle('light-content') : StatusBar.setBarStyle('dark-content');
  }

  _orientationListener = (orientation) => {
    if (!this.props.navigation.isFocused()) {
      return;
    }
    if (!this.isPageForeGround || !this.isPluginForeGround || !this.isAppForeround) {
      return;
    }
    LogUtil.logOnAll(TAG, `device orientation changed :${orientation} want ${this.mOri} current orientation: ${this.state.fullScreen}`);
    if ((Platform.OS == "ios" || (Host.isAndroid && Host.isPad)) && ((this.mOri === 'LANDSCAPE' && this.state.fullScreen) || (this.mOri === 'PORTRAIT' && !this.state.fullScreen))) {
      return;
    }
    if (this.mOri === orientation) {
      if (orientation === 'LANDSCAPE') { // 
        // do something with landscape layout
        let shouldChangeCallStatus = this.state.fullScreen == false;// 不是全屏，才会切换call状态
        // if (Host.isPad) {
        //   Service.miotcamera.enterFullscreenForPad(true);
        // }
        this.setState(() => { return { fullScreen: true } }, () => {
          // 切换到横屏了，判断是否是calling中，是的话，就先关后开 目的主要是处理竖屏切换横屏，动画不动的问题
          if (!shouldChangeCallStatus) {
            return;
          }
          this._restoreCallingIconAnimation();
        });
        
      } else {
        let shouldChangeCallStatus = this.state.fullScreen == true;// 是全屏，才会切换call状态
        // do something with portrait layout
        // if (Host.isPad) { // 直播页面也需要调用
        //   Service.miotcamera.enterFullscreenForPad(false);
        // }
        this.setState(() => { return { fullScreen: false } }, () => {
          if (!shouldChangeCallStatus) {
            return;
          }
          this._restoreCallingIconAnimation();
        });
      }
      
      this.setState({ isWhiteVideoBackground: orientation === "LANDSCAPE" ? false : true });
    } else {
      // ios need restore for next lock
      this.restoreOri(4);
    }
  };

  _restoreCallingIconAnimation() {
    if (this.state.isCalling) {
      this.setState(() => {
        return { isCalling: false };
      }, () => {
        this.setState({ isCalling: true });
      });
    }
  }

  _fetchFirmwareUpdateInfo() {
    Service.smarthome.getFirmwareUpdateInfo(Device.deviceID)
      .then((res) => {
        console.log("get firmware info: ", res);
        if (Device.isOwner) {
          this.setState({ showRedDot: res.needUpgrade });
        }
        if (res.upgrading && res.upgrading == true) {
          this.isFirmwareUpdating = true;
          this.setState({ showErrorView: true, errTextString: LocalizedStrings["firmware_updating_desc"] });
          this._clearTimer(this.mFirmwareUpdatingTimer);
          this.mFirmwareUpdatingTimer = setTimeout(() => {
            this._fetchFirmwareUpdateInfo();
          }, 5000);
        } else if (this.isFirmwareUpdating && res.upgrading == false) {
          this.isFirmwareUpdating = false;
          this.setState({ showErrorView: false });
          CameraConfig.checkNasVersion = true;
          this._onResume();
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ showRedDot: false });
      });
  }

  _powerOffHandler = (isPowerOn, popSleepDialog, shouldStartVideo = false) => {
    LogUtil.logOnAll("deviceReceivedMessages", "_powerOffHandler change:"+isPowerOn, " popSleepDialog:" + popSleepDialog," shouldStartVideo:" + shouldStartVideo);
    // 远端的下发的状态与本地的状态不一致 就回走到这里
    if (!isPowerOn) { // 变成了休眠
      this.isClickSleep = false;
      this.isPowerOn = false;
      this.sleepPower = new Date().getTime();

      CameraPlayer.getInstance().setPowerState(false);

      // this.cameraGLView.stopAudioPlay();//释放资源
      // Service.miotcamera.disconnectToDevice();//断开连接
      this._stopAll(this.state.showPauseView, false, false);
      this?.mHLottieVoiceButton?.switchDisplayState(MHLottieVoiceBtnDisplayState.NORMAL, true);
      this.setState(() => { return { isSleep: true, showPlayToolBar: true, showPoweroffView: true, showPanoView: false, showLoadingView: false, showPauseView: false ,showTargetPushView:false}}, () => {
        this.setState({
          panoViewStatus: 2
        });// 切换休眠唤醒的时候置为初始状态
      });
      this.cameraGLView?.stopRender();
      CameraPlayer.getInstance().stopVideoPlay();
      this._toggleAudio(true, false);

      if (!popSleepDialog) {
        return;
      }
      StorageKeys.SHOWN_SLEEP_DIALOG.
        then((result) => {
          if (typeof (result) != "boolean" || result === false || result == null) {
            this.sleepDialog.show();
            StorageKeys.SHOWN_SLEEP_DIALOG = true;
          }
        })
        .catch((err) => {
          this.sleepDialog.show();
          StorageKeys.SHOWN_SLEEP_DIALOG = true;
        });
    } else { // 唤醒了
      this.forceSleep = false;
      this.isClickSleep = false;
      // 休眠与唤醒时间指令下发特别靠近，直播无法正常渲染播放
      this.wakePower = new Date().getTime();
      this.setState({ isSleep: false, showPlayToolBar: true, showPoweroffView: false});
      Service.smarthome.reportLog(Device.model, "on wake up");
      this.isPowerOn = true;
      CameraPlayer.getInstance().setPowerState(true);
      if (shouldStartVideo) {
        this._refreshRemoteProps();
        this._toggleAudio(CameraConfig.getUnitMute());
        this.queryNetworkJob();
      }
    }
  }

  /**
   * @Author: byh
   * @Date: 2024/1/18
   * @explanation:
   * 看护屏在通话中，特殊情况下，状态无法检测到
   *********************************************************/
  _screenIsCallIPC = (value) => {
    console.log("看护屏通话、录制、截图状态改变-------", value,this.state.isCalling);
    if (value == 2 && this.state.isCalling) {
      let toastStr = LocalizedStrings['care_screen_is_calling'];
      Toast._showToast(toastStr);
      this.cancelCallTimeout && clearTimeout(this.cancelCallTimeout);
      this.cancelCallTimeout = setTimeout(() => {
        if (this.state.fullScreen) {
          this.mHLottieVoiceLandscapeButton && this.mHLottieVoiceLandscapeButton.switchDisplayState(MHLottieVoiceLandscapeBtnDisplayState.NORMAL, false);
        } else {
          this.mHLottieVoiceButton && this.mHLottieVoiceButton.switchDisplayState(MHLottieVoiceBtnDisplayState.NORMAL, false);
        }
      },750);

      this._stopCall();
    }
  }

  _localModeChange = (value) => {
    console.log("_localModeChange change",value);
    CameraPlayer.RUNTIME_LOCAL_MODE = value;
    this.isLocalMode = CameraPlayer.RUNTIME_LOCAL_MODE;
    if (this.isLocalMode) {
      this.setState({ showPlayToolBar: false, isRecording: false, isCalling: false, showLoadingView: false, showPauseView: false, showPoweroffView: false, showErrorView: true, errTextString: LocalizedStrings[''] });
    } else {
      // 联网模式，走重新连接过程
      this._getKanjiaSetting();
      this._getFunnyMemorySetting();
      this.loadMonitoringDetail_rn('resume');
      // 直接连接无法开启直播
      this.localModeDelayTimeout && clearTimeout(this.localModeDelayTimeout);
      this.localModeDelayTimeout = setTimeout(() => {
        this.queryNetworkJob();
      }, 500);
    }

  }

  loadLocalSetttings() {

    StorageKeys.IS_VIP_STATUS.then((res) => {
      if (typeof (res) === "string" || res == "" || res == null) {
        res = false;
        StorageKeys.IS_VIP_STATUS = false;
      }
      this.isVip = res;
      CameraConfig.isVip = res;
    })
      .catch((err) => {
        StorageKeys.IS_VIP_STATUS = false;
      });

    StorageKeys.IS_LENS_DISTORTION_CORREECTION.then((res) => { // 是否使用畸变纠正
      if (typeof (res) === "string" || res == null) {
        if (CameraConfig.isXiaomiCamera(Device.model) && !CameraConfig.Model_chuangmi_051a01 == Device.model) {
          res = false;// 默认禁用畸变纠正
          StorageKeys.IS_LENS_DISTORTION_CORREECTION = false;
        } else {
          res = true;// 默认启用畸变纠正
          StorageKeys.IS_LENS_DISTORTION_CORREECTION = true;
        }

      }
      this.setState({ useLenCorrent: res });
    }).catch((error) => {
      console.log(error);
      this.setState({ useLenCorrent: true });
    });
    StorageKeys.IS_PTZ_ROTATION_ENABLE.then((res) => { // 云台手势转动是否开启
      if (res == null || typeof (res) != 'boolean') {
        res = true;// 默认启用云台手势转动是否开启
        StorageKeys.IS_PTZ_ROTATION_ENABLE = true;
      }
      this.enablePtzRotation = res;
    }).catch((error) => {
      console.log(error);
      this.enablePtzRotation = true;
    });

    if (CameraConfig.isPTZCamera(Device.model)) {
      StorageKeys.IS_SHOW_DIRECTION_VIEW.then((res) => { // 是否显示方向盘
        if (res === true || res === '' || res === null) { // 当第一次进入res还没有值,ios和安卓表现形式不一样 ios是null 安卓是''
          this._showDirectionViewAnimated(true);
        }
      }).catch((error) => {
        StorageKeys.IS_SHOW_DIRECTION_VIEW = false;
      });
    }

    // StorageKeys.IS_SHOW_SDCARD_PAGE.then((res) => {
    //   if (res === "" || res == null) {
    //     StorageKeys.IS_SHOW_SDCARD_PAGE = false;
    //     res = false;
    //   }
    //   this.showSdcardPage = res;
    // });

    StorageKeys.IS_IMAGE_FLIP.then((isFlipOn) => {
      StorageKeys.IMAGE_ROTATION.then((imgRotation) => {
        this.setState({
          isFlip: isFlipOn,
          rotation: imgRotation
        });
      });
    }).catch((err) => {
      console.log(err);
    });

    StorageKeys.IS_AI_FRAME_OPEN.then((res) => {
      if (res === true) {
        this.setState({ enableAIFrame: true });
      } else {
        this.setState({ enableAIFrame: false });
      }
    });

    this._fetchFirmwareUpdateInfo();
  }

  checkIsInternationalServer() {
    Service.getServerName().then((server) => {
      CameraConfig.setIsIndiaServer(false); // 重置
      CameraConfig.setIsInternationalServer(true); // 重置

      let countryCode = server.countryCode;// countryCode是大写
      let serverCode = server.serverCode;
      CameraConfig.updateCloudSupportCountry(serverCode.toUpperCase());
      const cloudServer = ['us', 'de', 'sg'];
      if (serverCode.toLowerCase() == "cn" || GermanCluster.includes(serverCode.toUpperCase()) || cloudServer.includes(serverCode)) {
        CameraConfig.setSupportCloudCountry(true);
      }
      if (countryCode.toLowerCase() === "cn") {

        this.setState({ isInternationServer: false });
        CameraConfig.setIsInternationalServer(false);
        let language = Host.locale.language || "en";
        if (language == "zh" && !Device.isReadonlyShared) {
          this._getOperationBanner();
        }
        if (Device.isOwner) {
          this._getCloudBanner();
        }
        return;
      }
      this.isCloudServer = cloudServer.includes(serverCode);
      CameraConfig.setIsCloudServer(serverCode);// 该服务是否有海外云存功能
      // 如果是欧洲服务器
      this.isEuropeServer = CameraConfig.getIsEuropeServer();
      this.setState({ isInternationServer: true });
      CameraConfig.setIsInternationalServer(true);
      if (countryCode.toLowerCase() == "in") {
        CameraConfig.setIsIndiaServer(true);
      } else {
        CameraConfig.setIsIndiaServer(false);
      }

      this._getSecurityCodePush();

    }).catch((err) => { // 
      console.log(err);
      this.setState({ isInternationServer: true });
      CameraConfig.setIsInternationalServer(true);
    });
  }

  checkPrivacyDialog() {
    // if (Device.model == CameraConfig.Model_chuangmi_021) {
    this.checkPrivacyDialogLocal();
    // } else {
    //   this.checkPrivacyOnline();
    // }
  }

  checkPrivacyDialogLocal() {
    //因为只会执行一次，所以如果是新设备绑定进来的，就当做没有
    TrackConnectionHelper.onPrivacyBeginCheck();
    this.globalLoadingTimeout = setTimeout(() => {
      this.setState({ showGlobalLoading: true });
    }, 500);
    this.privacySDKUtil.bindPrivacyCallback(this);
    this.privacySDKUtil.checkNeedPopPrivacyDialog();
  }


  userExpPlanPopupCallBack(state) {
    LogUtil.logOnAll("userExpPlanPopupCallBack-=-=======", state);
    if (state) {
      this._refreshRemoteProps();
    }
  }

  progressPrivacyAuthed() {
    // 在这里重新刷一遍吧。。。
    Service.getServerName()
      .then((server) => {
        let countryCode = server.countryCode;// countryCode是大写
        let serverCode = server.serverCode;
        LogUtil.logOnAll("initPage getServerName:" + JSON.stringify(countryCode), " this.privacyDialogPoped=", this.privacyDialogPoped);
        if (countryCode.toLowerCase() === "cn") {
          CameraConfig.setIsInternationalServer(false);
          this.needCheckUserExp = true;
        }

        if (this.privacyDialogPoped && this.needCheckUserExp) { // 大陆 && 隐私弹框出现了 代表会有用户体验计划出现，再等等。
          return;
        }
        this._refreshRemoteProps();
      }).catch((err) =>{
        LogUtil.logOnAll("progressPrivacyAuthed getServerName err=", JSON.stringify(err));
        this.needCheckUserExp = false;
        this._refreshRemoteProps();
      });

  }

  // 授权了 进行后面的步骤
  onPrivacyAuthed() {
    Service.smarthome.reportLog(Device.model, "camera device auth success, start to connect");
    this.progressPrivacyAuthed();
    LogUtil.logOnAll("privacy authed");
    TrackConnectionHelper.onPrivacyEndCheck();
    clearTimeout(this.globalLoadingTimeout);
    this.setState({ showGlobalLoading: false });
    this.showLoadingView();
    this.queryPowerOffProperty();// 查询 remote的网络状态。
    Service.smarthome.reportLog(Device.model, "authed, go connect");
    this.isPrivacyAuthed = true;
    this.queryNetworkJob();// 这里开始连接摄像头。
    //授权通过后，开始处理韩国强制密码功能
    // PinCodeUtil.queryShouldPopPinCodeSeting()
    //   .then((result) => {
    //     LogUtil.logOnAll("PincodeUtil", "should pop privacy dialog???:" + result);
    //
    //     if (result) { // 需要处理韩国强制密码需求
    //       this.isOnRequestingPincode = true;
    //       Host.ui.openSecuritySetting();// 打开页面
    //       this._bindPinCodeSwitchChangedEvent();
    //     } else {
    //       // 不需要处理韩国强制密码需求
    //       // this.checkPrivacyDialog();
    //       // checkPrivacyDialog 刚进来就执行。
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err, err.stack);
    //     // this.checkPrivacyDialog();// 请求出错，就当做没毛病吧
    //   });
    // 信号增强弹框
    this.lanConfigSetting();
    this.securitySetting();
    SpecUtil.queryWatermark()
      .then((res) => {
        this.setState({ isWatermarkEnable: res });
      })

    this.getAISwitch();
  }

  /**
   * @Author: byh
   * @Date: 2024/8/7
   * @explanation:
   * 获取AI功能开关
   * AI功能看家互斥逻辑
   *********************************************************/
  getAISwitch() {
    if (!VersionUtil.supportCoveredFaceAndWakeup()) {
      // 不支持，下面就不处理了
      return;
    }
    if (Device.isReadonlyShared) {
      // 仅可查看 不再展示此互斥弹框
      return;
    }
    let params = [
      { "sname": SIID_AI_CUSTOM, "pname": PIID_PRIVATE_AREA_SWITCH },
      { "sname": SIID_FENCE_DETECTION, "pname": PIID_FENCE_SWITCH },
      { "sname": SIID_AI_DETECTION, "pname": PIID_PEOPLE_SWITCH },
      { "sname": SIID_AI_DETECTION, "pname": PIID_MOVE_SWITCH },
      { "sname": SIID_AI_CUSTOM, "pname": PIID_EXPRESSION_SWITCH },
      { "sname": SIID_AI_CUSTOM, "pname": PIID_MOUTH_NORSE_SWITCH },
      { "sname": SIID_AI_CUSTOM, "pname": PIID_ASLEEP_WAKEUP_SWITCH }
    ]

    AlarmUtilV2.getSpecPValue(params, 2, TAG).then((vo) => {
      if (vo[0]?.code == 0) {
        let privateSwitch = vo[0].value;
        let fenceSwitch = vo[1].value;
        let peopleSwitch = vo[2].value;
        let motionSwitch = vo[3].value;
        let expressionSwitch = vo[4].value;
        let mouthNorseSwitch = vo[5].value;
        let wakeupSwitch = vo[6].value;
        if (privateSwitch && (fenceSwitch || peopleSwitch || motionSwitch || expressionSwitch || mouthNorseSwitch || wakeupSwitch)) {
          this.setState({ showClosePrivateDialog: true });
        }
      } else {
        // 异常了就算了
      }
    }).catch(error => {
      Toast.fail('c_get_fail');
      this.setState({ progressing: false });
    });
  }

  lanConfigSetting() {
    if (Device.isReadonlyShared) {
      return;
    }
    // 不考虑固件版本，spec新版本添加无则获取失败
    let params = [{ sname: SIID_SCREEN_CONTROL, pname: PIID_SCREEN_LAN_POP }];
    AlarmUtilV2.getSpecPValue(params,2).then((res) => {
      console.log("lanConfigSetting success");
      if (res[0].code ==0) {
        let value = res[0].value;
        this.setState({ lanConfigDialog: value });
        if (value) {
          this.setLanPopIsDo();
        }
      }
    }).catch((error) => {
      console.log("lanConfigSetting error",error);
    });
  }

  setLanPopIsDo() {
    let params = [{ sname: SIID_SCREEN_CONTROL, pname: PIID_SCREEN_LAN_POP, value: false }];
    AlarmUtilV2.setSpecPValue(params).then((res) => {
      console.log("lanConfigSetting success");
    }).catch((error) => {
      console.log("lanConfigSetting error",error);
    });
  }

  securitySetting() {
    Service.getServerName().then((country) => {
      this.isKrServer = country.countryCode.toLocaleLowerCase() == "kr";
      if (this.isKrServer) {
        this.forcePinCodeSetting();
      } else {
        this.warningPinCodeSetting();
      }
    })
  }

  forcePinCodeSetting() {
    //授权通过后，开始处理韩国强制密码功能
    PinCodeUtil.queryShouldPopPinCodeSeting()
      .then((result) => {
        LogUtil.logOnAll("PincodeUtil", "should pop privacy dialog???:" + result);

        if (result) { // 需要处理韩国强制密码需求
          this.isOnRequestingPincode = true;
          Host.ui.openSecuritySetting();// 打开页面
          this._bindPinCodeSwitchChangedEvent();
        } else {
          // 不需要处理韩国强制密码需求
          // this.checkPrivacyDialog();
          // checkPrivacyDialog 刚进来就执行。
        }
      })
      .catch((err) => {
        console.log(err, err.stack);
        // this.checkPrivacyDialog();// 请求出错，就当做没毛病吧
      });
  }

  warningPinCodeSetting() {
    PinCodeUtil.queryShouldPopPinCodeSetingV2()
      .then((result) => {
        LogUtil.logOnAll("PincodeUtil", "should pop privacy warning:" + result);

        if (result) { // 需要处理韩国强制密码需求
          // 弹框提示
          this.setState({ showPinCodeWarningDialog: true });
        }
      })
      .catch((err) => {
        console.log(err, err.stack);
      });
  }
  // 授权拒绝了
  onPrivacyReject() {
    TrackConnectionHelper.onPrivacyEndCheck();
    TrackConnectionHelper.report();

    Package.exit();//授权拒绝了；
  }

  // 隐私弹框出现了，让loading 消失
  onPrivacyDialogPoped() {
    LogUtil.logOnAll("-=-=-=-=-=-=onPrivacyDialogPoped-=-=-=-=-=-=");
    this.privacyDialogPoped = true;
    clearTimeout(this.globalLoadingTimeout);
    this.setState({ showGlobalLoading: false });// 隐私对话框弹出来的时候应该隐藏全局的loading
  }

  // 从服务器是否授权状态拉取超时, loading消失，弹出退出对话框
  onPrivacyTimeout() {
    //这里又应该弹一个不可取消的对话框。 点确认 就退出插件。
    clearTimeout(this.globalLoadingTimeout);
    this.setState({ showGlobalLoading: false, showTimeoutDialog: true });
  }



  _onResume() {
    console.log(TAG, "_onResume");
    // if (this.isLocalMode) {
    //   this.setState({ showPlayToolBar: false, isRecording: false, isCalling: false, showLoadingView: false, showPauseView: false, showPoweroffView: false, showErrorView: true, errTextString: LocalizedStrings[''] });
    //   return;
    // }
    this._refreshRemoteProps(false);
    StorageKeys.LIVE_EVENT_TYPE_MODE.then((res) => {
      console.log("LIVE_EVENT_TYPE_MODE=", res);
      console.log("typeof (LIVE_EVENT_TYPE_MODE)=", typeof (res));
      if (typeof (res) == "string" || res == null) {
        this.event_type_mode = 2;
      } else {
        this.event_type_mode = res;
      }
      console.log("this.event_type_mode=", this.event_type_mode);
    });
    // this.fromOneKeyCall = this.props.navigation.getParam("fromOneKeyCall");
    // this.startCallFlag = this.props.navigation.getParam("startCallFlag");
    // LogUtil.logOnAll(TAG, `_onResume fromOneKeyCall=${ this.fromOneKeyCall } startCallFlag=${ this.startCallFlag }`);
    this.delayGetPreSetPosition = setTimeout(() => {
      this._getPreSetPosition();
    }, 1000);
    this.restoreOri(5);
    this.cruiseTimer && clearTimeout(this.cruiseTimer);
    this.cruiseTimer = setTimeout(this._getCruiseState, 2000);
    clearTimeout(this.delayPauseTimer);
    let colorScheme = DarkMode.getColorScheme();

    if (colorScheme == 'dark') {
      this.setState({ darkMode: true });
    } else {
      this.setState({ darkMode: false });
    }
    if (CameraConfig.isSupportAutoCruise(Device.model)) {
      AlarmUtil.getCruiseConfig().then((res) => {
        LogUtil.logOnAll("getCruiseConfig res=", JSON.stringify(res));
        // {"freq":"00:10","start_time":"00:00","end_time":"23:59","repeat":127,"mode":1,"position":"[1,2,3,4]"}
        this.rawData = JSON.parse(res[0].value);
      }).catch((err) => {
        this.rawData = { "freq": "00:10", "start_time": "10:00", "end_time": "08:59", "repeat": 127, "mode": 1, "position": "[1,2,3,4]" };
        LogUtil.logOnAll("getCruiseConfig err=", JSON.stringify(err));
      });
    }

    CameraPlayer.getInstance().bindOneKeyCallReceived(this._receivedOneKeyCall.bind(this));
    CameraPlayer.getInstance().bindConnectionCallback(this._connectionHandler);
    CameraPlayer.getInstance().bindP2pCommandCallback(this._p2pCommandHandler);
    CameraPlayer.getInstance().bindNetworkInfoCallback(this._networkChangeHandler);
    CameraPlayer.getInstance().bindPowerOffCallback(this._powerOffHandler);
    CameraPlayer.getInstance().bindPauseAllCallback(() => { this._stopAll(false, false)});
    CameraPlayer.getInstance().bindScreenIsCallCallback(this._screenIsCallIPC);
    CameraPlayer.getInstance().bindLocalModeCallback(this._localModeChange);

    // this._getOneKeyCallStatusWithoutToast();
    if (CameraConfig.isToUpdateVipStatue) {
      this._fetchVipStatus();
      CameraConfig.isToUpdateVipStatue = false;
    }
    this._loadWaterMarkInfoFromCache();
    this.enterLiveVideoTime = new Date().getTime();
    this._checkNasVersion();

    if (this.isFirstEnter) {
      return;// 刚进来的时候不请求connect  避免出现问题
    }
    if (!this.isPageForeGround) {
      return;
    }

    if (!this.isPluginForeGround) {
      return;
    }
    // 之前在render里设置的颜色，从设置里退回，如果摄像头处于关闭状态 render不会掉用。
    // StatusBar.setBarStyle('light-content');
    this.loadingRetryTimer = 0;
    if (this.loadingTooLongTimer) {
      clearTimeout(this.loadingTooLongTimer);
    }
    this.loadingTooLongTimer = setTimeout(() => {
      if (this.loadingRetryTimer != 0 && (new Date().getTime() - this.loadingRetryTimer) > 5000) {
        // ???这是什么逻辑
        Service.smarthome.reportLog(Device.model, "loadingTooLongTimer");
        this.queryNetworkJob();
        console.log("connect retry for loadingTooLongTimer");
      }
    }, 8000);

    this.loadLocalSetttings();


    // first query is power off or not
    let isPowerOn = CameraPlayer.getInstance().getPowerState();
    if (this.isPowerOn != isPowerOn) { // 去往其他页面的时候power off了
      this._powerOffHandler(isPowerOn, false, true);
      return;
    }


    if (!this.isPowerOn) { // 电源g关了  没有必要往下面走.
      return;
    }

    this._getKanjiaSetting();
    this._getFunnyMemorySetting();
    this.loadMonitoringDetail_rn('resume');


    setTimeout(() => {
      if (this.cameraGLView == null) {
        return;
      }

      Service.smarthome.reportLog(Device.model, "onresume, go connect");
      // 这里直接走连接的步骤吧  出现错误也会提示的
      this.queryNetworkJob();// 这里会处理是否连接成功之类的逻辑
      console.log("on resume");

    }, 500);

    this._toggleAudio(CameraConfig.getUnitMute());

    // 埋点 -- 云存运营曝光
    this.state.showCloudVipBuyTip ? TrackUtil.reportClickEvent("Camera_PopUp_CloudStorage_Show") : null;
  }

  getRuntimeMode() {
    let params = [{ "sname": SIID_LOCAL_MODE, "pname": PIID_LOCAL_MODE }]
    AlarmUtilV2.getSpecPValue(params,1).then((res) => {
      console.log("+++++++++++++++==============live",res);
      if (res[0].code == 0) {
        CameraPlayer.RUNTIME_LOCAL_MODE = res[0].value;
      }else {
        CameraPlayer.RUNTIME_LOCAL_MODE = false;
      }
      if (this.isLocalMode != CameraPlayer.RUNTIME_LOCAL_MODE) {
        // 不一致，有变更才刷新
        this.isLocalMode = CameraPlayer.RUNTIME_LOCAL_MODE;
        if (this.isLocalMode) {
          this.setState({ showPlayToolBar: false, isRecording: false, isCalling: false, showLoadingView: false, showPauseView: false, showPoweroffView: false, showErrorView: true, errTextString: LocalizedStrings[''] });
        }
        this.forceUpdate();
      }


    }).catch((error) => {
      console.log("+++++++++++++++==============error:",error);
      CameraPlayer.RUNTIME_LOCAL_MODE = false;
      this.isLocalMode = CameraPlayer.RUNTIME_LOCAL_MODE;
    });
  }

  _onPause() {
    this.cruiseTimer && clearTimeout(this.cruiseTimer);
    if (this.isOnRequestingPincode) {
      console.log("正在请求密码，不执行onpause。");
      return;
    }
    this._setStatusBarForNativeView();//把状态栏字体变成黑色，
    if (this.isFirstFrameReceived || !Host.isAndroid) {
      StorageKeys.VIDEO_SCALE = this.videoPortraitScale;
    }
    if (this.cameraGLView != null && !this.destroyed) {
      this.cameraGLView.stopRender();// stopRender
    }

    CameraPlayer.getInstance().bindConnectionCallback(null);
    CameraPlayer.getInstance().bindP2pCommandCallback(null);
    CameraPlayer.getInstance().bindPowerOffCallback(null);
    CameraPlayer.getInstance().bindPauseAllCallback(null);
    CameraPlayer.getInstance().bindNetworkInfoCallback(null);
    CameraPlayer.getInstance().bindScreenIsCallCallback(null);
    CameraPlayer.getInstance().bindLocalModeCallback(null);
    clearInterval(this.logInterval);


    // save state
    StorageKeys.IS_SHOW_DIRECTION_VIEW = this.state.showDirectCtr;

    if (this.showPlayToolBarTimer) {
      clearTimeout(this.showPlayToolBarTimer);
      this.showPlayToolBarTimer = null;
    }

    if (this.enterLiveVideoTime > 0) { // _onPause会被调多次
      let liveVideoTime = (new Date().getTime() - this.enterLiveVideoTime) / 1000;
      TrackUtil.reportResultEvent("Camera_Play_Time", "Time", liveVideoTime); // Camera_Play_Time
      this.enterLiveVideoTime = 0;
    }

    if (!this.isPowerOn) {
      return;
    }
    if (this.state.showErrorView) {
      return;
    }
    if (this.cameraGLView == null) {
      return;
    }

    if (Platform.OS === "android") {
      this.setState({ whiteTitleBg: true });
    }

    this._stopAll(this.state.showPauseView, false); // 要离开这个页面，停止设备发送音频，但不修改unitMute状态。

    if (this.loadingTooLongTimer) {
      clearTimeout(this.loadingTooLongTimer);
    }
  }


  _stopAll(showPauseView = false, setUnitMute = true, needSetPlayToolBar = true) {

    this._stopRecord();
    this._stopCall();
    this._toggleAudio(true, setUnitMute);
    CameraPlayer.getInstance().stopVideoPlay();
    if (this.cameraGLView != null && !this.destroyed) {
      this.cameraGLView.stopRender();// stopRender
    }
    this.hideBgBpsCount = 0;
    if (needSetPlayToolBar) {
      this.setState({ showPauseView: showPauseView, showLoadingView: false, showPlayToolBar: false });
    } else {
      this.setState({ showPauseView: showPauseView, showLoadingView: false });
    }
  }

  queryNetworkJob() {
    if (!this.props.navigation.isFocused()) {
      return;
    }
    if (!this.isPrivacyAuthed) {
      return;
    }
    if (this.isLocalMode) {
      // 本地模式，不去执行后续动作
      return;
    }
    Service.smarthome.reportLog(Device.model, "start query network");
    TrackConnectionHelper.onNetworkCheck();
    CameraPlayer.getInstance().queryShouldPauseOn4G()
      .then(({ state, pauseOnCellular }) => {
        Service.smarthome.reportLog(Device.model, "查询网络结果：当前网络类型" + state + " pauseOnCellular" + pauseOnCellular);
        if (state == "NONE" || state == "UNKNOWN") {
          this.currentNetworkState = 0;
          this.setState({ showErrorView: true });
          return;
        }
        TrackConnectionHelper.onNetworkChecked();
        if (state == "CELLULAR" && pauseOnCellular && !this.skipDataWarning) { // 普通网络 && 数据流量提醒
          Service.smarthome.reportLog(Device.model, "暂停连接");

          this.networkType = state;
          if (!this.state.showPauseView) { // 如果已经展示了pauseview  就没有必要再展示wifi no的提示了
            Toast.success("nowifi_pause", true);
          }
          this._stopAll(true);
          return;
        }
        this.showLoadingView();
        this.setState({ showPauseView: false });
        Service.smarthome.reportLog(Device.model, "start query network success:" + state);
        // 其他网络条件 走连接的步骤吧
        this._startConnect();// 开始连接
      })
      .catch((err) => { // 获取网络状态失败 也直接走开始连接的流程
        TrackConnectionHelper.onNetworkChecked();
        console.log(err);
        Service.smarthome.reportLog(Device.model, `start query network error${JSON.stringify(err)}`);
        this._startConnect();// 开始连接
      });
  }

  restoreOri(from = -1) {
    console.log(TAG, "restoreOri from:", from);
    Service.smarthome.reportLog(Device.model, `restoreOri from ${ from }`);
    if ("PORTRAIT" === this.mOri) {
      this.toPortrait(1);
    } else {
      this.toLandscape(1);
    }
  }


  toPortrait(from = -1) {
    StatusBar.setHidden(false);
    Service.smarthome.reportLog(Device.model, `toPortrait from ${ from }`);
    console.log(TAG, "toPortrait from:", from);
    this.mOri = "PORTRAIT";
    CameraConfig.lockToPortrait();
    if (Platform.OS == "android" && this.evenLockScreen > 0) {
      this.setState({ restoreOriFinished: true });
    }
    this._hidePlayToolBarLater();
    clearTimeout(this.angleViewTimeout);
    this.setState({ showCameraAngleView: false, angleViewShowScale: false });
  }

  toLandscape(from = -1) {
    StatusBar.setHidden(true);
    console.log(TAG, "toLandscape from:", from);
    Service.smarthome.reportLog(Device.model, `toLandscape from ${ from }`);
    this.mOri = "LANDSCAPE";
    if (Platform.OS === "android") {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToLandscapeRight();
    }
    if (Platform.OS == "android" && this.evenLockScreen > 0) {
      this.setState({ restoreOriFinished: true });
    }
    if (this.showPlayToolBarTimer) {
      clearTimeout(this.showPlayToolBarTimer);
      this.showPlayToolBarTimer = null;
    }
    if (Host.isPad) {
      Service.miotcamera.enterFullscreenForPad(true);
    }
    this._hidePlayToolBarLater();
    clearTimeout(this.angleViewTimeout);
    this.setState({ showCameraAngleView: false, angleViewShowScale: false });
  }

  _connectionHandler = (connectionState) => {
    this.loadingRetryTimer = 0;
    Service.smarthome.reportLog(Device.model, `why!, _connectionHandler, connectionState.state: ${connectionState.state}`);
    if (connectionState.state == MISSConnectState.MISS_Connection_ReceivedFirstFrame) {
      if (this.hasFirstFrame || Platform.OS === "ios") {
        this.setState({ showDefaultBgView: false, whiteTitleBg: false, showLoadingView: false, showPlayToolBar: true });
      } else {
      }
      if (!Host.isAndroid) {
        setTimeout(() => {
          AlbumHelper.snapshotForSetting(this.cameraGLView, this.state.isFlip);
          CameraPlayer.getInstance().sendCommandForPic();
        }, 100);
      }

      TrackConnectionHelper.onIFrameReceived();
    }

    if (this.state.pstate == connectionState.state && this.state.error == connectionState.error) {
      return;// 状态一样 没有必要通知
    }

    if (connectionState.state == MISSConnectState.MISS_Connection_Disconnected) {
      this.isConnecting = false;
      if (this.state.showPauseView) { // 如果显示暂停，就不显示error
        return;
      }
      TrackConnectionHelper.onDisconnected();
      if (this.state.isSleep) {
        // 休眠状态下断开了连接，也不显示errorView
        return;
      }
      if (!this.isLocalMode && this.connRetry > 0 && this.state.pstate != connectionState.state) {
        this.connRetry = this.connRetry - 1;
        setTimeout(() => {
          Service.smarthome.reportLog(Device.model, `error retry connect: ${this.connRetry}`);
          console.log("connection retry");
          this.queryNetworkJob();
        }, 300);
        return;
      }
      this.handleDisconnected(connectionState.error);
    }

    if (connectionState.state == MISSConnectState.MISS_Connection_Connected) { // onconnected 发送video-start
      this.loadingRetryTimer = new Date().getTime();
      if (!this.isConnecting) {
        return;
      }
      this._sendDirectionCmd(DirectionViewConstant.CMD_GET);
      this.isConnecting = false;
      this.startVideoRetry = false;
      console.log("start send video start");
      this._realStartVideo();

      TrackConnectionHelper.onConnected();
      // this._refreshRemoteProps();
      this.delayGetPreSetPosition = setTimeout(() => {
        this._getPreSetPosition();
      }, 1000);
      this.cruiseTimer && clearTimeout(this.cruiseTimer);
      this.cruiseTimer = setTimeout(this._getCruiseState, 3000);
    }
    if (connectionState.state == MISSConnectState.MISS_Connection_Connecting) {
      this.isConnecting = true;
    }
    if (connectionState.state >= MISSConnectState.MISS_Connection_Connected) {
      Service.miotcamera.bindRDTDataReceiveCallback(kRDTDataReceiveCallBackName);
      this.setState({ showErrorView: false });
      Service.miotcamera.bindBPSReceiveCallback(kBpsDataReceiveCallbackName);
    }

    if (connectionState.state >= MISSConnectState.MISS_Connection_ReceivedFirstFrame) {

      this.connRetry = 2;
      if (this.isPtz) {
        setTimeout(() => {
          this._getRotateAngle();
        }, 500);
      }

      if (!Host.isAndroid) { // android收到关键帧没有用，要等到解码出来的firstVideoShow， ios没有这个事件，只能在收到i帧后调用
        StorageKeys.VIDEO_SCALE.
          then((result) => {
            if (typeof (result) == "number") {
              if (this.savedVideoScale != result) {
                setTimeout(() => {
                  this.setState({ savedVideoScale: result, videoScale: result });
                }, 50);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
        setTimeout(() => {
          AlbumHelper.snapshotForSetting(this.cameraGLView, this.state.isFlip);
          CameraPlayer.getInstance().sendCommandForPic();
        }, 100);

      }

      this.hasFirstFrame = true;
      if (this.showPlayToolBarTimer) {
        clearTimeout(this.showPlayToolBarTimer);
        this.showPlayToolBarTimer = null;
      }
      if (!this.state.fullScreen) {
        this._hidePlayToolBarLater();
      }

    }
    this.setState({
      pstate: connectionState.state,
      error: connectionState.error
    });
  }

  handleDisconnected(errorCode) { // 已经断开了连接。
    console.log("disconnected");
    this._stopRecord();
    let errorStr = ((errorCode == 36 || errorCode == MISSError.MISS_ERR_MAX_SESSION) && VersionUtil.judgeIsMiss(Device)) ? LocalizedStrings["max_client_exceed"] : (errorCode == -6 && !VersionUtil.judgeIsMiss(Device) ? LocalizedStrings["max_client_exceed"] : `${LocalizedStrings["camera_connect_error"]} ${errorCode}, ${LocalizedStrings["camera_connect_retry"]}`);
    this.setState({ showPlayToolBar: false, isRecording: false, isCalling: false, showLoadingView: false, showPauseView: false, showPoweroffView: false, showErrorView: true, errTextString: errorStr });
    this.isClickCall = false;
    // this._toggleAudio(true);
    if (this.cameraGLView != null && !this.destroyed) {
      this.cameraGLView.stopAudioPlay();
      // sync ui state
      this.setState({ isMute: true });
      this.cameraGLView.stopAudioRecord();
      // this._stopCall();
      // CameraPlayer.getInstance().stopVideoPlay();
      this.cameraGLView.stopRender();// stopRender
    }

    if (!Device.isOnline) {
      return;
    }
  }

  _getRotateAngle() {
    LogUtil.logOnAll(TAG, "全景图成功后，发起查询角度命令");

    if (CameraConfig.isXiaomiCamera(Device.model)) {
      let param = { operation: 6 };
      Service.miotcamera.sendP2PCommandToDevice(MISSCommand.MISS_CMD_MOTOR_REQ, param)
        .then(() => {
          this.isSendingRdtCmd = true;
        })
        .catch((error) => {
          LogUtil.logOnAll(TAG, "查询角度命令发送失败:" + JSON.stringify(error));
          this.isSendingRdtCmd = false;
        })
    } else {
      let GetCurrentRotateAngle = 14;// 获取当前摄像机坐标(角度）
      let command = GetCurrentRotateAngle;
      let params = `${"{'mac':'F1F2F3F4F5F6','panorama':''}"}`;// 小米保留，固件暂时不做解析

      // 1个byte占用8个bit
      // 1个int占用4个byte
      let buf = new ArrayBuffer(8);// 1个int占用4个byte；

      let data = new Uint32Array(buf);
      data[0] = command;// 放命令号
      data[1] = 4;// 放 data的byte长度 这里是32位整数 长度是4
      let data_byte = new Uint8Array(buf);// int转byte

      console.log("_getRotateAngle data=", data);

      let base64Data = base64js.fromByteArray(data_byte);

      Service.miotcamera.sendRDTCommandToDevice(base64Data).then((res) => {
        this.isSendingRdtCmd = true;
        console.log("_getRotateAngle command=", command, ",res=", res);
      }).catch((err) => {
        this.isSendingRdtCmd = false;
        console.log("_getRotateAngle res=", err);
      });
    }

  }

  bindRdtListener() {
    this.rdtListener = DeviceEventEmitter.addListener(kRDTDataReceiveCallBackName, ({ data }) => {
      if (!this.isPtz) {
        return;
      }
      if (!this.isSendingRdtCmd) {
        return;// 不是这边发送的，不管。
      }
      // console.log("rdt listener received data=", data);

      if (data == null || data.length <= 0) {
        return;
      }
      try {
        let result = null;
        try {
          result = base64js.toByteArray(data);// uint8array
        } catch (exception) {
          console.log("rdt data  error");
          console.log(exception);
          console.log(data);
          throw exception;
        }

        // console.log("rdt result: " + result);

        let command = NumberUtil.byteArrayToInt(result, 0);
        if (command <= 0 || command > 65535) {
          throw ("invalid command");
        }

        let size = NumberUtil.byteArrayToInt(result, 4);
        if (size <= 0 || size >= 20971520) {
          throw ("invalid size");
        }
        let rawSize = size;


        // let status = this.byteArrayToInt(result, 8)
        // let currentPacketDataSize = result.length - 12;

        let commandBuffer = new Uint8Array(rawSize);
        commandBuffer.set(result.slice(12));

        // parse commandBuffer
        // PTZCMISSRdtSetPanoramaRotateAngle = 13, //点击全景图转动电机
        // PTZCMISSRdtGetCurrentRotateAngle = 14 //获取当前摄像机坐标(角度）

        if (command === 14) {
          let data = new Uint8Array(commandBuffer);
          NumberUtil.byteArrayToInt(data, 0);

          let positionX = NumberUtil.byte2ToUnsignedShort(data, 0);
          let positionY = NumberUtil.byte2ToUnsignedShort(data, 2);

          console.log("rdt listener update positionX: ", positionX);
          console.log("rdt listener update positionY: ", positionY);

          this.setState({ angle: positionX, elevation: positionY });
          if (this.showPanoAfterReceivedRotateAngle) {
            this.setState({ panoViewStatus: 3 });
            this.showPanoAfterReceivedRotateAngle = false;
            if (this.showPanoToastAfterReceivedRotateAngle) {
              Toast.success("pano_view_success");
              this.showPanoToastAfterReceivedRotateAngle = false;
            }
          }
          // if(this.state.showPanoView){
          //   this.setState({panoViewStatus:3, angle: positionX, elevation: positionY})
          // }
          this.isSendingRdtCmd = false;// end

        } else if (command === 13) {
          console.log("rdtListener SetPanoramaRotateAngle success!");
        }
      } catch (err) {
        // console.log(`rdt data error:${ err }`);
        this.isSendingRdtCmd = false;// end
      }
    });

    Service.miotcamera.bindRDTDataReceiveCallback(kRDTDataReceiveCallBackName);
  }
  // 这里切换角度
  _p2pCommandHandler = ({ command, data }) => {
    // 扩展程序注册命令回复回调，command为返回的命令号值，data 为P2P命令的返回数据。
    if (command == MISSCommand.MISS_CMD_SPEAKER_START_RESP) {
      if (this.forceSleep || this.state.showErrorView) {
        return;// 已经休眠或者显示了错误文案，就不打开麦克风
      }
      this.isClickCall = false;
      this.startSpeakerTime = new Date().getTime();
      console.log(' receive start speaker');
      let ba = base64js.toByteArray(data);

      if (ba.length > 0) {
        console.log('receive start speaker 0');
        console.log(ba[0]);
        if (Platform.OS === 'android') {
          if (ba[0] == 48) {
            console.log("start call in android");
            // this.isAudioMuteTmp = this.state.isMute;
            if (this.cameraGLView != null && !this.destroyed) {
              this.cameraGLView.startAudioRecord();
            }
            console.log("this.iscalling = true");
            this._toggleAudio(false);
            this.setState({ isCalling: true, showOneKeyCallDialog: false });
            AlarmUtil.putOneKeyCallStatus(2).then((res) => {
              LogUtil.logOnAll("putOneKeyCallStatus(2)", JSON.stringify(res));
            }).catch((err) => {
              LogUtil.logOnAll("putOneKeyCallStatus(2) err", JSON.stringify(err));
            });
            return;
          }
        } else {
          if (ba[0] == 0) {
            // this.isAudioMuteTmp = this.state.isMute;
            this._toggleAudio(false);
            this.callTimeout = setTimeout(() => {
              if (this.cameraGLView != null && !this.destroyed) {
                this.cameraGLView.startAudioRecord();
              }
            }, 800);// temp solution for bug MIIO-42838
            this.setState({ isCalling: true, showOneKeyCallDialog: false });
            AlarmUtil.putOneKeyCallStatus(2).then((res) => {
              LogUtil.logOnAll("putOneKeyCallStatus(2)", JSON.stringify(res));
            }).catch((err) => {
              LogUtil.logOnAll("putOneKeyCallStatus(2) err", JSON.stringify(err));
            });
            console.log("this.iscalling = true");
            return;
          }
        }
      }
      LogUtil.logOnAll("speak_failed because =", data);
      Toast.fail("speak_failed");
    } else if (command == MISSCommand.MISS_CMD_MOTOR_RESP) {
      console.log("received p2p angle resp");
      console.log(data); // {"ret":0,"angle":12,"elevation":1}
      if (this.isSendingRdtCmd) {
        LogUtil.logOnAll(TAG, "查询电机角度命令返回了：" + JSON.stringify(data));
      }
      try {
        if (typeof (data) == 'string') {
          data = JSON.parse(data);
        }
        this.angleData = data;

        let angleValue = Number(data.angle);
        let elevationValue = Number(data.elevation);
        let result = Number(data.ret);

        if (typeof (angleValue) == 'number' && typeof (elevationValue) == 'number') {
          if (this.ctrlCurrentLocation[0] != 0) {
            console.log(`preSetPosition update img current:${angleValue} - ${elevationValue} == h-v : ${this.ctrlCurrentLocation[1]} - ${this.ctrlCurrentLocation[2]}`);
            if ((angleValue > this.ctrlCurrentLocation[1] - 2 && angleValue < this.ctrlCurrentLocation[1] + 2) &&
              (elevationValue > this.ctrlCurrentLocation[2] - 2 && elevationValue < this.ctrlCurrentLocation[2] + 2)) {
              console.log(`preSetPosition update img h-v : ${this.ctrlCurrentLocation[1]} - ${this.ctrlCurrentLocation[2]}`);
              let imgPath = `${this.preSetPositionImg}${this.ctrlCurrentLocation[0]}.jpg`;
              this.delayUpdatePreSetImg && clearTimeout(this.delayUpdatePreSetImg);
              this.delayUpdatePreSetImg = setTimeout(() => {
                this._updatePreSetPositionImg(imgPath, this.ctrlCurrentLocation[0]);
                this.ctrlCurrentLocation[0] = 0;
              }, 2000);
            }
          }
          // if (this.angleViewTimeout) {
          //   clearTimeout(this.angleViewTimeout)
          //   this.angleViewTimeout = null
          // }
          // this.angleViewTimeout = setTimeout(() => {
          //   this.setState({ showCameraAngleView: false, angleViewShowScale: false });
          // }, 3000);
          // this.setState({showCameraAngleView: true, angleViewShowScale: false, angle: angleValue, elevation: elevationValue})
          // angle : left -> right 101 -> 1, 转换为 0 ~ 100
          // elevation : top -> bottom 101 -> 1, 转换为 0 ~ 100
          if (angleValue < 0 || angleValue > 101 || elevationValue < 0 || elevationValue > 101) {
            Service.smarthome.reportLog(Device.model, "illegal angle or elevation value:" + angleValue + " " + elevationValue);
            return;
          }
          if (this.isSendingRdtCmd) {// c01全景绘制后，获取电机方向改到这里了
            this.isSendingRdtCmd = false;
            this.setState({ angle: angleValue, elevation: elevationValue });
            if (this.showPanoAfterReceivedRotateAngle) {
              this.setState({ panoViewStatus: 3 });
              this.showPanoAfterReceivedRotateAngle = false;
              if (this.showPanoToastAfterReceivedRotateAngle) {
                Toast.success("pano_view_success");
                this.showPanoToastAfterReceivedRotateAngle = false;
              }
            }
            // if(this.state.showPanoView){
            //   this.setState({panoViewStatus:3, angle: positionX, elevation: positionY})
            // }
            this.isSendingRdtCmd = false;// end
            return;
          }
          if (Date.now() - this.lastLogTime > 1000) {
            LogUtil.logOnAll("receive ptz direction log: angleValue:" + angleValue + " elevationValue:" + elevationValue);
          }
          this.lastLogTime = Date.now();

          this.setState({ angleViewShowScale: false, angle: angleValue, elevation: elevationValue });
          if (result < 0) {
            if ((result == DirectionViewConstant.CMD_CHECK_END) && !this.state.showPoweroffView) {
              Toast.success("camera_celibrating");
            } else if (result <= -1 && result >= -4 && !this.state.showPoweroffView) {
              Toast.fail("camera_direction_end");
            }
          } else {
          }
        }

      } catch (exception) {
        console.log(`parse angle data error: ${exception}`);
      }

    } else if (command == MISSCommand.MISS_CMD_CRUISE_STATE_RESP) {
      LogUtil.logOnAll("received cruise state resp", data);
      if (typeof (data) == 'string') {
        data = JSON.parse(data);
      }
      if (data.value == 1) {
        this.setState({ isCruising: true });
      } else {
        this.setState({ isCruising: false });
      }
    } else if (command == MISSCommand.MISS_CMD_CALL_STATUS_RESP) {
      LogUtil.logOnAll("received CALL_STATUS_RESP", data);
      if (typeof (data) == 'string') {
        data = JSON.parse(data);
      }
      if (data.type == "hang_up") {
        LogUtil.logOnAll("received CALL_STATUS_RESP do stopCall");
        this._stopCall();
      } else {
        LogUtil.logOnAll("received CALL_STATUS_RESP type=", data.type);
      }
    } else if (command == MISSCommand_ECO.MISS_CMD_NETWORK_STATUS) {
      let ba = base64js.toByteArray(data);
      LogUtil.logOnAll(`receive MISS_CMD_NETWORK_STATUS:${ command } data:${ ba }`);
      if (ba[0] === 0) {
        this._getTargetPush(false, true);
      }
    } else {
      console.log(`receive other command:${command} data:${JSON.stringify(data)}`);
    }
  }

  _networkChangeHandler = (networkState) => {
    // if (this.currentNetworkState != networkState) { // 网络状态不一样
    //   this.isChangingNetwork = true;
    // }
    if (this.isFirstEnter) { // 放到后台的包  刚进来的时候
      return;
    }
    if (this.currentNetworkState == networkState) {
      return;
    }
    if (this.state.showPoweroffView) {
      return;// 已经休眠了，不需要走下面的逻辑
    }
    this.connRetry = 0;//避免重连。
    Service.smarthome.reportLog(Device.model, "处理网络变化" + networkState);
    this.currentNetworkState = networkState;
    clearTimeout(this.showNetworkDisconnectTimeout);
    if (networkState == 0 || networkState == -1) { // 网络断开了连接 showError?
      Service.smarthome.reportLog(Device.model, "网络异常" + networkState);
      // CameraPlayer.getInstance().disconnectToDevice();// 去往其他注册了网络监听的页面，就不会走到这里了，如果走到这里，这里必须先执行断开的操作
      this.showNetworkDisconnectTimeout = setTimeout(() => {
        this.handleDisconnected(MISSError.MISS_ERR_CLOSE_BY_LOCAL);// 刷新UI，避免出现异常。  
      }, 1300);
      return;
    }

    this._stopAll(false, false);
    if (this.isPageForeGround) { // 有网络来了  发起重连吧
      this.setState({ showErrorView: false });
      this._clearTimer(this.reconnectTimeout);
      this.reconnectTimeout = setTimeout(() => {
        if (this.cameraGLView == null) {
          return;
        }
        // this.mNetworkChangedConnection = true;
        Service.smarthome.reportLog(Device.model, `on network changed:${networkState}`);
        console.log("networkchangehandler");
        this.queryNetworkJob();
      }, 500);// 过一会再查询 ，那个查询网络类型的api有问题。
    }
  }

  // android返回键处理
  onBackHandler = () => {
    if (!this.isPageForeGround) {
      return false;
    }
    if (this.state.fullScreen) {
      this._correctOrientation();
      this.toPortrait(4);
      this.setState({ showCameraAngleView: false });
      return true;
    }
    if (this.state.isRecording) {
      Toast.success("camera_recording_block");
      return true;
    }
    if (this.state.isCalling) {
      Toast.success("camera_speaking_block");
      return true;
    }
    this._onPause();
    return false;
  }


  _fetchVipStatus() {
    // todo:需要框架端提供能够指定hostName前缀的api
    API.get("/miot/camera/app/v1/vip/status", "business.smartcamera")
      .then((result) => {
        if (result.code != 0) {
          return;
        }
        let data = result.data;
        if (data == null) {
          return;
        }
        console.log("-=-=-=-=_fetchVipStatus-=-=-=-=", data);
        let vip = data["vip"];
        let status = data["status"];
        let inWindow = !data["closeWindow"]; // false表示在窗口内，true表示不在
        let endTime = data["endTime"];
        StorageKeys.IS_VIP_STATUS = vip;
        StorageKeys.IN_CLOSE_WINDOW = inWindow;
        StorageKeys.VIP_DETAIL = data;
        CameraConfig.fetchCloudBabyCryStatus(Device.model, vip); // 26c02 需要根据是否是vip做这个事情
        this.isVip = vip;
        this.mVipStatus = status;
        CameraConfig.isVip = vip;
        this.inWindow = inWindow;
        let shouldShowBuyTip = false;
        this.freeHomeSurExpireTime = data.freeHomeSurExpireTime;// 免费看家结束时间
        this.freeHomSurStatus = data.freeHomSurStatus;// 免费看家弹窗状态
        
        if (this.isVip) {
          let curTime = new Date().getTime();
          let willEndDays = dayjs(endTime).diff(dayjs(curTime), 'day') + 1; // +1 和云存管理页面保持一致
          if (Device.isOwner && (willEndDays == 1 || willEndDays == 3 || willEndDays == 7)) {
            this.cloudVipEndTime = endTime;
            this.cloudVipWillEndDays = willEndDays;
            shouldShowBuyTip = true;
          }
        } else {
          if (Device.isOwner && status == 1 && this.inWindow) {
            shouldShowBuyTip = true;
          }
        }

        if (shouldShowBuyTip) {
          if (!this.mFirmwareSupportCloud || !CameraConfig.isSupportCloud()) {
            return;
          }

          StorageKeys.HIDE_CLOUD_BUY_TIP.then((res) => {
            if (!res) {
              this.setState({ showCloudVipBuyTip: true });
            } else {
              this.setState({ showCloudVipBuyTip: res });
            }
          }).catch(() => {
          });
        } else {
          StorageKeys.HIDE_CLOUD_BUY_TIP = false;
          this.setState({ showCloudVipBuyTip: false });

        }
      })
      .catch((err) => {
        console.log(err);
        // this.isVip = false;
        // this.inWindow = false;
        // StorageKeys.IN_CLOSE_WINDOW = false;
      });
  }

  _getTargetPush(showFormat = false, weakNetWork = false) {
    const { sdcardFullDialog, sdcardSmallDialog, sdcardFormatDialog } = this.state;
    LogUtil.logOnAll("_getTargetPush this.isPowerOn==", this.isPowerOn);
    if (typeof (this.isPowerOn) === 'boolean' && !this.isPowerOn) { // 休眠时不再提示
      return false;
    }
    if (this.state.showTargetPushView) {
      LogUtil.logOnAll("_getTargetPush", " is showed target pushview");
      return;
    }
    if (weakNetWork && this.state.resolution > 1) {
      this.targetpushItem = "7";
      this.setState({ showTargetPushView: true }, () => {
        setTimeout(() => {
          this.setState({ showTargetPushView: false });
        }, 15000);
      });
      return;
    }
    if (sdcardFullDialog || sdcardSmallDialog || sdcardFormatDialog) {
      return;
    }
    if (this.language != "zh" || this.state.isInternationServer) {
      return;
    }
    LogUtil.logOnAll(TAG, "china mainland && cn lang, begin to show targetpush, is allow in model:" + CameraConfig.isNewChuangmi(Device.model));
    if (!Device.isOwner) { //chuangmi-12220
      return;
    }
    StorageKeys.IS_TARGET_PUSH_SHOWN.
      then((result) => {
        LogUtil.logOnAll(TAG, "target push has been showned on this device?" + result);
        if ((typeof (result) != "boolean" || result == false) && !this.state.isNewDevice) {
          this._getTargetPushMessage();
        }
      })
      .catch((err) => {
        console.log("get IS_TARGET_PUSH_SHOWN error: ", err);
      });
    // 展示优先级：云存用户不同状态定向通知>uid+did定向推送>异常状态引导推送（存储卡异常>WDR>夜视设置）
  }

  _getSecurityCodePush() {
    if (this.state.isInternationServer && Device.isOwner) {
      StorageKeys.IS_SECURITY_CODE_TIP_SHOWN.
        then((result) => {
          LogUtil.logOnAll(TAG, "refresh security code push: isinternationalserver:" + this.isInternationServer + " isOwer:" + Device.isOwner + " cached state:" + result);
          if ((result == null || result == "" || result == false)) {
            this.targetpushItem = "5";
            this.setState({
              isNewDevice: true,
              showTargetPushView: true
            });
            this.setTargetPushViewShown();
          }
        })
        .catch((err) => {
          console.log("get IS_TARGET_PUSH_SHOWN error: ", err);
        });
    }
  }
  async sdCardabnormal() {
    let showSdCard = await this._getsdCardStoragePushMessage();
    LogUtil.logOnAll(TAG, "targetPush to show sdcard?" + showSdCard);
    if (showSdCard) {
      this.setState({
        showTargetPushView: true
      });
      return;
    }
  }

  
  async _getTargetPushMessage() {
    let showSdCard = await this._getsdCardStoragePushMessage();
    LogUtil.logOnAll(TAG, "targetPush to show sdcard?" + showSdCard);
    if (showSdCard) {
      // this.setState({
      //   showTargetPushView: true
      // });
      // this.setTargetPushViewShown();
      return;
    }
    LogUtil.logOnAll(TAG, "targetPush isOverExposed?" + this.state.isOverExposed);
    if (this.state.isOverExposed && CameraConfig.overexposureTip()) {
      let showWDR = await this._getWDRModePushMessage();
      LogUtil.logOnAll(TAG, "target push showWDR:" + showWDR);
      if (!showWDR) {
        let showNightMode = await this._getNightModePushMessage();
        LogUtil.logOnAll(TAG, "target push showNightMode:" + showNightMode);
        this.setState({
          showTargetPushView: showNightMode
        });
        if (showNightMode) {
          this.setTargetPushViewShown();
        }
      } else {
        this.setState({
          showTargetPushView: true
        });
        this.setTargetPushViewShown();
      }
    } else {
      let showNightMode = await this._getNightModePushMessage();
      LogUtil.logOnAll(TAG, "target push showNightMode:" + showNightMode);
      this.setState({
        showTargetPushView: showNightMode
      });
      if (showNightMode) {
        this.setTargetPushViewShown();
      }
    }
  }

  async _getsdCardStoragePushMessage() {
    // 1. 存储卡异常（ 0 正常 1 不存在存储卡 2 空间不足 3 异常 4 正在格式化 5 弹出）
    return new Promise((resolve, reject) => {
      CameraPlayer.getInstance().getSdcardStatus()
        .then(({ sdcardCode }) => {
          this.targetpushItem = `${sdcardCode}_sd`;
          resolve((sdcardCode == 3 || sdcardCode == 2 
            || sdcardCode == CameraPlayer.SD_CARD_TOO_SMALL_CODE || sdcardCode == CameraPlayer.SD_CARD_NEED_FORMAT_CODE
            || sdcardCode == CameraPlayer.SD_CARD_FILE_ERROR_CODE || sdcardCode == CameraPlayer.SD_CARD_INCOMPATIBLE_CODE));
        })
        .catch(({ sdcardCode, error }) => {
          if (typeof (sdcardCode) === 'number' && sdcardCode >= 0) {
            resolve((sdcardCode == 3));
          }
        });
    });
  }

  async _getWDRModePushMessage() {
    // 1.画面过曝问题且宽动态范围模式（WDR）设置为打开
    return new Promise((resolve, reject) => {
      if (VersionUtil.isUsingSpec(Device.model)) {
        let param = [{ did: Device.deviceID, siid: 2, piid: 5 }];
        Service.spec.getPropertiesValue(param, 2)
          .then((result) => {
            console.log(result);
            if (result instanceof Array && result.length >= 1) {
              this.targetpushItem = "3";
              let htValue = result[0].value;
              resolve(htValue);
            }
          })
          .catch((error) => {
            console.log(error);
            reject(false);
          });
      } else {
        RPC.callMethod("get_prop", [
          'wdr'
        ]).then((res) => {
          this.targetpushItem = "3";
          resolve((res.result[0] == "on"));
        }).catch((err) => {
          console.log(err);
          reject(false);
        });
      }
    });
  }

  async _getNightModePushMessage() {
    // 2. 夜视功能
    return new Promise((resolve, reject) => {

      if (VersionUtil.isUsingSpec(Device.model)) {
        Service.spec.getPropertiesValue([CAMERA_CONTROL_SEPC_PARAMS[0]], 2)
          .then((res) => {
            console.log(res);
            let code = res[0].code;
            if (code == 0) {
              let value = res[0].value;
              let shouldShowNight = value != 2;
              if (shouldShowNight) {
                if (value == 0) { // spec打开了
                  this.targetpushItem = "2";
                } else if (value == 1) { // spec 关闭了
                  this.targetpushItem = "1";
                }
              }
              resolve(shouldShowNight);
            } else {
              reject(false);
            }
          })
          .catch((err) => {
            reject(false);
          });
      } else {
        RPC.callMethod("get_prop", [
          'night_mode'
        ]).then((res) => {
          let value = res.result[0];
          let showNight = res.result[0] != "0";
          if (value == "2") {
            this.targetpushItem = "2"; // 开关打开，提示画面黑白
          } else if (value == "1") {
            this.targetpushItem = "1"; // 开关关闭，提示画面太黑
          }
          this.targetpushItem = res.result[0];
          resolve((showNight));
        }).catch((err) => {
          reject(false);
        });
      }

    });
  }

  async _getOperationBanner() {
    if (CameraConfig.shouldDisplayBannerTips(Device.model)) {
      StorageKeys.OPERATION_CLICKED_KEY.
        then((result) => {
          this.setState({ clickedBannerShortKey: result });
        })
        .catch((err) => {
          console.log(err);
        });
      let targetItem = await this._getOperationBannerOnline(`home.mi.com/cgi-op/api/v1/recommendation/banner?type=25&appTabType=1`);
      if (targetItem) {
        if (!this.bannerItem || targetItem.shortKey != this.bannerItem.shortKey) {
          this.bannerItem = targetItem;
          TrackUtil.reportClickEvent("Camera_Recommend_Show");// 推荐运营位曝光
          this.setState({ bannerShortKey: targetItem.shortKey });
          // let bannerItemStr = JSON.stringify(item);
          // StorageKeys.OPERATION_BANNER_ITEM = bannerItemStr;
        }
      } else {
        this.bannerItem = null;
        // StorageKeys.OPERATION_BANNER_ITEM = "";
        this.setState({ bannerShortKey: "0" });
      }

    }

  }

  async _getCloudBanner() {
    StorageKeys.HIDE_CLOUD_BANNER.
      then((result) => {
        this.cloudBannerClosed = result;
      })
      .catch((err) => {
        console.log(err);
      });
    let targetItem = await this._getOperationBannerOnline(`home.mi.com/cgi-op/api/v1/recommendation/banner?type=33&appTabType=1`);
    console.log("targetItem == ", JSON.stringify(targetItem));
    if (targetItem) {
      if (!this.cloudBannerItem || targetItem.shortKey != this.cloudBannerItem.shortKey) {
        this.cloudBannerItem = targetItem;
        TrackUtil.reportClickEvent("Camera_Recommend_Show");// 推荐运营位曝光
      }
    } else {
      this.cloudBannerItem = null;
    }
  }

  async _getOperationBannerOnline(bannerUrl) {
    let platformId = 1;
    if (Platform.OS === "android") {
      platformId = 2;
    }
    let appVersion = Host.version;
    bannerUrl = `https://${ bannerUrl }&platform=${ platformId }&appVersion=${ appVersion }`;
    if (CameraConfig.mIsPlatoPVEvn) {
      bannerUrl = `https://preview.${ bannerUrl }&platform=${ platformId }&appVersion=${ appVersion }`; // for preview
    }
    return await fetch(bannerUrl, { headers: { 'user-agent': Platform.OS === "android" ? "android" : "iphone" } })
      .then((response) => response.text())
      .then((responseText) => {
        console.log("banner tips:", responseText, bannerUrl);
        let res = JSON.parse(responseText);
        let targetItem = null;
        if (res && res.code == 0 && res.data && res.data.list) {
          for (let i = 0; i < res.data.list.length; ++i) {
            let item = res.data.list[i];
            let curTimeStamp = new Date().getTime(); // 整型，用于做唯一性标识
            if (curTimeStamp >= item.beginTime && curTimeStamp < item.endTime) {
              targetItem = item;
              break;
            }
          }
        }
        return targetItem;
      })
      .catch((err) => {
        console.log(`_getOperationInfo error: ${err}`);
        return null;
      });
  }

  // query whether is power off;
  queryPowerOffProperty() {
    // todo fist check power on/off
    TrackConnectionHelper.onPowerBeginChecked();
    if (VersionUtil.isUsingSpec(Device.model)) {
      Service.spec.getPropertiesValue([CAMERA_CONTROL_SEPC_PARAMS[6]])
        .then((result) => {
          let isOk = result[0].code == 0;
          if (isOk) {
            TrackConnectionHelper.onPowerEndChecked();
            this.isFirstEnter = false;
            let isPowerOn = result[0].value;
            this.isPowerOn = isPowerOn;

            this._powerOffHandler(isPowerOn, false, false);//powerOff notify ui only
          } else {
            this._powerOffHandler(true, false, false);
          }
        })
        .catch((error) => {
          TrackConnectionHelper.onPowerEndChecked();
          this.isFirstEnter = false;
          StorageKeys.IS_POWER_ON
            .then((res) => {
              if (typeof (res) == "string" || res === null) {
                res = true;// 没有设置过，默认当做是非休眠状态吧。
              }
              this._powerOffHandler(res, false, false);
            })
            .catch((err) => { // 查询本地属性都失败了。
              this._powerOffHandler(true, false, false);
            });

        });
    } else {
      RPC.callMethod("get_prop", ["power"])
        .then((res) => {
        
          TrackConnectionHelper.onPowerEndChecked();
          this.isFirstEnter = false;
          console.log(res);
          // this.setState({ isSleep: false, showPlayToolBar: true })
          let isPowerOn = res.result[0] === "on";
          this.isPowerOn = isPowerOn;
          this._powerOffHandler(this.isPowerOn, false, false);
        })
        .catch((err) => { // 查询状态出错  不管  直接去查询
          TrackConnectionHelper.onPowerEndChecked();
          this.isFirstEnter = false;
          Service.smarthome.reportLog(Device.model, "onPowerOn");
          StorageKeys.IS_POWER_ON
            .then((res) => {
              if (typeof (res) === "string" || res == null) {
                res = true;// 没有设置过，默认当做是非休眠状态吧。
              }
              this._powerOffHandler(res, false, false);
            })
            .catch((err) => { // 查询本地属性都失败了。
              this._powerOffHandler(true, false, false);
            });
        });
    }

  }

  startCheckLog() {
    fetchLogUploaderStatus()
      .then((result) => {
        let { showDialog, msg } = result;
        Service.smarthome.reportLog(Device.model, `fetchLogUploaderStatus: ${ result.showDialog }`);
        clearInterval(this.logInterval);
        if (showDialog) {
          this.setState({ showLogDialog: true, logDialogContent: msg });
        }
      })
      .catch((err) => {
        Service.smarthome.reportLog(Device.model, `fetchLogUploaderStatus2: ${ JSON.stringify(err) }`);
        console.log(JSON.stringify(err));
      });
  }

  _startConnect() {

    if (!this.props.navigation.isFocused()) { // 当前页面已经不在前台了
      this.setState({ showLoadingView: false });
      return;
    }
    if (!this.state.showLoadingView && !CameraPlayer.getInstance().isConnected()) { // 如果没有loading
      this.setState({ showLoadingView: true, showErrorView: false, showPlayToolBar: false });
    }
    if (this.state.showPauseView) {
      this.setState({ showPauseView: false });
    }
    // 开始连接
    if (CameraPlayer.getInstance().isConnected()) {
      // 如果已经连接成功 直接发送video_start
      Service.smarthome.reportLog(Device.model, "already connected, start send video start");
      TrackConnectionHelper.onConnected();
      LogUtil.logOnAll("connect",this.wakePower,this.sleepPower);
      if (!(this.wakePower == 0 && this.sleepPower ==0) && Math.abs(this.wakePower-this.sleepPower) < 1000) {
        // 查询设备状态，设备休眠、结束休眠操作间隔太短
        LogUtil.logOnAll("sleep wakeup close",this.wakePower,this.sleepPower);
        this.queryPowerOffProperty();
        return;
      }
      this.setState({ pstate: MISSConnectState.MISS_Connection_Connected });
      this._realStartVideo();
      return;
    }
    Service.smarthome.reportLog(Device.model, "not connected, try start connect");
    this.setState({ pstate: 0, error: 1 });
    TrackConnectionHelper.startConnect();
    this.isConnecting = true;
    CameraPlayer.getInstance().startConnect();
    if (!Device.isOnline) {
      this.setState({ showErrorView: true, errTextString: LocalizedStrings['device_offline'] });
      OfflineHelper.getLastOnlineTime()
        .then((result) => {
          this.setState({ lastOfflineTime: `${LocalizedStrings['offline_time_str']}: ${result}` });
        })
        .catch((rr) => {
        });
    }
  }

  _realStartVideo() {
    if (this.state.showPauseView) {
      this.setState({ showPauseView: false });
    }
    Service.smarthome.reportLog(Device.model, "send videoStart cmd");
    this.cameraGLView && this.cameraGLView.stopRender();
    this.cameraGLView && this.cameraGLView.startRender();// startBindVideo
    Service.miotcamera.sendP2PCommandToDevice(MISSCommand.MISS_CMD_VIDEO_START, {})
      .then((retCode) => {
        console.log("startVideo success ", retCode, "mute", this.state.isMute,this.state.pstate);
        if (this.cameraGLView == null || this.destroyed) {
          return;
        }
        if (this.state.pstate == 3) {
          this.setState({ showLoadingView: false });// 已经渲染过  直接跳过去
        }
        if (!this.state.isMute || this.state.isRecording) {
          // need renew AudioQueueRef for sound play
          if (!this.state.isRecording) {
            this.cameraGLView.stopAudioPlay();
          }

          Service.miotcamera.sendP2PCommandToDevice(MISSCommand.MISS_CMD_AUDIO_START, {}).then((retCode) => {
            console.log("resume audioplay ", retCode);
          });
          if (!this.state.isRecording) {
            this.cameraGLView.startAudioPlay();
          }
        }
        // 每次video-start都重新发送一次quality change吧
        if (this.videoQualityFetched || this.state.isRecording) {
          this.sendResolutionCmd(this.state.isRecording ? 3 : this.state.resolution, this.state.isRecording ? true : false);// 每次收到firstFrame都需要刷新resolution，避免去往其他页面再回来，分辨率变低了却不知道
        }
        if (this.startCallFlag && this.fromOneKeyCall) {
          LogUtil.logOnAll("_startCall for _realStartVideo fromOneKeyCall=", this.fromOneKeyCall);
          this._startCall(true);
          this.fromOneKeyCall = false;
          this.startCallFlag = false;
        }
      })
      .catch((err) => {
        this.cameraGLView && this.cameraGLView.stopRender();
        if (err == -1 || err == -8888) { // - 8888重置本地连接，然后开始重连。
          CameraPlayer.getInstance().resetConnectionState();
          Service.smarthome.reportLog(Device.model, "video-start的时候出错了:" + err);
          console.log("video-start error");
          this.queryNetworkJob();
          return;
        }

        this.setState({ pstate: 0, showLoadingView: false, showErrorView: true, errTextString: `${LocalizedStrings["camera_connect_error"]} ${err} ${LocalizedStrings["camera_connect_retry"]}` });// 已经渲染过  直接跳过去
      });

  }

  showLoadingView() {
    this.setState({ showLoadingView: true });
  }

  _onVideoClick() {
    LogUtil.logOnAll(TAG, "live page onVideoClick");
    if (!CameraPlayer.getInstance().isConnected()) {
      return;
    }
    this.setState((state) => {
      return {
        showPlayToolBar: !this.state.showPlayToolBar
      };
    }, () => {
      this._hidePlayToolBarLater();
    });
    // this.setState({
    //   showPlayToolBar: !this.state.showPlayToolBar
    // });

    // if (this.state.showPlayToolBar) { // setState在下个loop中才会生效，所以这里还要用老的状态检查
    //   if (!this.state.fullScreen) {
    //     // 横屏时不定时隐藏toolbar
    //     this._hidePlayToolBarLater();
    //   }
    //   if (this.showPlayToolBarTimer) {
    //     clearTimeout(this.showPlayToolBarTimer);
    //     this.showPlayToolBarTimer = null;
    //   }
    // }
    console.log("click video view");
  }
  // 设置定时器
  videoScaleTimer = null;
  // 倍数改变时的函数
  _onVideoScaleChanged(params) {
    let scale = params.nativeEvent?.scale;
    // 当返回有倍数时 清除定时器 并更新倍数 相当于防抖操作 一直触发事件就一直清空定时器
    if (scale) {
      clearTimeout(this.videoScaleTimer);
      
      this.videoScaleTimer = setTimeout(() => {
        console.log("tick"+ scale);
        this._updateScale(scale); // 更新倍数
      }, 0);  
    }
    
    this._onReceiveVideoRenderedEvent(params);
    // 进行节流操作 
    let endTime = Date.now();
    if ((endTime - this.startScaleTime) < 50) {
      console.log('_onVideoScaleChanged', scale)
      return;
    }
    this.startScaleTime = endTime;

    this._updateScale(scale);
  }

  _updateScale(scale) {
    if (scale) {
      scale = Number(scale);

      if (scale < 1) {
        scale = 1;
      }

      if (this.angleViewTimeout) {// 隔一段时间就需要隐藏
        clearTimeout(this.angleViewTimeout);
        this.angleViewTimeout = null;
      }

      this.angleViewTimeout = setTimeout(() => {
        this.setState({ showCameraAngleView: false, angleViewShowScale: false });
      }, 3000);
      if (!this.state.fullScreen) {
        this.videoPortraitScale = scale;// 保存竖屏下的videoScale
      }
      this.angleView?.setScale(scale);
      if (!this.state.showCameraAngleView) {
        this.setState(() => { return { showCameraAngleView: true, angleViewShowScale: true }}, () => {
          this.angleView?.setScale(scale);
          if (scale > 1 && this.state.showPlayToolBar) {
            this.setState({ showPlayToolBar: false });
          } else if (scale == 1 && !this.state.showPlayToolBar) {
            this.setState({ showPlayToolBar: true });
          }
        });
      }
      this.setState({ videoScale: scale, showCameraAngleView: true, angleViewShowScale: true, showPlayToolBar: scale > 1 ? false : true });
      if ((Date.now() - this.startScaleReportTime) > 1000) {
        this.startScaleReportTime = Date.now();
        if (scale == 1) {
          TrackUtil.reportClickEvent('camera_ZoomOutFull_Num');
        } else if (scale > this.tmpScale) {
          TrackUtil.reportClickEvent('camera_ZoomIn_Num');
        } else {
          TrackUtil.reportClickEvent('camera_ZoomOut_Num');
        }
      } else {
        this.tmpScale = scale;
      }
    }
  }

  _onReceiveVideoRenderedEvent(params) {
    if (params && params.nativeEvent && params.nativeEvent.firstVideoFrame && Host.isAndroid) {
      console.log(TAG, "received firstVideoFrame");
      this.isFirstFrameReceived = true;
      this.setState({ showDefaultBgView: false, showLoadingView: false, whiteTitleBg: false, showPlayToolBar: true });
      clearTimeout(this.snapshotTimer);
      setTimeout(() => {
        AlbumHelper.snapshotForSetting(this.cameraGLView, this.state.isFlip);
        CameraPlayer.getInstance().sendCommandForPic();
      }, 100);
      // important !!!!渲染了第一帧数据，开始缩放, 避免没有收到的时候，就发送这个通知，导致UI出问题了。
      if (!Host.isAndroid) {// 只有android有这个通知。。。。
        return;
      }
      StorageKeys.VIDEO_SCALE.
        then((result) => {
          if (typeof (result) == "number") {
            if (this.savedVideoScale != result) {
              setTimeout(() => {
                this.setState({ savedVideoScale: result, videoScale: result });
              }, 50);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });


      TrackConnectionHelper.onFrameRendered();
      TrackConnectionHelper.report();
    }
  }

  _onVideoPTZDirectionCtr(params) {
    if (!this.isPtz) {
      return;
    }

    console.log("received PTZ direction control from CameraRenderView");
    if (!this.enablePtzRotation) {
      Device.deviceId;
      return;
    }

    if (params && params.nativeEvent && params.nativeEvent.direction) {
      let direction = Number(params.nativeEvent.direction);
      if (this.isHorizontalPTZ && (direction == DirectionViewConstant.DIRECTION_UP || direction == DirectionViewConstant.DIRECTION_BOTTOM)) {
        return;
      }

      if (this.isReadonlyShared) {
        Toast.fail('cloud_share_hint');
        return;
      }
      LogUtil.logOnAll("screen drag causes ptz direction cmd");
      this._sendDirectionCmd(direction);
      this._sendDirectionCmd(DirectionViewConstant.CMD_OFF);
    }
  }

  canStepOut(ignoreSleep = false) {
    if (this.state.isRecording) {
      Toast.success("camera_recording_block");
      return false;
    }
    if (this.state.isCalling) {
      Toast.success("camera_speaking_block");
      return false;
    }
    if (this.state.isSleep && !ignoreSleep) {
      Toast.success(this.getPowerOffString());
      return false;
    }
    return true;
  }

  _handleSdcardClick(skipErrorCode = false) {

    TrackUtil.reportClickEvent("Camera_Playback_ClickNum"); // Camera_Playback_ClickNum

    this._handleSdcardPtzClick();
  }

  _handleSdcardV1V3Click(skipErrorCode = false) {
    // if(this.isHandlingSdcard) {//处理上一次点击后，又立马点击 防止重复。
    //   return;
    // }
    TrackUtil.reportClickEvent("Camera_Playback_ClickNum"); // Camera_Playback_ClickNum
    if (!this.canStepOut()) {
      return;
    }

    if (this.state.pstate < 2) {
      // 未连接
      Toast.success("no_playback_for_connect");
      return;
    }
    if (this.sdcardCode == -1) { // 这里应该弹sd卡状态获取失败。。。
      Toast.success("sdcard_page_desc_failed");
      return;
    }

    if (this.sdcardCode == 4) {
      Toast.success("formating_error");
      return;
    }
    if (this.sdcardCode == 3) { // sdcard error
      this.props.navigation.navigate("SDCardSetting");
      return;
    }

    if (this.sdcardCode == 1 || this.sdcardCode == 5) { // nosdcard
      // todo navigate to no memory card page
      this.props.navigation.navigate("SDCardSetting");// 这个页面 如果没有sd卡 也会自己显示空页面。
      return;
    }
    this.props.navigation.navigate("SdcardTimelinePlayerPage", { title: "sdcardPage" });// todo 待实现回看的代码
  }


  _handleSdcardPtzClick(item = null, lstType = "", eventType = "Default") {
    if (!this.canStepOut(true)) {
      return;
    }

    // if (this.sdcardCode == 4) {
    //   Toast.success("formating_error");
    //   return;
    // }

    // if (VersionUtil.Model_Chuangmi_022 == Device.model) {
    //   let data = { sdcardGetSuccess: true, sdcardStatus: sdcardCode, isVip: this.isVip };
    //   Service.miotcamera.showPlaybackVideos(JSON.stringify(data));
    // } else {
    // let showSdcard = this.showSdcardPage;
    let showSdcard = true;
    if (this.sdcardCode == 3 || this.sdcardCode == 1 || this.sdcardCode == 4 || this.sdcardCode == 5 || !this.pickedFreeCloud) { // 卡异常，无卡，卡正在格式化，都跳cloud页面
      showSdcard = false;
    }
    if (!this.getedDetectionSwitch) {
      showSdcard = false;
    }
    let param = { sdcardCode: this.sdcardCode, isVip: this.isVip, isShowSdcardPage: showSdcard, isSupportCloud: this.mFirmwareSupportCloud && CameraConfig.isSupportCloud(), cloudSwich: this.getedDetectionSwitch && this.detectionSwitch };
    LogUtil.logOnAll("sdcard cloud timeline page: param==", JSON.stringify(param));
    // 进入回看前 清空一次SdFileManager里的列表。
    SdcardEventLoader.getInstance().clearSdcardFileList();
    console.log(param,9999999999)
    // 添加这个原因是跳回看，播放器区域会一半黑一半显示
    if (this.cameraGLView != null && !this.isCheckingPermission) {
      this.cameraGLView.hidesSurfaceView();
    }
    this.props.navigation.navigate("SdcardCloudTimelinePageV2", Object.assign(param, { item, lstType, eventType }));// todo 待实现回看的代码
    // }
    // 显示事件类型时的埋点
    switch(eventType){
      case 'BabyCry':
        // Toast.success("as_baby_cry")
        TrackUtil.reportClickEvent("Camera_Monitoring_BabyCrying_ClickNum");
        break;
      case 'PeopleCough':
        // Toast.success("cough_desc")
        TrackUtil.reportClickEvent("Camera_Monitoring_Coughing_ClickNum");
        break;
      case 'AI':
        // Toast.success("ai_desc")
        TrackUtil.reportClickEvent("Camera_Monitoring_Automation_ClickNum");
        break;
      case 'PeopleMotion':
        // Toast.success('people_move_desc')
        TrackUtil.reportClickEvent("Camera_Monitoring_PeopleDetected_ClickNum");
        break;
      case 'EmotionRecognition':
        // Toast.success('expression_desc')
        TrackUtil.reportClickEvent("Camera_Monitoring_ExpressionRecognition_ClickNum");
        break;
      case 'Face':
        // Toast.success('face_desc')
        TrackUtil.reportClickEvent("Camera_Monitoring_FaceDeteced_ClickNum");
        break;
      case 'FenceIn':
        // Toast.success('pass_in_desc')
        TrackUtil.reportClickEvent("Camera_Monitoring_LeaveTheFence_ClickNum");
        break;
      case 'FenceOut':
        // Toast.success('pass_out_desc')
        TrackUtil.reportClickEvent("Camera_Monitoring_EnterTheFence_ClickNum");
        break;
      case 'LouderSound':
        // Toast.success('loud_desc')
        TrackUtil.reportClickEvent("Camera_Monitoring_LargeSound_ClickNum");
        break;
      case 'ObjectMotion':
        // Toast.success("object_move_desc")
        TrackUtil.reportClickEvent("Camera_Monitoring_MotionDeteced_ClickNum");
        break;
      default:
        return;
    }
  }

  _handleFunnyMemoryClick() {
    if (!this.canStepOut(true)) {
      return;
    }
    // 埋点--趣拍回忆功能点击
    TrackUtil.reportClickEvent("Camera_FunShotMemories_ClickNum")
    this.props.navigation.navigate("FunnyMemoryPage",{vip:true});
  }

  getPowerOffString() {
    return this.isSupportPhysicalCover ? "camera_physical_covered" : "camera_power_off";
  }

  render() {
    return (
      <View style={styles.main}>
        {/* <SafeAreaView style={{ backgroundColor: "#ffffff" }}></SafeAreaView> */}

        {this._renderVideoLayout()}
        {/* {this._renderCloudVipRenewView()} */}
        {this._renderControlLayout()}
        {/*{this._renderGlobalLoading()}*/}
        {this._renderTimeoutDialog()}

        {this._renderSleepNotifyDialog()}


        <DeviceOfflineDialog
          ref={(powerOfflineDialog) => {
            this.powerOfflineDialog = powerOfflineDialog;
          }}
        />
        <LocalModeDialog
          ref={(localModeDialog) => {
            this.localModeDialog = localModeDialog;
          }}
        />
        <NoNetworkDialog
          ref={(noNetworkDialog) => {
            this.noNetworkDialog = noNetworkDialog;
          }}
        />
        {this._renderShowSecurityDialog()}
        {this._renderLogUploaderDialog()}
        {this._renderPermissionDialog()}
        {this._renderVisitInfoDialog()}
        {/* <SafeAreaView></SafeAreaView> */}
        {this._renderGBFDialog()}
        {/* {this._renderOneKeyCallDialog()} */}
        {this._renderSDCardFormatDialog()}
        {this._renderSDCardFullDialog()}
        {this._renderSDCardSmallDialog()}
        {this._renderScreenBindDialog()}
        {this._renderLanConfigDialog()}
        {this._renderAttentionDialog()}
        {this._renderVipCloudOpenDialog()}
        {this._renderUpdateAppDialog()}
        {this._renderAIOpenDialog()}
      </View>
    );
  }

  _renderAIOpenDialog() {
    return (
      <MessageDialog
        visible={ this.state.showClosePrivateDialog }
        title={ LocalizedStrings['tips'] }
        message={ LocalizedStrings['object_open_msg'] }
        useNewType={ true }
        dialogStyle={ {
          allowFontScaling: true,
          unlimitedHeightEnable: true,
          titleStyle: {
            fontSize: 18
          },
          itemSubtitleNumberOfLines: 0
        } }
        onDismiss={ () => {
          this.setState({ showClosePrivateDialog: false });
        } }
        buttons={ [{
          text: LocalizedStrings['action_cancle'],
          // colorType: 'grayLayerBlack',
          callback: () => {
            this.setState({ showClosePrivateDialog: false });
          }
        }, {
          text: LocalizedStrings['close'],
          // colorType: 'grayLayerBlack',
          callback: () => {
            this.setState({ showClosePrivateDialog: false });
            this.closePrivateSwitch();
          }
        }] }/>
    );
  }

  closePrivateSwitch() {
    let params = [{ "sname": SIID_AI_CUSTOM, "pname": PIID_PRIVATE_AREA_SWITCH, value: false }];
    AlarmUtilV2.setSpecPValue(params, TAG).then((res) => {
      console.log("_onSwitchValue success", res);
      if (res[0].code == 0) {
        Toast.success("c_set_success");
      }
    }).catch((err) => {
      Toast.fail("c_set_fail", err);
      console.log("_onSwitchValue error", err);
    });
  }

  _renderVipCloudOpenDialog() {
    return (
      <MessageDialog
        visible={this.state.showVipCloudOpenDialog && this.isVip}
        title={LocalizedStrings['tip_vip_cloud_open_title']}
        message={LocalizedStrings['tip_vip_cloud_open_switch']}
        onDismiss={() => {
          this.setState({ showVipCloudOpenDialog: false });
        }}
        canDismiss={false}
        buttons={[
          {
            text: LocalizedStrings["btn_cancel"],
            // style: { color: 'lightpink' },
            callback: (_) => {
              this.setState({ showVipCloudOpenDialog: false });
            }
          },
          {
            text: LocalizedStrings["open"],
            // style: { color: 'lightblue' },
            callback: (_) => {
              let value = true;
              let params = [{ "sname": SIID_MOTION_DETECTION, "pname": PIID_MOTION_DETECTION, value: value }];
              AlarmUtilV2.setSpecPValue(params).then((result) => {
                if (result[0].code === 0) {
                  Toast.success('c_set_success');
                  this.setState({ showVipCloudOpenDialog: false });
                } else {
                  Toast.fail('c_set_fail');
                  this.setState({ showVipCloudOpenDialog: false });
                }
              }).catch((err) => {
                Toast.fail('c_set_fail', err);
                this.setState({ showVipCloudOpenDialog: false });
              });
            }
          }
        ]}
      />
    );
  }

  _renderUpdateAppDialog() {
    let myButtons = [
      {
        text: LocalizedStrings["btn_cancel"],
        callback: (_) => {
          this.setState({ showUpdateAppDialog: false });
        }
      },
      {
        text: LocalizedStrings["go_there"],
        callback: (_) => {
          this.setState({ showUpdateAppDialog: false });
          this.openAppStore();
        }
      }
    ];
    let msg = LocalizedStrings['update_warning_ios'];
    if (Platform.OS == "android") {
      myButtons = [
        {
          text: LocalizedStrings["offline_divice_ok"],
          // style: { color: 'lightpink' },
          callback: (_) => {
            this.setState({ showUpdateAppDialog: false });
          }
        }
      ];
      msg = LocalizedStrings['update_warning_android'];
    }
    return (
      <MessageDialog
        visible={this.state.showUpdateAppDialog}
        title={LocalizedStrings['update_warning']}
        message={msg}
        onDismiss={() => {
          this.setState({ showUpdateAppDialog: false });
        }}
        canDismiss={true}
        buttons={myButtons}
      />
    );
  }
  _renderAttentionDialog() {
    if (!this.state.attentionDlg) {
      return;
    }
    let attentionItem = this.eventSortList[this.eventTypeAttentionIndex];
    let attention = attentionItem ? attentionItem.attention : 0;
    return (
      <AbstractDialog
        visible={this.state.attentionDlg}
        showTitle={false}
        showSubtitle={false}
        useNewTheme={true}
        onDismiss={() => { this.setState({ attentionDlg: false }); }}
        buttons={[
          {
            text: LocalizedStrings['action_cancle'],
            colorType: "grayLayerBlack",
            callback: (_) => {
              this.setState({ attentionDlg: false });
            }
          }
        ]}>
        <TouchableOpacity onPress={() => {
          let item = this.eventSortList.splice(this.eventTypeAttentionIndex, 1)[0];
          if (!item) {
            LogUtil.logOnAll("_renderAttentionDialog-=-=eventSortList==", this.eventSortList);
            LogUtil.logOnAll("_renderAttentionDialog-=-=eventTypeAttentionIndex==", this.eventTypeAttentionIndex);
            this.loadEventSortStatics();
            return;
          }
          if (attention) {
            item.attention = 0;
            Util.insertEventItem(item, this.eventSortList);
          } else {
            item.attention = 1;
            this.eventSortList.unshift(item);
          }
          AlarmUtilV2.setEventSort(this.eventSortList, TAG).then(() => {
            this.loadEventSortStatics();
          }).catch(() => {
            Toast.fail('c_set_fail');
          });
        }}>
          <Text style={{ paddingTop: 30, paddingBottom: 30, paddingStart: 40 }}>
            {attention ? LocalizedStrings["preview_career_event_cancle"] : LocalizedStrings["preview_career_event"]}
          </Text>
        </TouchableOpacity>
      </AbstractDialog>
    );
  }
  _renderSDCardSmallDialog() {
    let myButtons = [
      {
        text: LocalizedStrings["offline_divice_ok"],
        // style: { color: 'lightblue' },
        callback: (_) => {
          this.setState({ sdcardSmallDialog: false });
        }
      }
    ];
    return (
      <MessageDialog
        visible={this.state.sdcardSmallDialog}
        title={LocalizedStrings['sdcard_small_title']}
        message={LocalizedStrings['sdcard_small_msg']}
        buttons={myButtons}
        onDismiss={() => {
          this.setState({ sdcardSmallDialog: false });
        }}
      />
    );
  }

  _renderOneKeyCallDialog() {
    if (VersionUtil.isAiCameraModel(Device.model)) {
      return (
        <AbstractDialog
          visible={this.state.showOneKeyCallDialog}
          title={LocalizedStrings['someone_calling']}
          useNewTheme
          canDismiss={false}
          buttons={[
            {
              text: LocalizedStrings["talk_for_push_reject"],
              // style: { color: 'lightpink' },
              callback: (_) => {
                this.setState({ showOneKeyCallDialog: false });
                AlarmUtil.putOneKeyCallStatus(0).then((res) => {
                  LogUtil.logOnAll("putOneKeyCallStatus(0)", JSON.stringify(res));
                }).catch((err) => {
                  LogUtil.logOnAll("putOneKeyCallStatus(0) err", JSON.stringify(err));
                });
              }
            },
            {
              text: LocalizedStrings["talk_for_push_accept"],
              // style: { color: 'lightblue' },
              callback: (_) => {
                if (!CameraPlayer.getInstance().isConnected()) {
                  Toast.fail('talk_for_push_connecting');
                  return;
                }
                LogUtil.logOnAll("_startCall for _renderOneKeyCallDialog fromOneKeyCall=", this.fromOneKeyCall);
                this._startCall();
                // Toast.loading('talk_for_push_calling');
              }
            }
          ]}>
          <View></View>
        </AbstractDialog>
      );
    }
  }
  _getCloudIsOpen() {
    let params = [{ "sname": SIID_MOTION_DETECTION, "pname": PIID_MOTION_DETECTION }];
    AlarmUtilV2.getSpecPValue(params, 2, TAG).then((result) => {
      if (result[0].code === 0) {
        let detectStc = result[0].value;
        if (!detectStc && this.shouldShowVipCloudOpenDialog) {
          this.shouldShowVipCloudOpenDialog = false;
          this.setState({ showVipCloudOpenDialog: true });
        }
      }
    }).catch(() => {});
  }

  _showGBFDialog() {
    if (Device.isReadonlyShared) {
      console.log("isReadonlyShared not supported");
      return;
    }
    StorageKeys.IS_FACE_PRIVACY_GBF_NEEDED.then((result) => {
      if (result !== false) {
        StorageKeys.IS_FACE_PRIVACY_GBF_NEEDED = false;
        this.setState({ showGBFDialog: true });
      }
    }).catch((err) => {
      StorageKeys.IS_FACE_PRIVACY_GBF_NEEDED = false;
      this.setState({ showGBFDialog: true });
    });
  }
  _showScreenBindDialog() {
    this.shouldRequestScreenState = false;
    if (Device.isReadonlyShared) {
      console.log("isReadonlyShared not supported");
      return;
    }
    // const params = [{ sname: SIID_SCREEN_CONTROL, pname: PIID_SCREEN_STATUS }];
    this.getScreenState().then((result) => {
      if (result[0]?.code === 0) {
        // todo 需要更具连接状态判断是否需要显示
        let flag = result[0]?.value == 1;
        StorageKeys.SCREEN_BIND_DIALOG.then((res) => {
          if (res !== false) {
            this.setState({ showScreenBindDialog: flag, screenBindStatus: result[0]?.value });
          } else {
            this.setState({ screenBindStatus: result[0]?.value });
          }
          if (flag) {
            StorageKeys.SCREEN_BIND_DIALOG = false;
          }
        }).catch(() => {
          this.setState({ showScreenBindDialog: flag, screenBindStatus: result[0]?.value });
          if (flag) {
            StorageKeys.SCREEN_BIND_DIALOG = false;
          }
        });
      }
    }).catch((e) => {
      this.setState({ showScreenBindDialog: false, screenBindStatus: 2 });
    });
  }

  getScreenState() {
    return new Promise((resolve, reject) => {
      const params = [{ sname: SIID_SCREEN_CONTROL, pname: PIID_SCREEN_STATUS }];
      AlarmUtilV2.getSpecPValue(params).then((result) => {
        resolve(result);
      }).catch((err)=>{
        reject(err);
      });
    });

  }

  _renderGBFDialog() {
    if (VersionUtil.isAiCameraModel(Device.model)) {
      return (
        <MessageDialog
          visible={this.state.showGBFDialog}
          title={LocalizedStrings['face_service_tips']}
          message={this.isCloudServer?LocalizedStrings['eu_face_service_tips_message']:LocalizedStrings['face_service_tips_message']}
          canDismiss={false}
          buttons={[
            {
              text: LocalizedStrings["license_negative_btn_face"],
              // style: { color: 'lightpink' },
              callback: (_) => {
                AlarmUtil.setFacePrivacyConfirmation(AlarmUtil.FACE_CANCEL);
                this.setState({ showGBFDialog: false });
              }
            },
            {
              text: LocalizedStrings["license_positive_btn_face"],
              // style: { color: 'lightblue' },
              callback: (_) => {
                AlarmUtil.setFacePrivacyConfirmation(AlarmUtil.FACE_ACCEPT);
                this.setState({ showGBFDialog: false });
              }
            }
          ]}
        />
      );
    }
  }

  _renderSDCardFullDialog() {
    let myButtons = [
      {
        text: LocalizedStrings["btn_cancel"],
        // style: { color: 'lightpink' },
        callback: (_) => {
          this.setState({ sdcardFullDialog: false });
        }
      },
      {
        text: LocalizedStrings["btn_confirm"],
        // style: { color: 'lightblue' },
        callback: (_) => {
          this.setState({ sdcardFullDialog: false });
          this.props.navigation.navigate("SDCardSetting", { toFormateSDCard: true, needShowFormatDialog: false });
        }
      }
    ];
    if (Device.isReadonlyShared) {
      myButtons = [
        {
          text: LocalizedStrings["offline_divice_ok"],
          // style: { color: 'lightpink' },
          callback: (_) => {
            this.setState({ sdcardFullDialog: false });
          }
        }
      ];
    }
    
    return (
      <MessageDialog
        visible={this.state.sdcardFullDialog}
        title={LocalizedStrings['sdcard_notfull_title']}
        message={Device.isReadonlyShared && Device.permitLevel === 36 ? LocalizedStrings['sdcard_notfull_message_readonly'] : LocalizedStrings['sdcard_notfull_message']}
        // canDismiss={false}
        buttons={myButtons}
        onDismiss={() => {
          this.setState({ sdcardFullDialog: false });
        }}
      />
    );
  }

  _renderShowSecurityDialog() {
    let myButtons = [
      {
        text: LocalizedStrings["security_setting_later"],
        // style: { color: 'lightpink' },
        callback: (_) => {
          StorageKeys.IS_PINCODE_SETTING_FORCE = true;
          this.setState({ showPinCodeWarningDialog: false });
        }
      },
      {
        text: LocalizedStrings["security_setting_now"],
        // style: { color: 'lightblue' },
        callback: (_) => {
          StorageKeys.IS_PINCODE_SETTING_FORCE = true;
          this.setState({ showPinCodeWarningDialog: false });
          this.isOnRequestingPincode = true;
          Host.ui.openSecuritySetting();// 打开页面
          this._bindPinCodeSwitchChangedEvent();
        }
      }
    ];

    return (
      <MessageDialog
        visible={this.state.showPinCodeWarningDialog}
        title={LocalizedStrings['security_setting']}
        message={LocalizedStrings['security_setting_desc']}
        // canDismiss={false}
        buttons={myButtons}
        onDismiss={() => {
          StorageKeys.IS_PINCODE_SETTING_FORCE = true;
          this.setState({ showPinCodeWarningDialog: false });
        }}
      />
    );
  }

  _renderSDCardFormatDialog() {
    let myButtons = [
      {
        text: LocalizedStrings["btn_cancel"],
        // style: { color: 'lightpink' },
        callback: (_) => {
          this.setState({ sdcardFormatDialog: false });
        }
      },
      {
        text: LocalizedStrings["btn_confirm"],
        // style: { color: 'lightblue' },
        callback: (_) => {
          this.setState({ sdcardFormatDialog: false });
          this.props.navigation.navigate("SDCardSetting", { toFormateSDCard: true, needShowFormatDialog: false });
        }
      }
    ];
    if (Device.isReadonlyShared || this.sdcardCode == CameraPlayer.SD_CARD_INCOMPATIBLE_CODE) {
      myButtons = [
        {
          text: LocalizedStrings["offline_divice_ok"],
          // style: { color: 'lightpink' },
          callback: (_) => {
            this.setState({ sdcardFormatDialog: false });
          }
        }
      ];
    }
    return (
      <MessageDialog
        visible={this.state.sdcardFormatDialog}
        title={LocalizedStrings[`sdcard_format_title_${ this.sdcardCode }`]}
        message={Device.isReadonlyShared ? LocalizedStrings[`sdcard_format_message_readonly_${ this.sdcardCode }`]
          : LocalizedStrings[`sdcard_format_message_${ this.sdcardCode }`]}
        // canDismiss={false}
        buttons={myButtons}
        onDismiss={() => {
          this.setState({ sdcardFormatDialog: false });
        }}

      />
    );
  }

  _renderLanConfigDialog() {
    let myButtons = [
      {
        text: LocalizedStrings["security_setting_later"],
        callback: (_) => {
          this.setState({ lanConfigDialog: false });
        }
      },
      {
        text: LocalizedStrings["security_setting_now"],
        callback: (_) => {
          this.setState({ lanConfigDialog: false });
          this.props.navigation.navigate("CareScreenSignal");
        }
      }
    ];
    return (
      <MessageDialog
        visible={this.state.lanConfigDialog}
        title={LocalizedStrings['care_screen_signal']}
        message={LocalizedStrings['lan_home_alert_msg']}
        // canDismiss={false}
        buttons={myButtons}
        onDismiss={() => {
          this.setState({ lanConfigDialog: false });
        }}

      />
    );
  }

  _renderGlobalLoading() {
    if (!this.state.showGlobalLoading) {
      return null;
    }
    return (
      <View style={{ zIndex: 4, position: "absolute", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#00000066" }}>
        <LoadingView style={{ width: 100, height: 100 }} />
      </View>
    );

  }

  _renderTimeoutDialog() {
    return (
      <MessageDialog
        message={LocalizedStrings["network_fake_connected"]}
        buttons={
          [
            {
              text: LocalizedStrings['action_confirm'],
              callback: () => {
                this.exitPackage();
              }
            }
          ]
        }
        onDismiss={() => {
          // this.setState({ showTimeoutDialog: false });
        }}
        visible={this.state.showTimeoutDialog}
      >

      </MessageDialog>
    )
  }

  _renderScreenBindDialog() {
    if (this.state.showPinCodeWarningDialog) {
      // 安全设置弹框显示在前台
      return null;
    }
    return (
      <AbstractDialog
        visible={this.state.showScreenBindDialog}
        title={LocalizedStrings['care_screen_start_to_connect']}
        useNewTheme
        canDismiss={false}
        onDismiss={() => {
          this.setState({ showScreenBindDialog: false });
        }}
        buttons={[
          {
            text: LocalizedStrings["care_screen_do_not_connect"],
            // style: { color: 'lightpink' },
            callback: (_) => {
              this.setState({ showScreenBindDialog: false });
            }
          },
          {
            text: LocalizedStrings["care_screen_start_connect"],
            // style: { color: 'lightblue' },
            callback: (_) => {
              this.setState({ showScreenBindDialog: false });
              this._toConnectCareScreen();
            }
          }
        ]}>
        <View>
          <Text style={{ fontSize: 14, fontWeight: "400", marginHorizontal: 28, marginTop: 16, marginBottom: 25 }}>{LocalizedStrings["care_screen_start_to_connect_desc"]}</Text>
          <Image
            style={{  width: 'auto', height: 175, borderRadius: 12, paddingHorizontal: 28, marginBottom: 25 }}
            resizeMode={'contain'}
            source={Util.isDark() ? require('../../Resources/Images/icon_screen_dark.webp') : require('../../Resources/Images/icon_screen_nor.webp')}/>
        </View>
      </AbstractDialog>
    );
  }

  _toConnectCareScreen() {
    this.getScreenState().then((res) => {
      if (res[0].code == 0 && res[0].value == 1) {
        // 未绑定状态
        const params = [{ "sname": SIID_SCREEN_CONTROL, "pname": PIID_SCREEN_BIND_CMD, value: 0 }];
        AlarmUtilV2.setSpecPValue(params).then((res) => {
          if (res[0]?.code == 0) {
            this.shouldRequestScreenState = true;
            this.props.navigation.navigate('CareScreenConnect');
          } else {
            Toast.fail("c_set_fail");
          }
        }).catch(() => {
          Toast.fail("c_set_fail");
        });
      } else {
        this.props.navigation.navigate('CareScreenSetting');
      }
    }).catch((err) => {
      Toast.fail("c_set_fail");
    });

    // this.props.navigation.navigate('CareScreenSetting');
  }

  exitPackage = () => {
    Package.exit();
  }

  _getStatusBarHeight() {
    let statusBarHeight = StatusBarUtil._getInset("top");
    return statusBarHeight;
  }

  _getTitleBarPortraitHeight() {
    let titleBarHeight = navigationBarHeightFat;
    let statusBarHeight = this._getStatusBarHeight();

    titleBarHeight += statusBarHeight;
    return titleBarHeight;
  }

  _initHeightValues() {
    let winWidth = Dimensions.get('window').width;
    let winHeight = Dimensions.get('window').height;
    let width = Math.min(winWidth, winHeight);
    let height = Math.max(winWidth, winHeight);
    this.winPortraitWidth = width;
    this.winPortraitHeight = height;
    this.videoPortraiHeight = width * 9 / 16;

    let optionAreaHeight = this.winPortraitHeight - this.videoPortraiHeight - fixControlBarHeight - navigationBarHeightFat - this._getStatusBarHeight();
    //操作区域的高度 = 页面window高度-视频区域高度-截图区域高度 - 导航栏高度 - 状态栏区域高度
    let directBottom;
    if (optionAreaHeight >= 300) {// 根据不同机型做适配，区分处理。
      directBottom = 50;
      this.directViewHeight = 220;
      this.directViewTop = 20;
    } else if (optionAreaHeight >= 270) {
      directBottom = 30;
      this.directViewHeight = 180;
      this.directViewTop = 20;
    } else {
      directBottom = 30;
      this.directViewHeight = 150;
      this.directViewTop = 0;
    }

    this.directContainerHeight = optionAreaHeight - directBottom;
  }

  _getWindowPortraitHeight() {
    if (this.winPortraitHeight == undefined) {
      this._initHeightValues();
    }

    return this.winPortraitHeight;
  }

  _getVideoPortraitHeight() {
    if (this.videoPortraiHeight == undefined) {
      this._initHeightValues();
    }

    return this.videoPortraiHeight;
  }

  _getDirectionContainerHeight() {
    if (this.directContainerHeight == undefined) {
      this._initHeightValues();
    }
    return this.directContainerHeight;
  }

  _getDirectionViewHeight() {
    if (this.directViewHeight == undefined) {
      this._initHeightValues();
    }
    return this.directViewHeight;
  }

  _getDirectionViewTop() {
    if (this.directViewTop == undefined) {
      this._initHeightValues();
    }
    return this.directViewTop;
  }

  _getVideoAreaHeight() {
    if (this.state.fullScreen) {
      return "100%";
    } else {
      return this._getVideoPortraitHeight();
    }
  }
  createVideoPanResponder(){
    this.videoPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true, // 刚开始的时候
      onMoveShouldSetPanResponder: () => true,
      onShouldBlockNativeResponder: () => true,
      onPanResponderTerminationRequest: () => true, // 不允许其他人抢占。
      onPanResponderGrant: (evt) => {
        console.log("============================开始触摸")
        // this.setState({ showDirectCtr: true });
      },

      onPanResponderMove: (e, gestureState) => {
        if(e.nativeEvent.changedTouches.length > 1){
          // console.log("-------------------------", e.nativeEvent.changedTouches);
          let dy = Math.abs(e.nativeEvent.changedTouches[1].locationY - e.nativeEvent.changedTouches[0].locationY);
          let dx = Math.abs(e.nativeEvent.changedTouches[1].locationX - e.nativeEvent.changedTouches[0].locationX);
          let value = 0;
          dy === 0 ? value = dx : (dx === 0 ? value = dy : value = Math.sqrt(dy * dy + dx * dx))
          this.setDoubleScale(value);
          // this.setState({doubleVideoScale: 1.8})
        }
      },

      onPanResponderRelease: () => {
        
      },

      onPanResponderTerminate: () => { }
    })
  }
  setDoubleScale(value){
    value = Number(((value) / 100).toFixed(2));
    console.log('---------------------------------', value);
    this.setState({doubleVideoScale: value})
  }
  _renderVideoLayout() {
    let videoLayoutStyle;
    if (this.state.fullScreen) {
      videoLayoutStyle = {
        backgroundColor: 'black',
        width: "100%",
        height: "100%",
        position: "relative"
      };
    } else {
      let videoHeight = this._getVideoPortraitHeight();
      let containerHeight = videoHeight + this._getTitleBarPortraitHeight();//视频区域的高度 == 标题栏+状态栏+视频高度
      videoLayoutStyle = {
        display: "flex",
        position: "relative",
        zIndex: 0,
        backgroundColor: "#ffffff",
        flexDirection: 'column',
        width: this.winPortraitWidth,
        height: containerHeight
      };
    }
    let videoHeight = this._getVideoPortraitHeight() + this._getTitleBarPortraitHeight() * 2;
    let bottom = -this._getTitleBarPortraitHeight();
    let videoContainer = {
      zIndex: 0,
      position: "absolute",
      width: "100%",
      height: videoHeight,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: 'transparent',
    }

    let videoScrollContainer = {
      zIndex: 100,
      position: "absolute",
      width: "100%",
      height: videoHeight,
      bottom: bottom,
      borderWidth: 2,
      borderColor: 'red'
    }

    return (
      <View style={videoLayoutStyle}>
        <View style={videoContainer} {...this.videoPanResponder.panHandlers} >
        {/* <ScrollView style={videoScrollContainer} maximumZoomScale={6.0} > */}
          {this._renderVideoView()}
              <Text style={{
            backgroundColor: 'red', 
            width: '100%', 
            height: 50, 
            zIndex: 1000,
            position: "relative",
            bottom: 0,
            transform: [{scale: this.state.doubleVideoScale}]
            }}>12131313131313</Text>
        {/* </ScrollView> */}
        </View>

        {this._renderAngleView()}
        {this._renderDefaultBgView()}

        {this._renderPowerOffView()}
        {this._renderRecordTimeView()}
        {this._renderErrorRetryView()}
        {this._renderLoadingView()}
        {this._renderSnapshotView()}
        {this._renderPauseView()}
        {this._renderDirectionEndHintView()}

        {this._renderTitleView()}

        {this._renderFloatingButtonsGroup()}
        {this._renderLandscapeButtonsGroup()}
        {this._renderLandscapeDirectionView()}

        {this._renderResolutionDialog()}
        {this._renderPanoViewDialog()}
        {this._renderTargetPushView()}

        {/* {this._renderTestView()} */}
      </View>
    );
  }

  // 这里是停止转动
  _renderDirectionEndHintView() {
    return null;// CHUANGMI-8497
  }


  _renderSleepNotifyDialog() {

    return (
      <CommonMsgDialog
        ref={(ref) => { this.sleepDialog = ref; }}
        visible={false}
        title={CameraConfig.isSupportPhysicalCover(Device.model) ? LocalizedStrings["physical_cover_title"] : LocalizedStrings["sleep_off_title"]}
        text={LocalizedStrings["sleep_off_subtitle"]}
        onConfirmPress={() => {
          this.sleepDialog.hide();
        }}
      >
      </CommonMsgDialog>

      //   <MJDialog
      //     ref = { component=>{ this.dialog = component; } }
      //     outSideDisappear = { true } //是否点击半透明区域让对话框消失;
      //     contentStyle = { styles.dialog }
      //     position = "bottom" // 对话框内容区域布局对齐方式:"center","top","bottom", 默认值是:"center"
      //     height = { PixelRatio.getPixelSizeForLayoutSize(50) }
      //     isHidden = { this.state.isDialogShow } // 对话框默认是否隐藏,默认为false
      //     isStatusBarHidden = { true } //状态栏是否处于显示状态，默认为false;
      //     margin = { PixelRatio.getPixelSizeForLayoutSize(5) }>
      //       <View style={ styles.dialog }>
      //           <Text style={ styles.title }>关闭摄像机</Text>
      //           <Text style={ styles.content }>摄像机将停止工作和记录视频信息</Text>
      //           <View style = { styles.dialogContent }>
      //               <Text style={ styles.ok }
      //               >知道了</Text>
      //           </View>
      //         </View>
      // </MJDialog>
    );

  }

  _renderLogUploaderDialog() {
    return (
      <MessageDialog
        message={this.state.logDialogContent}
        cancelable={false}
        buttons={[
          {
            text: LocalizedStrings['action_cancle'],
            callback: () => {
              feedbackLogUploaderStatus(2);
              this.setState({ showLogDialog: false });
            }
          },
          {
            text: LocalizedStrings['action_confirm'],
            callback: () => {
              feedbackLogUploaderStatus(1);
              this.setState({ showLogDialog: false });
            }
          }

        ]}
        onDismiss={() => {
          console.log('onDismiss');
          this.setState({ showLogDialog: false });
        }}
        visible={this.state.showLogDialog} />
    );
  }
  // 这里是弹出对话框
  _renderPermissionDialog() {
    if (!this.state.showPermissionDialog) {
      return null;
    }
    // status == 0 存储卡/相册
    // status == 1 麦克风
    // 
    let message = "";
    if (this.state.permissionRequestState == 0) {
      message = LocalizedStrings["permission_tips_denied_msg"].replace("%s", Platform.OS === "android" ? LocalizedStrings["permission_name_storage"] : LocalizedStrings["s_photo_album"]);
    } else if (this.state.permissionRequestState == 1) {
      message = LocalizedStrings["permission_tips_denied_msg"].replace("%s", LocalizedStrings["permission_name_microphone"]);
    } else {
      message = LocalizedStrings["cs_float_window_permission"];
    }
    return (
      // <AbstractDialog

      <MessageDialog
        title={LocalizedStrings["tips"]}
        message={message}
        modalStyle={{ width: "100%" }}
        messageStyle={{
          fontSize: 14,
        }}
        buttons={[
          {
            text: LocalizedStrings["action_cancle"],
            callback: () => {
              this.setState({ showPermissionDialog: false });
            }
          },
          {
            text: LocalizedStrings["setting"],
            callback: () => {
              Host.ui.openTerminalDeviceSettingPage(1);
              this.setState({ showPermissionDialog: false });
            }
          }
        ]}
        onDismiss={() => {
          this.setState({ showPermissionDialog: false });
        }}
        visible={this.state.showPermissionDialog} />
    );

  }

  _renderRecordTimeView() {
    if (!this.state.isRecording) {
      return null;
    }
    let recordTimerBarHeight = 24;
    // let top = this.state.fullScreen ? (kWindowHeight > 600 ? 320 : 200) : (kWindowHeight > 600 ? (this._getVideoAreaHeight() - 10 - recordTimerBarHeight) : 100);

    let containerStyle = {
      position: "absolute",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      backgroundColor: "#000000CC", // 0.8 opacity
      borderRadius: 20,
      width: 90,
      height: recordTimerBarHeight
    };

    if (this.state.fullScreen) {
      if (!this.state.showTargetPushView || this.shownTarget) {
        containerStyle.top = 30;
      }else {
        containerStyle.top = 50;
      }
    } else {
      if (!this.state.showTargetPushView || this.shownTarget) {
        containerStyle.bottom = (kWindowHeight > 600 ? (this._getVideoAreaHeight() - 10 - recordTimerBarHeight) : 100);
      }else {
        containerStyle.bottom = (kWindowHeight > 600 ? (this._getVideoAreaHeight() - 10 - recordTimerBarHeight - 40) : 60);
      }
    }

    let seconds = this.state.recordTimeSeconds;
    let second = Number.parseInt(seconds % 60);
    let minute = Number.parseInt(seconds / 60 % 60);
    let hour = Number.parseInt(seconds / 60 / 60 % 24);

    // if (Platform.OS === "ios") {
    //   this.lastRecordTime = `${ minute > 9 ? minute : `0${ minute }` }:${ second > 9 ? second : `0${ second }` }`;
    // } else {
    //   this.lastRecordTime = `${ hour > 9 ? hour : `0${ hour }` }:${ minute > 9 ? minute : `0${ minute }` }:${ second > 9 ? second : `0${ second }` }`;
    // }
    // this.lastRecordTime = `${ minute > 9 ? minute : `0${ minute }` }:${ second > 9 ? second : `0${ second }` }`;
    this.lastRecordTime = `${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}:${second > 9 ? second : `0${second}`}`;

    return (
      <View
        style={containerStyle}>
        <View
          accessibilityLabel={this.state.fullScreen ? DescriptionConstants.zb_43 : DescriptionConstants.zb_38}
          style={{
            backgroundColor: "#F43F31FF",
            borderRadius: 5,
            width: 5,
            height: 5,
            marginRight: 2
          }} />
        <Text style={{
          color: "#ffffff",
          fontSize: kIsCN ? 13 : 11,
          fontWeight: "bold",
          textAlign: "center",
          textAlignVertical: "center",
          lineHeight: 24,
          marginLeft: 2
        }}
        >{this.lastRecordTime}</Text>
      </View>


    );
  }

  _renderDefaultBgView() {
    if (!this.state.showDefaultBgView) {
      return null;
    }

    if (Platform.OS === "ios") {
      if (!this.state.bgImgUri) return null;
    //   return null; // 只有安卓在渲染第一帧之前显示CameraRenderView的背景色，ios会在背景色上显示黑色视频区域，不需要黑色背景
    }

    // let imgSource = { uri: this.state.bgImgUri };
    let viewHeight = this._getVideoAreaHeight();
    return (
      <View style={{ display: "flex", position: "absolute", bottom: 0, width: "100%", backgroundColor: "black", height: viewHeight }}
      >

        {this.state.bgImgUri ? <Image style={{ width: "100%", height: "100%" }}
          source={{ uri: this.state.bgImgUri }}
        /> : null}

      </View>
    );
  }

  _renderPauseView() {
    if (!this.state.showPauseView || this.state.showErrorView) {
      return null;
    }
    let viewHeight = this._getVideoAreaHeight();
    return (
      <View style={{ display: "flex", position: "absolute", bottom: 0, width: "100%", height: viewHeight, alignItems: "center", justifyContent: "center", zIndex: 10 }}
      >
        <ImageButton
          style={{ width: 64, height: 64 }}
          source={require("../../Resources/Images/home_icon_pause_normal.png")}
          onPress={() => {
            // StorageKeys.IS_DATA_USAGEE_WARNING = false //wifi下
            if (this.networkType === "CELLULAR") {
              this.skipDataWarning = true;
            }
            Service.smarthome.reportLog(Device.model, "on pause clicked");
            this._stopAll();
            console.log("pauseIcon clicked");
            this.connRetry = 2;
            this.queryNetworkJob();
          }}
        />
      </View>
    );
  }

  _renderTitleView() {
    if (this.state.fullScreen) {
      return null;
    }
    // first change statusBar
    // 切换到其他页面时候强制设置light-content 会导致浅色页面statusbar看不到
    if (this.isPageForeGround && this.isPluginForeGround) { // 在前台时才会显示
      // StatusBar.setBarStyle('light-content');
    }
    if (Platform.OS == 'android') {
      // StatusBar.setTranslucent(true); // 测试过的机型几乎都无效：华为荣耀V9，红米Note4X，小米Mix2
    }

    // StatusBar.setBarStyle('dark-content');
    // second get statusBar height;
    let containerHeight = this._getTitleBarPortraitHeight();
    let statusBarHeight = this._getStatusBarHeight();

    let bgColor;
    let txtColor;
    let gradientColors;
    let iconBack;
    let iconBackPre;
    let iconMore;
    let iconMorePre;
    let showGradient = false;
    gradientColors = ['#00000099', '#00000000'];
    // if (Platform.OS == 'android') {
    //   gradientColors = ['#FFFFFF99', '#00000000'];
    // }

    let videoCovered = false;
    if (this.state.showErrorView || this.state.showPoweroffView || this.state.showPauseView ||
      this.state.showDefaultBgView || this.state.whiteTitleBg) {
      videoCovered = true;
    }

    bgColor = "transparent";
    if (this.videoPortraitScale <= 1.03 || videoCovered) {
      bgColor = "#ffffff";
      txtColor = "black";
      iconBack = !this.state.darkMode ? require("../../Resources/Images/icon_back_black.png") : require("../../Resources/Images/icon_back_black_nor_dark.png");
      iconBackPre = !this.state.darkMode ? require("../../Resources/Images/icon_back_black.png") : require("../../Resources/Images/icon_back_black_nor_dark.png");
      iconMore = !this.state.darkMode ? require("../../Resources/Images/icon_more_black_nor.png") : require("../../Resources/Images/icon_more_black_nor_dark.png");
      iconMorePre = !this.state.darkMode ? require("../../Resources/Images/icon_more_black_pre.png") : require("../../Resources/Images/icon_more_black_pre_dark.png");
      if (this.isPageForeGround) {
        this.state.darkMode ? StatusBar.setBarStyle('light-content') : StatusBar.setBarStyle('dark-content');
      }
    } else {
      showGradient = true;
      txtColor = "#ffffff";
      iconBack = require("../../Resources/Images/icon_back_black_nor_dark.png");
      iconBackPre = require("../../Resources/Images/icon_back_black_nor_dark.png");
      iconMore = require("../../Resources/Images/icon_more.png");
      iconMorePre = require("../../Resources/Images/icon_more_pres.png");
      if (this.isPageForeGround) {//去往其他页面后 直播页面还有偶现的setState导致调用刷新了状态栏颜色, 未知原因
        StatusBar.setBarStyle('light-content');
      }
    }

    let titleBarStyle = {
      display: "flex",
      position: "absolute",
      top: 0,
      height: containerHeight,
      width: "100%",
      flexDirection: "column",
      backgroundColor: bgColor,
      zIndex: 1,
      alignItems: "center"
    };

    const containerStyle = {
      zIndex: 1,
      position: "relative",
      marginTop: statusBarHeight,
      height: navigationBarHeightFat,
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 12,
      paddingRight: 12
    };

    const gradientStyle = {
      position: "absolute",
      top: 0,
      width: "100%",
      height: "100%"
    };

    const textContainerStyle = {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      width: kWindowWidth - (40 * 3),
      paddingHorizontal: 20,
      flexGrow: 1,
      position: "relative",
      alignSelf: 'stretch',
      justifyContent: 'center'

    };

    const titleTextStyle = {
      fontSize: kIsCN ? 16 : 14,
      textAlignVertical: 'center',
      textAlign: 'center',
      fontWeight: 'bold',
    };

    const subTitleTextStyle = {
      fontSize: kIsCN ? 12 : 10,
      lineHeight: 17,
      fontFamily: 'MI-LANTING--GBK1-Light',
      textAlignVertical: 'center',
      textAlign: 'center'
    };

    const titleColor = { color: txtColor };
    const subTitleColor = { color: txtColor };
    let imageBtnStyle = {
      width: 40,
      height: 40,
    };

    // if (this.state.darkMode) {
    //   imageBtnStyle.tintColor = IMG_DARKMODE_TINT;
    // }

    // {{ width: iconSize, height: iconSize, position: "absolute", tintColor:"#ddddddFF" }

    return (
      <View style={titleBarStyle}>
        {showGradient ? <LinearGradient colors={gradientColors} style={gradientStyle} /> : null}
        <View
          style={containerStyle}>
          <View
            style={{ width: 40, height: 40 }}>
            <ImageButton
              style={imageBtnStyle}
              source={iconBack}
              highlightedSource={iconBackPre}
              accessibilityLabel={`${DescriptionConstants.zb_29}`}
              onPress={() => {
                if (this.state.isCalling) {
                  Toast.success("camera_speaking_block");
                  return;
                }
                if (this.state.isRecording) {
                  Toast.success("camera_recording_block");
                  return;
                }
                this._stopAll();
                Package.exit();
              }}
            />
          </View>

          <View style={textContainerStyle}>

            <Text
              accessible={true}
              accessibilityLabel={DescriptionConstants.zb_27+(Device.name ? (Device.name.length > 15 ? `${Device.name.substr(0, 15)}...` : Device.name) : "")}
              importantForAccessibility="no-hide-descendant"
              numberOfLines={1}
              ellipsizeMode={"tail"}
              style={[titleTextStyle, titleColor]}

            >
              {Device.name ? (Device.name.length > 15 ? `${Device.name.substr(0, 15)}...` : Device.name) : ""}
            </Text>
            <Text
              accessible={true}
              accessibilityLabel={DescriptionConstants.zb_28+ (this.state.bps > 1024
                ? `${Number.parseInt(this.state.bps / 1024)} KB/S`
                : `${Number.parseInt(this.state.bps)} B/S`)}
              numberOfLines={1}
              ellipsizeMode={"tail"}
              style={[subTitleTextStyle, subTitleColor]}
            >
              {
                !this.isPowerOn ? `0 B/S` : this.state.bps > 1024
                  ? this.state.isCruising ? `${Number.parseInt(this.state.bps / 1024)} KB/S ${ LocalizedStrings.cruise_ing }` : `${Number.parseInt(this.state.bps / 1024)} KB/S`
                  : this.state.isCruising ? `${Number.parseInt(this.state.bps)} B/S ${ LocalizedStrings.cruise_ing }` : `${Number.parseInt(this.state.bps)} B/S`
              }
            </Text>

          </View>

          <View style={{ width: 40, height: 40, position: "relative" }}>
            {
              (!Device.isReadonlyShared && (this.state.showRedDot || this.state.showNasRedDot)) ?
                <Image
                  style={{ width: 40, height: 40, position: "absolute" }}
                  source={require("../../Resources/Images/icon_dot.png")}
                />
                : null
            }

            {
              Device.isReadonlyShared ?
                null
                :
                <ImageButton
                  style={imageBtnStyle}
                  source={iconMore}
                  highlightedSource={iconMorePre}
                  accessibilityLabel={DescriptionConstants.zb_30}
                  onPress={() => {
                    // if (Device.isReadonlyShared) {
                    //   Toast.fail("cloud_share_hint");
                    //   return;
                    // }
                    if (this.state.isCalling) {
                      Toast.success("camera_speaking_block");
                      return;
                    }
                    if (this.state.isRecording) {
                      Toast.success("camera_recording_block");
                      return;
                    }
                    AlbumHelper.snapshotForSetting(this.cameraGLView, this.state.isFlip);
                    this.delayPause = true; // willBlur执行后截屏会失败，因此进入设置需要延时调onPause()
                    // 获取实时流的最低分辨率的图，用于隐私区域编辑页
                    CameraPlayer.getInstance().sendCommandForPic();
                    if (this.state.screenBindStatus === 1) {
                      // 解决绑定后返回首页，还展示未绑定
                      this.shouldRequestScreenState = true;
                    }
                    this.props.navigation.navigate('Setting', { 'title': '设置', hasFirmwareUpdate: this.state.showRedDot, hasNasTips: this.state.showNasRedDot, vip: this.isVip, inCloseWindow: this.inWindow, vipStatus: this.mVipStatus });
                    this.setState({ showRedDot: false });
                    TrackUtil.reportClickEvent('Camera_Setting_ClickNum');
                  }}
                />
            }

          </View>
        </View>
      </View>
    );
  }

  _renderVideoView() {

    let videoStyle;
    if (this.state.fullScreen) {
      videoStyle = {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "100%"
      };
    } else {
      let videoHeight = this._getVideoPortraitHeight() + this._getTitleBarPortraitHeight() * 2;//视频内容高度实际：两倍标题栏+视频高度
      let bottom = -this._getTitleBarPortraitHeight(); // 由于是绝对布局，需要距离父布局底部 -的标题栏高度，这样子做，可以控制视频缩放的时候正好在视频区域中心点缩放
      if (this.state.rotation == 90) {
        videoStyle = {
          // rotation 90
          position: "absolute",
          width: "100%",
          height: videoHeight,
          transform: [{ rotate: '270deg' }]
        };
      } else if (this.state.rotation == 270) {
        // rotation 270
        videoStyle = {
          position: "absolute",
          width: "100%",
          height: videoHeight,
          transform: [{ rotate: '90deg' }]
        };
      } else {
        // rotation 0/180
        videoStyle = {
          position: "absolute",
          bottom: bottom, // 为了在自适应时没有白边漏出
          width: "100%",
          height: videoHeight,
          transform: [{scale: this.state.doubleVideoScale}]
        };
      }
    }
    // console.log("return CameraRenderView: " + ((Platform.OS =="android" && this.evenLockScreen >0) && (!this.state.restoreOriFinished || !this.state.restoreOriFinished2)) +  ", evenLockScreen: " + this.evenLockScreen)
    let useWhiteBackground = this.state.darkMode || this.state.fullScreen ? false : this.state.isWhiteVideoBackground;
    return (
      <CameraRenderView
        ref={(ref) => {
          this.cameraGLView = ref;
          // if (this.cameraGLView && Platform.OS === "ios" && !this.hasSetPlayerType) {
          //   NativeModules.MHCameraOpenGLViewManager.setGeneralIjkPlayerEnable(false, Device.deviceID);
          //   this.hasSetPlayerType = true;
          // }
        }}
        // maximumZoomScale={6.0}
        style={[videoStyle]}
        // videoCodec={CameraConfig.getCameraCoderParam(Device.model, Device.lastVersion).videoCodec}
        // audioCodec={CameraConfig.getCameraCoderParam(Device.model, Device.lastVersion).audioCodec}
        videoCodec={CameraConfig.getCameraCoderParam(Device.model).videoCodec}
        audioCodec={CameraConfig.getCameraCoderParam(Device.model).audioCodec}
        audioRecordSampleRate={CameraConfig.getCameraAudioSampleRate(Device.model)}
        audioRecordChannel={MISSAudioChannel.FLAG_AUDIO_CHANNEL_MONO}
        audioRecordDataBits={MISSDataBits.FLAG_AUDIO_DATABITS_16}
        audioRecordCodec={MISSCodec.MISS_CODEC_AUDIO_OPUS}
        fullscreenState={this.state.fullScreen}
        scale={1}
        videoRate={this.rateModel()}
        correctRadius={CameraConfig.getCameraCorrentParam(Device.model).radius}
        osdx={this.state.isWatermarkEnable ? CameraConfig.getCameraCorrentParam(Device.model).osdx : 0}
        osdy={this.state.isWatermarkEnable ? CameraConfig.getCameraCorrentParam(Device.model).osdy : 0}
        useLenCorrent={CameraConfig.isDeviceCorrect(Device.model) ? false : this.state.useLenCorrent}
        onVideoClick={this._onVideoClick.bind(this)}
        // onScaleChanged={this._onVideoScaleChanged.bind(this)}
        onPTZDirectionCtr={this._onVideoPTZDirectionCtr.bind(this)}
        did={Device.deviceID}
        isFull={false}
        playRate={24}
        whiteBackground={useWhiteBackground}
        // recordingVideoParam={{ width: 1920, height: 1080 }}
        recordingVideoParam={{ ...CameraConfig.getRecordingVideoParam(Device.model), isInTimeRecord: true, hasRecordAudio: true, iosConstantFps: 1, fps: -1 }}
        enableAIFrame={this.state.enableAIFrame}
        accessible={true}
        accessibilityLabel={DescriptionConstants.zb_54}
      >
      </CameraRenderView>
    );
  }
  rateModel(){
    if(CameraConfig.deviceFrameRate(Device.model)){
      return 20;
    }
    return 15;
  }

  setTargetPushViewShown() {
    if (this.state.isNewDevice) {
      StorageKeys.IS_SECURITY_CODE_TIP_SHOWN = true;
    } else {
      StorageKeys.IS_TARGET_PUSH_SHOWN = true;
    }
  }

  _renderTargetPushView() {
    if (!this.state.showTargetPushView || this.shownTarget) {
      return null;
    }
    let ViewStyle = {
      position: "absolute",
      width: "100%",
      // top: this._getTitleBarPortraitHeight() + 13,
      top: this.mOri === "PORTRAIT" ? this._getTitleBarPortraitHeight() + 13 : 13,
      alignItems: "center",
      justifyContent: "center"
    };
    let containerStyle = {
      position: "absolute",
      top: 0,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      borderWidth: 0.5,
      borderColor: "rgba(255,255,255,0.1)",
      flexDirection: "row",
      backgroundColor: "#ffffff",
      shadowRadius: 8,
      marginHorizontal: 20,
      paddingStart: 2,
      paddingTop: 6,
      paddingBottom: 6,
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 2 },
      shadowColor: "#ffffff"
    };
    let title = null;
    let titleh5 = null;
    let subtitle = null;
    switch (this.targetpushItem) {
      case "1":
        title = LocalizedStrings["targetPushTitle_nightModeClose"];
        titleh5 = `https://home.mi.com/webapp/content/camera-tips.html#/faqDetail/248859482000000002`;
        subtitle = LocalizedStrings["targetPushTitle_subtitle"];
        break;
      case "2":
        title = LocalizedStrings["targetPushTitle_nightModeOpen"];
        titleh5 = `https://home.mi.com/webapp/content/camera-tips.html#/faqDetail/565203084000000002`;
        subtitle = LocalizedStrings["targetPushTitle_subtitle"];
        break;
      case "2_sd":
        title = LocalizedStrings["sdcard_notfull_title_tips"];
        titleh5 = `Native_SDCardSetting`;
        subtitle = LocalizedStrings["targetPushTitle_subtitle"];
        break;
      case "3":
        title = LocalizedStrings["targetPushTitle_DWROpen"];
        titleh5 = `https://home.mi.com/views/article.html?articleId=512091754000000001`;
        subtitle = LocalizedStrings["targetPushTitle_subtitle1"];
        break;
      case "3_sd":
      case "4_sd":
        title = LocalizedStrings["sdcard_format_title_tips_3"];
        titleh5 = `https://home.mi.com/views/article.html?articleId=10139525000000001`;
        subtitle = LocalizedStrings["targetPushTitle_subtitle"];
        break;
      case "5":
        title = LocalizedStrings["targetPushTitle_securityCode"];
        titleh5 = `Native_securityCodeSetting`;
        subtitle = null;
        break;
      case "6":
        title = LocalizedStrings["targetPush_sdcard_format"];
        titleh5 = `Native_SDCardFormatSetting`;
        subtitle = LocalizedStrings["targetPushTitle_subtitle"];
        break;
      case "7":
        title = LocalizedStrings["targetPushTitle_weakNetWork"];
        titleh5 = `Native_weakNetWorkSetting`;
        // subtitle = LocalizedStrings["targetPushTitle_subtitle"];
        break;
      case "8_sd":
      case "10_sd":
      case "11_sd":
        title = LocalizedStrings[`sdcard_format_title_tips_${ this.sdcardCode }`];
        titleh5 = `Native_SDCardFormatSetting`;
        subtitle = LocalizedStrings["targetPushTitle_subtitle"];
        break;
      case "9_sd":
        title = LocalizedStrings["sdcard_small_title_tips"];
        titleh5 = `Native_SDCardSetting`;
        subtitle = LocalizedStrings["targetPushTitle_subtitle"];
        break;
      default:
        console.log(`TargetPushError`);
    }
    if (!title) {
      console.log("=================", title, this.targetpushItem);
      return null;
    }
    title = `${ title } `;
    return (
      <View style={ViewStyle}>
        <View style={containerStyle}>
          { this.targetpushItem != "7"
            ?
            <Text style={{ fontSize: kIsCN ? 12 : 10, color: "#4c4c4c", marginLeft: 5 }} onPress={subtitle ? null : () => this._showTargetPush(titleh5)}> {`${title}`}<Text style={{ fontSize: kIsCN ? 12 : 10, color: "#32bac0" }} onPress={() => this._showTargetPush(titleh5)} >{subtitle}</Text></Text>
            :
            <ParsedText
              style={{ fontSize: kIsCN ? 12 : 10, color: "#4c4c4c", marginLeft: 5 }}
              parse={
                [
                  { pattern: /\[1(.+?)\]/g, style: { fontSize: kIsCN ? 12 : 10, color: "#32bac0" }, onPress: () => this._showTargetPush(titleh5), renderText: this.renderText },
                ]
              }
              childrenProps={{ allowFontScaling: false }}
            >
              {title}
            </ParsedText>
          }
          {/*<Text style={{ fontSize: kIsCN ? 12 : 10, color: "#4c4c4c", marginLeft: 5 }} onPress={subtitle ? null : () => this._showTargetPush(titleh5)}> {`${title}`}<Text style={{ fontSize: kIsCN ? 12 : 10, color: "#32bac0" }} onPress={() => this._showTargetPush(titleh5)} >{subtitle}</Text></Text>*/}
          <TouchableHighlight onPress={() => this._closeTargetPush()}>
            <Image style={{ width: 18, height: 18, marginLeft: 8, marginRight: 9 }} source={require('../../Resources/Images/close.png')}></Image>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
  renderText(matchingString, matches) {
    let find = '\\[|\\]|1|2';
    let re = new RegExp(find, 'g');
    return matchingString.replace(re, '');
  }
  verticalScreenTab(){ //切换竖屏
    const initial = Orientation.getInitialOrientation();
    if (initial === 'PORTRAIT') {//当为横屏时
      // 当前非竖屏
      Orientation.lockToPortrait();
    } 
  }
  _showTargetPush(h5) {
    this.shownTarget = true;
    console.log("点击了push，跳转到h5设置页面");
    this.verticalScreenTab()//切换竖屏
    if (h5.includes("Native_")) {
      if (h5.includes("securityCodeSetting")) {
        Host.ui.openSecuritySetting();//打开密码设置页面
      } else if (h5.includes("weakNetWorkSetting")) {
        if (!this.qulityToolPressed()) {
          return;
        }
      } else if (h5.includes("SDCardFormatSetting")) {
        if (Device.isReadonlyShared) {
          this.setState({ sdcardFormatDialog: true });
        } else {
          if (this.sdcardCode == CameraPlayer.SD_CARD_INCOMPATIBLE_CODE) {
            this.props.navigation.navigate("SDCardSetting");
          } else {
            this.props.navigation.navigate("SDCardSetting", { toFormateSDCard: false, needShowFormatDialog: true });
          }
        }
      } else if (h5.includes("SDCardSetting")) {
        if (Device.isReadonlyShared) {
          if (this.targetpushItem === '9_sd') {
            this.setState({ sdcardSmallDialog: true });
          }
          if (this.targetpushItem === '2_sd') {
            this.setState({ sdcardFullDialog: true });
          }
        } else {
          this.props.navigation.navigate("SDCardSetting");
        }
      }
    } else {
      if (Device.isReadonlyShared) {
        if (this.targetpushItem === '3_sd' || this.targetpushItem === '4_sd') {
          this.setState({ sdcardFormatDialog: true });
          return;
        }
      }
      this._showNativeWebPage(h5);
    }
    this.setState({
      showTargetPushView: false
    });
  }

  _closeTargetPush() {
    this.shownTarget = true;
    this.setState({
      showTargetPushView: false
    });
  }

  _renderSnapshotView() {
    if (!this.state.screenshotVisiblity) {
      return null;
    }
    // 这里是视频的缩略图
    let recordItem = (
      <LinearGradient colors={['#00000000', '#00000077']} style={{ position: 'absolute', bottom: 0, width: "100%", height: "30%",borderRadius: 4}}>
        <View style={{
          display: "flex",
          flexDirection: "row",
          bottom: 2,
          left: 6,
          position: "absolute",
          alignItems: "center"
        }}>
          <Image style={{ width: 10, height: 10 }} source={require("../../Resources/Images/icon_snapshot_camera_play.png")}></Image>
          <Text style={{ fontSize: kIsCN ? 12 : 10, fontWeight: "bold", color: "white", marginLeft: 5 }}>{this.lastRecordTime}</Text>
        </View>
      </LinearGradient>
    );

    let sWidth = 90;
    let sHeight = 55;
    let sPadding = 20;

    let containerStyle;
    if (this.state.fullScreen) {
      let toLeft = 25;
      let screenWidth = this._getWindowPortraitHeight();
      if (Platform.OS === "ios" && screenWidth >= 800) {
        toLeft = 80;
      }

      containerStyle = {
        position: "absolute",
        top: kWindowWidth < 400 ? 100 : 70,
        left: 40,
        width: sWidth,
        height: sHeight,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: "xm#ffffff"
      };
      if (Host.isPad) {
        containerStyle.top = "50%";
        containerStyle.marginTop = -1 * sHeight / 2;
      }
    } else {
      containerStyle = {
        position: "absolute",
        bottom: this._getVideoAreaHeight() - sPadding - sHeight,
        left: 20,
        width: sWidth,
        height: sHeight,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: "xm#ffffff",
        backgroundColor: "transparent",
        zIndex: 100
      };
    }
    return (
      <View style={containerStyle}
      >
        <ImageButton
          
          accessibilityLabel={this.isForVideoSnapshot ? DescriptionConstants.hk_2_6 : this.state.fullScreen ? DescriptionConstants.zb_18 : DescriptionConstants.zb_17}
          style={{ width: "100%", height: "100%", borderRadius: 4 }}
          source={(this.state.screenshotPath == "") ? null : { uri: `file://${Host.file.storageBasePath}/${this.state.screenshotPath}` }}
          fadeDuration={0}
          onPress={() => {
            if (!this.canStepOut()) {
              return;
            }
            clearTimeout(this.snapshotTimeout);
            this.setState({ screenshotVisiblity: false, screenshotPath: "", isWhiteVideoBackground: true });// 点击后就消失。

            if (this.isForVideoSnapshot) {
              console.log("点击了缩略图，跳转到视频页面");
              this.showLastVideo();
              // this.props.navigation.navigate("AlbumVideoViewPage");
            } else {

              console.log("点击了缩略图，跳转到图片页面", { uri: `file://${Host.file.storageBasePath}/${this.state.screenshotPath}` });
              this.showLastImage();
              // this.props.navigation.navigate("AlbumPhotoViewPage");
            }
            this.isForVideoSnapshot = false;


            // todo jump to album activity
          }}
        />


        {this.isForVideoSnapshot ? recordItem : null}

      </View>
    );
  }

  showLastImage() {
    if(Platform.OS === 'ios'){// IOS系统本身拥有APP获取的权限，当APP无法获取截取的照片时会自动提示操作失败
      AlbumHelper.getAlbumFiles()
      .then(() => {
        //当IOS获取权限时
        this.props.navigation.navigate("AlbumPhotoViewPage", { preOri: this.state.fullScreen ? "landscape" : "portrait" });
      })
      .catch((error) => {
        Toast._showToast(`${LocalizedStrings["action_failed"]}3`);
      });
    } else {
      this.props.navigation.navigate("AlbumPhotoViewPage", { preOri: this.state.fullScreen ? "landscape" : "portrait" });
    }
  }

  showLastVideo() {
    if (Platform.OS === 'ios') { // IOS系统本身拥有APP获取的权限，当APP无法获取截取的照片时会自动提示操作失败
      AlbumHelper.getAlbumFiles()
        .then(() => {
        // 当IOS获取权限时
          this.props.navigation.navigate("AlbumVideoViewPage",{ videoName: this.state.videoName, preOri: this.state.fullScreen ? "landscape" : "portrait" });
        })
        .catch((error) => {
          Toast._showToast(`${ LocalizedStrings["action_failed"] }3`);
        });
    } else {
      this.props.navigation.navigate("AlbumVideoViewPage",{ videoName: this.state.videoName, preOri: this.state.fullScreen ? "landscape" : "portrait" });
    }
  }

  showLastMediaFileInAlbum(isImage) {
    let medType = isImage ? 1 : 2;

    AlbumHelper.getAlbumFiles()
      .then((result) => {
        console.log(`why!, getAlbumFiles, result: ${JSON.stringify(result)}`);
        // 肯定是array了
        let mediaArray = result.filter((item) => item.mediaType == medType);// 过滤所有的图片

        let mediaItem = null;
        if (mediaArray.length == 0) {
          Toast._showToast(LocalizedStrings["action_failed"]);
          this.props.navigation.goBack();// 操作失败
          // 索引出错。
          return;
        }
        mediaItem = mediaArray[0];
        let url = mediaItem.url;

        let data = { fileName: this.state.screenshotPath, filePath: url, fileUrl: url };
        NativeModules.MHCameraSDK.showAlbumMediaFile(Device.deviceID, JSON.stringify(data));
        // Service.miotcamera.showAlbumMediaFile(JSON.stringify(data));
      })
      .catch((error) => {
        console.log(error);
        Toast._showToast(LocalizedStrings["action_failed"]);
      });

  }

  // 这里是直播中的小窗口
  _renderAngleView() {
    if (!this.state.showCameraAngleView) {
      return (null);
    }

    let sPadding = 20;
    let bottom = this.state.fullScreen ? (kWindowHeight > 600 ? 250 : 180) : (kWindowHeight > 600 ? (this._getVideoAreaHeight() - 28 - sPadding) : 80);// 28 is angle view's height
    let left = this.state.fullScreen ? 55 : sPadding;
    let angleStyle = {
      position: "absolute",
      left: left,
      bottom: bottom

    };

    return (
      <View style={angleStyle}>
        <RectAngleView
          ref={(ref) => { this.angleView = ref; }}
          angle={this.state.angle}
          elevation={this.state.elevation}
          scale={this.state.videoScale}
          showScale={this.state.angleViewShowScale}
          accessible={true}
          accessibilityLabel={DescriptionConstants.zb_39.replace('1',this.state.videoScale)}
        />
      </View>
    );
  }

  _hidePlayToolBarLater() {
    let tTimer = 10000;
    clearTimeout(this.showPlayToolBarTimer);
    if (VersionUtil.judgeIsV1(Device.model) && this.state.fullScreen) {
      tTimer = 50000;
    }
    this.showPlayToolBarTimer = setTimeout(() => {
      this.setState({ showPlayToolBar: false });
    }, tTimer);
  }

  _renderPowerOffView() {
    // todo render poweroffview  full
    if (!this.state.showPoweroffView) {
      return null;
    }
    let height = this._getVideoAreaHeight();

    return (
      <View style={{ width: "100%", height: height, position: "absolute", bottom: 0 }}>

        <TouchableWithoutFeedback style={{ width: "100%", height: "100%", position: "absolute", bottom: 0 }}
          onPress={() => {
            // this._toggleSleep(false);
            this.setState({ showPlayToolBar: true });
            if (this.showPlayToolBarTimer) {
              clearTimeout(this.showPlayToolBarTimer);
              this.showPlayToolBarTimer = null;
            }
            if (!this.state.fullScreen) {
              this._hidePlayToolBarLater();
            }
          }}
        >
          <View style={{ backgroundColor: "black", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <Image
              style={{ width: 54, height: 54 }}
              source={require("../../Resources/Images/icon_camera_sleep.png")} />
            <Text
              style={{ marginTop: 10, fontSize: kIsCN ? 14 : 12, color: "#bfbfbf" }}>
              {LocalizedStrings[this.getPowerOffString()]}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>

    );
  }

  _renderErrorRetryView() {
    if (!this.state.showErrorView) {
      return null;
    }
    if (!Device.isOnline && this.state.errTextString != LocalizedStrings['device_offline']) {
      this.setState({ errTextString: LocalizedStrings['device_offline'] });
    }

    let viewHeight = this._getVideoAreaHeight();

    let sleepButton = (
      <View
        style={{
          backgroundColor: "#249A9F",
          borderRadius: 20,
          marginTop: 10,
          height: 26,
          justifyContent: "center"

        }}>
        <Text style={{
          color: "#fff",
          fontSize: kIsCN ? 12 : 10,
          textAlign: 'center',
          textAlignVertical: 'center',
          paddingLeft: 17,
          paddingRight: 17
        }}
        >{LocalizedStrings['offline_see_help']}</Text>
      </View>
    );
    let buttonReConnectItem = (
      <View
        style={{
          backgroundColor: "#249A9F",
          borderRadius: 20,
          marginTop: 10,
          height: 26,
          justifyContent: "center"
        }}>
        <Text style={{
          color: "#fff",
          fontSize: kIsCN ? 12 : 10,
          textAlign: 'center',
          textAlignVertical: 'center',
          paddingLeft: 17,
          paddingRight: 17
        }}
        >{LocalizedStrings['reconnect_button_text']}</Text>
      </View>
    );
    let localModeButton = (
      <View
        style={{
          backgroundColor: "#249A9F",
          borderRadius: 20,
          marginTop: 10,
          height: 26,
          justifyContent: "center"

        }}>
        <Text style={{
          color: "#fff",
          fontSize: kIsCN ? 12 : 10,
          textAlign: 'center',
          textAlignVertical: 'center',
          paddingLeft: 17,
          paddingRight: 17
        }}
        >{LocalizedStrings['know_more']}</Text>
      </View>
    );

    let powerOfflineItem = (
      <TouchableOpacity
        style={{ display: "flex", alignItems: "center" }}
        onPress={() => {
          this.powerOfflineDialog.show();
        }}>
        {sleepButton}
      </TouchableOpacity>
    );

    let localModeItem = (
      <TouchableOpacity
        style={{ display: "flex", alignItems: "center" }}
        onPress={() => {
          this.localModeDialog.show();
        }}>
        {localModeButton}
      </TouchableOpacity>
    );
    let powerOfflineText = (
      <Text
        style={{ marginTop: 5, fontSize: kIsCN ? 12 : 10, color: "#bfbfbf" }}
      >
        {this.state.lastOfflineTime}
      </Text>
    );
    let noNetworkItem = (
      <View style={{ display: "flex", flexDirection: "row" }}>
        <TouchableOpacity
          style={{ display: "flex", alignItems: "center", paddingRight: 8 }}
          onPress={() => {
            this.setState({ showErrorView: false, bgImgUri: null });
            Service.smarthome.reportLog(Device.model, "on error Retry");
            this._stopAll();
            console.log("error button clicked");
            this.queryNetworkJob();
          }}>
          {buttonReConnectItem}
        </TouchableOpacity>
        <TouchableOpacity
          style={{ display: "flex", alignItems: "center", paddingLeft: 8 }}
          onPress={() => {
            this.noNetworkDialog.show();
          }}>
          {sleepButton}
        </TouchableOpacity>

      </View>

    );

    const errIcons = [
      require("../../Resources/Images/icon_connection_failure.png"),
      require("../../Resources/Images/icon_camera_offline.png"),
      require("../../Resources/Images/icon_camera_fail.png"),
      require("../../Resources/Images/icon_camera_local_mode.png")
    ];

    let errIconIndex = 0;
    if (!Device.isOnline) {
      errIconIndex = 1;
    }
    if (this.isLocalMode) {
      errIconIndex = 3;
    }
    return (
      <View
        style={{ zIndex: 7, position: "absolute", bottom: 0, backgroundColor: "black", width: "100%", height: viewHeight, display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {
          this.state.fullScreen ?
            <View style={{ position: "absolute", width: "100%", height: 80, top: (Host.isPad && Host.isAndroid) ? 35 : 5 }}>
              {this.state.fullScreen ? this._renderFullScreenBackButton() : null}
            </View>
            :
            null
        }

        <TouchableOpacity
          style={{ display: "flex", alignItems: "center" }}
          onPress={() => {
            if (this.isLocalMode) {
              return;
            }
            this.setState({ showErrorView: false, bgImgUri: null });
            Service.smarthome.reportLog(Device.model, "on error Retry");
            this._stopAll();
            console.log("error button clicked");
            this.queryNetworkJob();
          }}// 走重新播放的逻辑,如果是断线了  会走重连的逻辑的}
        >
          <Image
            style={{ width: 54, height: 54 }}
            source={errIcons[errIconIndex]} />
          <Text
            style={{ marginTop: 10, fontSize: kIsCN ? 12 : 10, color: "#ffffff", paddingHorizontal: 10, textAlign: "center", width: kWindowWidth - 60 }}>

            {
              this.isLocalMode ? LocalizedStrings['local_mode_protect'] :
              this.currentNetworkState == 0 ? LocalizedStrings['common_net_error'] : this.state.errTextString}{Device.isOnline ? "" : (this.state.lastOfflineTime == "") ? "" : `, ${this.state.lastOfflineTime}`
            }

          </Text>
          {/* {Device.isOnline ? null : powerOfflineText} */}
        </TouchableOpacity>
        {this.isLocalMode ? null : (Device.isOnline ? noNetworkItem : null)}
        {this.isLocalMode ? null : (Device.isOnline ? null : powerOfflineItem)}
        {this.isLocalMode ? localModeItem : null}
      </View>
    );
    // todo render errorRetryView not
  }

  _renderLoadingView() {
    // todo render loading view
    if (!this.state.showLoadingView || this.state.showPoweroffView) {
      return null;
    }

    let height = this._getVideoAreaHeight();
    let bgColor = "transparent";
    let loadingViewStyle = {
      zIndex: 0,
      position: "absolute",
      width: "100%",
      height: height,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: bgColor
    };

    return (
      <TouchableOpacity
        style={loadingViewStyle}
        onPress={() => {
          const initial = Orientation.getInitialOrientation();
          if (initial === 'PORTRAIT') { // 当为横屏时
            this.setState(() => {
              return {
                showPlayToolBar: !this.state.showPlayToolBar
              };
              }, () => {
                this._hidePlayToolBarLater();
              });
            }}
         } 
      >
        {
          this.state.fullScreen ?
            <View style={{ position: "absolute", width: "100%", height: 80, top: (Host.isPad && Host.isAndroid) ? 35 : 5 }}>
              {this._renderFullScreenBackButton()}
            </View>
            :
            null
        }
        <LoadingView
          style={{ width: 54, height: 54 }}
        />
        <Text
          style={{ marginTop: 10, fontSize: kIsCN ? 12 : 10, color: "#ffffff" }}>
          {LocalizedStrings["camera_loading"]}
        </Text>
      </TouchableOpacity>
    );
  }
  //竖屏模式下得tool button
  _renderFloatingButtonsGroup() {


    let resolutinIcon = [];

    let hfdIcon = this.isSupport2K ? require('../../Resources/Images/icon_2k_nor.png') : require('../../Resources/Images/icon_1080p_nor.png');
    let hfdDisIcon = this.isSupport2K ? require('../../Resources/Images/icon_2k_dis.png') : require('../../Resources/Images/icon_1080p_dis.png');

    switch (this.state.resolution) {
      case 1:
        resolutinIcon = [require('../../Resources/Images/icon_360p_nor.png'),
        require('../../Resources/Images/icon_360p_dis.png')
        ];
        break;
      case 3:
        resolutinIcon = [hfdIcon, hfdDisIcon];
        break;
      case 0:
      default:
        resolutinIcon = this.state.isNoneChinaLand ? [require('../../Resources/Images/icon_auto_en_nor.png'),
        require('../../Resources/Images/icon_auto_en_dis.png')
        ] : [require('../../Resources/Images/icon_auto_zh_nor.png'),
        require('../../Resources/Images/icon_auto_zh_dis.png')
        ];
        break;
    }



    let positionRight = 22;
    let screenWidth = this._getWindowPortraitHeight();
    if (Platform.OS === "ios" && screenWidth >= 800) {
      positionRight = 85;
    }


    let gradientStyle;
    let containerStyle;
    let gradientColors;
    if (this.state.fullScreen) {
      gradientStyle =
      {
        position: "absolute",
        right: 0,
        width: "100%",
        zIndex: 10,
        height: (Host.isPad && Host.isAndroid) ? 110 : 80
      };
      containerStyle = {
        display: "flex",
        width: "100%",
        paddingRight: positionRight,
        flexDirection: "row",
        justifyContent: "flex-end",
        top: (Host.isPad && Host.isAndroid) ? 50 : 20
      };
      gradientColors = ['#00000077', '#00000000'];
    } else {
      gradientStyle =
      {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 70
      };

      containerStyle = styles.videoControlBarPortrait;

      gradientColors = ['#00000000', '#00000077'];
    }

    if (this.state.showPlayToolBar) {

      let itemStyle = this.state.fullScreen ? styles.videoControlBarItemLandscape : styles.videoControlBarItem;
      return (

        // { display:'none' } doesn't work on Android, use { opacity: 0, height: 0 }
        <LinearGradient colors={gradientColors} style={[gradientStyle, !this.state.showPlayToolBar ? { opacity: 0, height: 0 } : {}]}>
          <View style={containerStyle}>

            {/* 目前的 - Lottie动画按钮 */}
            {this.state.fullScreen ? this._renderFullScreenTitle() : null}
            {this.state.fullScreen ? null : this._renderSleepToolButton(itemStyle)}
            {this._renderAudioToolButton(itemStyle)}
            {this._renderQulityToolButton(itemStyle)}
            {this.state.fullScreen ? null : this._renderFullScreenToolButton(itemStyle)}

            {/* 以前的 - 普通按钮 */}
            {/* {this.state.fullScreen ? null : this._renderVideoFloatButton(sleepIcons[sleepIndex])}
            {this._renderVideoFloatButton(audioIcons[audioIndex])}
            {this._renderVideoFloatButton(resolutionIcons[resolutionIndex])}
            {this.state.fullScreen ? null : this._renderVideoFloatButton(fullScreenIcons[fullScreenIndex])} */}

            {/* {this._renderVideoFloatButton(fullScreenIcons[this.state.fullScreen ? 1 : 0])} */}
            {this.state.fullScreen ? this._renderFullScreenBackButton() : null}
          </View>
        </LinearGradient>
      );
    }
    else {
      return (null);
    }
  }

  _renderFullScreenTitle() {
    let topMargin = 0;
    if (this.state.isRecording) {
      topMargin = -22;
    }
    let titleBarStyle = {
      display: "flex",
      position: "absolute",
      top: topMargin,
      height: 40,
      width: "100%",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    };
    return <View style={titleBarStyle}>
      <Text style={{ color: "#ffffff" }}>
        {this.state.isCruising ? `${ LocalizedStrings.cruise_ing }` : ""}
      </Text>
    </View>;
  }

  _renderSleepToolButton(style) {
    return (
      <MHLottieSleepToolButton
        style={style}

        onPress={() => {
          this._hidePlayToolBarLater();
          if (this.state.isSleep) {
            this._toggleSleep(false);
          } else {
            this._toggleSleep(true);
          }
          TrackUtil.reportClickEvent('Camera_Sleep_ClickNum');
        }}
        disabled={this.state.isRecording && !this.state.isSleep}
        displayState={MHLottieSleepToolBtnDisplayState.NORMAL}
        accessibilityLabel={!this.state.isSleep ? DescriptionConstants.zb_1 : DescriptionConstants.zb_1_1}
      />
    );

  }

  _renderAudioToolButton(style) {

    return (
      <MHLottieAudioToolButton
        style={style}
        onPress={() => {
          this._hidePlayToolBarLater();
          // 和Native一致，通话中不允许控制开启关闭声音
          if (this.state.isCalling) {
            Toast.success("camera_speaking_block");
            return;
          }
          if (this.state.isMute) {

            // 默认是这个状态，去开启声音
            // if (this.state.isCalling) {
            this.isAudioMuteTmp = false;
            // }
            this._toggleAudio(false);
            TrackUtil.reportClickEvent('Camera_OpenVolume_ClickNum');
          } else {
            if (this.state.isCalling) {
              Toast.fail("camera_speaking_block");
              return;
            }
            // if (this.state.isCalling) {
            this.isAudioMuteTmp = true;
            // }
            this._toggleAudio(true);
          }
        }}

        displayState={this.state.isMute ? MHLottieAudioToolBtnDisplayState.MUTED : MHLottieAudioToolBtnDisplayState.NORMAL}
        landscape={this.state.fullScreen}

        disabled={this.state.isSleep}
        accessible={true}
        accessibilityLabel={this.state.isMute ? DescriptionConstants.zb_2 : DescriptionConstants.zb_2_1}
        accessibilityState={{
          disabled: this.state.isSleep
        }}
      />
    );
  }

  _renderQulityToolButton(style) {
    let displayState = MHLottieQulityToolBtnDisplayState.AUTO;

    let accessibilityText='';
    switch (this.state.resolution) {
      case 1:
        if (CameraConfig.isNormalFHD()) {
          displayState = MHLottieQulityToolBtnDisplayState.RSD;
          accessibilityText=LocalizedStrings["camera_quality_low"].replace("360", "").replace(" ", "");
        } else if (CameraConfig.isSupport480P(Device.model)) {
          displayState = MHLottieQulityToolBtnDisplayState.R480;
          accessibilityText=LocalizedStrings["camera_quality_low"].replace("360", "480")
        } else if (CameraConfig.isSupport720P(Device.model)) {
          displayState = MHLottieQulityToolBtnDisplayState.R720;
          accessibilityText = LocalizedStrings["camera_quality_low"].replace("360", "720");
        } else {
          displayState = MHLottieQulityToolBtnDisplayState.R360;
          accessibilityText=LocalizedStrings["camera_quality_low"]
        }
        break;
      case 2:
        if (CameraConfig.isNormalFHD()) {
          displayState = MHLottieQulityToolBtnDisplayState.RHD;
        } else {
          displayState = MHLottieQulityToolBtnDisplayState.R720;
        }
        break;
        
      case 3:
        if (CameraConfig.isNormalFHD()) {
          displayState = MHLottieQulityToolBtnDisplayState.RFHD;
        } else {
          displayState = this.isSupport3K ? MHLottieQulityToolBtnDisplayState.R3K : this.isSupport2K ? MHLottieQulityToolBtnDisplayState.R2K : (this.isSupport25K ? MHLottieQulityToolBtnDisplayState.R25K : MHLottieQulityToolBtnDisplayState.R1080);
        }
        accessibilityText=this.isSupport2K ? LocalizedStrings["camera_quality_fhd2k"] : (this.isSupport25K ? LocalizedStrings["camera_quality_fhd2k"].replace("2K", "2.5K") : LocalizedStrings["camera_quality_fhd"]);
        break;
      case 0:
      default:
        displayState = this.state.isNoneChinaLand ? MHLottieQulityToolBtnDisplayState.AUTO : this.state.isZH ? MHLottieQulityToolBtnDisplayState.AUTOCN : MHLottieQulityToolBtnDisplayState.AUTOCNTR;
        accessibilityText= LocalizedStrings["camera_quality_auto"]
        break;
    }
    if (devOpen) {
      accessibilityText = DescriptionConstants["zb_3_4"];
    }

    return (
      <MHLottieQulityToolButton
        style={style}

        onPress={() => {
          this.qulityToolPressed();
          TrackUtil.reportClickEvent('Camera_Definition_ClickNum');
        }}

        displayState={displayState}
        landscape={this.state.fullScreen}

        disabled={(this.state.isRecording || this.state.isSleep)}
        accessibilityLabel={ accessibilityText}
        accessibilityState={{
          disabled:this.state.isRecording || this.state.isSleep
        }}
        testID={'111'}
      />
    );
  }

  qulityToolPressed() {
    this._hidePlayToolBarLater();
    if (this.state.isRecording) {
      Toast.success("camera_recording_block");
      return false;
    }
    this.setState({ dialogVisibility: true });
    return true;
  }

  _renderFullScreenToolButton(style) {

    return (
      <MHLottieFullScreenToolButton
        style={style}

        onPress={() => {
          this._hidePlayToolBarLater();
          if (!this.state.fullScreen) {
            this.setState({
              isWhiteVideoBackground: false
            });
            this.toLandscape(2);
            this.setState({ showCameraAngleView: false });
            TrackUtil.reportClickEvent('Camera_FullScreen_ClickNum');
          } else {
            this.setState({
              isWhiteVideoBackground: true
            });
            this.toPortrait(2);
            this.setState({ showCameraAngleView: false });
          }
        }}

        displayState={MHLottieSleepToolBtnDisplayState.NORMAL}

        disabled={(this.state.isSleep)}
        accessibilityLabel={ DescriptionConstants.zb_4}
        accessibilityState={
          {
            disabled:this.state.isSleep
          }
        }

      />
    );

  }

  _renderVideoFloatButton(item) {
    let itemStyle = this.state.fullScreen ? styles.videoControlBarItemLandscape : styles.videoControlBarItem;
    return (
      <View style={itemStyle}>
        <ImageButton
          style={{
            width: "100%", height: "100%"
          }}
          source={item.source}
          // highlightedSource={item.highlightedSource}
          // 元素标签，获取焦点时会读出该值，默认为该元素内所有开启无障碍能力子元素的文本
          accessibilityLabel={item.accessibilityLabel}
          onPress={item.onPress}
          disabled={!item.clickable}
        />
      </View>
    );
  }
  // 这里是返回按钮
  _renderFullScreenBackButton() {

    if (!this.state.fullScreen) {
      return null;
    }

    let iconBack = require("../../Resources/Images/icon_back_black_nor_dark.png");
    let iconBackPre = require("../../Resources/Images/icon_back_black_nor_dark.png");
    let containerStyle =
    {
      position: "absolute",
      left: 20,
      marginLeft: 0,
      width: 70,
      height: "100%",
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center"
    };

    return (
      <View style={containerStyle}>
        <ImageButton
          style={{ width: 40, height: 40, position: "absolute" }}
          source={iconBack}
          highlightedSource={iconBackPre}
          onPress={() => {
            this._correctOrientation();
            this.toPortrait(5);
            this.setState({
              isWhiteVideoBackground: true
            });
          }}
          accessibilityLabel={DescriptionConstants.zb_10}
        />
      </View>
    );
  }

  _correctOrientation() {
    if (Platform.OS == "android" && this.evenLockScreen > 0) {
      this.setState({ restoreOriFinished2: false });
      setTimeout(() => {
        this.setState({ restoreOriFinished2: true });
        this._startConnect();
      }, 5);
    }
  }
  //全屏下面的按钮
  _renderLandscapeButtonsGroup() {
    if (!this.state.fullScreen) {
      return null;
    }
    if (!this.state.showPlayToolBar) {
      return null;
    }
    let positionRight = 25;
    let screenWidth = this._getWindowPortraitHeight();

    if (Platform.OS === "ios" && screenWidth >= 800) {
      positionRight = 85;
    }

    let landscapeButtonGroupStyle = {
      display: "flex",
      flexDirection: 'column',
      position: "absolute",
      right: positionRight,
      bottom: 22,
      // paddingTop: this._getTitleBarPortraitHeight() + 22,
      width: 80,
      height: "70%",
      marginBottom: 0,
      alignItems: "flex-end",
      justifyContent: "space-between"
    };

    return (
      <View style={landscapeButtonGroupStyle}>

        {/* 目前的 - Lottie动画按钮 */}
        {this._renderSnapLandscapeButton()}
        {this._renderRecordLandscapeButton()}
        {this._renderVoiceLandscapeButton()}

      </View>
    );
  }

  _renderSnapLandscapeButton() {
    return (
      <MHLottieSnapLandscapeButton
        style={styles.landscapeButton}

        onPress={() => {
          this._startSnapshot();
          this._hidePlayToolBarLater();
        }}
        disabled={(this.state.isSleep || this.state.showErrorView)}
        displayState={MHLottieSnapLandscapeBtnDisplayState.NORMAL}
        accessibilityLabel={!this.state.fullScreen ? DescriptionConstants.zb_6 : DescriptionConstants.zb_14}
      />
    );
  }

  _renderRecordLandscapeButton() {
    return (
      <MHLottieRecordLandscapeButton
        style={styles.landscapeButton}

        onPress={() => {
          this._hidePlayToolBarLater();
          let cur = new Date().getTime();
          if (cur - this.lastTimeRecordBtnClicked < 800) {
            return;
          }
          this.lastTimeRecordBtnClicked = cur;
          if (this.state.isRecording) {
            this._stopRecord();
          } else {
            this._startRecord();
          }

        }}
        disabled={(this.state.isSleep || this.state.showErrorView)}
        displayState={this.state.isRecording ? MHLottieRecordLandscapeBtnDisplayState.RECORDING : MHLottieRecordLandscapeBtnDisplayState.NORMAL}
        accessibilityLabel={!this.state.fullScreen ? DescriptionConstants.zb_7 : DescriptionConstants.zb_15}
        accessibilityState={{
          selected: this.state.isRecording
        }}
      />
    );
  }

  _renderVoiceLandscapeButton() {
    return (
      <MHLottieVoiceLandscapeButton
        ref={(ref) => { this.mHLottieVoiceLandscapeButton = ref; }}
        style={styles.landscapeButton}

        onPress={() => {
          if (this.clickedTime && Date.now() - this.clickedTime <= 1150) {
            console.log("_renderVoiceLandscapeButton = duplicated click");
            return;
          }
          this._hidePlayToolBarLater();
          if (this.state.isCalling) {
            this._stopCall();
          } else {
            LogUtil.logOnAll("_startCall for _renderVoiceLandscapeButton press fromOneKeyCall=", this.fromOneKeyCall);
            this._startCall();
          }
        }}
        disabled={(this.state.isSleep || this.state.showErrorView)}
        displayState={this.state.isCalling ? MHLottieVoiceBtnDisplayState.CHATTING : MHLottieVoiceBtnDisplayState.NORMAL}
        accessible={true}
        accessibilityState={{
          selected: this.state.isCalling
        }}
        accessibilityLabel={DescriptionConstants.zb_16}
        testID={this.state.isCalling ? '1' : '0'}
      />
    );
  }

  _renderLandscapeLongPressButton(item) {
    return (
      <View style={styles.landscapeLongPressButton}>
        <Image
          style={{ width: 50, height: 50 }}
          source={item.source}
        />
        <TouchableOpacity style={{ position: "absolute", width: "100%", height: "100%" }}
          onLongPress={() => {
            console.log("enter longpress");
            clearTimeout(this.longPressTimer);
            this.longPressTimer = setTimeout(() => {
              LogUtil.logOnAll("_startCall for _renderLandscapeLongPressButton onLongPress fromOneKeyCall=", this.fromOneKeyCall);
              this._startCall();
            }, 500);
          }}
          onPressOut={() => {
            clearTimeout(this.longPressTimer);
            this._stopCall();
          }}
        />
      </View>
    );
  }
  // 这里是轮盘
  _renderLandscapeDirectionView() {
    if (!this.state.fullScreen || !this.isPtz) {
      return null;
    }
    if (!this.state.showPlayToolBar) {
      return null;
    }

    let landscapeButtonGroupStyle = {
      position: "absolute",
      left: 25,
      bottom: 20,
      width: 130,
      height: 130,
      alignItems: "center",
      justifyContent: "center"
    };
    return (
      <View style={landscapeButtonGroupStyle}
      >
        <TouchableOpacity
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />
        {this._renderDirectionView(false)}
      </View>
    );
  }

  _renderCloudVipRenewView() {
    if (this.state.fullScreen) {
      return null;
    }

    if (!this.state.showCloudVipBuyTip) {
      return null;
    }

    let cloundRenewVipStyle = {
      display: "flex",
      flexDirection: "row",
      position: "relative",
      width: "100%",
      height: 30,
      backgroundColor: "#32BAC0FF"
    };

    let renewVipTextStyle = {
      width: "80%",
      left: 20,
      color: "#ffffff",
      fontSize: kIsCN ? 12 : 10,
      textAlignVertical: 'center'
    };

    let tipStr = this.isCloudServer ? LocalizedStrings["eu_c_cloudvip_end_tip"] : LocalizedStrings["c_cloudvip_end_tip"];
    if (this.isVip && this.cloudVipWillEndDays > 0) {
      if (this.cloudVipWillEndDays == 1) {
        tipStr = (this.isCloudServer ? LocalizedStrings["eu_c_cloudvip_will_end_tip_one"].replace("%1$d", this.cloudVipWillEndDays) : LocalizedStrings["c_cloudvip_will_end_tip_one"]).replace("%1$d", this.cloudVipWillEndDays);
      } else {
        tipStr = (this.isCloudServer ? LocalizedStrings["eu_c_cloudvip_will_end_tip_few"].replace("%1$d", this.cloudVipWillEndDays) : LocalizedStrings["c_cloudvip_will_end_tip_few"]).replace("%1$d", this.cloudVipWillEndDays);
        if (Host.locale.language === "pl" && this.isCloudServer ) { 
          if ((this.cloudVipWillEndDays >= 2 && this.cloudVipWillEndDays <= 19) || this.cloudVipWillEndDays >= 22 && this.cloudVipWillEndDays <= 24) {
            tipStr = LocalizedStrings["eu_c_cloudvip_will_end_tip_other"].replace("%1$d", this.cloudVipWillEndDays);
          }
        }
        if (Host.locale.language === "ru" && this.isCloudServer) { 
          if (this.cloudVipWillEndDays == 0 || (this.cloudVipWillEndDays >= 5 && this.cloudVipWillEndDays <= 19)) {
            tipStr = LocalizedStrings["eu_c_cloudvip_will_end_tip_other"].replace("%1$d", this.cloudVipWillEndDays);
          }
        }
      }
    }
    return (
      <View style={cloundRenewVipStyle}>

        <TouchableOpacity
          activeOpacity={1.0}
          style={{ display: "flex", width: "100%", height: "100%", alignContent: "center", justifyContent: "center" }}
          onPress={() => {
            console.log("why!, clound vip renew");
            LogUtil.logOnAll(TAG, "点击了续费按钮，跳到云存储列表");
            this._showCloundStorage();
          }}>
          {
            <Text style={renewVipTextStyle}>
              {tipStr}
            </Text>
          }
          <TouchableOpacity
            style={{ position: "absolute", right: 0, width: 50, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
            activeOpacity={0.5}
            onPress={() => {
              StorageKeys.HIDE_CLOUD_BUY_TIP = true;
              this.setState({ showCloudVipBuyTip: false });
            }}
          >
            <Image style={{ width: 20, height: 20 }}
              source={require('../../Resources/Images/icon_cloud_close_nor.png')}
            >
            </Image>
          </TouchableOpacity>

        </TouchableOpacity>

      </View>
    );
  }

  _renderCloudBannerView() {
    // if (this.state.fullScreen || this.state.screenBindStatus < 0) {
    //   return null;
    // }
    if (this.state.fullScreen) {
      return null;
    }
    // if (this.state.screenBindStatus == 1) {
    //   return this._renderCloudBannerViewDetial(true, true);
    // }
    if (this.state.showCloudVipBuyTip) {
      return this._renderCloudBannerViewDetial(true); // !!!!屏蔽了测试banner!!!!
    }
    if (this.cloudBannerItem && this.cloudBannerClosed != this.cloudBannerItem?.shortKey) {
      return this._renderCloudBannerViewDetial(false);
    }
  }

  _renderCloudBannerViewDetial(isBuyTips = false, screenUnbindTip = false) { 
    // 新的购买提示: true: show buy tip; false: show cloud banner
    if (this.state.fullScreen) {
      return null;
    }
    if ((isBuyTips && !this.statCloudTipsExposeDone) || (!isBuyTips && !this.statCloudBannerExposeDone)) {
      if (isBuyTips) {
        this.statCloudTipsExposeDone = true;
      } else {
        this.statCloudBannerExposeDone = true;
      }
      // TrackUtil.oneTrackReport(isBuyTips ? 'Camera_CloudStorage_Expose' : 'Camera_Cloud_Banner_Expose');
    }
    let isIOS = Platform.OS === "ios";
    let cloudBannerRenewStyle = {
      display: "flex",
      flexDirection: "row",
      position: "relative",
      height: 44,
      width: "97%",
      marginTop: 9,
      // marginHorizontal: 30,
      borderRadius: 16,
      backgroundColor: Util.isDark() ? "#DB8E0D32" : '#F5A62319'
    };
    let cloudBannerStyle = {
      display: "flex",
      flexDirection: "row",
      position: "relative",
      marginHorizontal: 30,
      height: 80,
      marginTop: isIOS ? -10 : 0

    };

    let style = isBuyTips ? cloudBannerRenewStyle : cloudBannerStyle;

    let renewVipTextStyle = {
      width: "80%",
      left: 20,
      color: Util.isDark() ? "#DB8E0D" :"#F5A623",
      fontSize: kIsCN ? 13 : 11,
      fontWeight: "400",
      textAlignVertical: 'center'
    };

    let tipStr = this.isEuropeServer ? LocalizedStrings["eu_c_cloudvip_end_tip"] : LocalizedStrings["c_cloudvip_end_tip"];
    if (this.isVip && this.cloudVipWillEndDays > 0) {
      if (this.cloudVipWillEndDays == 1) {
        tipStr = (this.isEuropeServer ? LocalizedStrings["eu_c_cloudvip_will_end_tip_one"].replace("%1$d", this.cloudVipWillEndDays) : LocalizedStrings["c_cloudvip_will_end_tip_one"]).replace("%1$d", this.cloudVipWillEndDays);
      } else {
        tipStr = (this.isEuropeServer ? LocalizedStrings["eu_c_cloudvip_will_end_tip_few"].replace("%1$d", this.cloudVipWillEndDays):LocalizedStrings["c_cloudvip_will_end_tip_few"]).replace("%1$d", this.cloudVipWillEndDays);
      }
    }
    let iconSize = 26;
    let iconStyle = { position: "absolute", width: 50, height: "100%", display: "flex", top: 7, right: -18 };
    if (isBuyTips) {
      iconSize = 22;
      iconStyle = { position: "absolute", width: 50, height: "100%", display: "flex", justifyContent: "center", alignContent: "center", right: -15 };
    }
    if (screenUnbindTip) {
      tipStr = `${ LocalizedStrings['care_screen_not_bind'] }，${ LocalizedStrings['offline_see_help'] }`;
    }
    return (
      <View style={style}>

        <TouchableOpacity
          activeOpacity={1.0}
          style={{ display: "flex", width: "100%", height: "100%", alignContent: "center", justifyContent: "center" }}
          onPress={() => {
            // 埋点-- 云存运营点击
            TrackUtil.reportClickEvent("Camera_PopUp_CloudStorage_ClickNum")
            if (Device.isReadonlyShared) {
              Toast.success("share_user_permission_hint");
              return;
            }
            if (screenUnbindTip) {
              // this.setState({ showScreenBindDialog: true });
              // this._toConnectCareScreen();
              this.shouldRequestScreenState = true;
              this.props.navigation.navigate('CareScreenSetting');
              return;
            }
            if (isBuyTips) {
              console.log("why!, clound vip renew");
              LogUtil.logOnAll(TAG, "点击了续费按钮，跳到云存储列表");
              this._showCloundStorage();
            } else { // go to cloud banner page
              console.log("goto webpage to load banner page");
              if (this.cloudBannerItem && this.cloudBannerItem?.h5Url) {
                this._showCloundStorage(this.cloudBannerItem?.h5Url);
              }
            }
          }}>

          {
            isBuyTips ? 
              <Text style={renewVipTextStyle}>
                {tipStr}
              </Text> 
              :
              <Image style={{ width: "100%", height: "100%", borderRadius: isIOS ? 16 : 5, resizeMode: "stretch" }}
                source={{ uri: this.cloudBannerItem?.imgUrl }}
              >
              </Image>
          }

          <TouchableOpacity
            style={iconStyle}
            activeOpacity={0.5}
            onPress={() => {
              // 埋点 -- 云存运营关闭
              TrackUtil.reportClickEvent("Camera_PopUp_CloudStorage_Close_ClickNum")
              if (screenUnbindTip) {
                this.setState({ screenBindStatus: 3 });
                return;
              }
              if (isBuyTips) {
                StorageKeys.HIDE_CLOUD_BUY_TIP = true;
                this.setState({ showCloudVipBuyTip: false });
              } else {
                StorageKeys.HIDE_CLOUD_BANNER = this.cloudBannerItem.shortKey;
                this.cloudBannerClosed = this.cloudBannerItem.shortKey;
              }
            }}
          >
            <Image style={{ width: iconSize, height: iconSize }}
              source={ isBuyTips ? (this.state.darkMode ? require('../../Resources/Images/cloud_banner_tip_close_dark.png') : require('../../Resources/Images/cloud_banner_tip_close.png')) : require('../../Resources/Images/cloud_banner_pic_close.png')}
            >
            </Image>
          </TouchableOpacity>

        </TouchableOpacity>

      </View>
    );
  }

  _renderControlLayout() {
    if (this.state.fullScreen) {
      return null;
    }
    let controlLayout = {
      position: "relative",
      display: "flex",
      zIndex: 1,
      // backgroundColor: "#EEEEEE",
      backgroundColor: "#F6F6F6",
      bottom: 5,
      width: "100%",
      flexDirection: "column",
      flexWrap: 'nowrap',
      flexGrow: 1
    };

    if (this.state.darkMode) {
      // controlLayout.backgroundColor = "#ffffff";
      controlLayout.backgroundColor = "xm#000000";
    }

    return (
      <View style={controlLayout}>

        {this._renderPannelView()}
        {this._renderFixControlView()}
        {/* 这里是下面说话截图录屏的 */}

        <View style={{ position: "absolute", width: "100%", height: "100%", zIndex: 0 }}>
          {/* 这里看家 */}
          {this._renderOptionsView()}
          {this._renderOptionsCoverView()}
        </View>
      </View>
    );
  }
  // 这里是转换方向
  _renderPannelView() {
    if (!this.isPtz) {
      return null;
    }
    let pannelViewStyle = {
      display: "flex",
      zIndex: 1,
      position: "absolute",
      backgroundColor: "#ffffff",
      height: this.state.controlViewHeight,
      width: "100%",
      overflow: "hidden",
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30
    };

    let exapndPannelViewStyle = {
      display: "flex",
      position: "absolute",
      bottom: 0,
      height: this._getDirectionContainerHeight(),
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start"
    };

    if (this.state.darkMode) {
      pannelViewStyle.backgroundColor = "#EEEEEE";
    }

    let showDirectionView = !this.state.showPanoView || this.state.showPoweroffView;
    return (
      <Animated.View style={pannelViewStyle}
      >
        <View style={exapndPannelViewStyle}>
          <View style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "transparent" }}
            {...this.panResponder.panHandlers}
          />
          {this._renderPanoViewButtons()}
          {showDirectionView ? this._renderDirectionLayout() : this._renderPanoViewLayout()}
          <View style={{ position: "absolute", bottom: 10, width: 32, height: 2, backgroundColor: "#DDDDDD", borderRadius: 1 }} />
        </View>
      </Animated.View>
    );
  }

  _renderEnvironmentView() {
    if (this.state.fullScreen) {
      return null;
    }

    let fixContolViewStyle = {
      display: "flex",
      zIndex: 2,
      marginTop: 10,
      // margin: 8,
      // height: fixControlBarHeight,
      width: "97%",
      flexDirection: "column",
      alignItems: "center",
      paddingLeft: 25,
      paddingRight: 25,
      paddingTop: 20, 
      paddingBottom: 20,
      justifyContent: "center",
      backgroundColor: "#ffffff",
      // paddingStart: 30, paddingEnd: 30,
      borderRadius: 10
    };

    if (this.state.darkMode) {
      fixContolViewStyle.backgroundColor = "#EEEEEE";
    }
    let bottomTextStyle = { fontSize: 12, color: "#999999" };
    let jiaobiaoStyle = { fontSize: 12, marginBottom: 4 };
    // console.log(`this.event_type_mode=${ this.event_type_mode } this.getedDetectionSwitch=${ this.getedDetectionSwitch } this.detectionSwitch=${ this.detectionSwitch }`);
    return (
      <View style={fixContolViewStyle}>
        <Text style={{ width: "100%", fontSize: 16, fontWeight: "bold", justifyContent: "flex-start" }}>环境信息</Text>
        <View style={{ width: "95%", flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <Text style={{ fontSize: 26 }}>30</Text>
              <Text style={jiaobiaoStyle}>°C</Text>
            </View>
            <Text style={bottomTextStyle}>室温</Text>
          </View>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <Text style={{ fontSize: 26 }}>40</Text>
              <Text style={jiaobiaoStyle}>%</Text>
            </View>
            <Text style={bottomTextStyle}>湿度</Text>
          </View>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <Text style={{ fontSize: 26 }}>65</Text>
              <Text style={jiaobiaoStyle}>dB</Text>
            </View>
            <Text style={bottomTextStyle}>噪音</Text>
          </View>
        </View>
      </View>
    );
  }
  _renderAlarmView() {
    if (this.state.fullScreen) {
      return null;
    }

    let fixContolViewStyle = {
      display: "flex",
      flex: 1,
      zIndex: 2,
      marginTop: 12,
      // margin: 8,
      // height: fixControlBarHeight,
      width: kWindowWidth - 12 * 2,
      flexDirection: "column",
      alignItems: "center",
      // paddingLeft: 25,
      // paddingRight: 25,
      justifyContent: "center",
      backgroundColor: Util.isDark() ? "xm#1a1a1a" : "#ffffff",
      // paddingStart: 30, paddingEnd: 30,
      borderRadius: 10
    };

    if (this.state.darkMode) {
      fixContolViewStyle.backgroundColor = "#EEEEEE";
      // fixContolViewStyle.backgroundColor = "xm#000000";
    }
    let backIcon = Util.isDark() ? require('../../Resources/Images/icon_right_anchor_black_dark_mode.png') : require('../../Resources/Images/icon_right_anchor_black.png');
    let count = this.todayEventSize > 0 ? this.todayEventSize : 0;
    let eventCountStr = LocalizedStrings["event_size_str"].replace("%d", count);
    if (count <= 0) {
      eventCountStr = LocalizedStrings["event_empty_str"];
    }

    return (
      <View style={fixContolViewStyle} key={"alarm_0"}>
        <TouchableOpacity style={{ width: "100%",paddingLeft: 25, paddingRight: 25 }}
          onPress={() => {
            TrackUtil.reportClickEvent("Camera_Monitoring_ClickNum_momBaby");
            this._handleSdcardPtzClick();
          }}>
          <View style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", paddingTop: 20, paddingBottom: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: Host.locale.language.includes("zh") ? 16 : 14, fontWeight: "700" }}>{LocalizedStrings["ss_home_survelillance"]}</Text>
              <View style={{ width: 0.5, height: 13, backgroundColor: Util.isDark() ? "xm#FFFFFF66" : "#CCCCCC", marginStart: 10 }}></View>
              <Text style={{ marginStart: 10, color: Util.isDark() ? "xm#FFFFFF99" : "#999999", fontSize: Host.locale.language.includes("zh") ? 13 : 11, }}>{this.event_type_mode < 0 ? "" : this.event_type_mode == 3 ? "SD卡" : eventCountStr}</Text>
            </View>
            <Image style={{ width: 7, height: 12, position: "relative" }} source={backIcon}></Image>
          </View>
        </TouchableOpacity>
        {this.event_type_mode < 0 ? this._renderAlarmView00() : null}
        {this.event_type_mode == 1 ? 
          this.todayEvents && this.todayEvents.length > 0 ? this._renderAlarmView01() : !this.getedDetectionSwitch ? this._renderAlarmView00() 
            : this.detectionSwitch ? this._renderAlarmView01() : this._renderAlarmView04()
          : null}
        {/*{this.event_type_mode == 2 ?*/}
        {/*  this.todayEvents && this.todayEvents.length > 0 ? this._renderAlarmView02() : !this.getedDetectionSwitch ?*/}
        {/*    this._renderAlarmView00() : this.detectionSwitch ? this._renderAlarmView02() : this._renderAlarmView04()*/}
        {/*  : null}*/}
        {this.event_type_mode == 2 ?
          this.todayEvents && this.todayEvents.length > 0 ? this._renderAlarmView02() : this._renderAlarmView00()
          : null}
        {/* {this.event_type_mode == 3 ? 
          !this.detectionSwitch && this.getedDetectionSwitch ? this._renderAlarmView04() : this._renderAlarmView00()
          : null} */}
      </View>
    );
  }

  _renderAlarmView00() {
    return (
      <View style={{ width: "100%", paddingTop: 10 }}/>
    );
  }

  _renderAlarmView04() {
    return (
      <Text style={{ width: "100%", paddingTop: 10, paddingBottom: 20 }}>
        启用云存，录制报警视频并向您发送通知
      </Text>
    );
  }
  _renderAlarmView01() {
    return (
      <View style={{ width: "100%", paddingTop: 10, paddingBottom: 20, paddingHorizontal: 25 }}>
        {
          this.todayEvents && this.todayEvents.map((item,index) => {
            let imgStoreUrl = item.imgStoreUrl;
            let imgSource = imgStoreUrl != null ? { uri: `file://${imgStoreUrl}` } : null;
            return <TouchableOpacity key={item.createTime}
              onPress={() => {
                this._handleSdcardPtzClick(item, "push");
                // 显示最近三条事件的埋点
                switch(index){
                  case 0:
                    TrackUtil.reportClickEvent("Camera_Monitoring_FirstEvent_ClickNum");
                    break;
                  case 1:
                    TrackUtil.reportClickEvent("Camera_Monitoring_SecondEvent_ClickNum");
                    break;
                  case 2:
                    TrackUtil.reportClickEvent("Camera_Monitoring_ThirdEvent_ClickNum");
                    break;
                }
              }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ width: 50, fontSize: 15, color: Util.isDark() ? "xm#FFFFFFE5" : "#333333", marginRight: 5, fontWeight: '700' }}>{item.eventTime}</Text>
                <View style={{ alignItems: "center", justifyContent: "center", marginRight: 24, marginLeft: 10 }}>
                  <View style={{ width: 1, height: 30, backgroundColor: index !== 0 ? Util.isDark() ? "xm#383838" : "#e8e8e8" : "#00000000" }}></View>
                  <Image style={{ width: 5, height: 5 }} source={Util.isDark() ? require("../../Resources/images_v2/alarm_item_point_icon_dark_mode.png") : require("../../Resources/images_v2/alarm_item_point_icon.png")}></Image>
                  <View style={{ width: 1, height: 30, backgroundColor: index !== this.todayEvents.length -1 ? Util.isDark() ? "xm#383838" : "#e8e8e8" : "#00000000" }}></View>
                </View>
                <Image style={{ width: 75, height: 45, borderRadius: 10, marginEnd: 14 }} source={imgSource}></Image>
                <Text style={{ fontSize: 15, color: Util.isDark() ? "xm#FFFFFFE5" : "#333333", fontWeight: '700', maxWidth: kWindowWidth - 248 }}>{item.desc}</Text>
              </View></TouchableOpacity>;
          })
        }
        {
          !this.todayEvents || this.todayEvents.length <= 0 ? <View style={{ alignItems: "center", marginEnd: 20 }}>
            <Image style={{ width: 92, height: 60, marginTop: 25, marginBottom: 25 }} source={DarkMode.getColorScheme() == "dark" ? require("../../Resources/images_v2/icon_home_empty_d.webp") : require("../../Resources/images_v2/icon_home_empty.webp")} />
          </View> : null
        }
      </View>
    );
  }
  _renderAlarmView02() {
    if (!this.state.eventStatisticsList || this.state.eventStatisticsList.length == 0) {
      return <View style={{ width: "100%", paddingTop: 10 }}/>;
    }
    return (
      <ScrollView horizontal={ true } showsHorizontalScrollIndicator={ false } style={{ flex: 1, paddingLeft: 25, marginBottom: 10, marginTop: 13 }} contentContainerStyle={{ flexGrow: 1, paddingRight: 25}}>
        {
          this.state.eventStatisticsList && this.state.eventStatisticsList.map((item, index) => {
            return <TouchableWithoutFeedback key={index}
              onPress={() => {
                // if (item.eventNum > 0) {
                this._handleSdcardPtzClick(null, "", item.eventType);
                // }
              }}
              onLongPress={() => {
                if (Device.isReadonlyShared) {
                  return;
                }
                if (Object.keys(AlarmUtilV2.AI_EVENT_SETTING_MAP).length <= 0) {
                  LogUtil.logOnAll(TAG, "AI_EVENT_SETTING_MAP.length <= 0");
                  return;
                }
                if (!AlarmUtilV2.AI_EVENT_SETTING_MAP[item.eventType] && item.eventType != Event.AI) {
                  LogUtil.logOnAll(TAG, item.eventType, "swich is false");
                  return;
                }
                this.eventTypeAttentionIndex = item.realIndex;
                this.setState({ attentionDlg: true });
              }}><View style={{ alignItems: "center", marginEnd: 20, width: 75 }}>
                <Image style={{ width: 48, height: 48 }}
                  source={(!AlarmUtilV2.AI_EVENT_SETTING_MAP[item.eventType] && item.eventType != Event.AI) || (item.eventType == Event.Face && !this.isVip) ? item.icon_dis : item.icon} />
                <Text style={{ fontSize: 13, fontWeight: "bold", marginTop: 8, textAlign: 'center', lineHeight: 18 }} ellipsizeMode={'tail'} numberOfLines={3}>{item.des}</Text>
                <Text style={{ fontSize: 12, color: "#999999", marginTop: 5, marginBottom: 13 }}>{item.eventNum}</Text>
              </View></TouchableWithoutFeedback>;
          })
        }
      </ScrollView>
    );
  }

  _renderFunnyView() {
    if (this.state.fullScreen) {
      return null;
    }

    let fixContolViewStyle = {
      display: "flex",
      zIndex: 2,
      marginTop: 12,
      width: kWindowWidth - 12 * 2,
      marginHorizontal: 12,
      flexDirection: "column",
      alignItems: "center",
      paddingLeft: 25,
      paddingRight: 25,
      justifyContent: "center",
      backgroundColor: "#ffffff",
      borderRadius: 10
    };

    if (this.state.darkMode) {
      fixContolViewStyle.backgroundColor = "#EEEEEE";
    }
    let backIcon = Util.isDark() ? require('../../Resources/Images/icon_right_anchor_black_dark_mode.png') : require('../../Resources/Images/icon_right_anchor_black.png');
    let count = this.todayEventSize > 0 ? this.todayEventSize : 0;
    // this.todayEmotionEventCount
    // this.todayStoryCount
    let eventCountStr = LocalizedStrings["content_empty"]
    let showItems = [];
    if (this.state.funnySwitch && this.todayEmotionEventCount > 0) {
      showItems = this.todayFunnyMemoryEvents;
      if (this.todayStoryCount > 0) {
        eventCountStr = LocalizedStrings["funny_memory_count_desc"].replace("%1$d", this.todayEmotionEventCount);
      } else {
        eventCountStr = LocalizedStrings["funny_count_desc"].replace("%1$d", this.todayEmotionEventCount);
      }
    } else if (this.state.memorySwitch && this.todayStoryCount > 0) {
      eventCountStr = LocalizedStrings["memory_count_desc"].replace("%1$d", this.todayStoryCount);
      if (this.todayFunnyMemoryEvents.length > 0) {
        showItems = this.todayFunnyMemoryEvents.slice(this.todayFunnyMemoryEvents.length -1 , this.todayFunnyMemoryEvents.length);
      }
    }
    let imageWidth = (kWindowWidth - 12*4 - 25*2)/3;
    // let imageHeight = imageWidth * 9 / 16;
    let imageHeight = imageWidth * 33 / 50;
    let width = kWindowWidth - 74;
    let rightValueStyle = Host.locale.language.includes("zh") ? {} : { width: width / 2 -17 }
    return (
      <View style={fixContolViewStyle} key={"funny_0"}>
        <TouchableOpacity
          style={{ width: "100%" }}
          onPress={() => {
            this._handleFunnyMemoryClick();
          }}>
          <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: 'center', paddingTop: 20, paddingBottom: 10 }}>
            <View style={{ flexDirection: "row",flex: 1, alignItems: "center"}}>
              <Text numberOfLines={1} style={{ fontSize: Host.locale.language.includes("zh") ? 16 : 14, fontWeight: "700" }}>{LocalizedStrings["funny_memory"]}</Text>
              <View style={{ width: 0.5, height: 13, backgroundColor: Util.isDark() ? "xm#FFFFFF66" : "#CCCCCC", marginLeft: 10 }}></View>
              <Text numberOfLines={2} style={[{  marginLeft: 10, color: Util.isDark() ? "xm#FFFFFF99" : "#999999", fontSize: Host.locale.language.includes("zh") ? 13 : 11, paddingRight: 10 },rightValueStyle]}>{eventCountStr}</Text>
            </View>
            <Image style={{ width: 7, height: 12 }} source={backIcon}></Image>
          </View>
        </TouchableOpacity>
        {
          !showItems || showItems.length <= 0 ? <View style={{ justifyContent: "center", alignItems: "center", marginTop: 12 }}>
            <Image style={{ width: 92, height: 60, marginTop: 25, marginBottom: 26 }} source={require("../../Resources/images_v2/icon_home_empty.webp")} />
          </View> : <View style={{ width: "100%", marginBottom: 26, flexDirection: 'row', marginTop: 12, justifyContent: 'flex-start' }}>
            {
               showItems.map((item,index) => {
                let imgStoreUrl = item.imgStoreUrl;
                let imgSource = imgStoreUrl != null ? { uri: `file://${imgStoreUrl}` } : null;
                return (
                  <TouchableOpacity
                    key={item.createTime}
                    onPress={() => {
                      // 埋点--趣拍回忆缩略图点击
                      switch(index){
                        case 0:
                          TrackUtil.reportClickEvent("Camera_FunShotMemories_First_ClickNum");
                          break;
                        case 1:
                          TrackUtil.reportClickEvent("Camera_FunShotMemories_Second_ClickNum");
                          break;
                        case 2:
                          TrackUtil.reportClickEvent("Camera_FunShotMemories_Third_ClickNum");
                          break;
                      }
                      if (item.isStory) {
                        // 回忆故事
                        let params = {
                          "method": "GET",
                          "did": Device.deviceID, "region": Host.locale.language.includes("en") ? "US" : "CN", "fileId": item.fileId,
                          "model": Device.model
                        };
                        Service.miotcamera.getVideoFileUrlV2("business.smartcamera.", "/miot/camera/app/v1/dailyStory/m3u8", params)
                          .then((res) => {
                            this.props.navigation.navigate("DailyStoryVideoViewPageV2", {
                              url: res, item: item, category: this.state.category, callback: data => {
                                this.category = data
                              }
                            });
                          }).catch((err) => {
                          console.log(err);
                          Toast.fail("action_failed")
                        });
                      } else {
                        // 趣拍点击
                        FunnyVideoUtil.getVideoUrl(item,this.isVip).then((url) => {
                          this.props.navigation.navigate("FunnyVideoViewPage", { url: url, item: item });
                        }).catch((error) => {
                          Toast.fail("action_failed", error);
                        });
                      }
                    }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginRight: index === 2 ? 0 : 12 }}>
                      <Image style={{ width: imageWidth, height: imageHeight, borderRadius: 8, backgroundColor: '#eeeeee' }} source={imgSource}></Image>
                    </View>
                  </TouchableOpacity>
                )

              })
            }

          </View>
        }

      </View>
    )

  }

  _renderFixControlView() {
    if (this.state.fullScreen) {
      return null;
    }

    let fixContolViewStyle = {
      display: "flex",
      zIndex: 2,
      marginBottom: 1,
      height: fixControlBarHeight,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      // paddingLeft: this.isPtz ? 25 : 0,
      paddingLeft: this.isPtz ? 25 : this.isIOS ? 0 : 25,
      // paddingRight: this.isPtz ? 25 : 0,
      paddingRight: this.isPtz ? 25 : this.isIOS ? 0 : 25,
      // justifyContent: this.isPtz ? "space-between" : "center",
      justifyContent: this.isPtz ? "space-between" : this.isIOS ? "center" : "space-between",
      backgroundColor: "#ffffff",
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      // elevation: 1, shadowColor: '#000000', shadowOffset: { width: 0, height: 0 },
      // shadowOpacity: 0.2,
      shadowRadius: 1,
      overflow: 'visible'
    };

    if (this.state.darkMode) {
      fixContolViewStyle.backgroundColor = "#EEEEEE";
    }

    // let buttonStyle = this.isPtz ? { position: "relative", height: iconSize, width: iconSize } : { position: "relative", height: iconSize, width: iconSize, marginLeft: 34, marginRight: 34 };
    let buttonStyle = this.isPtz ? { position: "relative", height: iconSize, width: iconSize } : this.isIOS ? { position: "relative", height: iconSize, width: iconSize, marginLeft: 34, marginRight: 34 } : { position: "relative", height: iconSize, width: iconSize };
    let iosShadow = {
      shadowColor: '#000000',
      shadowOffset: {  width: 0, height: 4 },
      shadowOpacity: 0.01,
    };
    // 数值越大阴影效果越明显，颜色越深
    let androidShadow = {  elevation: 5 };
    let fixControlStyle = this.state.showShadow ? (Platform.OS === 'ios' ? iosShadow : androidShadow) : null;

    return (
      <View style={[fixContolViewStyle,fixControlStyle]}
      >
        {this.isPtz ? <View style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "100%", backgroundColor: "transparent", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
          {...this.panResponder.panHandlers}
        /> : null
        }

        {/* 目前的 - Lottie动画按钮 */}
        {this._renderVoiceButton(buttonStyle)}
        {this._renderSnapButton(buttonStyle)}
        {this._renderRecordButton(buttonStyle)}
        {this.isPtz ? this._renderControlButton(buttonStyle) : this.isIOS ? null : this._renderFloatViewButton(buttonStyle)}

      </View>

    );
  }
  _toggleSwitch() {
    if (this.state.showPoweroffView) {
      Toast.fail(this.getPowerOffString());
      return;
    }

    if (this.isReadonlyShared) {
      Toast.fail('cloud_share_hint');
      return;
    }

    let preShowStatus = this.state.showPanoView;
    this.setState({ showPanoView: !this.state.showPanoView });

    TrackUtil.reportClickEvent(preShowStatus ? 'Camera_PanoramaClose_ClickNum' : 'Camera_Panorama_ClickNum');

    if (preShowStatus) {
      return;
    }
    if (this.isAllViewRpc && this.state.panoViewStatus == 2) {
      return;
    }
    this.setState({ panoViewStatus: 0 }); //成功之后置为0

    if (!this.panoramaImgStoreUrl) {
      let timeStamp = new Date().getTime(); // 整型，用于做唯一性标识
      this.panoTimestamp = timeStamp & 0x7fffffff;
      let params = { timeStamp: this.panoTimestamp, panoramaType: this.panoramaType };
      this.startPanoIconAnimation();
      setTimeout(() => {
        this._getMergePhotoMeta(params, -1);
      });
    } else {
      this.setState({ panoViewStatus: 3 });
    }
  }
  _renderPanoViewButtons() {

    // 这里panoParmam现时undefined 后来添加了了this.panoParam.isSupport 全景绘图海外依旧是没有的。。。
    if (!this.panoParam || !this.panoParam.isSupport || this.state.isInternationServer) {
      return;
    }

    const switchIcons = [
      {
        source: !this.state.darkMode ? require('../../Resources/Images/icon_switch_pano_confirm_nor.png')
          : require('../../Resources/Images/icon_switch_pano_confirm_nor_dark.png'),
        highlightedSource: !this.state.darkMode ? require('../../Resources/Images/icon_switch_pano_confirm_nor.png')
          : require('../../Resources/Images/icon_switch_pano_confirm_nor_dark.png'),
        accessibilityLabel: DescriptionConstants.zb_21,
        onPress: () => this._toggleSwitch()// 切换
      },
      {
        source: !this.state.darkMode ? require('../../Resources/Images/icon_switch_pano_confirm_nor.png')
          : require('../../Resources/Images/icon_switch_pano_confirm_nor_dark.png'),
        highlightedSource: !this.state.darkMode ? require('../../Resources/Images/icon_switch_pano_confirm_nor.png')
          : require('../../Resources/Images/icon_switch_pano_confirm_nor_dark.png'),
        accessibilityLabel: DescriptionConstants.zb_21,
        onPress: () => this._toggleSwitch()// 切回去
      }
    ];
    const editIcons = [
      {
        source: !this.state.darkMode ? this.prePositions.length == 0 ? require('../../Resources/Images/icon_edit_pano_dis.png') : require('../../Resources/Images/icon_edit_pano_nor.png')
          : require('../../Resources/Images/icon_edit_pano_nor_dark.png'),
        highlightedSource: !this.state.darkMode ? require('../../Resources/Images/icon_edit_pano_nor.png')
          : require('../../Resources/Images/icon_edit_pano_nor_dark.png'),
        accessibilityLabel: DescriptionConstants.zb_20,
        onPress: () => {
          if (VersionUtil.Model_chuangmi_051a01 != Device.model) {
            this.setState({ editPonoView: true });
          }
          this.props.navigation.navigate("EditSelectPrePositions", {
            positionArray: this.prePositions,
            callBack: (params) => {
              console.log("call back data=", params);
              AlarmUtil.putPrePositions(params).then(() => {
                this._getPreSetPosition();
              }).catch((err) => {
                console.log("call back data to set err=", err);
              });
            }
          });
        }
      },
      {
        source: !this.state.darkMode ? require('../../Resources/Images/icon_edit_pano_confirm_nor.png')
          : require('../../Resources/Images/icon_edit_pano_confirm_nor_dark.png'),
        highlightedSource: !this.state.darkMode ? require('../../Resources/Images/icon_edit_pano_confirm_nor.png')
          : require('../../Resources/Images/icon_edit_pano_confirm_nor_dark.png'),
        accessibilityLabel: DescriptionConstants.zb_20,
        onPress: () => {
          this.setState({ editPonoView: false });
        }
      }
    ];

    let switchIndex = this.state.showPanoView ? 0 : 1;
    let editIndex = this.state.editPonoView ? 1 : 0;
    // let editIcon = this.state.editPonoView ? require('../../Resources/Images/icon_confirm.png') : require('../../Resources/Images/icon_edit_black.png');
    // 这里是切换
    let switchBtnStyle = {
      width: 40,
      height: 40,
      
    };

    let editBtnStyle = {
      width: 40,
      height: 40,
      marginRight: 20
    };

    // if (this.state.darkMode) {
    //   switchBtnStyle.tintColor = "#C0C0C0FF"; // IMG_DARKMODE_TINT;
    //   editBtnStyle.tintColor = IMG_DARKMODE_TINT;
    // }

    return (
      <View style={{ position: "absolute", height: 40, top: 3, right: 26, zIndex: 10, display: "flex", flexDirection: "row" }}>
        

        {
          this.state.showPanoView && (this.state.panoViewStatus == 3 || VersionUtil.Model_chuangmi_051a01 == Device.model) ?

            <ImageButton style={editBtnStyle}
              source={editIcons[editIndex].source}
              onPress={editIcons[editIndex].onPress}
              accessibilityLabel={editIcons[editIndex].accessibilityLabel}
              disabled={this.prePositions.length == 0}
            /> : null}

        <ImageButton style={switchBtnStyle}
          source={switchIcons[switchIndex].source}
          onPress={switchIcons[switchIndex].onPress}
          accessibilityLabel={switchIcons[switchIndex].accessibilityLabel}
        />

      </View>

    );
  }

  _renderDirectionLayout() {
    let height = this._getDirectionViewHeight();
    let directTop = this._getDirectionViewTop();
    let directionStyle = {
      position: "relative",
      backgroundColor: DarkMode.getColorScheme() == "dark" ? '#EEEEEE' : '#ffffff',
      marginTop: directTop,
      height: height,
      width: height,
      alignItems: "center",
      justifyContent: "center"
    };
    return (
      <View style={directionStyle} >
        {this._renderDirectionView(true)}
      </View>
    );
  }

  _renderDirectionView(isPortrait) {
    if (this.isHorizontalPTZ) {
      return this._renderHorizontalDirectionView(isPortrait);
    }
    return (
      <DirectionView
        isPortrait={isPortrait}
        accessibilityLabel={DescriptionConstants.zb_12}
        ref={(ref) => {
          this.directionView = ref;
        }}
        onActionDown={() => {
          if (this.showPlayToolBarTimer) {
            clearTimeout(this.showPlayToolBarTimer);
            this.showPlayToolBarTimer = null;
          }
          if (this.state.isSleep) {
            Toast.fail(this.getPowerOffString());
            return;
          }
          if (this.isReadonlyShared) {
            Toast.fail("cloud_share_hint");
            return;
          }
          console.log('onActionDown 按下得时候 走进这里')
          
        }}
        onActionUp={(off) => {
          if (this.isReadonlyShared) {
            return;
          }
          if (off) {
            this._sendDirectionCmd(DirectionViewConstant.CMD_OFF);
          }
          this._hidePlayToolBarLater();
          console.log('onActionUp 抬起得时候 走进这里')
        }}

        onClickDirection={(type) => {
          if (this.isReadonlyShared) {
            return;
          }
          this._sendDirectionCmd(type);
          TrackUtil.reportClickEvent("Camera_direction_ClickNum"); // Camera_direction_ClickNum
        }}
      />
    );
  }

  _renderHorizontalDirectionView(isPortrait) {
    return (
      <DirectionHorizontalView
        accessibilityLabel={DescriptionConstants.zb_19}
        isPortrait={isPortrait}
        ref={(ref) => {
          this.directionView = ref;
        }}
        onActionDown={() => {
          if (this.state.isSleep) {
            Toast.fail(this.getPowerOffString());
          }
          if (this.isReadonlyShared) {
            Toast.fail("cloud_share_hint");
            return;
          }
        }}
        onActionUp={(off) => {
          if (this.isReadonlyShared) {
            return;
          }
          if (off) {
            this._sendDirectionCmd(DirectionViewConstant.CMD_OFF);
          }
        }}

        onClickDirection={(type) => {

          if (this.isReadonlyShared) {
            return;
          }
          this._sendDirectionCmd(type);
          TrackUtil.reportClickEvent("Camera_direction_ClickNum"); // Camera_direction_ClickNum
        }}
      />
    );
  }

  _sendDirectionCmd(type) {
    if (this.state.isSleep) {
      return;
    }
    if (type == DirectionViewConstant.DIRECTION_lEFT || type == DirectionViewConstant.DIRECTION_RIGHT ||
      type == DirectionViewConstant.DIRECTION_UP || type == DirectionViewConstant.DIRECTION_BOTTOM) {
      clearTimeout(this.angleViewTimeout);
      this.setState({ showCameraAngleView: true, angleViewShowScale: false });
      this.angleViewTimeout = setTimeout(() => {
        this.setState({ showCameraAngleView: false, angleViewShowScale: false });
      }, 3000);
    }

    if ((type == DirectionViewConstant.DIRECTION_lEFT && this.state.angle == MAX_ANGLE) ||
      (type == DirectionViewConstant.DIRECTION_RIGHT && this.state.angle == MIN_ANGLE) ||
      (type == DirectionViewConstant.DIRECTION_UP && this.state.elevation == MAX_ELEVATION) ||
      (type == DirectionViewConstant.DIRECTION_BOTTOM && this.state.elevation == MIN_ELEVATION)) {
        
    }
    CameraPlayer.getInstance().sendDirectionCmd(type);
  }

  startPanoIconAnimation() {
    if (this.panoAnimationLoading) {
      return;
    }
    this.iconAnimatedValue.setValue(0);
    this.panoAnimationLoading = Animated.timing(
      this.iconAnimatedValue,
      {
        duration: 1200,
        toValue: 360,
        easing: Easing.linear
      }
    ).start(() => {
      if (this.state.panoViewStatus == 2 || this.state.panoViewStatus == 0) {
        this.startPanoIconAnimation();
      } else {
        this.panoAnimationLoading = null;
      }
    });
  }

  _getPreSetPosition() {
    console.log("start get_preset_position");
    AlarmUtil.getPrePositions().then((res) => {
      this.addPreSetIndex = 1;
      console.log(`get_preset_position = ${JSON.stringify(res)}`);
      this.prePositions = JSON.parse(res[0].value);
      this._updatePreSetPositions();
    }).catch((err) => {
      this.addPreSetIndex = 1;
      this.prePositions = [];
      this.prePositionItems = [{ "pre_pos_stu": -9999 }];
      console.log(`get_preset_position error = ${err}`);
      this.forceUpdate();
    });
    // if (AlarmUtil.cruiseConfigure.length == 0) {
    // } else {
    //   console.log("getCruiseConfig cache=", JSON.stringify(AlarmUtil.cruiseConfigure));
    //   this.rawData = JSON.parse(AlarmUtil.cruiseConfigure[0].value);
    // }
  }

  _updatePreSetPositions() {
    this.prePositionItems = [];
    this.prePositions.sort(function (a, b) { return a.idx - b.idx; });
    this.prePositions.forEach((item) => {
      if (this.addPreSetIndex == item.idx) {
        this.addPreSetIndex = item.idx + 1;
      }
    });
    this.prePositions.sort(function (a, b) { return a.location - b.location; });
    this.preSetPositionExist = false;
    this.prePositions.forEach((item) => {
      this.preSetPositionExist = true;
      this.prePositionItems.push(item);
      if (this.addPreSetLocation == item.location) {
        this.addPreSetLocation = item.location + 1;
      }
    });
    if (this.prePositionItems.length < 6) {
      this.prePositionItems.push({ "pre_pos_stu": -9999 });
    }
    // console.log(`get_preset_position prePositions = ${ JSON.stringify(this.prePositions) }`);
    this.forceUpdate();
  }

  _ctrlPreSetPosition(type, idx, pos) {
    if (type == this.PreSetCTRL) {
      this.delayUpdatePreSetImg && clearTimeout(this.delayUpdatePreSetImg);
      this.ctrlCurrentLocation[0] = idx;
      let posXY = JSON.parse(pos);
      this.ctrlCurrentLocation[1] = posXY[0];
      this.ctrlCurrentLocation[2] = posXY[1];
      console.log(`ctrlCurrentLocation = ${JSON.stringify(this.ctrlCurrentLocation)}`);
      this._sendDirectionCmd(DirectionViewConstant.CMD_GET);
    }
    AlarmUtil.activePrePositions(idx).then((res) => {
      console.log(`activePrePositions res=${JSON.stringify(res[0])}`);
      if (res.code == 0) {
        if (res.result == 0) {
          let imgPath = `${this.preSetPositionImg}${idx}.jpg`;
          switch (type) {
            case this.PreSetCTRL:
              if (this.ctrlCurrentLocation[0] == idx) {
                this.delayUpdatePreSetImg && clearTimeout(this.delayUpdatePreSetImg);
                this.delayUpdatePreSetImg = setTimeout(() => {
                  this._updatePreSetPositionImg(imgPath, idx);
                }, 2000);
              }
              break;
            case this.PreSetADD: {
              this._updatePreSetPositionImg(imgPath, idx);
              break;
            }
            case this.PreSetDELETE: {
              Host.file.deleteFile(`${imgPath}`);
              this.preSetPositionImgTime[idx] = Date.now();
              break;
            }
          }
          // this._getPreSetPosition();
        } else {
          console.log(`set_preset_position res=${JSON.stringify(res.error)}`);
          Toast._showToast(`${type} error = ${JSON.stringify(res.error.code)}`, true);
        }
      }
    }).catch((err) => {
      console.log(`set_preset_position res=${JSON.stringify(err)}`);
    });
  }

  _addPreSetPosition(name) {
    AlarmUtil.getPrePositions().then((res) => {
      this.addPreSetIndex = 1;
      console.log(`get_preset_position = ${JSON.stringify(res)}`);
      this.prePositions = JSON.parse(res[0].value);
      this.prePositions.sort(function (a, b) { return a.idx - b.idx; });
      this.prePositions.forEach((item) => {
        if (this.addPreSetIndex == item.idx) {
          this.addPreSetIndex = item.idx + 1;
        }
      });
      this.addPreSetLocation = 1;
      this.prePositions.sort(function (a, b) { return a.location - b.location; });
      this.prePositions.forEach((item) => {
        if (this.addPreSetLocation == item.location) {
          this.addPreSetLocation = item.location + 1;
        }
      });
      this._doAddPreSetPosition(name);
    }).catch((err) => {
      console.log(`get_preset_position error = ${ err }`);
      this._doAddPreSetPosition(name);
    });
  }

  _doAddPreSetPosition(name) {
    let repeated = false;
    let nameRepeated = false;
    for (let i = 0; i < this.prePositions.length; i++) {
      let item = this.prePositions[i];
      let posXY = JSON.parse(item.pos);
      if (name == item.name) {
        nameRepeated = true;
        break;
      }
      if (this.angleData.angle == posXY[0] && this.angleData.elevation == posXY[1]) {
        repeated = true;
        break;
      }
    }
    if (nameRepeated) {
      Toast._showToast(LocalizedStrings.the_name_already_exists);
      return;
    }
    if (repeated) {
      Toast._showToast(LocalizedStrings.pre_set_position_repeat);
      return;
    }
    console.log("name=====", name);
    this.prePositions.push({
      "idx": this.addPreSetIndex, "location": this.addPreSetLocation, "name": name,
      "pos": `[${this.angleData.angle},${this.angleData.elevation}]`
    });
    let imgPath = `${this.preSetPositionImg}${this.addPreSetIndex}.jpg`;
    this._updatePreSetPositionImg(imgPath, this.addPreSetIndex);
    console.log("prePositions=====", JSON.stringify(this.prePositions));
    AlarmUtil.putPrePositions(JSON.stringify(this.prePositions)).then((res) => {
      console.log("putPrePositions res=====", JSON.stringify(res));
      let positions = JSON.parse(this.rawData.position);
      if (positions.indexOf(this.addPreSetIndex) < 0) positions.push(this.addPreSetIndex);
      this.rawData.position = JSON.stringify(positions);

      AlarmUtil.putCruiseConfig(JSON.stringify(this.rawData)).then((res) => {
        console.log("putCruiseConfig==res=", JSON.stringify(res));

      }).catch((err) => {
        this.rawData = JSON.parse(AlarmUtil.cruiseConfigure[0].value);
        console.log("putCruiseConfig==err=", JSON.stringify(err));
      });

      this._updatePreSetPositions();
    }).catch((err) => {
      console.log("putPrePositions err=====", JSON.stringify(err));
    });
  }

  _updatePreSetPositionImg(imgPath, idx) {
    AlbumHelper.snapshotForSetting(this.cameraGLView, this.state.isFlip, `${imgPath}`).then(() => {
      this.preSetPositionImgTime[idx] = Date.now();
    }).catch(() => {
      this.preSetPositionImgTime[idx] = Date.now();
    });
  }

  // 点了切换之后
  _renderPanoViewLayout() {
    let panoContainerLayout = {
      display: "flex",
      width: "95%",
      height: 60,
      backgroundColor: "#F5F5F5",
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 10,
      paddingBottom: 10
    };

    let panoRootLayout = {
      display: "flex",
      width: "100%",
      borderRadius: 10,
      marginTop: 35,
      paddingTop: 10,
      alignItems: "flex-start",
      justifyContent: "center",
      paddingBottom: 10
    };

    let listViewStyle = {
      // 主轴方向
      flexDirection: 'row',
      // 一行显示不下,换一行
      flexWrap: 'wrap',
      // 侧轴方向
      alignItems: 'center', // 必须设置,否则换行不起作用
      // justifyContent: "center"
    };
    return (
      <View style={panoRootLayout}>
        <FlatList
          data={this.prePositionItems}
          bounces={Platform.OS === "ios" ? false : true}
          // keyExtractor={this._keyExtractor}
          renderItem={(data) => this._renderItem(data.item, data.index, this.preSetPositionImgTime, this.addPreSetIndex)}
          contentContainerStyle={listViewStyle}
        />
        {Device.model != VersionUtil.Model_chuangmi_051a01 ? <View style={panoContainerLayout}>
          {// 显示绘制
            this.state.panoViewStatus == 1 ?
              <View
                style={{ display: "flex", position: "absolute", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", height: "100%" }}
              >
                <Text style={{ position: "relative", textAlign: 'left', fontSize: kIsCN ? 16 : 14, color: "#333", textAlignVertical: 'center', marginLeft: 15, marginRight: 15, maxWidth: "65%" }}>
                  {LocalizedStrings["pano_view_title_init"]}
                </Text>
                {/* 这里是点击立即绘制 */}
                <TouchableOpacity
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 7, paddingBottom: 7, paddingLeft: 15, paddingRight: 15, marginRight: 15, backgroundColor: '#32BAC033', textAlignVertical: 'center', borderRadius: 20, maxWidth: "30%" }}
                  onPress={() => {
                    if (this.panoParam && this.panoParam.isSupportAngle == false) {
                      this._startDrawingPanorama(0);
                      return 0;
                    }
                    this.setState({ panoDialogVisibility: true });
                    TrackUtil.reportClickEvent('Camera_PanoramaDraw_ClickNum');
                  }}>
                  <View style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 7, paddingBottom: 7, paddingLeft: 15, marginEnd: 20, paddingRight: 15, backgroundColor: '#32BAC033', textAlignVertical: 'center', borderRadius: 20 }}>
                    <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 14, color: '#32BAC0' }}>
                      {LocalizedStrings["pano_view_immediately_draw"]}
                    </Text>
                  </View>

                </TouchableOpacity>
              </View> : null
          }
          {// 显示loading 从正在绘制全景图跳到图片
            (this.state.panoViewStatus == 2 || this.state.panoViewStatus == 0) ?
              <View
                style={{ flexDirection: "row", position: "absolute", justifyContent: "center", alignItems: "center", marginStart: 30 }}
              >
                <Animated.Image
                  style={{
                    height: 16,
                    width: 16,
                    transform: [{ rotate: this.iconAnimatedValue.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] }) }]
                  }}
                  source={require("../../Resources/Images/icon_loading.png")}
                />

                <Text
                  style={{ marginLeft: 5, fontSize: 16, color: "#333333" }}>
                  {LocalizedStrings["pano_view_title_drawing"]}
                </Text>
              </View> : null
          }
          {
            this.state.panoViewStatus == 3 ?
              <OverAllControlView
                onTouch={(pointX) => {
                  // this.setState({angle: pointX})
                  this._setPanoramaRotateAngle(pointX, 51);
                }}
                onLoosen={() => { }}
                selectPositionX={this.state.angle}
                minSelectPositionLeft={this.minSelectPositionLeft}
                maxSelectPositionRight={this.maxSelectPositionRight}
                panoramaType={this.panoramaType}
                imgStoreUrl={this.panoramaImgStoreUrl}
                accessibilityLabel={DescriptionConstants.zb_22}
              /> : null
          }
          {/* 这是重新选择的那里 */}
          {
            (this.state.panoViewStatus == 3 && this.state.editPonoView) ?
              <ImageButton style={{ position: "absolute", width: 25, height: 25, top: -10, right: -3 }}
                accessibilityLabel={DescriptionConstants.zb_23}
                source={require('../../Resources/Images/icon_refresh_nor.png')}
                onPress={() => {
                  this.setState({ panoDialogVisibility: true });
                  TrackUtil.reportClickEvent('Camera_PanoramaReDraw_ClickNum');
                }}
              /> : null
          }
        </View> : null}
        {this.renderPrePositionNameDialog()}
        {this.renderPositionLetter()}
      </View>
    );
  }

  renderPositionLetter() {
    return (
      <AbstractDialog
        visible={this.state.showPostionLetter}
        title={LocalizedStrings.pre_set_position_str}
        // subtitle={LocalizedStrings.pre_set_position_str_sub}
        // dialogStyle={{ subTitleNumberOfLines: 2 }}
        // showSubtitle
        useNewTheme
        onDismiss={() => this.setState({ showPostionLetter: false })}
        buttons={[
          {
            text: LocalizedStrings["action_cancle"],
            callback: () => {
              this.setState({ showPostionLetter: false });
              this._toggleSwitch();
              console.log('取消');
            }
          },
          {
            text: LocalizedStrings.pre_set_position_start_add,
            callback: () => {
              this.setState({ showPostionLetter: false });
              console.log('开始添加');
            }
          }
        ]}>
        <Text style={{ marginTop: -10, paddingStart: 20, paddingEnd: 20, paddingBottom: 10, color: "#666666", size: 13 }}>
          {LocalizedStrings.pre_set_position_str_sub}</Text>

        <View style={{ flex: 1, height: 200, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Image style={{ width: 340, height: 200, margin: 10 }}
            source={require('../../Resources/Images/ai2_pre_position_img.webp')} />
        </View>
      </AbstractDialog>
    );
  }

  renderPrePositionNameDialog() {
    return (
      <InputDialog
        singleLine={true}
        onDismiss={() => {
          this.renameItem = null;
          this.setState({ commentDlg: false, isRename: false });
        }}
        canDismiss={false}
        visible={this.state.inputPrePositionName}
        title={LocalizedStrings["input_name_text"]}
        inputs={[{
          placeholder: LocalizedStrings["input_name_text"],
          defaultValue: '',
          textInputProps: {
            autoFocus: true
          },
          onChangeText: (result) => {
            let isEmoji = this.containsEmoji(result);
            let length = result.length; 
            let isCommon = this.isTextcommon(result);
            if (isEmoji) {
              this.setState({ prePositionNameTooLong: true, commentErr: LocalizedStrings["Special_symbol_input_not_supported_temporarily"] }); 
            } else if (length > 6) {
              this.setState({ prePositionNameTooLong: true, commentErr: LocalizedStrings["input_name_too_long"] });
            } else if (isCommon && result !== "") {
              this.setState({ prePositionNameTooLong: true, commentErr: LocalizedStrings["the_name_already_exists"] });
            } else if (length <= 0) {
              this.setState({ prePositionNameTooLong: true, commentErr: LocalizedStrings["add_feature_empty_tips"] });
            } else {
              this.setState({ prePositionNameTooLong: false, commentErr: "error" });
            }
          },
          type: 'DELETE',
          isCorrect: !this.state.prePositionNameTooLong
        }]}
        inputWarnText={this.state.commentErr}
        buttons={[
          {
            callback: () => this.setState({ inputPrePositionName: false, prePositionNameTooLong: false })
          },
          {
            text: LocalizedStrings["save_files"],
            disabled: this.state.prePositionNameTooLong,
            callback: (result) => {
              console.log(`结果`, result);
              if (result.textInputArray[0].length <= 0) {
                this.setState({ prePositionNameTooLong: true, commentErr: LocalizedStrings["add_feature_empty_tips"] });
                return;
              }
              if (!CameraPlayer.getInstance().isConnected()) {
                this.setState({ inputPrePositionName: false, prePositionNameTooLong: false });
                Toast.show(LocalizedStrings["network_exception_failed_to_add"]); // 判断网络是否连接
              } else {
                this._addPreSetPosition(Base64.encode(result.textInputArray[0]));
                this.setState({ inputPrePositionName: false, prePositionNameTooLong: false });
              }
            }
          }
        ]}
        // onDismiss={() => this.setState({ inputPrePositionName: false, prePositionNameTooLong: false })}
      />
    );
  }
  isTextcommon(str) {
    let arrList = this.prePositionItems;
    return arrList.some((res) => {
      return res.name === Base64.encode(str);
    });
  }
  isEmojiCharacterV2(codePoint) {
    return !((codePoint == 0x0) ||
			(codePoint == 0x9) ||
			(codePoint == 0xA) ||
			(codePoint == 0xD) ||
			((codePoint >= 0x20) && (codePoint <= 0xD7FF)) ||
			((codePoint >= 0xE000) && (codePoint <= 0xFFFD)) ||
			((codePoint >= 0x10000))) ||
			(codePoint == 0xa9 || codePoint == 0xae || codePoint == 0x2122 ||
				codePoint == 0x3030 || (codePoint >= 0x25b6 && codePoint <= 0x27bf) ||
				codePoint == 0x2328 || (codePoint >= 0x23e9 && codePoint <= 0x23fa))
			|| ((codePoint >= 0x1F000 && codePoint <= 0x1FFFF))
			|| ((codePoint >= 0x2702) && (codePoint <= 0x27B0))
			|| ((codePoint >= 0x1F601) && (codePoint <= 0x1F64F));
  }
  containsEmoji(str) {
    let length = str.length;
    for (let i = 0; i < length; ++i) {
      let c = str.charCodeAt(i);
      if (this.isEmojiCharacterV2(c)) {
        return true;
      } else if (str.match(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/)) {
        return true;
      }
      // else if(this.isTextcommon(str)){
      //   return true
      // }
    }
    return false;
  }

  _renderItem(item, index, preSetPositionImgTime, addPreSetIndex) {
    let preSetPositionImg = "preSetPosition_";
    let backColr = this.state.darkMode ? "xm#333333" : "#F5F5F5";
    let preSetItemLayout = {
      display: "flex",
      width: this.itemWidth, height: this.itemHeight,
      backgroundColor: backColr, borderRadius: 10, alignItems: "center", justifyContent: "center"
    };
    let textItemStyle = { paddingTop: 5, fontSize: 12, alignSelf: "center" };
    if (index == 0 || index == 3) {
      preSetItemLayout = {
        display: "flex",
        width: this.itemWidth, height: this.itemHeight, marginStart: -this.jianju, marginEnd: this.jianju,
        backgroundColor: backColr, borderRadius: 10, alignItems: "center", alignSelf: "flex-end", justifyContent: "center"
      };
      textItemStyle = { paddingTop: 5, fontSize: 12, alignSelf: "center", marginStart: this.jianju, marginEnd: -this.jianju };
    } else if (index == 2 || index == 5) {
      preSetItemLayout = {
        display: "flex",
        width: this.itemWidth, height: this.itemHeight, marginEnd: -this.jianju, marginStart: this.jianju,
        backgroundColor: backColr, borderRadius: 10, alignItems: "center", alignSelf: "flex-start", justifyContent: "center"
      };
      textItemStyle = { paddingTop: 5, fontSize: 12, alignSelf: "center", marginEnd: this.jianju, marginStart: -this.jianju };
    }
    if (item.pre_pos_stu != -9999) {
      let imgPath = `${Host.file.storageBasePath}/${preSetPositionImg}${item.idx}.jpg?timestamp=${preSetPositionImgTime[item.idx]}`;
      if (Platform.OS === "ios") {
        imgPath = `${Host.file.storageBasePath}/${preSetPositionImg}${item.idx}.jpg`;
      }
      // console.log(`img path = ${ imgPath }`);
      return (<View style={{ display: "flex", marginTop: 15, width: this.itemWidthP, alignItems: "center" }} key={item}>
        <View style={preSetItemLayout}>
          <TouchableWithoutFeedback onPress={() => { this._ctrlPreSetPosition(this.PreSetCTRL, item.idx, item.pos); }}>
            <Image style={{ position: "absolute", width: "100%", height: "100%", borderRadius: 10, top: 0, left: 0 }}
              source={{ uri: imgPath }} key={preSetPositionImgTime[item.idx]} />
          </TouchableWithoutFeedback>
          {
            (this.preSetPositionExist && this.state.editPonoView) ?
              <TouchableWithoutFeedback onPress={() => { this._ctrlPreSetPosition(this.PreSetDELETE, item.idx); }}>
                <Image style={{ position: "absolute", width: 20, height: 20, top: -3, right: -3 }}
                  source={require('../../Resources/Images/preset_position_del.png')} />
              </TouchableWithoutFeedback> : null
          }
          {/* <Text style={{ position: "absolute", backgroundColor: "#44CECA", textAlign: 'center', textAlignVertical: 'center', color: "#ffffff",
            fontSize: 12, borderRadius: 360, width: 18, height: 18, bottom: 5, left: 5 }}>{ item.idx }</Text> */}
        </View>
        {item.name !== "" ? <Text style={textItemStyle}>{Base64.decode(item.name)}</Text>
          : <Text style={textItemStyle}>{LocalizedStrings["default_location"]}</Text> } 
      </View>);
    } else if (item.pre_pos_stu == -9999) {
      return (<View style={{ display: "flex", marginTop: 15, width: this.itemWidthP, alignItems: "center" }}>
        <TouchableWithoutFeedback onPress={() => {
          if (this.state.isCruising) {
            Toast.show(LocalizedStrings.pre_position_add_cruising);
            return;
          }
          if (!CameraPlayer.getInstance().isConnected()) {
            Toast.show(LocalizedStrings["network_exception_failed_to_add"]) //判断网络是否连接
          } else {
            this._sendDirectionCmd(DirectionViewConstant.CMD_GET);
            this.setState({ inputPrePositionName: true });
          }

        }}>
          <View style={preSetItemLayout}>
            <Image style={{ display: "flex", width: 20, height: 20, alignItems: "flex-start", justifyContent: "center" }}
              source={require('../../Resources/Images/preset_position_add.png')} />
          </View>
        </TouchableWithoutFeedback>
        <Text style={textItemStyle}>{LocalizedStrings["add_as_frequently_watched"]}</Text> 
        {/* 添加为常看  LocalizedStrings["add_as_frequently_watched"]*/}
      </View>);
    }
  }

  _setPanoramaRotateAngle(h, v) {
    if (CameraConfig.isXiaomiCamera(Device.model)) {
      Service.miotcamera.sendP2PCommandToDevice(MISSCommand.MISS_CMD_MOTOR_REQ, { operation: 13, "angle": h, "elevation": v })
        .then(() => {
          console.log("change direction success");
        })
        .catch(() => {
          console.log("change direction fail");
        })
    } else {
      let SetPanoramaRotateAngle = 13;// 点击全景图转动电机

      let command = SetPanoramaRotateAngle;
      let params = { "mac": "F1F2F3F4F5F6", "angle": `[${h},${v}]` };

      console.log("_setPanoramaRotateAngle params=", params);

      // 1个byte占用8个bit
      // 1个int占用4个byte
      let buf = new ArrayBuffer(8);// 1个int占用4个byte；

      let data = new Uint32Array(buf);
      data[0] = command;// 放命令号
      data[1] = 4;// 放 data的byte长度 这里是32位整数 长度是4
      let data_byte = new Uint8Array(buf);// int转byte

      let buf_params = new ArrayBuffer(20);
      let params_byte = new Uint8Array(buf_params);
      params_byte = NumberUtil.stringToUtf8ByteArray(JSON.stringify(params));


      let final_data_byte = [];
      for (let i = 0; i < data_byte.length; i++) {
        final_data_byte[i] = data_byte[i];
      }
      for (let j = 0; j < params_byte.length; j++) {
        final_data_byte[data_byte.length + j] = params_byte[j];
      }

      let base64Data = base64js.fromByteArray(new Uint8Array(final_data_byte));

      Service.miotcamera.sendRDTCommandToDevice(base64Data).then((res) => {
        this.isSendingRdtCmd = true;
        console.log("_setPanoramaRotateAngle res=", res);
      }).catch((err) => {
        this.isSendingRdtCmd = false;
        console.log("_setPanoramaRotateAngle err=", err);
      });
      TrackUtil.reportClickEvent('Camera_PanoramaControl_ClickNum');
    }

  }



  _getPanorama() {
    console.log("_getPanorama111");
    LogUtil.logOnAll(TAG, "点击全景图绘制，开始绘制了");
    if (this.isAllViewRpc) {
      Toast.fail("pano_view_title_drawing");
      return;
    }
    this.isAllViewRpc = true;

    let method = "get_panoram";

    let timeStamp = new Date().getTime(); // 整型，用于做唯一性标识
    this.panoTimestamp = timeStamp & 0x7fffffff;

    let params = { timeStamp: this.panoTimestamp, panoramType: this.panoramaType };
    console.log("why! get_panoram params=", params);

    this.getPanoViewRetries = 0;
    // 发送Rpc
    RPC.callMethod(method, params)
      .then((res) => {
        LogUtil.logOnAll(TAG, "全景图绘制RPC成功，结果：" + JSON.stringify(res));
        console.log("why! _getPanorama, res:", res);
        let panoramState = res.panoramState;
        if (panoramState == 1) {
          Toast.success("panorama_ing");
          this.setState({ showPanoView: false, panoViewStatus: 0 });
          return;
        }
        this._clearTimer(this.mRpcCallTimer);
        this.mRpcCallTimer = setTimeout(() => {
          LogUtil.logOnAll(TAG, "开始从服务器请求全景图数据");
          const intervalID = setInterval(() => {
            let params = {
              timeStamp: this.panoTimestamp
            };
            console.log(`get panoview interval, retry: ${this.getPanoViewRetries}`);
            // 获取全景图信息
            this.getPanoViewRetries += 1;
            if (this.getPanoViewRetries <= 30) {
              let paramInteralId = this.panoramaImgStoreUrl ? intervalID : -1;
              this._getMergePhotoMeta(params, paramInteralId);
              // this._getMergePhotoMeta(params, intervalID);

            } else {
              LogUtil.logOnAll(TAG, "连续30次查询全景图都失败了，886");
              this.isAllViewRpc = false;
              clearInterval(intervalID);
              this.setState({ panoViewStatus: 1 });
            }

          }, 5000);
          if (this.state.isSleep) {
            clearInterval(intervalID);
          }
        });
      })
      .catch((err) => {
        this.isAllViewRpc = false;
        LogUtil.logOnAll(TAG, "全景图绘制RPC失败：" + JSON.stringify(err));
        console.log("get_panoram err=", err);
      });
  }

  _getMergePhotoMeta(params, intervalID) {
    // 获取全景图信息
    // this._getPanoramPhotoMeta(params);

    console.log(`_getPanoramaPhotoMeta, intervalID: ${intervalID}`);

    API.get("/common/app/get/mergePhotoMeta", "business.smartcamera", params)
      .then((result) => {
        console.log(`why!, _getPanoramaPhotoMeta result=${JSON.stringify(result)}`);

        // {"result":"ok","retriable":false,"code":0,
        // "data":{"borderRx":94,"modifyTime":2147483647,"stoId":"GLACho5r7ejIv3zr5wWDAdirUihhK9YZz780pOg3uwQW8W7Cbc79EvIZZKY9o2Djma0Y8Gkl4K6P5KO49U_hjLbbmxILDen2T2yuz5zV0of67fUv512SnZOtME3I11razpvvycPRaM-DJb4iGEtib3WeFy2BlzDvJAfihNexPyrc3lO1ahAyi82Bd9kSd4BaYIyOuWmv6LaVequWb0xF1qYcg_ZfopCsWh4_qhH8KDVNed2KJRJ9EJlBYs8n6ZK6p6MB1QYbnktt_pFPBl4K73BBBFhLi1ztj4iZwTOnHXwQxEgk6tJEf5kkCbxBQ5-dt4lmyUekz_BzmNCYxTJloTrzQj_GtpA9Dpq3ZCYWwKE3Jxk1plnVbk_ZB1VDZPJG99FGC6Ig-Uic50WTeaOvwZxJGBgSL7kUkNH7RmK1QMs15XOVDg4BGBDTYnXzyhUJyCObW8h36D9wGBSrcK2ENggawp9WRtbGGicWOgpBYQA",
        // "borderRy":51,"borderLx":10,"borderLy":51,"userId":1115522811,"did":"324203916"},
        // "description":"成功","ts":1591599641024}

        let hasValidResult = false;
        if (result.data && result.data.stoId) {
          let modifyTime = result.data.modifyTime;
          let stoId = result.data.stoId;
          let borderLx = result.data.borderLx;
          let borderRx = result.data.borderRx;
          let borderLy = result.data.borderLy;
          let borderRy = result.data.borderRy;

          console.log(`modifyTime: ${modifyTime}, this.panoTimestamp: ${this.panoTimestamp}`);
          if (modifyTime == this.panoTimestamp) {
            console.log("timestamp match");
          } else {
            console.log("timestamp not match");
          }

          if ((modifyTime == this.panoTimestamp || intervalID == -1) && stoId && stoId.length > 0 && borderLx && borderRx && borderLy && borderRy) {
            clearInterval(intervalID);
            let did = Device.deviceID;
            let imgId = stoId;
            let hostParams = { prefix: "processor.smartcamera.", method: "GET", path: "/miot/camera/app/v1/img" };
            let pathParams = { did: did, fileId: "0", stoId: stoId };

            console.log(`getCommonImgWithParams imgId=${imgId}`);
            console.log(`getCommonImgWithParams JSON.stringify(hostParams)=${JSON.stringify(hostParams)}`);
            console.log(`getCommonImgWithParams JSON.stringify(pathParams)=${JSON.stringify(pathParams)}`);
            console.log(`getCommonImgWithParams did=${did}`);

            console.log(`borderLx = ${borderLx}`);
            console.log(`borderRx = ${borderRx}`);

            LogUtil.logOnAll(TAG, "全景图请求" + this.getPanoViewRetries + "次  请求成功:" + JSON.stringify(result.data));

            hasValidResult = true;
            Service.miotcamera.getCommonImgWithParams(imgId, JSON.stringify(hostParams), JSON.stringify(pathParams), did)
              .then((result) => {

                console.log(`getCommonImgWithParams result: ${result}`);
                this.allViewImageStoId = stoId;
                this.isAllViewRpc = false;
                console.log(`getCommonImgWithParams result=${JSON.stringify(result)}`);
                this.minSelectPositionLeft = borderLx;
                this.maxSelectPositionRight = borderRx;
                this.panoramaImgStoreUrl = result;

                this.showPanoAfterReceivedRotateAngle = true;
                let getRotationTime = intervalID > 0 ? 10000 : 100;
                this.showPanoToastAfterReceivedRotateAngle = intervalID > 0 ? true : false;
                this._clearTimer(this.mGetRotationTimer);
                this.mGetRotationTimer = setTimeout(() => {
                  this._getRotateAngle();
                }, getRotationTime);

                let fileExist = Host.file.isFileExists(result);
                if (fileExist) {
                  LogUtil.logOnAll(TAG, "全景图下载成功，路径：" + result);

                  console.log("save panorama");
                  StorageKeys.PANORAMA_IMAGE_PATH = this.panoramaImgStoreUrl;
                  let panoParams = { type: this.panoramaType, minLeft: this.minSelectPositionLeft, maxRight: this.maxSelectPositionRight };
                  StorageKeys.PANORAMA_PARAM = JSON.stringify(panoParams);
                } else {
                  this.setState({ panoViewStatus: 1 });
                }
              })
              .catch((err) => {
                this.isAllViewRpc = false;
                this.setState({ panoViewStatus: 1 });
                console.log(`getCommonImgWithParams err=${JSON.stringify(err)}`);
              });
          }
        }
        // else {
        //   if (!this.isAllViewRpc)
        //     this.setState({ panoViewStatus: 1 });
        // }
        if (!hasValidResult && !this.isAllViewRpc) {
          console("why!, not has valid result");
          this.setState({ panoViewStatus: 1 });
        }

      })
      .catch((err) => {
        console.log(`_getPanoramaPhotoMeta err=${JSON.stringify(err)}`);
        this.isAllViewRpc = false;
        this.setState({ panoViewStatus: 1 });
        clearInterval(intervalID);
      });
  }

  _renderVoiceButton(style) {

    return (
      <MHLottieVoiceButton
        ref={(ref) => { this.mHLottieVoiceButton = ref; }}
        style={style}
        label="rnlabelCall"
        description="rndescriptionCall"
        onPress={() => {
          console.log(TAG, "startSpeakerTime:" + this.startSpeakerTime);
          if ((new Date().getTime() - this.startSpeakerTime) < 1000) {
            // Toast.fail("click_too_fast");
            return;
          }
          this.startSpeakerTime = new Date().getTime();
          if (this.state.isCalling) {
            this._stopCall();
          } else {
            LogUtil.logOnAll("_startCall for _renderVoiceButton onPress fromOneKeyCall=", this.fromOneKeyCall);
            this._startCall();
          }
        }}

        displayState={this.state.isCalling ? MHLottieVoiceBtnDisplayState.CHATTING : MHLottieVoiceBtnDisplayState.NORMAL}

        disabled={(this.state.isSleep || this.state.showErrorView)}

        darkMode={this.state.darkMode}

        accessible={true}
        accessibilityState={{
          selected: this.state.isCalling,
          disabled: this.state.isSleep || this.state.showErrorView
        }}
        accessibilityLabel={!this.state.fullScreen ? DescriptionConstants.zb_5 : DescriptionConstants.zb_16}
        testID={this.state.isCalling ? '1' : '0'}
      />
    );
  }

  _renderSnapButton(style) {

    return (
      <MHLottieSnapButton
        style={style}
        accessibilityState={{
          disabled: this.state.isSleep || this.state.showErrorView
        }}
        accessibilityLabel={!this.state.fullScreen ? DescriptionConstants.zb_6 : DescriptionConstants.zb_14}
        label="rnlabelSnap"
        description="rndescriptionSnap"

        onPress={() => {
          this.setState({ screenshotVisiblity: false, screenshotPath: null }, () => {
            this._startSnapshot();
          });
        }}

        displayState={MHLottieSnapBtnDisplayState.NORMAL}

        disabled={(this.state.isSleep || this.state.showErrorView)}

        darkMode={this.state.darkMode}
      />
    );
  }

  _renderRecordButton(style) {

    return (
      <MHLottieRecordButton
        style={style}
        label="rnlabelRecord"
        description="rndescriptionRecord"
        onPress={() => {
          if (this.state.isRecording) {
            this._stopRecord();
          } else {
            this._startRecord();
          }

        }}

        displayState={this.state.isRecording ? MHLottieRecordBtnDisplayState.RECORDING : MHLottieRecordBtnDisplayState.NORMAL}

        disabled={(this.state.isSleep || this.state.showErrorView)}

        darkMode={this.state.darkMode}
        accessible={true}
        accessibilityState={{
          selected: this.state.isRecording,
          disabled: this.state.isSleep || this.state.showErrorView
        }}
        accessibilityLabel={DescriptionConstants.zb_7}
        testID={this.state.isRecording ? '1' : '0'}
      />
    );
  }

  _renderControlButton(style) {
    return (
      <MHLottieControlButton
        style={style}
        accessibilityLabel={DescriptionConstants.zb_8}
        label="rnlabelControl"
        description="rndescriptionControl"
        accessibilityState={{
          selected: this.state.showDirectCtr
        }}
        onPress={() => {
          if (this.state.showDirectCtr) {
            this._showDirectionViewAnimated(false);
          } else {
            this._showDirectionViewAnimated(true);
          }
        }}

        displayState={this.state.showDirectCtr ? MHLottieControlBtnDisplayState.CONTROLLING : MHLottieControlBtnDisplayState.NORMAL}

        darkMode={this.state.darkMode}
      />
    );
  }
  _renderFloatViewButton(style) {
    return (
      <TouchableOpacity
        disabled={this.state.isSleep || this.state.showErrorView}
        style={this.state.isSleep || this.state.showErrorView ? { opacity: 0.3 } : { opacity: 1 }}
        onPress={() => {
          if (!CameraPlayer.getInstance().getPowerState()) {
            this.isSupportPhysicalCover ? Toast.show("camera_physical_covered") : Toast.show("camera_power_off");
            return;
          }
          
          if (this.state.isCalling) {
            Toast.success("camera_speaking_block");
            return;
          }
          if (this.state.isRecording) {
            Toast.success("camera_recording_block");
            return;
          }
          Service.miotcamera.openFloatWindow().then(() => {
            Package.exit();
          }).catch((error) => {
            if (error.code == -2) {
              this.setState({ showPermissionDialog: true, permissionRequestState: 2 });
            } else {
              Toast.fail("c_set_fail", error);
            }
          });
        }}>
        <Image style={style} source={DarkMode.getColorScheme() == "dark" ? require("../../Resources/Images/icon_float_button_dark.png") : require("../../Resources/Images/icon_float_button.png")}></Image>
      </TouchableOpacity>
    );
  }



  _renderVideoFixButton(item) {

    let buttonStyle = this.isPtz ? { position: "relative", height: iconSize, width: iconSize } : { position: "relative", height: iconSize, width: iconSize, marginLeft: 34, marginRight: 34 };
    // let colorScheme = DarkMode.getColorScheme();
    // if (colorScheme == 'dark') {
    //   buttonStyle.tintColor = IMG_DARKMODE_TINT;
    // }
    return (
      <ImageButton style={buttonStyle}
        source={item.source}
        highlightedSource={item.highlightedSource}
        accessibilityLabel={item.accessibilityLabel}
        onPress={item.onPress}
        disabled={!item.clickable}
      />
    );
  }

  _renderLongPressButton(item) {
    let buttonStyle = this.isPtz ? { position: "relative", height: iconSize, width: iconSize } : { position: "relative", height: iconSize, width: iconSize, marginLeft: 34, marginRight: 34 };
    return (
      <View >
        <Image style={buttonStyle}
          source={item.source}
          highlightedSource={item.highlightedSource}
        />
        <TouchableOpacity
          style={{ position: "absolute", flexDirection: "row", flexGrow: 1, width: "100%", height: 50, display: "flex", alignItems: "center" }}
          onLongPress={() => {
            console.log("enter longpress");
            clearTimeout(this.longPressTimer);
            this.longPressTimer = setTimeout(() => {
              LogUtil.logOnAll("_startCall for _renderLongPressButton onLongPress fromOneKeyCall=", this.fromOneKeyCall);
              this._startCall();
            }, 500);
          }}
          onPressOut={() => {
            clearTimeout(this.longPressTimer);
            this._stopCall();
          }}
        >
        </TouchableOpacity>
      </View>
    );
  }

  _showDirectionViewAnimated(isShow) {
    this.setState({ showDirectCtr: isShow });
    let ctrViewToHeight = isShow ? fixControlBarHeight + this._getDirectionContainerHeight() : fixControlBarHeight;
    let duration = Math.abs(ctrViewToHeight - this._controlViewHeight) * 300 / this._getDirectionContainerHeight();

    let toAlpha = isShow ? 0.5 : 0;

    Animated.timing(
      this.state.controlViewHeight,
      {
        toValue: ctrViewToHeight,
        duration: duration
      }
    ).start();

    Animated.timing(
      this.state.optionCoverAlpha,
      {
        toValue: toAlpha,
        duration: duration
      }
    ).start();
    TrackUtil.reportClickEvent('Camera_ShowHidedirection_ClickNum');
    TrackUtil.reportResultEvent('Camera_direction_Status', 'type', isShow ? 1 : 2);
  }

  _showCloundStorage() { // VIP 进入原生云存插件， 非vip, 10068后直接进入购买云存页面
    TrackUtil.reportClickEvent("Camera_CloudStorage_ClickNum"); // Camera_CloudStorage_ClickNum
    if (this.state.isRecording) {
      Toast.success("camera_recording_block");
      return;
    }
    if (this.state.isCalling) {
      Toast.success("camera_speaking_block");
      return;
    }
    if (!Device.isOwner && !this.isVip) {
      Toast.success("share_user_permission_hint");
      return;
    }
    if (this.isVip) {
      Service.miotcamera.showCloudStorageSetting();
    } else {
      API_LEVEL > 10068 ? Service.miotcamera.showCloudStorage(true, true, Device.deviceID, "", true, { channel: !this.isVip ? "P2P_snackbar_expired" : "P2P_snackbar_cancel"}) : Service.miotcamera.showCloudStorageSetting();
      CameraConfig.isToUpdateVipStatue = true;
    }
  }

  _showAllStorage() {
    TrackUtil.reportClickEvent("Camera_Storage_ClickNum"); // Camera_Storage_ClickNum
    if (this.state.isRecording) {
      Toast.success("camera_recording_block");
      return;
    }
    if (this.state.isCalling) {
      Toast.success("camera_speaking_block");
      return;
    }
    // if (!Device.isOwner && !this.isVip) {
    //   Toast.success("cloud_share_hint");
    //   return;
    // }
    let index = 0;
    if (this.isVip) {
      index = 0;
    } else if (this.sdcardCode == 0 || this.sdcardCode == 2 || !Device.isOwner) {
      index = 2;
    }

    if (!CameraConfig.isSupportCloud() || !this.mFirmwareSupportCloud) {
      index = index - 1;
      index = index > -1 ? index : 0;
    }
    let navigationParam = { initPageIndex: index, vip: this.isVip, isSupportCloud: this.mFirmwareSupportCloud && CameraConfig.isSupportCloud() };
    LogUtil.logOnAll("AllStorage UI s param:", navigationParam, " isConnected:", CameraPlayer.getInstance().isConnected());
    // 进入回看前 清空一次SdFileManager里的列表。避免缓存的问题
    SdcardEventLoader.getInstance().clearSdcardFileList();
    this.props.navigation.navigate("AllStorage", navigationParam);
  }

  _startAllStorageWithPermissionCheck() {
    if (Platform.OS === "android") {
      this.isCheckingPermission = true;
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, null)
        .then((granted) => {
          this.isCheckingPermission = false;
          console.log("granted", granted);
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this._showAllStorage();
          } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            // Toast.success("camera_no_write_permission");
            this.setState({ showPermissionDialog: true, permissionRequestState: 0 });
          } else {
            Toast.success("camera_no_write_permission");
          }
        }).catch((error) => {
          this.isCheckingPermission = false;
          Toast.success("action_failed");
        });
    } else {
      // no ios's photos const use hardcode
      System.permission.request("photos").then((res) => {
        this._showAllStorage();
      }).catch((error) => {
        // Toast.success("camera_no_write_permission");
        this.setState({ showPermissionDialog: true, permissionRequestState: 0 });
      });

    }
    TrackUtil.reportClickEvent('Camera_ScreenShot_ClickNum');
  }

  _showOperationBannerPage() {
    TrackUtil.reportClickEvent("Camera_Recommend_ClickNum");// 推荐运营位点击
    this._showNativeWebPage(this.bannerItem.h5Url);
    let shortKey = this.state.bannerShortKey;
    this.setState({ clickedBannerShortKey: shortKey });
    StorageKeys.OPERATION_CLICKED_KEY = shortKey;
  }

  _showNativeWebPage(h5) {
    if (this.state.isRecording) {
      Toast.success("camera_recording_block");
      return;
    }
    if (this.state.isCalling) {
      Toast.success("camera_speaking_block");
      return;
    }

    let data = { h5Url: h5, sdcardGetSuccess: true, sdcardStatus: this.sdcardCode };

    // let showSdcard = this.showSdcardPage;
    let showSdcard = true;
    if (this.sdcardCode == 3) {
      showSdcard = false;
    }

    let newData = { url: h5, sdcardCode: this.sdcardCode, isVip: this.isVip, isShowSdcardPage: showSdcard, showFace: Device.isOwner };
    // TODO: replaced by miotcamera api since 10053
    // Service.miotcamera.showOperationBannerPage(data);
    // NativeModules.MHCameraSDK.showOperationBannerPage(Device.deviceID, JSON.stringify(data));
    clearTimeout(this.snapshotTimer);

    this.props.navigation.navigate("NativeWebPage", newData);
    let shortKey = this.state.bannerShortKey;
    this.setState({ clickedBannerShortKey: shortKey });
    StorageKeys.OPERATION_CLICKED_KEY = shortKey;
  }

  openAppStore() {
    let yourAppID = "957323480"
    // const appStoreUrl = `https://apps.apple.com/app/${yourAppID}`;
    const appStoreUrl = `https://apps.apple.com/app/id${yourAppID}`;
    Linking.openURL(appStoreUrl).then((res) => {
      console.log("openURL success",res);
    }).catch((err) => console.error('An error occurred', err));
  }
  _renderOptionsView() {
    let kanjiaSubtitle = (this.detectionSwitch && this.state.lastMonitorEvent) ? this.state.lastMonitorEvent : LocalizedStrings["kanjia_subtitle"];
    let item1 = {
      source: require('../../Resources/Images/icon_kanjia.png'),
      title: LocalizedStrings["camera_housekeeping"],
      accessibilityLabel: LocalizedStrings["camera_housekeeping"] + kanjiaSubtitle,
      subTitle: kanjiaSubtitle,
      onPress: () => {
        TrackUtil.reportClickEvent("Camera_Monitoring_ClickNum"); // Camera_Monitoring_ClickNum
        if (this.state.isRecording) {
          Toast.success("camera_recording_block");
          return;
        }
        if (this.state.isCalling) {
          Toast.success("camera_speaking_block");
          return;
        }

        let isSupportAlarmGuide = CameraConfig.isSupportAlarmGuide(Device.model);
        if (isSupportAlarmGuide && !Device.isReadonlyShared) {
          StorageKeys.IS_ALARM_GUIDE_SHOWN.
            then((result) => {
              if (typeof (result) !== "boolean" || result == false) {
                this.props.navigation.navigate("AlarmGuide", { vip: this.isVip, freeHomeSurExpireTime: this.freeHomeSurExpireTime, freeHomSurStatus:this.freeHomSurStatus });
              } else {
                this.props.navigation.navigate("AlarmPage", { vip: this.isVip, freeHomeSurExpireTime: this.freeHomeSurExpireTime, freeHomSurStatus:this.freeHomSurStatus });
                // Service.miotcamera.showAlarmVideos(CameraConfig.getAlarmTypes(Device.model, this.isVip), Device.did, true);
                // this.props.navigation.navigate("AlarmPage", { vip: this.isVip });
              }
            })
            .catch((err) => {
              console.log("get IS_ALARM_GUIDE_SHOWN error: ", err);
            });
        } else {
          // Service.miotcamera.showAlarmVideos(CameraConfig.getAlarmTypes(Device.model, this.isVip), Device.did, true);
          this.props.navigation.navigate("AlarmPage", { vip: this.isVip, freeHomeSurExpireTime: this.freeHomeSurExpireTime, freeHomSurStatus:this.freeHomSurStatus });
        }
        // Service.miotcamera.showAlarmVideos(CameraConfig.getAlarmTypes(Device.model, this.isVip), Device.did, true);
      }
    };
    //看家
    let item0 = {
      source: require('../../Resources/Images/icon_kanjia.png'),
      title: LocalizedStrings["camera_housekeeping"],
      subTitle: kanjiaSubtitle,
      onPress: () => {
        TrackUtil.reportClickEvent("Camera_Monitoring_ClickNum"); // Camera_Monitoring_ClickNum
        if (this.state.isRecording) {
          Toast.success("camera_recording_block");
          return;
        }
        if (this.state.isCalling) {
          Toast.success("camera_speaking_block");
          return;
        }

        let isSupportAlarmGuide = CameraConfig.isSupportAlarmGuide(Device.model);
        if (isSupportAlarmGuide && !Device.isReadonlyShared) {
          StorageKeys.IS_ALARM_GUIDE_SHOWN.
            then((result) => {
              if (typeof (result) != "boolean" || result == false) {
                this.props.navigation.navigate("AlarmGuide", { isVip: this.isVip });
              } else {
                // Service.miotcamera.showAlarmVideos(CameraConfig.getAlarmTypes(Device.model, this.isVip), Device.did, true);
                this.props.navigation.navigate("AlarmPage", {vip: this.isVip });
              }
            })
            .catch((err) => {
              console.log("get IS_ALARM_GUIDE_SHOWN error: ", err);
            });
        } else {
          // Service.miotcamera.showAlarmVideos(CameraConfig.getAlarmTypes(Device.model, this.isVip), Device.did, true);
          this.props.navigation.navigate("AlarmPage", {vip: this.isVip });
        }
        // Service.miotcamera.showAlarmVideos(CameraConfig.getAlarmTypes(Device.model, this.isVip), Device.did, true);
      }
    };

    // 回看
    let item2 = {
      source: require('../../Resources/Images/icon_huikan.png'),
      title: LocalizedStrings["camera_playback"],
      subTitle: LocalizedStrings["playback_subtitle_new"],
      onPress: () => {
        this._handleSdcardClick();
      }
    };
    // 云存储 
    let item3 = {
      source: require('../../Resources/Images/icon_yuncun.png'),
      title: this.isCloudServer?LocalizedStrings["eu_camera_cloud"]:LocalizedStrings["camera_cloud"],
      subTitle: LocalizedStrings["cloud_subtitle"],
      accessibilityLabel: DescriptionConstants.zb_32,
      onPress: () => {
        LogUtil.logOnAll(TAG, "点击了云存储按钮，跳到云存储列表");
        this._showCloundStorage();
      }
    };

    let item10 = { //只有022人脸管理才会显示这个入口
      source: require('../../Resources/Images/icon_face_identify.png'),
      title: LocalizedStrings["camera_face"],
      subTitle: LocalizedStrings["camera_face_subtitle"],
      accessibilityLabel: "rnLabelBtnCloud",
      onPress: () => {
        // this._showCloundStorage();
        if (!Device.isOwner) {
          Toast.success("face_deny_tips");
          return;
        }
        if (this.state.isRecording) {
          Toast.success("camera_recording_block");
          return false;
        }
        if (this.state.isCalling) {
          Toast.success("camera_speaking_block");
          return false;
        }
        // if (VersionUtil.Model_chuangmi_051a01 == Device.model) {
        //   Service.miotcamera.showFaceRecognize(this.isVip || VersionUtil.isAiCameraModel(Device.model));
        // } else {
        //   this.props.navigation.navigate("FaceManager2");
        // }
        this.props.navigation.navigate("FaceManager2");
      }
    };
    let item11 = { // 只有051使用AI 功能入口
      source: Util.isDark() ? require('../../Resources/Images/icon_home_ai_dark.png') : require('../../Resources/Images/icon_home_ai.png'),
      title: LocalizedStrings.ai_settings_title,
      subTitle: LocalizedStrings["ai_settings_sub_title"],
      accessibilityLabel: "rnLabelBtnCloud",
      onPress: () => {
        // this._showCloundStorage();
        // 埋点 -- 首页 AI 功能点击
        TrackUtil.reportClickEvent("Camera_AIFeatures_ClickNum")
        if (Device.isReadonlyShared) {
          Toast.success("share_user_permission_hint");
          return;
        }
        if (this.state.isRecording) {
          Toast.success("camera_recording_block");
          return false;
        }
        if (this.state.isCalling) {
          Toast.success("camera_speaking_block");
          return false;
        }
        // this.props.navigation.navigate('AICameraSettins');
        AlbumHelper.snapshotForSetting(this.cameraGLView, this.state.isFlip);
        CameraPlayer.getInstance().sendCommandForPic();
        this.props.navigation.navigate('AICameraSettingsV2');
      }
    };

    let item4 = null;
    let language = Host.locale.language || "en";
    if (language == "zh" && this.state.bannerShortKey != "0" && this.bannerItem) {
      let showNew = true;
      if (this.state.clickedBannerShortKey == this.state.bannerShortKey) {
        showNew = false;
      }
      item4 = {
        // source: { uri: this.bannerItem.imgUrl },
        source: Util.isDark() ? require('../../Resources/Images/icon_home_tieshi_dark.png') : require('../../Resources/Images/icon_home_tieshi.png'),
        title: "小贴士",
        subTitle: this.bannerItem.name,
        showNewTag: showNew,
        onPress: () => {
          this._showOperationBannerPage();
        }
      };
    }
    if (!this.mFirmwareSupportCloud || !CameraConfig.isSupportCloud()) {
      item3 = null;
    }

    if (VersionUtil.judgeIsV3(Device.model) || VersionUtil.judgeIsV1(Device.model)) { // V3 临时下架小贴士功能
      item4 = null;
    }

    let storageBarTitle = "storage_sub_title";
    if (!CameraConfig.isSupportCloud() || !this.mFirmwareSupportCloud) {// 不支持云存
      storageBarTitle = "storage_sub_title_e";
    }

    let item5 = {
      source: require('../../Resources/Images/icon_yuncun.png'),
      title: LocalizedStrings["storage_title"],
      subTitle: LocalizedStrings[storageBarTitle],
      onPress: () => {
        this._startAllStorageWithPermissionCheck();
      }
    };
    let item_alarmView = {
      // source: { uri: this.bannerItem.imgUrl },
      source: Util.isDark() ? require('../../Resources/Images/icon_home_alarm_dark.png') : require('../../Resources/Images/icon_home_alarm.png'),
      title: LocalizedStrings["ss_home_survelillance"],
      subTitle: LocalizedStrings["home_alarm_subtitle"],
      onPress: () => {
        this._handleSdcardPtzClick();
      }
    };
    let customAlarm = {
      showType: "alarm"
    };
    let shouldDisplayNewStorageManage = CameraConfig.shouldDisplayNewStorageManage(Device.model);

    let optionItems = null;
    if ((!this.getedDetectionSwitch || (this.getedDetectionSwitch && this.detectionSwitch)) && !this.isLocalMode) {
      optionItems = [customAlarm];
    } else {
      optionItems = [item_alarmView];
    }
    let item_FunnyView = {
      source: Util.isDark() ? require('../../Resources/Images/icon_home_funny_memory_dark.png') : require('../../Resources/Images/icon_home_funny_memory.png'),
      title: LocalizedStrings['funny_memory'],
      subTitle: LocalizedStrings['funny_memory_desc'],
      onPress: () => {
        LogUtil.logOnAll("RN SDK msg:",API_LEVEL, __DEV__);
        if (!__DEV__ && API_LEVEL < 10092) {
        // if (API_LEVEL < 10092) {
          // 需要弹框提示用户升级APP
          this.setState({ showUpdateAppDialog: true });
          return;
        }
        this._handleFunnyMemoryClick();
      }
    };
    let customFunny = {
      showType: "funny"
    };
    if ((!this.state.funnySwitch && !this.state.memorySwitch || this.isLocalMode) || (!__DEV__ && API_LEVEL < 10092)){
    // if ((!this.state.funnySwitch && !this.state.memorySwitch || this.isLocalMode) || API_LEVEL < 10092){
      optionItems.push(item_FunnyView);
    }else {
      optionItems.push(customFunny);
    }
    optionItems.push(item11);
    if (item4 != null) {
      optionItems.push(item4);
    }
    // console.log('optionItems',optionItems)

    // let h = this._getWindowPortraitHeight() - this._getVideoPortraitHeight() - this._getTitleBarPortraitHeight() - fixControlBarHeight;
    // if (Platform.OS === "android") {
    //   h += this._getStatusBarHeight();
    // }

    return (
      <ScrollView style={[styles.panelOptionsViewLayout, { paddingBottom: 100 }]}
        contentContainerStyle={{ alignItems: "center", flexGrow: 1 }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          let offY = nativeEvent.contentOffset.y;
          if (offY < 13 && this.state.showShadow) {
            this.setState({ showShadow: false });
          }

          if (offY > 13 && !this.state.showShadow) {
            this.setState({ showShadow: true });
          }
        }}
        scrollEventThrottle={1}
        overScrollMode={"never"}
        importantForAccessibility={this.state.showDirectCtr ? "no-hide-descendants" : "yes"}
        accessibilityElementsHidden={this.state.showDirectCtr ? true : false}
      >
        {/* 占位 */}
        <View style={{ height: fixControlBarHeight }}></View>

        {this.isLocalMode ? null : this._renderCloudBannerView()}
        {/*{(this.getedDetectionSwitch && !this.detectionSwitch) || this.isLocalMode ? null : this._renderAlarmView()}*/}
        {/*{(this.state.funnySwitch || this.state.memorySwitch) && !this.isLocalMode ? this._renderFunnyView() : null}*/}
        {/* {this._renderEnvironmentView()} */}
        {optionItems.map((item, idx) => this._renderOptionItem(item, idx, optionItems.length))}
      </ScrollView>
    );
  }

  _renderOptionItem(item, idx, length) {
    if (item.showType && item.showType == "alarm"){
      return this._renderAlarmView();

    } else if (item.showType && item.showType == "funny"){
      return this._renderFunnyView();
    } else {
      let backIcon = Util.isDark() ? require('../../Resources/Images/icon_right_anchor_black_dark_mode.png') : require('../../Resources/Images/icon_right_anchor_black.png');

      return (
        <View key={idx} style={{
          // width: "97%",
          marginHorizontal: 12,
          marginTop: 12,
          marginBottom: idx == length - 1 ? 12 : 0,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: this.state.darkMode ? "#EEEEEE" : "#ffffff",
          // paddingStart: 30, paddingEnd: 30,
          borderRadius: 10 }}>
          <TouchableOpacity
            disabled={this.isLocalMode}
            style={[styles.panelOptionItemLayout,{opacity: this.isLocalMode ? 0.2 : 1}]}
            onPress={item.onPress}
            accessibilityLabel={item.accessibilityLabel}
          >
            <Image
              style={{ width: 40, height: 40, position: "relative" }}
              source={item.source}
            />

            <View style={{ display: "flex", height: "100%", flex: 1, position: "relative", flexDirection: "column", justifyContent: "center", width: kWindowWidth - (7 + 40), paddingRight: 20 }}>
              <View
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <Text numberOfLines={2}
                      style={{ marginLeft: 15, marginTop: 0, fontSize: kIsCN ? 16 : 14, color: "#000000", fontWeight: "700" }}
                >
                  {item.title}
                </Text>
                {
                  item.showNewTag ?
                    <View style={styles.optionNewTagContainerStyle}>
                      <Text style={styles.optionNewTagStyle}>
                        {"新"}
                      </Text>
                    </View>
                    :
                    null
                }

              </View>

              <Text
                style={{ marginLeft: 15, marginTop: 4, fontSize: kIsCN ? 12 : 10, color: "#7F7F7F" }}
                numberOfLines={2}
                ellipsizeMode={"tail"}
              >
                {item.subTitle}
              </Text>
            </View>

            <ImageButton
              style={{ width: 7, height: 12, position: "relative" }}
              source={backIcon}
            />
          </TouchableOpacity>

          {/* <TouchableOpacity
          style={{ position: "absolute", flexDirection: "row", flexGrow: 1, width: "100%", height: 60, display: "flex", alignItems: "center", }}
          onPress={item.onPress}
          accessibilityLabel={item.accessibilityLabel}
        >
        </TouchableOpacity> */}
        </View>
      );
    }

  }
  // 授权看家
  _renderOptionsCoverView() {
    if (!this.state.showDirectCtr) {
      return null;
    }

    let containerStyle = {
      position: "absolute",
      height: "100%",
      width: "100%",
      backgroundColor: "#000000",
      opacity: this.state.optionCoverAlpha
    };
    return (
      <Animated.View style={containerStyle}>
      </Animated.View>
    );
  }

  _startCall(focus = false) {

    LogUtil.logOnAll(`_startCall for focus=${ focus } fromOneKeyCall=`, this.fromOneKeyCall);
    // if (this.state.isRecording) {
    //   Toast.success("camera_recording_block");
    //   return;
    // }
    if (this.isReadonlyShared) {
      Toast.fail('cloud_share_hint');
      return;
    }
    TrackUtil.reportClickEvent("Camera_VoiceCall_ClickNum"); // Camera_VoiceCall_ClickNum
    if (this.state.isSleep) {
      Toast.success(this.getPowerOffString());
      return;
    }

    LogUtil.logOnAll(`-=-=-=-=-=showPauseView=${ this.state.showPanoView } showErrorView=${ this.state.showErrorView } pstate=${ this.state.pstate } focus=${ focus }`);
    if ((this.state.showPauseView || this.state.showErrorView || this.state.pstate < 2) && !focus) {
      Toast.success("call_no_play");
      return;
    }
    console.log(TAG, "startCall: isClickCall " + this.isClickCall + " this.state.isCalling:" + this.state.isCalling);
    if (this.isClickCall) {
      LogUtil.logOnAll("this.isClickCall = true");
      return;
    }
    this.clickedTime = Date.now();
    this.isClickCall = true;

    if (this.state.isCalling) {
      LogUtil.logOnAll("this.state.isCalling = true");
      return;
    }

    this.enterCallTime = new Date().getTime();
    this.setState({ showPlayToolBar: true });
    if (Platform.OS === "android") {
      this.isCheckingPermission = true;
      let talkPreRecordPermission = new Date().getTime();
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, null)
        .then((granted) => {
          this.isCheckingPermission = false;
          console.log("granted", granted);
          this.isClickCall = false;
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            if ((new Date().getTime() - talkPreRecordPermission) > 1500) { // android 授权弹窗会导致收不到onPressOut,这里主动停止
              this.isClickCall = false;
              return;
            }
            this._checkStateForCall();
          } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            // Toast.success("camera_no_audio_permission");
            this.setState({ showPermissionDialog: true, permissionRequestState: 1 });
            this.isClickCall = false;
          } else {
            Toast.success("camera_no_audio_permission");
          }
          this.isClickCall = false;
        }).catch((error) => {
          this.isCheckingPermission = false;
          Toast.fail("action_failed", error);
          this.isClickCall = false;
        });
    } else {
      System.permission.request(Permissions.RECORD_AUDIO).then((res) => {
        this._checkStateForCall();
      }).catch((error) => {
        // 这里提示没有权限
        // Toast.success("camera_no_audio_permission");
        this.isClickCall = false;
        this.setState({ showPermissionDialog: true, permissionRequestState: 1 });
      });


    }

  }

  _checkStateForCall() {
    this._getScreenWorkState().then((value) => {
      this.isClickCall = false;
      if (value === 2) {
        let toastStr = LocalizedStrings['care_screen_is_calling'];
        Toast._showToast(toastStr);
      } else {
        Service.miotcamera.sendP2PCommandToDevice(MISSCommand.MISS_CMD_SPEAKER_START_REQ, {})
          .then((retCode) => {
            console.log("speaker on get send callback");
            console.log(retCode);
          })
          .catch((err) => {
            Toast.fail("action_failed", err);
          });
      }
    }).catch(error => {
      this.isClickCall = false;
      Service.miotcamera.sendP2PCommandToDevice(MISSCommand.MISS_CMD_SPEAKER_START_REQ, {})
        .then((retCode) => {
          console.log("speaker on get send callback");
          console.log(retCode);
        })
        .catch((err) => {
          Toast.fail("action_failed", err);
        });
    });
  }
  _stopCall() {
    console.log("stop call: thisstate.iscalling:" + this.state.isCalling + " cameraGlView:" + (this.cameraGLView != null) + " destroyed:" + this.destroyed);
    if (!this.state.isCalling) {
      return;
    }
    if (this.enterCallTime > 0) {
      let callTime = (new Date().getTime() - this.enterCallTime) / 1000;
      TrackUtil.reportResultEvent("Camera_VoiceCall_Time", "Time", callTime); // Camera_VoiceCall_Time
      this.enterCallTime = 0;
    }
    clearTimeout(this.callTimeout);
    Service.miotcamera.sendP2PCommandToDevice(MISSCommand.MISS_CMD_SPEAKER_STOP, {}).then((retCode) => {
      console.log("speaker off get send callback");
      console.log(retCode);
      this.fromOneKeyCall = false;
      this.startCallFlag = false;
    }).catch((err) => console.log(err));
    if (this.cameraGLView != null && !this.destroyed) {
      this.cameraGLView.stopAudioRecord();
    }

    this._disableAudioBtnTemporarily();
    this._toggleAudio(this.isAudioMuteTmp);// 恢复对讲之前的状态

    this.setState({
      isCalling: false
    });
    console.log("this.iscalling = false");
    this.isClickCall = false;
  }

  _disableAudioBtnTemporarily() {
    if (Platform.OS == "android") {
      return;
    }
    this.setState({ isAudioBtnDisabled: true });
    this._clearTimer(this.mSetAudioBtnStateTimer);
    this.mSetAudioBtnStateTimer = setTimeout(() => {
      this.setState({ isAudioBtnDisabled: false });
    }, 500);
  }

  _startSnapshot() {
    if (Platform.OS === "android") {
      this.isCheckingPermission = true;
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, null)
        .then((granted) => {
          this.isCheckingPermission = false;
          console.log("granted", granted);
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this._realStartSnapshot(false, true);
          } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            // Toast.success("camera_no_write_permission");
            this.setState({ showPermissionDialog: true, permissionRequestState: 0 });
          } else {
            Toast.success("camera_no_write_permission");
          }
        }).catch((error) => {
          this.isCheckingPermission = false;
          Toast.success("action_failed");
        });
    } else {
      // no ios's photos const use hardcode

      System.permission.request("photos").then((res) => {
        this._realStartSnapshot(false, true);
      }).catch((error) => {
        // Toast.success("camera_no_write_permission");
        this.setState({ showPermissionDialog: true, permissionRequestState: 0 });
      });

    }
    TrackUtil.reportClickEvent('Camera_ScreenShot_ClickNum');
  }

  _realStartSnapshot(isFromVideo, shouldShowPop) {
    AlbumHelper.snapShot(this.cameraGLView)
      .then((path) => {
        console.log(path, 'path');
        this.isForVideoSnapshot = isFromVideo;
        if (!shouldShowPop) {
          return;// 点右上角的设置时，调用截图api，不弹框
        }
        clearTimeout(this.snapshotTimeout);
        this.setState({ screenshotVisiblity: true, screenshotPath: path });// show snapshotview
        this.snapshotTimeout = setTimeout(() => {
          this.isForVideoSnapshot = false;
          this.setState({ screenshotVisiblity: false, screenshotPath: null });
        }, 5000);// v1 比 v3 需要更多时间
        // 文件路径。
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        Toast.success("action_failed");
      });
  }

  _stopRecord() {
    if (!this.state.isRecording) {
      return;
    }
  
    if (this.state.resolution != 3) { // 不是高清
      Service.miotcamera.sendP2PCommandToDevice(
        MISSCommand.MISS_CMD_STREAM_CTRL_REQ, { "videoquality": this.state.resolution })
        .then(() => { // 不修改这些信息。
  
        })
        .catch((err) => {
          console.log(err);
        });
    }
  
    if (this.state.isMute) { // 原本静音
      Service.miotcamera.sendP2PCommandToDevice(MISSCommand.MISS_CMD_AUDIO_STOP, {}).then(() => {
  
      });
      if (this.cameraGLView != null && !this.destroyed) {
        this.cameraGLView.stopAudioPlay();
      }
    }
    if (this.cameraGLView == null || this.destroyed) {
      this.setState({ isRecording: false, recordTimeSeconds: 0 });
      return;
    }
    this.cameraGLView.stopRecord().then(() => {
      console.log("stopRecord success branch");
      this.setState({ isRecording: false, recordTimeSeconds: 0 });
      if (this.videoRecordPath == null || this.videoRecordPath == "") {
        LogUtil.logOnAll("stopRecord failed this.videoRecordPath=", this.videoRecordPath);
        return;
      }
      this.mRecordOkTimer = setTimeout(() => { // setTimneout锁屏后不再执行，开屏后自动执行
        // 录制成功后 要把视频转存储到相册。
        AlbumHelper.saveToAlbum(this.videoRecordPath, true)
          .then((result) => {
            this.setState({
              videoName: result,
              isRecording: false, 
              recordTimeSeconds: 0
            });
            if (this.justSnapshotResult) {
              this.isForVideoSnapshot = true;
              this.setState({ screenshotVisiblity: true, screenshotPath: AlbumHelper.getSnapshotName() });// show snapshotview
              clearTimeout(this.snapshotTimeout);
              this.snapshotTimeout = setTimeout(() => {
                this.setState({ screenshotVisiblity: false, screenshotPath: null });
              }, 5000);
            } else { // 截图失败的时候，就使用videoRecordPath
              this.isForVideoSnapshot = true;
              this.setState({ screenshotVisiblity: true, screenshotPath: this.videoRecordPath });// show snapshotview
              clearTimeout(this.snapshotTimeout);
              this.snapshotTimeout = setTimeout(() => {
                this.setState({ screenshotVisiblity: false, screenshotPath: null });
              }, 5000);
            }
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
      .catch((error) => {
        LogUtil.logOnAll(TAG, "stopRecord failed reason:", JSON.stringify(error))
        this.setState({ isRecording: false, recordTimeSeconds: 0 });
        if (error == -2) {
          Toast.fail("record_video_failed_time_mini");
        } else {
          Toast.fail("record_video_failed");
        }
      });
  
    this.justSnapshotResult = false;
    AlbumHelper.justSnapshot(this.cameraGLView)
      .then((path) => {
        this.justSnapshotResult = true;
      })
      .catch((error) => {
        this.justSnapshotResult = false;
      });
  }

  _startRecord() {
    if (this.state.showLoadingView) {
      Toast.success("action_failed");
      return;
    }
    if (Platform.OS === "ios") {
      // no ios's photos const use hardcode
      System.permission.request("photos").then((res) => {
        this.realStartRecord();
      }).catch((error) => {
        // Toast.success("camera_no_write_permission");
        this.setState({ showPermissionDialog: true, permissionRequestState: 0 });
      });
    } else {
      this.isCheckingPermission = true;
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, null)
        .then((granted) => {
          this.isCheckingPermission = false;
          console.log("granted", granted);
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.realStartRecord();
          } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            // Toast.success("camera_no_write_permission");
            this.setState({ showPermissionDialog: true, permissionRequestState: 0 });
          } else {
            Toast.success("camera_no_write_permission");
          }
        }).catch((error) => {
          this.isCheckingPermission = false;
          // Toast.fail("action_failed", error);
          this.setState({ showPermissionDialog: true, permissionRequestState: 0 });

        });
    }
    TrackUtil.reportClickEvent('Camera_Record_ClickNum');
  }

  realStartRecord() {
    // 切换清晰度为高清
    if (this.state.resolution != 3) { // 不是高清
      Service.miotcamera.sendP2PCommandToDevice(
        MISSCommand.MISS_CMD_STREAM_CTRL_REQ, { "videoquality": 3 })
        .then(() => { // 不修改这些信息。
          // this.setState({ resolution: index })
          // StorageKeys.LIVE_VIDEO_RESOLUTION = index;
          this._realStartRecord(1);
        })
        .catch((err) => {
          console.log(err);
          this._realStartRecord(2);
        });
    } else {
      this._realStartRecord(3);
    }
  }

  _realStartRecord(fromi) {
    console.log(`_realStartRecord called from: ${fromi}`);
    // 打开声音
    if (this.state.isMute) { // 不是有声音 开启声音通道 不播放
      Service.miotcamera.sendP2PCommandToDevice(MISSCommand.MISS_CMD_AUDIO_START, {}).then((retCode) => {
        console.log("audio start get send callback");
        console.log(retCode);
      });
    }

    let path = AlbumHelper.getDownloadTargetPathName(true);
    this.videoRecordPath = path;
    if (this.cameraGLView == null || this.destroyed) {
      return;
    }
    this.cameraGLView.startRecord(`${Host.file.storageBasePath}/${path}`, kRecordTimeCallbackName)
      .then((retCode) => {
        console.log(`start record, retCode: ${retCode}`);
        this.setState({ isRecording: true, screenshotVisiblity: false });
      })
      .catch((err) => {
        console.log(err);
        Toast.success("action_failed");
      });
  }

  _changeResolution(position) {

    // if (this.state.pstate < 2) {//没有连接上
    //   //
    //   return;
    // }
    // if (this.state.isRecording) {
    //   //
    //   return;
    // }

    let index = 0;
    switch (position) {
      case 1:
        if (CameraConfig.suport2HigherResolution(Device.model)) {
          index = 2;
        } else {
          index = 1;
        }
        break;
      case 2:
        if (CameraConfig.suport3Resolution(Device.model)) {
          index = 2;
        } else {
          index = 3;
        }
        break;
      case 3:
        index = 3;
        break;
      default:
        index = 0;
        break;
    }

    // show dialog for user to choose
    // send p2p cmds
    this.sendResolutionCmd(index);
    TrackUtil.reportResultEvent('Camera_Definition_Status', 'type', position + 1);
  }

  sendResolutionCmd(index, ignoreState = false) {
    Service.miotcamera.sendP2PCommandToDevice(
      MISSCommand.MISS_CMD_STREAM_CTRL_REQ, { "videoquality": index })
      .then(() => {
        if (!ignoreState) {
          this.setState({ resolution: index });
        }
        StorageKeys.LIVE_VIDEO_RESOLUTION = index;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  _toggleSleep(isSleep) {
    this.isAllViewRpc = false;
    
    if (this.isReadonlyShared) {
      Toast.fail('cloud_share_hint');
      return;
    }
    if (this.state.isRecording) {
      Toast.success("camera_recording_block");
      return;
    }
    if (this.state.isCalling) {
      Toast.success("camera_speaking_block");
      return;
    }

    if (this.isClickSleep) {
      return;
    }

    if (isSleep) {
      this.forceSleep = true;
    } else {
      this.forceSleep = false;
    }
    this.isClickSleep = true;

    this.lastClickSleepTime = new Date().getTime();
    if (isSleep) {
      this._getScreenWorkState().then(value => {
        if (value === 0) {
          this._doSleepAction(isSleep);
        } else {
          this.isClickSleep = false;
          this.forceSleep = false;
          let toastStr = value == 1 ? LocalizedStrings['care_screen_is_recording']
            : value == 2 ? LocalizedStrings['care_screen_is_calling']
              : LocalizedStrings['care_screen_is_snapshot'];
          Toast._showToast(toastStr);
        }
      }).catch(error => {
        // this.isClickSleep = false;
        // Toast.fail("action_failed");
        this._doSleepAction(isSleep);
      });
    } else {
      this._doSleepAction(isSleep);
    }
  }

  /**
   * @Author: byh
   * @Date: 2023/11/25
   * @explanation:
   * 休眠时，先获取看护屏状态，看护屏空闲时可休眠，其他给对应提示
   * 0: Idle
   * 1: Manu-recording
   * 2: Talking
   * 3: Manu-snapshot
   *********************************************************/
  _getScreenWorkState() {
    return new Promise((resolve, reject) => {
      const params = [{ sname: SIID_SCREEN_CONTROL, pname: PIID_SCREEN_WORK_STATUS }];
      AlarmUtilV2.getSpecPValue(params, 2)
        .then((res) => {
          if (res[0].code === 0) {
            let value = res[0].value;
            resolve(value);
          } else {
            reject(-1);
          }
        }).catch(err => {
          reject(-1);
        });
    });
  }

  _doSleepAction(isSleep) {
    SpecUtil.toggleSleep(isSleep)
      .then(() => {
        this._powerOffHandler(!isSleep, true, true);
      })
      .catch((err) => {
        this.isClickSleep = false;
        if (VersionUtil.judgeIsV1(Device.model)) { // 不管。。。v1原生插件这么干的

        } else {
          Toast.fail("action_failed");
        }
      });

  }

  _toggleAudio(isMute, changeUnitMute = true) {
    if (this.state.isMute == isMute) { // 状态一致，没有必要走到下面。
      return;
    }
    if (this.cameraGLView == null || this.destroyed) {
      return;
    }
    console.log(TAG, "isMute:" + isMute + " changeUnitMUte:" + changeUnitMute);
    if (isMute) {
      if (this.state.isMute) { // 已经静音
        return;
      }
      if (!this.state.isRecording) {
        Service.miotcamera.sendP2PCommandToDevice(MISSCommand.MISS_CMD_AUDIO_STOP, {}).then((retCode) => {
          console.log("audio stop get send callback");
          console.log(retCode);
        });
      }
      console.log(TAG, "stopAudioPlay called");
      this.cameraGLView.stopAudioPlay();
      this.setState({ isMute: true });
      if (changeUnitMute) {
        CameraConfig.setUnitMute(true);
      }
      return;
    }
    if (!this.state.isRecording) {
      Service.miotcamera.sendP2PCommandToDevice(MISSCommand.MISS_CMD_AUDIO_START, {}).then((retCode) => {
        console.log("audio start get send callback");
        console.log(retCode);
      });
    }
    this.cameraGLView.startAudioPlay();
    this.setState({ isMute: false });
    CameraConfig.setUnitMute(false);

  }

  _renderResolutionDialog() {
    return this._renderResolutionDialog_ios(); // 不再区分平台
  }

  _renderResolutionDialog_ios() {
    let fhdname = CameraConfig.isNormalFHD() ? LocalizedStrings["camera_quality_super_fhd"]
      : this.isSupport2K ? LocalizedStrings["camera_quality_fhd2k"] : (this.isSupport25K ? LocalizedStrings["camera_quality_fhd2k"].replace("2K", "2.5K") 
        : this.isSupport3K ? LocalizedStrings["camera_quality_fhd3k"] : LocalizedStrings["camera_quality_fhd"]);
    let midname = CameraConfig.isNormalFHD() ? LocalizedStrings["camera_quality_fhd2k"].replace("2K", "").replace(" ", "").replace("高清", "高清HD")
      : VersionUtil.Model_chuangmi_051a01 == Device.model ? LocalizedStrings["camera_quality_fhd"].replace("1080", "720") : fhdname;
    let lowName = CameraConfig.isNormalFHD() ? LocalizedStrings["camera_quality_sd"]
      : CameraConfig.isSupport480P(Device.model) ? LocalizedStrings["camera_quality_low"].replace("360", "480") 
      : CameraConfig.isSupport720P(Device.model) ? LocalizedStrings["camera_quality_low"].replace("360", "720") : LocalizedStrings["camera_quality_low"];
    let dataSourceArr = CameraConfig.suport3Resolution(Device.model) ? [{ title: LocalizedStrings["camera_quality_auto"] }, { title: lowName }, { title: midname }, { title: fhdname }]
      : CameraConfig.suport2HigherResolution(Device.model) ? [{ title: LocalizedStrings["camera_quality_auto"] }, { title: midname }, { title: fhdname }] 
      : [{ title: LocalizedStrings["camera_quality_auto"] }, { title: lowName }, { title: fhdname }];
    return (
      <ChoiceDialog
        modalStyle={{ marginBottom: -16, marginLeft: this.state.fullScreen ? 78 : 0, width: this.state.fullScreen ? (this._getWindowPortraitHeight() - 78 * 2) : "100%" }}

        visible={this.state.dialogVisibility}
        title={LocalizedStrings["camera_quality_choose"]}
        options={dataSourceArr}
        selectedIndexArray={this.selectedIndexArray}
        itemStyleType={2}
        onDismiss={(_) => this.setState({ dialogVisibility: false })}
        onSelect={(result) => {
          this.selectedIndexArray = result;
          this._changeResolution(result[0]);
          this.setState({ dialogVisibility: false });
        }}
        accessibilityLabel={DescriptionConstants.zb_46}
      />
    );
  }

  _renderPanoViewDialog() {
    if (!this.state.panoDialogVisibility) {
      return null;
    }
    if (this.state.isInternationServer) { // 海外没有上线全景图服务
      return;
    }

    let isShowAngle = true;
    if (this.panoParam) {
      isShowAngle = this.panoParam.isSupportAngle;
    }
    return (
      <PanoramaViewDialog
        visible={true}
        showAngle={isShowAngle}
        initType={this.panoramaType}
        onCancelPress={(selectType) => {
          this.setState({ panoDialogVisibility: false });
        }}
        onConfirmPress={(selectType) => {
          this._startDrawingPanorama(selectType);
        }}
      />
    );
  }
  // 开始绘制
  _startDrawingPanorama(selectType) {
    StorageKeys.LAST_PANO_ANGLE = selectType;
    this.panoramaType = selectType;
    this.startPanoIconAnimation();
    this.setState({ panoDialogVisibility: false, panoViewStatus: 2 });
    setTimeout(() => {
      this._getPanorama();
    });
  }
  _putSD_STATUS_EJECTED() {
    AlarmUtilV2.putSD_STATUS_EJECTED(false).then((res) => {
      LogUtil.logOnAll(`putSD_STATUS_EJECTED res=${ JSON.stringify(res) }`);
      this.putedSD_STATUS_EJECTED = 1;
    }).catch((err) => {
      LogUtil.logOnAll(`putSD_STATUS_EJECTED err=${ JSON.stringify(err) }`);
      this.putedSD_STATUS_EJECTED = -1;
    });
  }
  async onePopUp(data,state) { //存储到本地，仅出现一次弹窗方法，data:本地存储对象名；state:弹窗状态名
    let res = await StorageKeys[data];
    // const res = false;
    LogUtil.logOnAll("onePopUp set status ", state, " value=", !res);
    AlarmUtilV2.getSD_STATUS_EJECTED().then((result) => {
      LogUtil.logOnAll("getSD_STATUS_EJECTED by onePopUp=", JSON.stringify(result));
      res = result[0].value || CameraConfig.fromSdCardErrorPush ? false : res;
      if (Device.isReadonlyShared) {
        res = true;
      }
      this.setState({ [state]: !res }, () => {
        if (res) {
          this.sdCardabnormal()//sd卡异常监测
        }
      });
      if (!res) {
        this._putSD_STATUS_EJECTED();
      }
    }).catch((err) => {
      LogUtil.logOnAll("getSD_STATUS_EJECTED by onePopUp err =", JSON.stringify(err));
      res = CameraConfig.fromSdCardErrorPush ? false : res;
      if (Device.isReadonlyShared) {
        res = true;
      }
      this.setState({ [state]: !res }, () => {
        if (res) {
          this.sdCardabnormal()//sd卡异常监测
        }
      });
      if (!res) {
        this._putSD_STATUS_EJECTED();
      }
    });
    if (!Device.isReadonlyShared) {
      StorageKeys[data] = true;
    }
  }
  _refreshRemoteProps(showDialogs = true) {
    if (showDialogs) {
      if (CameraConfig.isSupportVisitInfo(Device.model) && !Device.isOwner) { this._showVisitInfo() }
      // this._showGBFDialog();
      // 下掉绑定弹框
      // this._showScreenBindDialog();
      LogUtil.logOnAll("Device.isNew=", Device.isNew, "this.privacyDialogPoped", this.privacyDialogPoped);
      if (Device.isNew || this.privacyDialogPoped && Device.isOwner) {
        this.shouldShowVipCloudOpenDialog = true;
        this._getCloudIsOpen();
      }
    }
    console.log("===========+++++++===========",this.shouldRequestScreenState)
    // if (this.shouldRequestScreenState) {
    //   this._showScreenBindDialog();
    // }
    if (!this.calledSdcardStatus && !showDialogs) {
      LogUtil.logOnAll("-=-=-=-=-=!this.calledSdcardStatus && !showDialogs");
      return;
    }
    CameraPlayer.getInstance().getSdcardStatus()
      .then(({ sdcardCode }) => {
        // let result = JSON.parse(res);//res优先转化为json 转化失败则是str
        LogUtil.logOnAll("-=-=-=-=-=-=-=-=-=-=-= sdcardCode:", sdcardCode, "-=-=-=showDialog:", showDialogs);
        this.sdcardCode = sdcardCode;
        if (this.sdcardCode == 0 && CameraConfig.fromSdCardErrorPush) {
          Toast.show("sds_format_success");
        }
        if (showDialogs) {
          this.calledSdcardStatus = true;
          if (this.sdcardCode == 2) {
            this.onePopUp("SDCARD_FULL_DIALOG", 'sdcardFullDialog');
          } else if (this.sdcardCode == CameraPlayer.SD_CARD_TOO_SMALL_CODE) {
            this.onePopUp("SDCARD_SMALL_CAPACITY", 'sdcardSmallDialog');
          } else if (this.sdcardCode == CameraPlayer.SD_CARD_NEED_FORMAT_CODE 
            || this.sdcardCode == CameraPlayer.SD_CARD_FILE_ERROR_CODE 
            || this.sdcardCode == CameraPlayer.SD_CARD_INCOMPATIBLE_CODE
            || this.sdcardCode == 3) {
            this.onePopUp(`SDCARD_FORMAT_DIALOG_${ sdcardCode }`, 'sdcardFormatDialog');
          }
        }
      })
      .catch(({ sdcardCode, error }) => {
        // fix MIIO-40229
        // error in this form {"error": {"code": -2003, "domain": "MiHomeNetworkErrorRemote", "localDescription": "The operation couldn’t be completed. (MiHomeNetworkErrorRemote error -2003.)"}, "message": "callMethod failedError Domain=MiHomeNetworkErrorRemote Code=-2003 \"(null)\" UserInfo={ot_cost=1570, id=10, code=-2003, net_cost=71, exe_time=100, message=default error, otlocalts=1598861669714605, error={code = \"-2003\"}}"};
        if (typeof (sdcardCode) === 'number' && sdcardCode >= 0) {
          this.sdcardCode = sdcardCode;
        }

        console.log("request sdcard status error", error);
      });

    
    
  }
  _renderVisitInfoDialog() {
    let message =
      Device.isFamily ?
        LocalizedStrings["visit_record_tip1"] :
        (
          Device.isReadonlyShared
            ?
            LocalizedStrings["visit_record_tip2"]
            :
            LocalizedStrings["visit_record_tip1"]
        )

    // if(this.state.isVisitShow)
    return (
      <MessageDialog
        visible={this.state.isVisitShow}
        title={LocalizedStrings["device_visit_record"]}
        message={message}
        messageStyle={{ textAlign: 'center', backgroundColor: 'white' }}
        buttons={[
          {
            text: LocalizedStrings["offline_divice_ok"],
            style: { color: 'lightpink' },
            // onLongPress: () => alert('aa'),
            // backgroundColor: { bgColorNormal: 'red', bgColorPressed: 'green',},
            callback: () => {
              this.setState({
                isVisitShow: false
              })
            }
          }
        ]}
        onDismiss={() => { this.setState({ isVisitShow: false }) }}
      />

    )
  }

  _checkNasVersion() {
    LogUtil.logOnAll("nas_get_config-=-=-=-=start checkNasVersion=", CameraConfig.checkNasVersion);
    CameraConfig.nasUpgradeTips = -1;
    CameraConfig.nasUpgradeTipsShown = -1;
    if (CameraConfig.isNASV123(Device.model) && CameraConfig.checkNasVersion) {
      RPC.callMethod("nas_get_config", {})
        .then((res) => {
          LogUtil.logOnAll("nas_get_config-=-=-=-=", JSON.stringify(res));
          let support_type = res.result?.support_type || 1;
          let share_type = res.result?.share?.type || -1; // -1 表示没有连接的设备
          if (support_type == 1 || share_type == 1) {
            CameraConfig.nasUpgradeTips = -1; // 无提示
            if (support_type === 1) {
              if (share_type !== 1) {
                CameraConfig.nasUpgradeTips = 1; // 提示摄像机固件升级
              } else {
                CameraConfig.nasUpgradeTips = 2; // 都要升级的提示
              }
            } else {
              if (share_type === 1) {
                CameraConfig.nasUpgradeTips = 3; // 提示nas设备需要升级
              }
            }
            if (CameraConfig.nasUpgradeTips != CameraConfig.nasUpgradeTipsShown) {
              this.setState({ showNasRedDot: true });
            } else {
              this.setState({ showNasRedDot: false });
            }
          } else {
            this.setState({ showNasRedDot: false });
          }
        }).catch((err) => {
          LogUtil.logOnAll("LiveVideoPageV2", `nas_get_config failed: ${ JSON.stringify(err)}`);
          this.setState({ showNasRedDot: false });
        });
        CameraConfig.checkNasVersion = false;
        CameraConfig.nasUpgradeDlgBtnChecked = false;
    }
  }
}

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    // backgroundColor: 'white',
    width: "100%",
    height: "100%"
  },

  controlLayout: {
    position: "relative",
    display: "flex",
    zIndex: 1,
    backgroundColor: "#EEEEEE",
    width: "100%",
    flexDirection: "column",
    flexWrap: 'nowrap',
    flexGrow: 1
  },

  panelOptionsViewLayout: {
    display: "flex",
    width: "100%",
    height: "100%",
    // marginTop: kWindowHeight >= 700 ? 25 : 5,
    flexGrow: 1,
    flexDirection: "column"
  },

  bgImageStyle: {
    width: "100%",
    aspectRatio: 1920.0 / 1080.0
  },

  panelOptionItemLayout: {
    display: "flex",
    position: "relative",
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight: 30,
  },

  // fixContolView: { 
  //   display: "flex", 
  //   position: "absolute", 
  //   top: 0,
  //   zIndex: 2, 
  //   height: fixControlBarHeight, 
  //   width: "100%", 
  //   flexDirection: "row", 
  //   alignItems: "center", 
  //   justifyContent: this.isPtz ? "space-around" : "center",
  //   backgroundColor: "#ffffff",
  //   borderBottomLeftRadius: 30, 
  //   borderBottomRightRadius: 30
  // },

  videoControl: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80
  },

  videoControlBarPortrait: {
    display: "flex",
    position: "absolute",
    bottom: 0,
    marginBottom: 5,
    width: "100%",
    height: iconButtonSize,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 10,
    justifyContent: "space-between",
    backgroundColor: "transparent"
  },

  videoControlBarLandscape: {
    display: "flex",
    width: "100%",
    paddingRight: 22,
    flexDirection: "row",
    justifyContent: "flex-end"
  },

  videoControlBarItem: {
    width: iconButtonSize,
    height: iconButtonSize,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  videoControlBarItemLandscape: {
    width: iconButtonSize,
    height: iconButtonSize,
    display: "flex",
    marginLeft: 22,
    justifyContent: "center",
    alignItems: "center"
  },

  landscapeButton: {
    width: 50,
    height: 50,
    // marginTop: kWindowWidth < 400 ? 50 : 35
  },

  landscapeLongPressButton: {
    display: "flex",
    width: 80,
    height: 50,
    marginTop: 35,
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },

  optionNewTagContainerStyle: {
    marginLeft: 5,
    marginTop: 0,
    width: 16,
    height: 16,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#FF5D45FF"
  },

  optionNewTagStyle: {
    fontSize: kIsCN ? 9 : 7,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#ffffff",
    fontWeight: "bold",
    backgroundColor: "#FF5D45FF"
  }

});
