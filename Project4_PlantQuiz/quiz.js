var grammar, lines, json, result;
var questionState = 0;	//Keeps track of users place in quiz
var quizActive = true;	//True until last question is answered
var userStats = [
	0,	//extroversion, more sun
	0, //introversion, less sun
	0, //logical, less water
	0, 	//feeling, more water
	0, 	//lawful good, alkaline soil
	0, //chaotic bad, acidic soil
	0, 	//conscious of others, big bloom
	0, //not conscious of others, smaller bloom
];
var startStats = userStats; //Holds stat increases relating to user selection
var questionText = [
	" If you passed by a classmate that you haven't seen or talked to for a year, how would you probably react?", 	//q1
	"You go to dinner with a group of people, and everyone orders things in various prices. How is the food paid for?", 					//q2
	"It's the peak of summer and your bedroom is very warm. What position do you sleep in at night?", 	//q3
	"How do you deal with big decisions?", 	//q4
	"How do you manage your stress?", //q5
	"When do you have the most energy?", //q6
	"If you could live anywhere, what kind of place would you live?", //q7
	"What kind of font do you like the most?", //q8
];
var answerText = [		//question 1 answers													
	["Only Wave",
		"Not Wave",
		"Say Hi",
		"Catch up and talk a lot"],

	//question 2 answers
	["Dutch Pay (Split per Person)",
		"Venmo one person.",
		"One person pays for everything.",
		"I only eat food at home!"],

	//question 3 answers
	["Soldier Position",
		"Fetus Position",
		"On the side",
		"On my face"],

	//question 4 answers
	["I feel like doing whatever.",
		"Write pros and cons in a rational way.",
		"I do what my heart tells me.",
		"I deal with decisions last minute."],
	
	//question 5 answers
	["Ask for help.",
		"Take a break.",
		"Write out your feelings.",
		"Cry your feelings out."],

	//question 6 answers
		["6am to 12pm",
		"12pm to 6pm",
		"6pm to 12am",
		"12am to 6am"],

	//question 7 answers
	["The City!",
	"The Surburbs",
	"The Countryside",
	"I'll be okay wherever I live."],

	//question 8 answers
	["I don't care!!",
	"Serif fonts.",
	"Sans serif fonts.",
	"Rounded fonts."],
]

var answerValues = [
	//question 1 answer values
	[[1, 0, 0, 1, 1, 0, 0, 1],
	[0, 1, 1, 0, 0, 2, 0, 1],
	[2, 1, 1, 0, 1, 0, 1, 0],
	[1, 0, 0, 1, 0, 1, 0, 1],
	],

	//question 2 answer values
	[[1, 0, 1, 1, 1, 0, 1, 1],
	[0, 2, 1, 0, 0, 1, 1, 0],
	[1, 0, 0, 1, 1, 1, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1],
	],

	//question 3 answer values
	[[1, 0, 2, 0, 1, 0, 1, 1],
	[0, 2, 0, 1, 1, 1, 0, 1],
	[1, 0, 1, 1, 1, 1, 1, 1],
	[0, 1, 0, 1, 0, 0, 1, 1],
	],

	//question 4 answer values
	[[1, 1, 0, 0, 1, 1, 0, 2],
	[1, 1, 0, 2, 1, 0, 0, 1],
	[1, 0, 0, 1, 2, 0, 0, 1],
	[0, 0, 1, 0, 1, 1, 1, 0],
	],

	//question 5 answer values
	[[2,0,1,1,1,0,1,1],
	[0,1,1,0,1,0,1,0],
	[1,1,2,0,1,0,1,0],
	[0,1,0,2,1,1,0,1],
	],

	//question 6 answer values
	[[1,0,1,0,1,0,1,0],
	[1,0,1,0,1,0,1,0],
	[0,1,0,1,0,1,0,1],
	[0,1,0,1,0,1,0,1],
	],

	//question 7 answer values
	[[1,0,1,1,1,1,1,0],
	[1,1,1,1,1,1,1,1],
	[0,1,0,1,1,1,0,1],
	[1,1,2,1,1,1,1,1],
	],

	//question 8 answer values
	[[0,0,0,0,0,0,0,0],
	[1,0,1,0,0,1,0,1],
	[1,0,1,0,1,0,1,0],
	[0,1,0,1,0,1,0,1],
	],
]

