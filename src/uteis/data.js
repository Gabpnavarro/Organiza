const moment = require('moment');

const dataTratada = (data) => {

    const date = moment(data, "DD/MM/YYYY").format("DD/MM/YYYY");
    
    return date;
}

const dataTratadaArray = (array) => {
    for(let objeto of array){
        objeto.data = dataTratada(objeto.data);
    }

    return array;
}

module.exports = {dataTratada,dataTratadaArray};