import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import DateFlterView from './components/DateFilterCpn/DateFilterView'

const SCREEN_WIDTH = Math.min(
  Dimensions.get('window').height,
  Dimensions.get('window').width
);
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <DateFlterView
        totalWidth={SCREEN_WIDTH}
        dayButtonPressed={() => { }}
        extraHeader={null}
        // 加一个scrollModel属性，为1时按周切换
        scrollModel={1}
        // 从今天起的日期长度
        dayLength={30}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
