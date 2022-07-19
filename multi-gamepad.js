class GamepadHandler {
	constructor() {
		this.gamepad_state = {}
		this.command_state = {}
		this.pad_timestamp_z1 = 0;
		this.gamepadId = 0;
    	this.virtual_nipplejs_L = null;
    	this.virtual_nipplejs_R = null;
		this.virtual_text = null;
		this.gamepad2command = {
			// 1.gamepad id, 2.gamepad command, 3.send command
			'axis': [
				[ 'id0', 'axis0', 'axis_cmd0' ],
				[ 'id0', 'axis1', 'axis_cmd1' ],
				[ 'id0', 'axis2', 'axis_cmd2' ],
				[ 'id0', 'axis3', 'axis_cmd3' ],
				[ 'id0', 'axis4', 'axis_cmd4' ],
				[ 'id0', 'axis5', 'axis_cmd5' ],
				[ 'id0', 'axis6', 'axis_cmd6' ],
				[ 'id0', 'axis7', 'axis_cmd7' ]
			],
			'buttons': [
				[ 'id0', 'button0', 'btn_cmd0' ],
				[ 'id0', 'button1', 'btn_cmd1' ],
				[ 'id0', 'button2', 'btn_cmd2' ],
				[ 'id0', 'button3', 'btn_cmd3' ],
				[ 'id0', 'button4', 'btn_cmd4' ],
				[ 'id0', 'button5', 'btn_cmd5' ],
				[ 'id0', 'button6', 'btn_cmd6' ],
				[ 'id0', 'button7', 'btn_cmd7' ],
				[ 'id0', 'button8', 'btn_cmd8' ],
				[ 'id0', 'button9', 'btn_cmd9' ],
				[ 'id0', 'button10', 'btn_cmd10' ],
				[ 'id0', 'button11', 'btn_cmd11' ],
				[ 'id0', 'button12', 'btn_cmd12' ],
				[ 'id0', 'button13', 'btn_cmd13' ],
				[ 'id0', 'button14', 'btn_cmd14' ],
				[ 'id0', 'button15', 'btn_cmd15' ],
				[ 'id0', 'button16', 'btn_cmd16' ],
			]
		}
		this.rightButtonsList = [0,1,2,3,5,7,9,11,16,17]
		this.leftButtonsList = [4,6,8,10,12,13,14,15]
	};
	load = () => {
		let gamepads = window.navigator.getGamepads();
		if(gamepads.length){
      		console.log('Device has gamepad support.');
      		this.hasGamepad = true;
    	}
    	this.virtual_nipplejs_L = new VirtualNipple(0.25, 0.5, 'left', 100);
    	this.virtual_nipplejs_L.create();
    	this.virtual_nipplejs_R = new VirtualNipple(0.75, 0.5, 'right', 100);
    	this.virtual_nipplejs_R.create()
		this.virtual_text = new VirtualNipple(0, 0, 'center', 100);
		this.virtual_text.create()
		this.gamePadLoop();
		this.createSelection('left', gamepads.length);
		this.createSelection('right', gamepads.length);
	}

	setBinds = () => {
		const leftSelectbox = document.getElementById('gamepad-id-left');
		const rightSelectbox = document.getElementById('gamepad-id-right');
		const multi = document.getElementById('set-multi');
		multi.addEventListener('click', () => {
			this.setMultiGamepad(leftSelectbox.value, 'left');
			this.setMultiGamepad(rightSelectbox.value, 'right');
		});
	}

	createSelection = (groupname, gamepadsLength) => {
		const controllers = []
        for (let i=0; i < gamepadsLength; i++){
            controllers[i] = i
        }

		const selectBoxes = document.getElementById('select-boxes');
		const selectWrap = document.createElement('div');
		selectWrap.classList.add('selectwrap'+groupname);
		const select = document.createElement('select');
		const optgroup = document.createElement('optgroup')
		optgroup.label = groupname;
		optgroup.id = groupname + '-selection';
		select.classList.add('select');
		select.setAttribute('id', 'gamepad-id-'+groupname);
		select.appendChild(optgroup);
		controllers.forEach((element) => {
			const option = document.createElement('option');
  			option.value = element;
			option.textContent = element;
  			optgroup.appendChild(option);
		});
		selectWrap.appendChild(select);
		selectBoxes.appendChild(selectWrap);
	}	
	countConnectedGamepad = () => {
		var gamepads = this.gamepads
		let gamepadList = []
		for (var i = 0; i < this.gamepads.length; ++i) {
			if (gamepads[i] != null) {
				if (gamepads[i]['connected']) {
					gamepadList.push(gamepads[i]['id'])
				}
			}
		}
		return gamepadList.length
	}

	setMultiGamepad = (idN, side) => {
		if (this.countConnectedGamepad() > 1) {
			for (var i = 0; i < this.gamepads.length; ++i) {
				let pad = this.gamepads[i];
				if (pad != null) {
					if (side == 'left')
					for (let j=0; j<2; ++j) {
						this.gamepad2command['axis'][j][0] = 'id'+idN
					} else if (side == 'right') {
						for (let j=2; j<4; ++j) {
							this.gamepad2command['axis'][j][0] = 'id'+idN
						}
					} else {
						for (let j=4; j<8; ++j) 
							this.gamepad2command['axis'][j][0] = 'id'+idN
					}
					for (let k = 0; k < pad.buttons.length; ++k) {
						if (this.leftButtonsList.includes(k) && side == 'left'){
							this.gamepad2command['buttons'][k][0] = 'id'+idN
						} 
						if (this.rightButtonsList.includes(k) && side == 'right') {
							this.gamepad2command['buttons'][k][0] = 'id'+idN
						}
					}
				}
			}
		}
	}

	gamePadLoop = () => {
    	if (document.visibilityState == 'visible') {
			setTimeout(
				(() => {
          			this.gamePadLoop();
        		}), 20
     	 	);
    	}
    	this.gamepads = navigator.getGamepads();
		let activeGamepadAmount = this.countConnectedGamepad();

		for (var i = 0; i < this.gamepads.length; ++i) {
			var pad = this.gamepads[i];
			if (pad && pad.timestamp!=0) { 
				let padId = 'id'+pad.index
				this.gamepad_state[padId] = {}
				for (let j = 0; j < pad.axes.length; ++j) {
					this.gamepad_state[padId]['axis'+j] = pad.axes[j]
				}
				for (let k = 0; k < pad.buttons.length; ++k) {
					this.gamepad_state[padId]['button'+k] = pad.buttons[k].value
				}

				if (pad && this.pad_timestamp_z1 != pad.timestamp) {
					this.pad_timestamp_z1 = pad.timestamp;
				}
			}
		}
		if (activeGamepadAmount > 0 && this.pad_timestamp_z1 !=0) {
			for (const key in this.gamepad2command){
				for (const item in this.gamepad2command[key] ) {
					let gpId = this.gamepad2command[key][item][0] 
					let gpCmd = this.gamepad2command[key][item][1]
					let sdCmd = this.gamepad2command[key][item][2]
					this.command_state[sdCmd] = this.gamepad_state[gpId][gpCmd]
				}
			}
			this.virtual_nipplejs_L.draw(this.command_state.axis_cmd0, this.command_state.axis_cmd1);
			this.virtual_nipplejs_R.draw(this.command_state.axis_cmd2, this.command_state.axis_cmd3);
			this.virtual_text.clearText();
			
			for (let b=0; b < this.gamepad2command.buttons.length; ++b){
				let txt = 'button'+b +' : ' + this.command_state['btn_cmd'+b]
				this.virtual_text.drawText(100, (b+1)*20, txt, 20);
			}	
			for (let z=0; z < this.gamepad2command.axis.length; ++z){
				let txt = 'axis'+z +' : ' + this.command_state['axis_cmd'+z]
				this.virtual_text.drawText(200, (z+1)*20, txt, 20);
			}
		}
	}
}