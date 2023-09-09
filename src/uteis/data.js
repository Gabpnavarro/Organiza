const moment = require('moment');

const dataTratada = (data) => {

    const date = moment(data).format('DD/MM/YYYY');
    
    return date;
}

module.exports = {dataTratada};