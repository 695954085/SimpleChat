var jwt = require('jsonwebtoken');
var util = require('util');
var token = jwt.sign({ foo: 'bar' }, 'shhhhh', {
  expiresIn: '1'
});

console.log('生成token', token);

var decoded = jwt.verify(token, 'shhhhh');
console.log('认证token', decoded.foo);

decoded = jwt.decode(token);
console.log('decoded = '+ util.inspect(decoded));



