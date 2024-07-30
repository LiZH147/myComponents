import React, { memo, useEffect, useRef } from "react";
import './SlideBanner.css'

const SildeBanner = () => {
    const bannerRef = useRef();
    const videoRef = useRef();
    let bannerLeft, bannerWidth;
    let initMouseLeft = 0;

    useEffect(() => {
        bannerLeft = bannerRef.current.offsetLeft;
        bannerWidth = bannerRef.current.offsetWidth;
        init()
        playVideo()
        touchListener()
    }, [])
    const styleMap = {
        0: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 0,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: null,
        },
        1: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 0,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'y',
                scale: 10
            },
        },
        2: {
            initialStyle: {
                height: '224.4px',
                width: '2400px',
                translateX: 300,
                translateY: 24,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: null,
        },
        3: {
            initialStyle: {
                height: '205.7px',
                width: '2200px',
                translateX: 330,
                translateY: 33,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'x',
                scale: 50
            },
        },
        4: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 15,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: null,
        },
        5: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 15,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'x',
                scale: 10
            },
        },
        6: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 15,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'x',
                scale: 10
            },
        },
        7: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 15,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'x',
                scale: 2
            },
        },
        8: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 15,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'x',
                scale: 10
            },
        },
        9: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 15,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: null,
        },
        10: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 15,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'x',
                scale: 50
            },
        },
        11: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 15,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'x',
                scale: 10
            },
        },
        12: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 15,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'x',
                scale: 30
            },
        },
        13: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 15,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'x',
                scale: 30
            },
        },
        14: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 15,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: null,
        },
        15: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 15,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'x',
                scale: 20
            },
        },
        16: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 15,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'x',
                scale: 10
            },
        },
        17: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: -100,
                translateY: 15,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'x',
                scale: 20
            },
        },
        18: {
            initialStyle: {
                height: '168.3px',
                width: '1800px',
                translateX: -90,
                translateY: 0,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'x',
                scale: 400
            },
        },
        19: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 0,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'x',
                scale: 10
            },
        },
        20: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 0,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'x',
                scale: 10
            },
        },
        21: {
            initialStyle: {
                height: '100px',
                width: '180px',
                translateX: -245,
                translateY: 15,
                rotate: 0,
                scale: 1,
                opacity: 1,
                objectFit: 'cover'
            },
            style: null,
        },
        22: {
            initialStyle: {
                height: '205.7px',
                width: '2200px',
                translateX: 0,
                translateY: 0,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'x',
                scale: 200
            },
        },
        23: {
            initialStyle: {
                height: '187px',
                width: '2000px',
                translateX: 0,
                translateY: 15,
                rotate: 0,
                scale: 1,
                opacity: 1
            },
            style: {
                direction: 'x',
                scale: 200
            },
        },
    }

    const init = () => {
        Object.keys(styleMap).forEach((item, index) => {
            const current = styleMap[item];
            const initStyle = current.initialStyle;
            current.element = bannerRef.current.children[index]
            current.element.style = `height:${initStyle.height}; width:${initStyle.translateX}px, ${initStyle.translateY}px) rotate(${initStyle.rotate}deg) scale(${initStyle.scale}); opacity: ${initStyle.opacity}; object-fit: ${initStyle.objectFit}`
        })
    }

    const playVideo = () => {
        videoRef.current.play()
    }

    const touchListener = () => {
        function calcutedPosition(mouseLeft, scale) {
            return -(mouseLeft - initMouseLeft) * scale / bannerWidth
        }

        function startListener() {
            bannerRef.current.addEventListener('mousemove', function (event) {
                event.stopPropagation()
                const mouseLeft = event.pageX - bannerLeft;
                console.log('mouseLeft', mouseLeft)
                Object.keys(styleMap).forEach(item => {
                    const current = styleMap[item];
                    if (current.style) {
                        const initStyle = current.initialStyle;
                        const style = current.style;
                        const element = current.element;
                        // 计算偏移
                        const offset = calcutedPosition(mouseLeft, style.scale);
                        let styleResult = `height: ${initStyle.height}; width: ${initStyle.width}; opacity: ${initStyle.opacity}; objectFit: ${initStyle.objectFit};`;

                        if (style.direction === 'y') {
                            styleResult += `transform: translate(${initStyle.translateX}px, ${initStyle.translateY - offset}px) rotate(${initStyle.rotate}deg) scale(${initStyle.scale});`
                        } else {
                            styleResult += `transform: translate(${initStyle.translateX - offset}px, ${initStyle.translateY}px) rotate(${initStyle.rotate}deg) scale(${initStyle.scale});`
                        }
                        element.style = styleResult;
                    }
                });
            })
        }

        function clearListener(event) {
            const mouseLeft = event.pageX - bannerLeft;

            Object.keys(styleMap).forEach(item => {
                const current = styleMap[item];
                const style = current.style;
                const initStyle = current.initialStyle;
                const element = current.element;

                if (current.style) {
                    // 计算偏移
                    const offset = calcutedPosition(mouseLeft, style.scale);

                    let startValue = offset;
                    let endValue = 0;
                    let duration = 500; // 总时间，单位为毫秒
                    let interval = 50; // 每次更新的间隔时间，单位为毫秒
                    let steps = duration / interval; // 总步数
                    let stepValue = (startValue - endValue) / steps; // 每一步的值变化量

                    let currentValue = startValue;

                    let timer = setInterval(() => {
                        currentValue -= stepValue;
                        let styleResult = `height: ${initStyle.height}; width: ${initStyle.width}; opacity: ${initStyle.opacity}; object-fit: ${initStyle.objectFit};`;

                        if (style.direction === 'y') {
                            styleResult += `transform: translate(${initStyle.translateX}px, ${initStyle.translateY - currentValue}px) rotate(${initStyle.rotate}deg) scale(${initStyle.scale});`
                        } else {
                            styleResult += `transform: translate(${initStyle.translateX - currentValue}px, ${initStyle.translateY}px) rotate(${initStyle.rotate}deg) scale(${initStyle.scale});`
                        }

                        if (Math.abs(currentValue - endValue) < Math.abs(stepValue)) {
                            clearInterval(timer);
                            styleResult = `transform: translate(${initStyle.translateX}px, ${initStyle.translateY}px) rotate(${initStyle.rotate}deg) scale(${initStyle.scale});`;
                        }
                        element.style = styleResult;
                    }, interval);
                }
            });
        }

        bannerRef.current.addEventListener('mouseenter', function (event) {
            event.stopPropagation();
            // 计算初始鼠标 x 位置
            initMouseLeft = event.pageX - bannerLeft;
            // 开始监听偏移量
            startListener();
        });

        bannerRef.current.addEventListener('mouseleave', function (event) {
            event.stopPropagation();
            // 还原
            clearListener(event);
        });
    }

    return (
        <div ref={bannerRef} className="animated-banner">
            <div className="layer"><img alt="" src={require("./asset/2024.05/1.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/2.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/3.webp")} data-height="187" data-width="2000" height="224" width="2400" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/4.webp")} data-height="187" data-width="2000" height="205" width="2200" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/5.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/6.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/7.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/8.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/9.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/10.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/11.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/12.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/13.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/14.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/15.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/16.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/17.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/18.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/19.webp")} data-height="187" data-width="2000" height="168" width="1800" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/20.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/21.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
            <div className="layer"><video ref={videoRef} loop muted src={require("./asset/2024.05/1.webm")} playsInline="" width="180" height="100" data-height="100"
                data-width="180"></video></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/22.webp")} data-height="187" data-width="2000" height="205" width="2200" /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/23.webp")} data-height="187" data-width="2000" height="187" width="2000" /></div>
        </div>
    )
}

export default memo(SildeBanner)