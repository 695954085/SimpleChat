var jwt = require('jsonwebtoken');
var token = jwt.sign({ foo: 'bar' }, 'shhhhh', {
  expiresIn: '10h'
});

console.log('生成token', token);

var decoded = jwt.verify(token, 'shhhhh');
console.log('认证token', decoded.foo);



