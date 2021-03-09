let background_image;
let state = [1,1,1,1,1,1];
let selected = [0,0,0,0,0,0];
let used = [0,0,0,0,0,0];
let dice_spacing = 10;
let dice_size = 64;
let dice_amount = 6;
let has_rolled = false;

let dice_images = [];
let reset_button;
let roll_button;
let stop_button;

function preload() {
  background_image = loadImage('http://192.168.1.209:8080/assets/Background.png');
  dice_images[1] = loadImage('http://192.168.1.209:8080/assets/1-rendered.png');
  dice_images[2] = loadImage('http://192.168.1.209:8080/assets/2-rendered.png');
  dice_images[3] = loadImage('http://192.168.1.209:8080/assets/3-rendered.png');
  dice_images[4] = loadImage('http://192.168.1.209:8080/assets/4-rendered.png');
  dice_images[5] = loadImage('http://192.168.1.209:8080/assets/5-rendered.png');
  dice_images[6] = loadImage('http://192.168.1.209:8080/assets/6-rendered.png');
  reset_button = loadImage('http://192.168.1.209:8080/assets/Reset.png');
  roll_button = loadImage('http://192.168.1.209:8080/assets/Roll.png');
  stop_button = loadImage('http://192.168.1.209:8080/assets/Stop.png');  
}
function setup(){
	createCanvas(1000,500)
}

function draw(){
	//background image
	tint(255, 255, 255, 255);
	image(background_image, 0, 0,1000,500);
	image(roll_button,50, 150,89,40);
	for(var i = 0; i < state.length; i++){
		tint(255, 255, 255, 255);
		if(selected[i] == 1){
			tint(50, 168, 82, 255);
		}
		if(used[i] == 1){
			tint(66, 135, 245, 255);
		}
		rect_width = dice_amount * (dice_size + dice_spacing);
		offset = (rect_width / 2) + (i * (dice_spacing + dice_size))
		dice_image = dice_images[state[i]]
		image(dice_image,offset, 300,64,64);
	}
}
function calculateSum(){
	pairs = {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0}
	for(var i = 0; i < selected.length; i++){
		//calculate pairs
		if(selected[i]){
			console.log(state[i]);
			pairs[state[i].toString()] += 1;
		}
	}
	console.log(pairs);
}
function clearBoard(){
	for(var i = 0; i < selected.length; i++){
		selected[i] = 0;
		used[i] = 0;
	}
}
function mouseClicked(){
	for(var i = 0; i < state.length; i++){
		rect_width = dice_amount * (dice_size + dice_spacing);
		offset = (rect_width / 2) + (i * (dice_spacing + dice_size))
		dice_hit = collidePointRect(mouseX, mouseY, offset, 300, 64, 64);
		roll_button_hit = collidePointRect(mouseX, mouseY, 50, 150, 89, 40);
	    if(dice_hit && has_rolled){
			selected[i] = !selected[i];
		}
		if(roll_button_hit){
			calculateSum();
			has_rolled = true;
			for(var i = 0; i < state.length; i++){
				random_number = floor(random() * 6) + 1;
				if(!used[i]){
					state[i] = random_number;
				}
				//console.log(random_number);
				
				if(selected[i]){
					used[i] = true;
				}
			}

			
		}
	}
	
}