var results = document.getElementById("results");
var resultPlural = document.getElementById("plural");
var quiz = document.getElementById("quiz");
var printResult = document.getElementById("topScore");
var printDescription = document.getElementById("description");
var printDescription2 = document.getElementById("description2");
var printBotanical = document.getElementById("botanical");
var buttonElement = document.getElementById("button");
var theme = document.getElementsByTagName('link')[0];
var printLines = document.getElementById("gen")

buttonElement.addEventListener("click", changeState);	//Add click event listener to main button

function changeState() {

	updatePersonality(); 	//Adds the values of the startStats to the userStats	
	swapCSS("css/quiz.css");									
	
	if (quizActive) {
		initText(questionState);	//sets up next question based on user's progress through quiz
		questionState++;			//advances progress through quiz
		buttonElement.disabled = true; //disables button until user chooses next answer
		buttonElement.innerHTML = "Please select an answer";
		buttonElement.style.opacity = 0.8;

	} else {

		/*All questions answered*/

		setResultPage(); //runs set up for result page
	}
}

function initText(question) {

	var answerSelection = "";
	for (i = 0; i < answerText[question].length; i++) {

		answerSelection += "<li><input type='radio' name='question" +
			(question + 1) + "' onClick='setAnswer(" + i + ")' id='" + answerText[question][i] + "'><label for='" + answerText[question][i] + "'>" + answerText[question][i] + "</label></li>";
	}

	document.getElementById("questions").innerHTML = questionText[question];	//set question text
	document.getElementById("answers").innerHTML = answerSelection;				//set answer text
}

function setAnswer(input) {

	clearStartStats();									//clear startStats in case user reselects their answer
	
	startStats = answerValues[questionState - 1][input];	//selects personality values based on user selection 

	if (questionState < questionText.length) {

		/*User has not reached the end of the quiz */

		buttonElement.innerHTML = "Continue";
		buttonElement.disabled = false;
		buttonElement.style.opacity = 1;

	} else {

		/*All questions answered*/

		quizActive = false;
		buttonElement.innerHTML = "RESULTS"
		buttonElement.disabled = false;
		buttonElement.style.opacity = 1;
	}
}


function clearStartStats() {

	startStats = [0, 0, 0, 0, 0, 0, 0, 0];
}

/*This function adds the values of the startStats to the userStats based on user selection */

function updatePersonality() {

	for (i = 0; i < userStats.length; i++) {
		userStats[i] += startStats[i];
	}
}

function swapCSS(value) {
	var sheets = document
		.getElementsByTagName('link');

	sheets[0].href = value;
}


/* This function determines the highest personality value */

function setResultPage() {

	var highestStatPosition = 0;	//highest stat defaults as 'bamboo'

	/* This statement loops through all personality stats and updates highestStatPosition based on a highest stat */

	for (i = 1; i < userStats.length; i++) {

		if (userStats[i] > userStats[highestStatPosition]) {
			highestStatPosition = i;
		}
	}

	displayResults(highestStatPosition); //passes the index value of the highest stat discovered

	/* Hides the quiz content, shows results content */
	quiz.style.display = "none";

}

function preload() {
	json = loadJSON('haiku.json');
  }
  
  function setup() {
	grammar = RiTa.grammar(json);
	result = grammar.expand();
	printLines.innerText = result;
	noCanvas();
  }

 
