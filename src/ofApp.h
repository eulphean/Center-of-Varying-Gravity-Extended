#pragma once

#include "ofMain.h"

class ofApp : public ofBaseApp{

	public:
		void setup();
		void update();
		void draw();
		ofShader shader;
		ofFbo baseFbo;
		float currentPosition[2];  // Center of the screen
};
