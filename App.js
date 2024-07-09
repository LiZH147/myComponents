import { Text, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react';

import DateFlterView from './components/DateFiterView';

const SCREEN_WIDTH = Math.min(
  Dimensions.get('window').height,
  Dimensions.get('window').width
);

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <DateFlterView
        totalWidth={SCREEN_WIDTH}
        dataSource={data}
        dayButtonPressed={() => {}}
        extraHeader={null}
        // 加一个scrollModel属性，为1时按周切换
        scrollModel={0}
        // 从今天起的日期长度
        dayLength={100}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});