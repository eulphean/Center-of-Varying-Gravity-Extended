#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    ofBackground(255); 
    shader.load("", "shader.frag");
	baseFbo.allocate(ofGetWidth(), ofGetHeight(), GL_RGBA);
    ofHideCursor();
}

//--------------------------------------------------------------
void ofApp::update(){
	baseFbo.begin();
		shader.begin();
			shader.setUniform2f("u_resolution", baseFbo.getWidth(), baseFbo.getHeight());
			shader.setUniform1f("u_time", ofGetElapsedTimef());
			ofDrawRectangle(0, 0, ofGetWidth(), ofGetHeight());
		shader.end();
	baseFbo.end();
}

//--------------------------------------------------------------
void ofApp::draw(){
    baseFbo.draw(0, 0);
}