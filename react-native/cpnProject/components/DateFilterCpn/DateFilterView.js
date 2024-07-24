import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useRef, useState } from 'react';

/**
 * 默认加载30天的日期，自动补全7的倍数，即最终数据源为35天
 */

const Padding = 12;
const NumColumns = 7;
const itemSpace = 4;

const wkDayArr = ['日', '一', '二', '三', '四', '五', '六'];

/**
 * 从今天所在的周起向前获取日期列表
 * @param {Number} dayLength 规定获取日期列表的长度，默认为7
 * @returns 
 */
function getmyDate(dayLength = 14) {
  let curDate = new Date();
  const days = [];
  // 向后填充，保证加载今天所在的一周
  if (curDate.getDay() !== 6) {
    let addLen = 6 - curDate.getDay();
    let tempDate = curDate.getDate() + addLen;
    curDate.setDate(tempDate);
    dayLength += addLen;
  }
  for (let i = 0; i < dayLength; i++) {
    let tempDate = new Date(curDate - 1000 * 60 * 60 * 24 * i);
    let obj = {
      date: tempDate.getDate().toString(),
      wkDay: wkDayArr[tempDate.getDay()],
      selected: i === 0 ? true : false,
      enable: i === 0 ? true : false,   // 是否有数据
    };
    days.unshift(obj);

    // 向前填充，向前挪起始日期保证总日期是7的倍数
    if (i === dayLength - 1 && tempDate.getDay() !== 0) {
      dayLength += tempDate.getDay();
    }
  }

  const chunkDays = [];
  for (let i = 0; i < days.length; i += 7) {
    let temp = days.slice(i, i + 7);
    chunkDays.push(temp);
  }
  return chunkDays;
}

const DateFlterView = (props) => {
  const flatListRef = useRef();
  const [beginOffset, setBeginOffset] = useState();
  const [endOffset, setEndOffset] = useState();
  let daysTemp = getmyDate(props.dayLength, props.dataSource);
  const [days, setDays] = useState(daysTemp);
  let todayStr = (new Date().getMonth() + 1).toString() + '月' + new Date().getDate().toString() + '日'

  const itemWidthTotal =
    (props.totalWidth - 2 * Padding - itemSpace * (NumColumns + 1)) /
    NumColumns +
    itemSpace;

  function selectItem(indexs, index) {
    let daysTemp = [...days];
    daysTemp.forEach((items) => {
      items.forEach(item => item.selected ? item.selected = false : null)
    })
    daysTemp[indexs][index].selected = true;
    setDays(daysTemp)
  }

  /**
   * 设置滑动切换一周的函数，
   * 根据滑动起始偏移量和结束偏移量计算方向，判断是否切换
   * @returns null
   */
  function scrollByWeek() {
    // console.log('beginOffset,endOffset=====', beginOffset, endOffset)
    if (endOffset >= (days.length - 1) * props.totalWidth - 200) {
      return;
    }
    if (beginOffset === 0) return;
    let coefficient = 0;
    // 滑动超过屏幕宽度一半时才切换，利用coefficient做系数判断向左还是向右
    if (Math.abs(endOffset - beginOffset) > itemWidthTotal * 2) {
      endOffset > beginOffset ? (coefficient = -1) : (coefficient = +1);
    } else {
      coefficient = 0;
    }
    let finalOffset =
      coefficient === 0
        ? beginOffset
        : beginOffset - coefficient * itemWidthTotal * 7;
    flatListRef.current.scrollToOffset({ animated: false, offset: finalOffset });
    // flatListRef.current.scrollToIndex({ animated: false, index: coefficient })
  }

  /**
   * 这是组成FlatList的项，返回一个封装的组件
   * 此处定义点击函数，这里只是简单的编写了背景切换效果＋调用传入的点击函数
   * 日期对象的selected和enabled属性对应是否选中，其中enabled对应是否有记录
   * @param {Object} item 传入的属性，此处就是日期对象
   * @param {Number} index 该项的下标
   * @returns 封装好的组件
   */
  const ListItem = ({ items, indexs }) => {
    let aItmW = itemWidthTotal - itemSpace;
    let dateStyles = [[styles.cell, { width: aItmW, height: aItmW }],
    [styles.cell, { backgroundColor: '#33ACFF', borderRadius: aItmW, width: aItmW, height: aItmW }]];
    let textStyle = [{ color: "rgba(153,153,153,0.4)" }, { color: "#000000" }, { color: "#99999966" }, { color: "#00000066" }, { color: "#FFFFFF" }];

    const wkDaysCpn = items.map((item, index) => {
      const { date, wkDay, selected, enabled } = item;
      return (
        <TouchableOpacity
          style={[dateStyles[selected ? 1 : 0], { paddingTop: 4, paddingBottom: 4 }]}
          onPress={() => {
            selectItem(indexs, index)
            props.dayButtonPressed();
          }}>
          <Text style={[{ fontSize: 12 }, selected ? textStyle[4] : enabled ? textStyle[0] : textStyle[2]]} >{wkDay}</Text>
          <Text style={[{ fontSize: 16 }, selected ? textStyle[4] : enabled ? textStyle[1] : textStyle[3]]} >{date}</Text>
        </TouchableOpacity>
      );
    })
    return (
      <View style={{ flexDirection: 'row', width: props.totalWidth, marginLeft: 2 }} key={indexs}>
        {wkDaysCpn}
      </View>
    )
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 34, marginLeft: 28, justifyContent: 'center' }}>
        <Text style={{ fontSize: 12, color: '#8c93b0', fontWeight: 'bold' }}>
          {todayStr}
        </Text>
      </View>
      <FlatList
        onLayout={() => { flatListRef.current.scrollToOffset({ animated: false, offset: (days.length - 1) * props.totalWidth }) }}
        ref={flatListRef}
        style={{ marginBottom: 13, width: '100%' }}
        data={days}
        renderItem={({ item, index }) => <ListItem items={item} indexs={index} />}
        pagingEnabled={true}
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        keyExtractor={(item, index) => index.toString()}
        // initialNumToRender={days.length - 7}
        getItemLayout={(data, index) => ({
          length: (itemWidthTotal - itemSpace),
          offset: itemWidthTotal * index,
          index,
        })}
        onScrollBeginDrag={(e) => {
          // 记录起始偏移量
          setBeginOffset(e.nativeEvent.contentOffset.x);
        }}
        onScrollEndDrag={(e) => {
          // 记录抬手时的偏移量
          setEndOffset(e.nativeEvent.contentOffset.x);
          props.scrollModel === 1 ? scrollByWeek() : null;
        }}
      />
      {props.extraHeader ? props.extraHeader() : null}
    </View>
  );
};

export default DateFlterView;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: itemSpace / 2,
    marginBottom: itemSpace,
  },
});
