// Process
// console.log(process.argv)
// console.log(process.cwd())
// console.log(process.env)
// console.log(process.version)
// console.log(process.platform)
// console.log(process.pid)
// console.log(process.arch)
// process.stdout.write("hello world\n")
// process.stdin.on('data', (data) => {
//     console.log(`User input ${data}`);
//     process.exit(1)
// })

// Buffer
const buf1 = Buffer.alloc(10); // 创建一个大小为10的Buffer对象，默认用0填充
const buf2 = Buffer.from('hello world'); // 创建一个Buffer对象，包含字符串"hello world"
const buf3 = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f]) // 内容为hello构成的16进制数组 Buffer 对象 
console.log(Array.from(buf1), buf2.toString('base64'), buf2.toString('hex'), buf3.toString())

const buf = Buffer.alloc(10);
buf.write('hello');
// 将字符串 'world' 写入 Buffer 实例的第 6 个字节开始的位置，由于 'world' 的长度为 5，所以不会覆盖掉之前写入的 'Hello'
buf.write('world', 5);
console.log(buf.toString()); // 输出：hello world

// 合并多个 Buffer 对象
const buf4 = Buffer.from('Hello');
const buf5 = Buffer.from('World');
const buf6 = Buffer.concat([buf4, buf5]);
console.log(buf6.toString()); // 输出 'HelloWorld'

//  截取 Buffer 对象
const buf7 = Buffer.from('Hello, world!');
const buf8 = buf7.slice(0, 5);
console.log(buf8.toString()); // 输出 'Hello'



// process.exit(1)
