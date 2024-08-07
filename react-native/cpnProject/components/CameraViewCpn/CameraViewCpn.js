import React from 'react';
import {
  View,
  Platform,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { localStrings as LocalizedStrings } from '../MHLocalizableString';
import { Device, Host } from 'miot';
import CameraPlayer from '../util/CameraPlayer';
import Util from "../util2/Util";
import { DescriptionConstants } from '../Constants';
import AlbumHelper from '../util/AlbumHelper';
import CameraRenderView from 'miot/ui/CameraRenderView';
import CameraConfig from '../util/CameraConfig';
import Service from 'miot/Service';
import { MISSCommand, MISSConnectState, MISSError } from 'miot/service/miotcamera';
import { ImageButton } from 'miot/ui';
import { TouchableOpacity } from 'react-native';
import LoadingView from '../ui/LoadingView';
import VersionUtil from '../util/VersionUtil';
import { TouchableWithoutFeedback } from 'react-native';
import TrackConnectionHelper from '../util/TrackConnectionHelper';
import Toast from '../Toast';
import OfflineHelper from '../util/OfflineHelper';
import NoNetworkDialog from '../ui/NoNetworkDialog';
import DeviceOfflineDialog from '../ui/DeviceOfflineDialog';
import LocalModeDialog from '../ui/LocalModeDialog';

const ScreenOptions = Dimensions.get('window');
const viewWidth = ScreenOptions.width - 24 * 2;
const viewHeight = viewWidth * 9 / 16;
const TAG = "InstallSuggestionPage";
const kIsCN = Util.isLanguageCN();
const kRDTDataReceiveCallBackName = 'rdtDataReceiveCallBack';
const kBpsDataReceiveCallbackName = "bpsDataReceiveCallback";

/**
 * @Author: lzh
 * @Date: 2024/8/7
 * @explanation: 标准化的视频流组件。完成视频流的展示以及相关的错误处理
 * 1. 休眠状态：显示已休眠
 * 2. 网络错误：显示网络连接中断，并设有 重新连接、查看帮助 两个按钮，同时实现对应的弹窗
 * 3. 本地模式：显示本地模式，设有 查看更多 按钮
 * 4. 支持检测网络状态，实现自动重连
 * 5. 基于 安装建议 界面抽象，遗留有覆盖在视频上的人性轮廓
 * 6. 视频流入口
 *    0. 绑定相关回调函数（bindConnectionCallback连接状态、bindNetworkInfoCallback网络状态、bindPauseAllCallback休眠、bindLocalModeCallback模式改变）
 *      a. _connectionHandler()连接状态的回调，此处监听第一帧是否已经渲染，解除Loading状态；连接断开时，尝试重连queryNetWorkJob() / 进行断连处理handleDisconnected()
 *      b. _networkChangeHandler()网络状态改变的回调，网络断开时-->进行断连处理handleDisconnected()-->_stopAll()；有网络来了时-->重连queryNetWorkJob()
 *      c. _localModeChange()模式改变时的回调，本地模式时展示对应Err页面；变为直连时开启直播queryNetWorkJob()
 *      d. _stopAll()停止音视频渲染，将所有Err页面隐藏
 *    1. 入口函数：_startConnect()连接摄像机
 *    2. startVideo()开启视频流，发送P2P指令；失败时进入检查网络参数的流程queryNetWorkJob()
 *    3. queryNetWorkJob()监测网络状况，失败进入_stopAll()销毁，网络允许进入_startConnect()
 *********************************************************/

export default class CameraViewCpn extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      source: require('../../Resources/Images/camera_default_rote.jpg'),
      showLoadingView: false,
      showErrorView: false,
      showPowerOffView: false,
      errTextString: '',
      pstate: 0,
      isSleep: false,
      error: null,
      lastOfflineTime: 0
    };
    this.installSuggestionMsg = [LocalizedStrings["install_suggestion_msg0"], LocalizedStrings["install_suggestion_msg1"], LocalizedStrings["install_suggestion_msg2"], LocalizedStrings["install_suggestion_msg3"]]
    this.topImageSrc = require("../../Resources/Images/install_suggestion_baby.png");
    this.cameraGLView = null;
    this.isLocalMode = CameraPlayer.RUNTIME_LOCAL_MODE; //是否是本地模式
    this.currentNetworkState = -1; // 当前网络状态
    this.connRetry = 2;
    this.startVideoRetry = false;
    this.isPageForeGround = true;
    this.destroyed = false;
    this.hideBgBpsCount = 0;
    this.loadingRetryTimer = 0;
    this.isConnecting = false;
  }
  componentDidMount() {
    if (this.isLocalMode) {
      this.setState({ showLoadingView: false, showPauseView: false, showPowerOffView: false, showErrorView: true, errTextString: LocalizedStrings[''] });
      // return;
    }

    // 回调与摄像机实例绑定
    CameraPlayer.getInstance().bindConnectionCallback(this._connectionHandler);// 连接
    CameraPlayer.getInstance().bindNetworkInfoCallback(this._networkChangeHandler); // 网络变化 √
    CameraPlayer.getInstance().bindPauseAllCallback(() => { this._stopAll(false, false) });
    if (!CameraPlayer.getInstance().getPowerState()) {
      this.setState(() => { return { isSleep: true, showPowerOffView: true, showLoadingView: false, showPauseView: false } });
    } else {
      this.setState({ isSleep: false, showPoweroffView: false });
    }
    CameraPlayer.getInstance().bindLocalModeCallback(this._localModeChange);
    this.setState({ showLoadingView: true })
    this._startConnect();
  }

  _startConnect() {
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
      this.setState({ pstate: MISSConnectState.MISS_Connection_Connected });
      this.startVideo();
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

  queryNetWorkJob() {
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
        this.setState({ showLoading: true, showPauseView: false });
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

  // 连接摄像头的回调
  _connectionHandler = (connectionState) => {
    this.loadingRetryTimer = 0;
    Service.smarthome.reportLog(Device.model, `why!, _connectionHandler, connectionState.state: ${connectionState.state}`);
    if (connectionState.state == MISSConnectState.MISS_Connection_ReceivedFirstFrame) {
      if (this.hasFirstFrame || Platform.OS === "ios") {
        this.setState({ showLoadingView: false });
      } else {
        this.setState({ showLoadingView: false });
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
          this.queryNetWorkJob();
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
      // this._sendDirectionCmd(DirectionViewConstant.CMD_GET);
      this.isConnecting = false;
      this.startVideoRetry = false;
      console.log("start send video start");
      this.startVideo();

      TrackConnectionHelper.onConnected();
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

      this.hasFirstFrame = true;
    }
    this.setState({
      pstate: connectionState.state,
      error: connectionState.error
    });
  }
  // 网络状态变化的回调
  _networkChangeHandler = (networkState) => {
    if (this.isFirstEnter) { // 放到后台的包  刚进来的时候
      return;
    }
    if (this.currentNetworkState == networkState) {
      return;
    }
    if (this.state.showPowerOffView) {
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
        this.queryNetWorkJob();
      }, 500);// 过一会再查询 ，那个查询网络类型的api有问题。
    }
  }
  // 本地模式改变的回调
  _localModeChange = (value) => {
    console.log("_localModeChange change", value);
    CameraPlayer.RUNTIME_LOCAL_MODE = value;
    this.isLocalMode = CameraPlayer.RUNTIME_LOCAL_MODE;
    if (this.isLocalMode) {
      this.setState({ showLoadingView: false, showPauseView: false, showPoweroffView: false, showErrorView: true, errTextString: LocalizedStrings[''] });
    } else {
      // 直接连接无法开启直播
      this.localModeDelayTimeout && clearTimeout(this.localModeDelayTimeout);
      this.localModeDelayTimeout = setTimeout(() => {
        this.queryNetWorkJob();
      }, 500);
    }

  }

  _stopAll(showPauseView = false, setUnitMute = true, needSetPlayToolBar = true) {
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


  startVideo() {
    this.cameraGLView && this.cameraGLView.stopRender();
    this.cameraGLView && this.cameraGLView.startRender();
    // 关闭音频
    this.cameraGLView && this.cameraGLView.stopAudioPlay();
    Service.miotcamera.sendP2PCommandToDevice(MISSCommand.MISS_CMD_VIDEO_START, {})
      .then((retCode) => {
        console.log("startVideo success ", retCode);
        if (this.cameraGLView == null || this.destroyed) {
          return;
        }
        if (this.state.pstate == 3) {
          this.setState({ showLoadingView: false });// 已经渲染过  直接跳过去
        }
      })
      .catch((err) => {
        this.cameraGLView && this.cameraGLView.stopRender();
        if (err === -1 || err === 8888) {
          CameraPlayer.getInstance().resetConnectionState();
          Service.smarthome.reportLog(Device.model, "video-start的时候出错了:" + err);
          this.queryNetWorkJob();
          return;
        }
        this.setState({ pstate: 0, showLoadingView: false, showErrorView: true, errTextString: `${LocalizedStrings["camera_connect_error"]} ${err} ${LocalizedStrings["camera_connect_retry"]}` });// 已经渲染过  直接跳过去
      })
  }

  _renderPauseView() {
    if (!this.state.showPauseView || this.state.showErrorView) {
      return null;
    }
    return (
      <View style={{ display: "flex", position: "absolute", bottom: 0, width: "100%", height: viewHeight, alignItems: "center", justifyContent: "center", zIndex: 10 }}
      >
        <ImageButton
          style={{ width: 64, height: 64 }}
          source={require("../../Resources/Images/home_icon_pause_normal.png")}
          onPress={() => {
            // StorageKeys.IS_DATA_USAGEE_WARNING = false //wifi下
            // if (this.networkType === "CELLULAR") {
            //   this.skipDataWarning = true;
            // }
            Service.smarthome.reportLog(Device.model, "on pause clicked");
            // this._stopAll();
            console.log("pauseIcon clicked");
            this.connRetry = 2;
            this.queryNetWorkJob();
          }}
        />
      </View>
    );
  }

  _renderBabyBorderView() {
    let _state = this.state;
    if (_state.showErrorView || _state.showLoadingView || _state.showPowerOffView || _state.showPauseView) return
    return (
      <Image resizeMode='contain' style={{ width: viewWidth, height: viewHeight, position: 'absolute', top: 0 }} source={this.topImageSrc} />
    )
  }

  _renderLoadingView() {
    // todo render loading view
    if (!this.state.showLoadingView || this.state.showPowerOffView) {
      return null;
    }

    let height = viewHeight;
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
      <TouchableOpacity style={loadingViewStyle} >
        <LoadingView
          style={{ width: 54, height: 54 }}
        />
        <Text
          style={{ marginTop: 10, fontSize: Util.isLanguageCN() ? 12 : 10, color: "#ffffff" }}>
          {LocalizedStrings["camera_loading"]}
        </Text>
      </TouchableOpacity>
    );
  }

  handleDisconnected(errorCode) { // 已经断开了连接。
    console.log("disconnected");
    let errorStr = ((errorCode == 36 || errorCode == MISSError.MISS_ERR_MAX_SESSION) && VersionUtil.judgeIsMiss(Device)) ? LocalizedStrings["max_client_exceed"] : (errorCode == -6 && !VersionUtil.judgeIsMiss(Device) ? LocalizedStrings["max_client_exceed"] : `${LocalizedStrings["camera_connect_error"]} ${errorCode}, ${LocalizedStrings["camera_connect_retry"]}`);
    this.setState({ showLoadingView: false, showPauseView: false, showPowerOffView: false, showErrorView: true, errTextString: errorStr });
    this.isClickCall = false;
    if (this.cameraGLView != null && !this.destroyed) {
      this.cameraGLView.stopAudioPlay();
      this.cameraGLView.stopAudioRecord();
      this.cameraGLView.stopRender();// stopRender
    }

    if (!Device.isOnline) {
      return;
    }
  }
  _renderErrorRetryView() {

    if (!this.state.showErrorView) {
      return null;
    }
    if (!Device.isOnline && this.state.errTextString != LocalizedStrings['device_offline']) {
      this.setState({ errTextString: LocalizedStrings['device_offline'] });
    }

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
    let noNetworkItem = (
      <View style={{ display: "flex", flexDirection: "row" }}>
        <TouchableOpacity
          style={{ display: "flex", alignItems: "center", paddingRight: 8 }}
          onPress={() => {
            this.setState({ showErrorView: false });
            Service.smarthome.reportLog(Device.model, "on error Retry");
            this._stopAll();
            console.log("error button clicked");
            this.queryNetWorkJob();
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
        style={{ zIndex: 7, position: "absolute", bottom: 0, backgroundColor: "black", width: viewWidth, height: viewHeight, display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <TouchableOpacity
          style={{ display: "flex", alignItems: "center" }}
          onPress={() => {
            if (this.isLocalMode) {
              return;
            }
            this.setState({ showErrorView: false });
            Service.smarthome.reportLog(Device.model, "on error Retry");
            // this._stopAll();
            console.log("error button clicked");
            this.queryNetWorkJob();
          }}// 走重新播放的逻辑,如果是断线了  会走重连的逻辑的}
        >
          <Image
            style={{ width: 54, height: 54 }}
            source={errIcons[errIconIndex]} />
          <Text
            style={{ marginTop: 10, fontSize: kIsCN ? 12 : 10, color: "#ffffff", paddingHorizontal: 10, textAlign: "center", width: viewWidth - 60 }}>

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
  }

  _renderPowerOffView() {
    // todo render poweroffview  full
    if (!this.state.showPowerOffView) {
      return null;
    }
    let height = viewHeight;

    return (
      <View style={{ width: viewWidth, height: height, position: "absolute", bottom: 0 }}>

        <TouchableWithoutFeedback style={{ width: "100%", height: "100%", position: "absolute", bottom: 0 }} >
          <View style={{ backgroundColor: "black", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <Image
              style={{ width: 54, height: 54 }}
              source={require("../../Resources/Images/icon_camera_sleep.png")} />
            <Text
              style={{ marginTop: 10, fontSize: kIsCN ? 14 : 12, color: "#bfbfbf" }}>
              {LocalizedStrings[this.isSupportPhysicalCover ? "camera_physical_covered" : "camera_power_off"]}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>

    );
  }

  _renderVideoView() {
    let useWhiteBackground = this.state.darkMode || this.state.fullScreen ? false : this.state.isWhiteVideoBackground;
    return (
      <CameraRenderView
        ref={(ref) => { this.cameraGLView = ref }}
        style={{ width: viewWidth, height: viewHeight }}
        videoCodec={CameraConfig.getCameraCoderParam(Device.model).videoCodec}
        // audioCodec={CameraConfig.getCameraCoderParam(Device.model).audioCodec}
        fullscreenState={false}
        correctRadius={CameraConfig.getCameraCorrentParam(Device.model).radius}
        osdx={CameraConfig.getCameraCorrentParam(Device.model).osdx}
        osdy={CameraConfig.getCameraCorrentParam(Device.model).osdy}
        useLenCorrent={!CameraConfig.isDeviceCorrect(Device.model)}
        did={Device.deviceID}
        isFull={false}
        playRate={24}
        whiteBackground={useWhiteBackground}
        accessible={true}
        accessibilityLabel={DescriptionConstants.zb_54}
        maximumZoomScale={1}
      ></CameraRenderView>
    )
  }

  componentWillUnmount() {
    console.log("MotionDetectionPage componentWillUnmount.....");
    CameraPlayer.getInstance().bindConnectionCallback(null);// 连接
    CameraPlayer.getInstance().bindNetworkInfoCallback(null); // 网络变化 √
    CameraPlayer.getInstance().bindPauseAllCallback(null);
    CameraPlayer.getInstance().bindLocalModeCallback(null);
    this.cameraGLView?.stopRender()
  }

  render() {
    return (
      <View style={stylesInstall.container}>

          <View accessibilityLabel={DescriptionConstants.sz_4_71} style={{ alignItems: "center", marginTop: 20 }} >
            {this._renderVideoView()}
            {this._renderPauseView()}
            {this._renderBabyBorderView()}
            {this._renderPowerOffView()}
            {this._renderErrorRetryView()}
            {this._renderLoadingView()}
            <Image style={{ width: viewWidth, height: viewHeight, position: 'absolute', top: 0 }}
              source={require("../../Resources/Images/one_key_call_coner_view.png")}
            />

          </View>
          <DeviceOfflineDialog ref={(ref) => { this.powerOfflineDialog = ref; }} />
          <LocalModeDialog ref={(ref) => { this.localModeDialog = ref; }} />
          <NoNetworkDialog ref={ (ref) => {this.noNetworkDialog = ref} } />
      </View>
    );
  }
  _clearTimer(timer) {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

const stylesInstall = StyleSheet.create({
  container: {
    display: "flex",
    height: viewHeight,
    flex: 1,
    flexDirection: "column",
    backgroundColor: Util.isDark() ? "#000000" : "#FFFFFF",
    alignItems: "center"
  },
});