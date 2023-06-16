let nodePath = process.argv[0];
let appPath = process.argv[1];
let num = process.argv[2];
let msg = process.argv[3];
const smpp = require('smpp')
const conf = require('./conf').getConf()

var session = smpp.connect('smpp://'+conf.endpoint+':'+conf.port);

session['bind_'+conf.bindType]({
	system_id: conf.user, 
	password: conf.pass,
	addr_ton: conf.srcTon,
	addr_npi: conf.srcNpi,
	dst_addr_ton: conf.dstTon,
	sdt_addr_npi: conf.dstNpi,
}, function(pdu) {
	if(pdu.command_status ==0){
		console.log('Bind is up')

		session.submit_sm({
			source_addr_ton: conf.srcTon,
			source_addr_npi: conf.srcNpi,
			dest_addr_ton: conf.dstTon,
			dest_addr_npi: conf.dstNpi,
			data_coding: conf.encoding,
			source_addr: conf.srcAddr,
			destination_addr: num,
			sm_length: 0,
			message_payload: msg
			//'Уважаемый абонент! Напоминаем Вам о необходимости пополнить счет для дальнейшего пользования услугами. Подробнее на сайте https://www.mir-telecom.ru/gde-kupit. Номер вашего договора: 33000001'
		}, function(pdu){
			if(pdu.command_status ==0){
					console.log('Conn is exist')
			}else{
					console.log('Conn error '+pdu.command_status)
			}
		})
	}
	console.log(pdu)
})

session.on('connect', () => {
		console.log('SMSC Online')
})

session.on('close', () => {
		console.log('Connection lost')
})

session.on('error', (err) => {
		console.log(err)
})
