"use strict";
let emotionClassifier = function() {

	let previousParameters = [];
	let classifier = {};
	let emotions = [];
	let coefficient_length;

	this.getEmotions = function() {
		return emotions;
	}

	this.init = function(model) {
		// load it
		for (let m in model) {
			emotions.push(m);
			classifier[m] = {};
			classifier[m]['bias'] = model[m]['bias'];
			classifier[m]['coefficients'] = model[m]['coefficients'];
		}
		coefficient_length = classifier[emotions[0]]['coefficients'].length;
	}

	this.getBlank = function() {
		let prediction = [];
		for (let j = 0;j < emotions.length;j++) {
			prediction[j] = {"emotion" : emotions[j], "value" : 0.0};
		}
		return prediction;
	}

	this.predict = function(parameters) {
		let prediction = [];
		for (let j = 0;j < emotions.length;j++) {
			let e = emotions[j];
			let score = classifier[e].bias;
			for (let i = 0;i < coefficient_length;i++) {
				score += classifier[e].coefficients[i]*parameters[i+6];
			}
			prediction[j] = {"emotion" : e, "value" : 0.0};
			prediction[j]['value'] = 1.0/(1.0 + Math.exp(-score));
		}
		return prediction;
	}

	this.meanPredict = function (parameters) {
		// store to array of 10 previous parameters
		previousParameters.splice(0, previousParameters.length == 10 ? 1 : 0);
		previousParameters.push(parameters.slice(0));

		if (previousParameters.length > 9) {
			// calculate mean of parameters?
			let meanParameters = [];
			for (let i = 0;i < parameters.length;i++) {
				meanParameters[i] = 0;
			}
			for (let i = 0;i < previousParameters.length;i++) {
				for (let j = 0;j < parameters.length;j++) {
					meanParameters[j] += previousParameters[i][j];
				}
			}
			for (let i = 0;i < parameters.length;i++) {
				meanParameters[i] /= 10;
			}

			// calculate logistic regression
			return this.predict(meanParameters);
		} else {
			return false;
		}
	}
}