import express from 'express';

const router = express.Router();

const userList = [
    {
        id: 1,
        name: '张三'
    },
    {
        id: 2,
        name: '李四'
    },
    {
        id: 3,
        name: '王五'
    }
];
router.route('/users')
    .get((req, res) => {
        res.json(userList);
    })
    .post((req, res) => {
        const user = {
            id: userList.length + 1,
            name: req.body.name
        }
        userList.push(user);
        res.json(user);
    })

router.route('/users/:id')
    .get((req, res) => {
        const user = userList.find(item => item.id === Number(req.params.id));
        res.json(user);
    })
    .put((req, res) => {
        const user = userList.find(item => item.id === Number(req.params.id));
        user.name = req.body.name;
        res.json(user);
    })
    .delete((req, res) => {
        const index = userList.findIndex(item => item.id === req.params.id);
        const delUser = userList[index];
        userList.splice(index, 1);
        res.json({
            message: '删除成功',
            data: delUser
        })
    })


export default router;
