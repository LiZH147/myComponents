import headerRouter from './header.js'
import responseRouter from './response.js'
import demoRouter from './router-demo.js'
import mountMethodDemo from './method.js'
import restfulRouter from './restful.js'
import uploadRouter from './upload.js'

const routers = [headerRouter, responseRouter, demoRouter, uploadRouter];

export default function mountRouter(app) {
    mountMethodDemo(app);
    
    // 注册所有router
    app.use(routers);

    app.use('/api', restfulRouter)

    // 将demoRouter注册到/demo路径上，路由会自动拼接上/demo
    app.use('demo', demoRouter);

    app.get('/hello/:id', (req, res) => {
        const {params} = req;
        console.log('params', params);
        res.json(params);
    })

    app.get('/hello', (req, res) => {
        res.send('<h1>Hello Express</h1>')
      })
}