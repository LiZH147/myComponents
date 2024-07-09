# DateFlterView
## 使用方法
封装程度较高，相对的抽象性较差。选择使用日期列表的长度渲染数据，抛弃了data属性，改用dayLength属性规定列表长度。
### 属性：
+ totalWidth:Number 屏幕宽度。可以使用RN的Dimensions获取
    ```javascript
    const SCREEN_WIDTH = Math.min(
        Dimensions.get('window').height,
        Dimensions.get('window').width
    );
    ```
+ dayButtonPressed:function 点击某一项的回调函数
+ scrollModel:Number 选择是否按周滑动，为1时表示按周滑动切换，否则为默认
+ dayLength:Number 规定列表长度，默认为7，也即一周的长度
+ extraHeader:React.Component || function 用来渲染额外的头部
### 一些自定义
+ wkDayArr是用来显示周几的数组，可根据需要进行国际化适配
+ 封装了FlatList渲染的项组件ListItem
+ 渲染日期列表的函数getmyDate
+ Padding NumColumns itemSpace 分别为间隔 列数 宽度
## 使用示例
```javascript
<DateFlterView
    totalWidth={SCREEN_WIDTH}
    dayButtonPressed={() => {}}
    extraHeader={null}
    // 加一个scrollModel属性，为1时按周切换
    scrollModel={1}
    // 从今天起的日期长度
    dayLength={100}
/>
```