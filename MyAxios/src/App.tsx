import React from 'react';
import useRequest from 'server/http';
import './App.css';

function App() {
    function get() {
        useRequest
            .get({
                url: '/a'
            })
            .then((res) => console.log('GET', res));
    }
    function post() {
        useRequest
            .post({
                url: '/b',
                data: {
                    message: 'POST',
                    testMes: 'test'
                }
            })
            .then((data) => console.log('POST:', data));
    }
    function retryGet() {
        useRequest
            .get({
                url: '/c'
            })
            .then((res) => console.log('GET:', res))
            .catch((err) => {
                console.log('Err', err);
            });
    }
    return (
        <div className="App">
            <button onClick={get}>发送Get请求</button>
            <button onClick={post}>发送Post请求</button>
            <button onClick={retryGet}>重复执行Get请求</button>
        </div>
    );
}

export default App;
