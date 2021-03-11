let background_image;
let state = [1,1,1,1,1,1];
let selected = [0,0,0,0,0,0];
let used = [0,0,0,0,0,0];
let dice_spacing = 10;
let dice_size = 64;
let dice_amount = 6;
let has_rolled = false;
let points = 0;
let stars = 0;
let guiButtons = [];
let reset_button;
let roll_button;
let stop_button;
let dice_images = [];



class guiButton{
	constructor(image,name){
		this.image = image;
		this.width = image.width;
		this.height = image.height;
		this.name = name;
		this.clickAction = function(){}



		this.x = 0;
		this.y = 0;
		this.scale = 1;
	}
	draw(){
		image(this.image,this.x,this.y,this.width * this.scale,this.height * this.scale);
	}
	onClick(){
		this.clickAction();
	}
	setScale(scale){
		this.scale = scale;
		return this;
	}
	setPosition(x,y){
		this.x = x;
		this.y = y;
		return this;
	}
	setWidth(width){
		this.width = width;
		return this;
	}
	setHeight(height){
		this.height = height;
		return this;
	}
	setClickAction(clickAction){
		this.clickAction = clickAction;
	}
	getWidth(){
		return this.width * this.scale;
	}
	getHeight(){
		return this.height * this.scale;
	}
}

function preload() {


	background_image = loadImage('./assets/Background.png');
	dice_images[1] = loadImage('./assets/1-rendered.png');
	dice_images[2] = loadImage('./assets/2-rendered.png');
	dice_images[3] = loadImage('./assets/3-rendered.png');
	dice_images[4] = loadImage('./assets/4-rendered.png');
	dice_images[5] = loadImage('./assets/5-rendered.png');
	dice_images[6] = loadImage('./assets/6-rendered.png');
	reset_button = loadImage('./assets/Reset.png');
	roll_button = loadImage('./assets/Roll.png');
	stop_button = loadImage('./assets/Stop.png');

}
function setup(){
	createCanvas(1000,500)
	guiButtons.push(new guiButton(reset_button,"reset_button").setScale(0.5).setPosition(50,150));
	guiButtons.push(new guiButton(roll_button,"roll_button").setScale(0.5).setPosition(50,200))
	guiButtons.push(new guiButton(stop_button,"stop_button").setScale(0.5).setPosition(50,250));
}

function draw(){
	//background image
	tint(255, 255, 255, 255);
	image(background_image, 0, 0,1000,500);
	for(var i = 0;i < guiButtons.length;i++){
		guiButtons[i].draw();
	}
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
	fill(255)
	textSize(32);
	text("Score: "+points, 200, 30);
}
function calculateSum(searchArea){
	point_value = 0;
	pairs = {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0}
	for(var i = 0; i < selected.length; i++){
		//calculate pairs
		if(selected[i] && searchArea == "SELECTED"){
			pairs[state[i].toString()] += 1;
		}
		if(!used[i] && searchArea == "UNUSED"){
			pairs[state[i].toString()] += 1;
		}
	}
	if(pairs["1"] < 3){
		point_value += pairs["1"] * 100;
	}else{
		point_value += (pairs["1"] - 2) * 1000
	}
	if(pairs["5"] < 3){
		point_value += pairs["5"] * 50;
	}else{
		point_value += (pairs["5"] - 2) * 500
	}
	if(pairs["2"] > 2){
		point_value += (pairs["2"] - 2) * 200
	}
	if(pairs["3"] > 2){
		point_value += (pairs["3"] - 2) * 300
	}
	if(pairs["4"] > 2){
		point_value += (pairs["4"] - 2) * 400
	}
	if(pairs["6"] > 2){
		point_value += (pairs["6"] - 2) * 600
	}
	return point_value;
}
function clearBoard(){
	for(var i = 0; i < selected.length; i++){
		selected[i] = 0;
		used[i] = 0;
	}
}
function rollDice(){
	let used_dice = 0;
	for(var i = 0; i < state.length; i++){				
		if(selected[i]){
			used[i] = true;
			selected[i] = false;

		}
	}
	for(var i = 0; i < state.length; i++){
		random_number = floor(random() * 6) + 1;
		if(!used[i]){
			state[i] = random_number;
		}else{
			used_dice++;
		}
	}
	return used_dice;
}
function buttonClicked(){

}
function mouseClicked(){
	let used_dice = 0;
	for(var i = 0; i < state.length; i++){
		rect_width = dice_amount * (dice_size + dice_spacing);
		offset = (rect_width / 2) + (i * (dice_spacing + dice_size))
		dice_hit = collidePointRect(mouseX, mouseY, offset, 300, 64, 64);
	    if(dice_hit && has_rolled){
			selected[i] = !selected[i];
		}

	}
	for(var i = 0;i < guiButtons.length;i++){
		current_button = guiButtons[i];
		button_hit = collidePointRect(mouseX, mouseY, current_button.x, current_button.y, current_button.getWidth(), current_button.getHeight());
		if(button_hit){
			current_button.onClick();
		}
	}

	selected_points = calculateSum("SELECTED");
	if(roll_button_hit){
		if(selected_points > 0 || !has_rolled){
			used_dice = rollDice();
			points += selected_points
			has_rolled = true;	
		}



		


		//refresh dice after all are used
		if(used_dice == dice_amount){
			for(var i = 0; i < state.length; i++){
				random_number = floor(random() * 6) + 1;
				state[i] = random_number;
				used[i] = 0;
				
			}
		}
		possible_points = calculateSum("UNUSED");
		if(possible_points == 0){
			has_rolled = false;
			if(points < 1000){
				points = 0;
			}else{
				stars += 1;
			}
			if(stars > 2){
				points = 0
			}
			clearBoard();

		}
	}
			

	
}