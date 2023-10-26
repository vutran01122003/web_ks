require('dotenv').config();
const app = require('./app');
const {
    app: { port }
} = require('./config/config');

app.listen(port, () => {
    console.log('Server is listening on port:::', port);
});
