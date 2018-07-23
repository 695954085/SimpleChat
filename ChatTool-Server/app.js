require("babel-register");
const app = require('./index')
if (!module.parent) {
  app.listen(3000, () => {
    console.log('listening on *:3000');
  })
}