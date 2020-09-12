#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    ofBackground(255); 
    shader.load("", "shader.frag");
	baseFbo.allocate(ofGetWidth(), ofGetHeight(), GL_RGBA);
    ofHideCursor();
    currentPosition[0] = ofGetWidth()/2;
    currentPosition[1] = ofGetHeight()/2; 
}

//--------------------------------------------------------------
void ofApp::update(){
	baseFbo.begin();
		shader.begin();
			shader.setUniform2f("u_resolution", baseFbo.getWidth(), baseFbo.getHeight());
			shader.setUniform1f("u_time", ofGetElapsedTimef());
			shader.setUniform2f("u_position", currentPosition[0], currentPosition[1]);
			ofDrawRectangle(0, 0, ofGetWidth(), ofGetHeight());
		shader.end();
	baseFbo.end();
}

//--------------------------------------------------------------
void ofApp::draw(){
    baseFbo.draw(0, 0);
}