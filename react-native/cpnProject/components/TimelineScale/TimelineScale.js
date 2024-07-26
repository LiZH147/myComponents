import React, { useRef } from 'react';
import { Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native'

let windowWidth = Math.min(Dimensions.get('screen').height, Dimensions.get('screen').width);

const TimelineScale = (props) => {
    let verticalLine = {
        position: 'flex',
        height: windowWidth,
        width: props.width ? props.width : 20,
        backgroundColor: props.backgroundColor ? props.backgroundColor : 'red',
    }
    const panResponder = useRef(
        PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) =>
                true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
                true,

            onPanResponderGrant: (evt, gestureState) => {
                // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
                // gestureState.d{x,y} 现在会被设置为0
            },
            onPanResponderMove: (evt, gestureState) => {
                // 最近一次的移动距离为gestureState.move{X,Y}
                // console.log(evt.nativeEvent.changedTouches.length)
                if(evt.nativeEvent.changedTouches.length > 1){
                    let changedTouches = evt.nativeEvent.changedTouches;
                    let value = Math.abs(changedTouches[0].locationY - changedTouches[1].locationY);
                    console.log(value)
                }
                // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
            },
            onPanResponderTerminationRequest: (evt, gestureState) =>
                true,
            onPanResponderRelease: (evt, gestureState) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                // 一般来说这意味着一个手势操作已经成功完成。
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            },
        })
    ).current;
    return (
        <View>
            <Text>TimelineScale</Text>
            <View style={verticalLine} {...panResponder.panHandlers} ></View>
        </View>
    )
}

styles = StyleSheet.create({})

export default TimelineScale;