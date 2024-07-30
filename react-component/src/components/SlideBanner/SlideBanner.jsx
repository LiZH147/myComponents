import React, { memo, useEffect, useRef, useState } from "react";
import './SlideBanner.css'

const SildeBanner = () => {
    const bannerRef = useRef(null);
    const [initMouseLeft, setInitMouseLeft] = useState(0);

    const styleMap = useRef({
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
                translateY: 0,
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
                translateY: 0,
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
    }).current

    useEffect(() => {
        const banner = bannerRef.current;
        const bannerLeft = banner.offsetLeft;
        const bannerWidth = banner.offsetWidth;

        const init = () => {
            Object.keys(styleMap).forEach(item => {
                const current = styleMap[item];
                const initStyle = current.initialStyle;
                current.element.style = `height: ${initStyle.height}; width: ${initStyle.width}; transform: translate(${initStyle.translateX}px, ${initStyle.translateY}px) rotate(${initStyle.rotate}deg) scale(${initStyle.scale}); opacity: ${initStyle.opacity}; object-fit: ${initStyle.objectFit}`;
            });
        };

        const playVideo = () => {
            const video = document.querySelector('video');
            video.play();
        };

        const calcutedPosition = (mouseLeft, scale) => {
            return -(mouseLeft - initMouseLeft) * scale / bannerWidth;
        };

        const startListener = () => {
            banner.addEventListener('mousemove', function (event) {
                event.stopPropagation();
                const mouseLeft = event.pageX - bannerLeft;
                Object.keys(styleMap).forEach(item => {
                    const current = styleMap[item];
                    if (current.style) {
                        const initStyle = current.initialStyle;
                        const style = current.style;
                        const element = current.element;
                        const offset = calcutedPosition(mouseLeft, style.scale);
                        let styleResult = `height: ${initStyle.height}; width: ${initStyle.width}; opacity: ${initStyle.opacity}; object-fit: ${initStyle.objectFit};`;

                        if (style.direction === 'y') {
                            styleResult += `transform: translate(${initStyle.translateX}px, ${initStyle.translateY - offset}px) rotate(${initStyle.rotate}deg) scale(${initStyle.scale});`;
                        } else {
                            styleResult += `transform: translate(${initStyle.translateX - offset}px, ${initStyle.translateY}px) rotate(${initStyle.rotate}deg) scale(${initStyle.scale});`;
                        }
                        element.style = styleResult;
                    }
                });
            });
        };

        const clearListener = (event) => {
            const mouseLeft = event.pageX - bannerLeft;
            Object.keys(styleMap).forEach(item => {
                const current = styleMap[item];
                const style = current.style;
                const initStyle = current.initialStyle;
                const element = current.element;

                if (current.style) {
                    const offset = calcutedPosition(mouseLeft, style.scale);
                    let startValue = offset;
                    let endValue = 0;
                    let duration = 500;
                    let interval = 50;
                    let steps = duration / interval;
                    let stepValue = (startValue - endValue) / steps;
                    let currentValue = startValue;

                    let timer = setInterval(() => {
                        currentValue -= stepValue;
                        let styleResult = `height: ${initStyle.height}; width: ${initStyle.width}; opacity: ${initStyle.opacity}; object-fit: ${initStyle.objectFit};`;

                        if (style.direction === 'y') {
                            styleResult += `transform: translate(${initStyle.translateX}px, ${initStyle.translateY - currentValue}px) rotate(${initStyle.rotate}deg) scale(${initStyle.scale});`;
                        } else {
                            styleResult += `transform: translate(${initStyle.translateX - currentValue}px, ${initStyle.translateY}px) rotate(${initStyle.rotate}deg) scale(${initStyle.scale});`;
                        }

                        if (Math.abs(currentValue - endValue) < Math.abs(stepValue)) {
                            clearInterval(timer);
                            styleResult = `transform: translate(${initStyle.translateX}px, ${initStyle.translateY}px) rotate(${initStyle.rotate}deg) scale(${initStyle.scale});`;
                        }
                        element.style = styleResult;
                    }, interval);
                }
            });
        };

        const mouseEnterHandler = (event) => {
            event.stopPropagation();
            setInitMouseLeft(event.pageX - bannerLeft);
            startListener();
        };

        const mouseLeaveHandler = (event) => {
            event.stopPropagation();
            clearListener(event);
        };

        banner.addEventListener('mouseenter', mouseEnterHandler);
        banner.addEventListener('mouseleave', mouseLeaveHandler);

        init();
        playVideo();

        return () => {
            banner.removeEventListener('mouseenter', mouseEnterHandler);
            banner.removeEventListener('mouseleave', mouseLeaveHandler);
        };
    }, [initMouseLeft, styleMap]);

    return (
        <div ref={bannerRef} className="animated-banner">
            <div className="layer"><img alt="" src={require("./asset/2024.05/1.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[0].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/2.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[1].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/3.webp")} data-height="187" data-width="2000" height="224" width="2400" ref={el => styleMap[2].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/4.webp")} data-height="187" data-width="2000" height="205" width="2200" ref={el => styleMap[3].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/5.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[4].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/6.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[5].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/7.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[6].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/8.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[7].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/9.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[8].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/10.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[9].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/11.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[10].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/12.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[11].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/13.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[12].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/14.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[13].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/15.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[14].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/16.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[15].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/17.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[16].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/18.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[17].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/19.webp")} data-height="187" data-width="2000" height="168" width="1800" ref={el => styleMap[18].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/20.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[19].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/21.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[20].element = el} /></div>
            <div className="layer"><video loop muted src={require("./asset/2024.05/1.webm")} playsInline="" width="180" height="100" data-height="100"
                data-width="180" ref={el => styleMap[21].element = el}></video></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/22.webp")} data-height="187" data-width="2000" height="205" width="2200" ref={el => styleMap[22].element = el} /></div>
            <div className="layer"><img alt="" src={require("./asset/2024.05/23.webp")} data-height="187" data-width="2000" height="187" width="2000" ref={el => styleMap[23].element = el} /></div>
        </div>
    )
}

export default memo(SildeBanner)