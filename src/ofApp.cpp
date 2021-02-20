#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    ofBackground(255); 
    shader.load("", "./COVG/covg_core.frag");
	width=1920; height=1080; 
	baseFbo.allocate(width, height, GL_RGBA);
    ofHideCursor();

	maxFrames = 5400;  // 3 minutes of footage at 30fps.
}

//--------------------------------------------------------------
void ofApp::update(){
	if (totalFrames < maxFrames) {
		baseFbo.begin();
			shader.begin();
				shader.setUniform2f("u_resolution", baseFbo.getWidth(), baseFbo.getHeight());
				shader.setUniform1f("u_time", now);
				ofDrawRectangle(0, 0, ofGetWidth(), ofGetHeight());
			shader.end();
		baseFbo.end();

		// Frame calculation. 
		now += frameCount/30.0; 
		frameCount++; 
		totalFrames++; 
		frameCount = frameCount == 30 ? 0 : frameCount;

		baseFbo.readToPixels(pixels); 
		image_name = ofToString(totalFrames) + ".png";

		ofSaveImage(pixels, image_name, OF_IMAGE_QUALITY_BEST);

		cout << "Total Frames: " << totalFrames << endl; 
	}
}

//--------------------------------------------------------------
void ofApp::draw(){
    baseFbo.draw(0, 0);
}