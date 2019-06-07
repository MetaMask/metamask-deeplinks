window.ethParser = require('eth-url-parser');

let paramFields = [];
const BASE_URL = 'https://metamask.app.link';
window.addNewParam = function() {
	const ts = Date.now();

	const newKeyField = document.createElement("input");
	newKeyField.type = "text";
	newKeyField.name = `key_${ts}`;
	newKeyField.id = newKeyField.name;
	newKeyField.placeholder = "Key";
	newKeyField.classList.add("field");
	newKeyField.classList.add("short-field");

	const newValField = document.createElement("input");
	newValField.type = "text";
	newValField.name = `val_${ts}`;
	newValField.id = newValField.name;
	newValField.placeholder = "Value";
	newValField.class = "field short-field";
	newValField.classList.add("field");
	newValField.classList.add("short-field");

	const row = document.createElement("p");
	row.classList.add("param-row");
	row.appendChild(newKeyField);
	row.appendChild(newValField);

	paramFields.push(ts);

	document.getElementById("params-container").appendChild(row);
}

function renderUrl(url){
	document.getElementById("url").href = url;
	document.getElementById("url").innerText = url;

	const baseImgUrl = 'http://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=${DATA}&qzone=1&margin=0&size=250x250&ecc=L';
	const qrCodeUrl = baseImgUrl.replace('${DATA}', escape(url));

	if(document.getElementById("qr-wrapper").firstElementChild){
		const img = document.getElementById("qr-wrapper").firstElementChild;
		img.src = qrCodeUrl;
	}else{
		const img = document.createElement("img");
		img.src = qrCodeUrl
		document.getElementById("qr-wrapper").appendChild(img);
	}
}

window.generatePaymentUrl = function() {
	const url_scheme = "ethereum";
	let prefix = document.getElementById("is_payment").checked
		? "pay"
		: null;
	const target_address = document.getElementById("target_address").value;
	const chain_id =
		document.getElementById("chain_id").value !== ""
			? document.getElementById("chain_id").value
			: null;
	const function_name =
		document.getElementById("function_name").value !== ""
			? document.getElementById("function_name").value
			: null;
	let params = {};
	paramFields.forEach(ts => {
		const key = document.getElementById(`key_${ts}`).value;
		let val = document.getElementById(`val_${ts}`).value;
		if (key === "value" && !function_name) {
			if (val !== "") {
				val += "e18";
			}
		}
		if (val !== "") {
			params[key] = val;
		}
	});

	if(target_address.toLowerCase().substr(0,2) !== '0x'){
		prefix = 'ens';
	}
    
	try {
         const data = {
			scheme: url_scheme,
			prefix,
			target_address,
			chain_id,
			function_name,
			parameters: params
		};
        
        console.log(data);
		const url = ethParser.build(data);
		
		renderUrl(url.replace('ethereum:',`${BASE_URL}/send/`));

	} catch (e) {
		alert(e.toString());
	}	
}

window.generateDappUrl = function(){
	const dapp_url = document.getElementById('dapp_url').value.trim();
	if(dapp_url.search("https://") !== -1){
		const url = `${BASE_URL}/dapp/`+dapp_url.replace('https://', '');
		renderUrl(url);
	} else {
		alert('The url needs to start with https://');
	}
}
window.generatePaymentChannelRequestUrl = function(){
	const target = document.getElementById('pc_target').value.trim();
	const amount = document.getElementById('pc_amount').value.trim();
	const detail = document.getElementById('pc_detail').value.trim();
	let url =  `${BASE_URL}/payment/${target}?amount=${amount}`;
	if(detail){
		url += `&detail=${detail}`;
	}
	renderUrl(url);
}


window.showView = function(name) {
	if (name === "dapp") {
		document.getElementById("dapp-form").style.display = "block";
	} else if(name === 'payment-request'){
		document.getElementById("payment-request").style.display = "block";
		document.getElementById("reset").style.display = "block";
	} else if(name === 'payment-channel-request'){
		document.getElementById("payment-channel-request-form").style.display = "block";
		document.getElementById("reset").style.display = "block";

	}else if (name === "ether") {
		document.getElementById("payment-request").style.display = "none";
		document.getElementById("payment-request-form").style.display = "block";
		
		document.getElementById("function_name").style.display = "none";
		document.getElementById("add_parameter").style.visibility = "hidden";
		addNewParam();
		document.getElementById(`key_${paramFields[0]}`).value = "value";
		document.getElementById(`key_${paramFields[0]}`).style.display = "none";
		document.getElementById(`val_${paramFields[0]}`).placeholder =
			"Amount in ETH";
		document.getElementById(`val_${paramFields[0]}`).type = "number";
	} else if (name === "erc20") {
		document.getElementById("payment-request").style.display = "none";
		document.getElementById("payment-request-form").style.display = "block";
		document.getElementById("payment-link").style.display = "hidden";
		document.getElementById("function_name").style.display = "block";
		document.getElementById("function_name").value = "transfer";
		document.getElementById("function_name").style.display = "none";
		document.getElementById("add_parameter").style.visibility = "hidden";
		addNewParam();
		document.getElementById(`target_address`).placeholder =
			"Contract address";
		document.getElementById(`key_${paramFields[0]}`).value = "address";
		document.getElementById(`key_${paramFields[0]}`).style.display = "none";
		document.getElementById(`val_${paramFields[0]}`).placeholder =
			"Receiver address";
		setTimeout(_ => {
			addNewParam();
			document.getElementById(`key_${paramFields[1]}`).value = "uint256";
			document.getElementById(`key_${paramFields[1]}`).style.display =
				"none";
			document.getElementById(`val_${paramFields[1]}`).type = "number";
			document.getElementById(`val_${paramFields[1]}`).placeholder =
				"Amount of tokens";
		}, 1);
	}
	document.getElementById("buttons").style.display = "none";
	document.getElementById("reset").style.display = "block";
	
}

// This is just a placeholder for proper validation
window.isValidAddress = function(address) {
	return address.length === 42 && address.toLowerCase().substr(0, 2) === "0x";
}
