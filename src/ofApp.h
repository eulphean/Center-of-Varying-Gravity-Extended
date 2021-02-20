#pragma once

#include "ofMain.h"

class ofApp : public ofBaseApp{

	public:
		void setup();
		void update();
		void draw();
		void shaderUpdate();
		void drawLines();

		// Shader stuff. 
		ofShader shader;
		ofFbo baseFbo;
		float currentPosition[2];  // Center of the screen
		int frame = 0; 
		ofPixels p; 
		int width; int height; 
		float now = 0; 
};
