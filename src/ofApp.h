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
		int frameCount = 0; 
		int totalFrames = 0; 
		int width; int height; 
		float now = 0; 

		int maxFrames; 
		ofPixels pixels; 
		string image_name; 
};