function displayResults(personality) {
	switch (personality) {

		case 0:	//type1 code
			results.style.display = "flex";
			results.classList.add("Bamboo");
			printResult.innerText = "Bamboo";
			printDescription.innerText = "Purple Bamboo, or";
			printBotanical.innerText =  "Phyllostachys nigra";
			printDescription2.innerText = "is an evergreen cane-shaped plant native to many parts of China. They love tropical climates, and can grow up to 30ft tall. Much like a bamboo tree, you are capable of surviving through harsh weather and thrives when surrounding yourself with others."
			printLines.innerText = result;
			resultPlural.innerText = "Bamboo Trees";
			break;

		case 1:		//type2
			results.style.display = "flex";
			results.classList.add("Orchid");
			printResult.innerText = "Orchid";
			printDescription.innerText = "The Moon Orchid, or";
			printBotanical.innerText =  "Phalaenopsis amabilis";
			printDescription2.innerText = "is a flowering plant native to Japan and China. They appreciate being in a warm, humid, environment, and can grow up to 3 feet tall. Much like an orchid, you are happiest in specific conditions, but give off beautiful blooms when tended to."
			printLines.innerText = result;
			resultPlural.innerText = "Moon Orchids";
			break;

		case 2:		//type3
			results.style.display = "flex";
			results.classList.add("Ficus");
			printResult.innerText = "Ficus";
			printDescription.innerText = "The Rubber Fig, or";
			printBotanical.innerText =  "Ficus elastica";
			printDescription2.innerText = "is an evergreen tree native to much of southeast asia. They appreciate humid conditions, and can grow up to 30ft tall. Much like a rubber fig, you can tolerate being indoors, but reach your full potential when given the freedom to go outside."
			printLines.innerText = result;
			resultPlural.innerText = "Rubber Figs";
			break;

		case 3:		//type4
			results.style.display = "flex";
			results.classList.add("Wakame");
			printResult.innerText = "Wakame";
			printDescription.innerText = "Wakame, or";
			printBotanical.innerText =  "Undaria pinnatifida";
			printDescription2.innerText = "is an edible seaweed native to the Pacific Ocean. They live in cold waters, and can grow up to 3m long. Much like a wakame, you are able to go with the flow of the ocean, but have an emotional side to you."
			printLines.innerText = result;
			resultPlural.innerText = "Wakame";
			break;

		case 4:		//type5
			results.style.display = "flex";
			results.classList.add("Sakura");
			printResult.innerText = "Sakura";
			printDescription.innerText = "The Japanese Cherry Tree, or";
			printBotanical.innerText =  "Prunus serrulata";
			printDescription2.innerText = "is a cherry tree native to Japan. They are adaptable to many types of sun and soil conditions, but will prefer acidic soil. Much like a sakura, you are favored by many and stay consistent throughout the years."
			printLines.innerText = result;
			resultPlural.innerText = "Sakura Trees";
			break;

		case 5:		//type6
			results.style.display = "flex";
			results.classList.add("Hydrangea");
			printResult.innerText = "Hydrangea";
			printDescription.innerText = "The Big-Leaf Hydrangea, or";
			printBotanical.innerText =  "Hydrangea macrophylla";
			printDescription2.innerText = "is a flowering bush native to Japan. They require a lot of water, and bloom the most after rainy seasons. Much like a hydrangea, your colors change drastically in different conditions, and are fascinating to be around."
			printLines.innerText = result;
			resultPlural.innerText = "Hydrangeas";
			break;

		case 6:		//type7
			results.style.display = "flex";
			results.classList.add("lotus");
			printResult.innerText = "lotus";
			printDescription.innerText = "The Lotus, or";
			printBotanical.innerText =  "Nelumbo nucifera";
			printDescription2.innerText = "is an aquatic plant native to East Asia, South Asia, Southeast Asia and probably Australia. They are considered sacred in some religions, and can grow up to five feet tall. Much like a lotus, you take time to open up and stand out in murky waters."
			printLines.innerText = result;
			resultPlural.innerText = "Lotuses";
			break;

		case 7:		//type8
			results.style.display = "flex";
			results.classList.add("gingko");
			printResult.innerText = "gingko";
			printDescription.innerText = "The Gingko Tree, or";
			printBotanical.innerText =  "Ginkgo biloba";
			printDescription2.innerText = "is a tree native to China. It is the last of its genus, and can grow up to 80 feet tall. Much like a gingko, you may not be favored by everybody, but the people who love you enjoy being around you a lot."
			printLines.innerText = result;
			resultPlural.innerText = "Gingko Trees";
			break;


		default:
			document.getElementById("error").style.display = "inline-block";

	}
}