
#version 120

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define TWO_PI 6.28318530718
#define PI 3.14159265359

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

float hash( float n )
{
	return fract(sin(n)*43758.5453);
}

float noise( in vec2 x )
{
	vec2 p = floor(x);
	vec2 f = fract(x);
	f = f*f*(3.0-2.0*f);
	float n = p.x + p.y*57.0;
	float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x), mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
	return res;
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main(){
	vec2 st = gl_FragCoord.xy / u_resolution.xy;
	float factor = (u_resolution.x/u_resolution.y); 
	st = 2.0 * st - 1.0; 
	st.x *= factor; // Remap x-space based on the factor.
    st += vec2(sin(u_time*0.1) + noise(st), sin(u_time* 0.1) - noise(st)); 
    st -= vec2(0.5);
    // rotate the space
    st = rotate2d(sin(u_time* 0.1 + noise(st))*PI) * st;
    // move it back to the original place
    st += vec2(0.5);

	float leftLid = step(-2.0 + cos(u_time*0.10)*2.05, st.x); 
	vec3 l = vec3(leftLid); 
	float rightLid = step(-1.0 + cos(u_time*0.10)*2.05, 1.0-st.x);
	vec3 u = vec3(rightLid); 

    // // a. The DISTANCE from the pixel to the center
    float pct = distance(st, vec2(0.5));
    vec2 toCenter = (vec2(pct) - noise(st)) * sin(u_time * 0.01);
	float angle = atan(toCenter.y + noise(st) * sin(u_time * 0.0001), toCenter.x - noise(st) * cos(u_time * 0.001));
    float radius = length(toCenter) * 2.0; 

    float hue = angle/(TWO_PI + TWO_PI) * cos(u_time * 0.1) * 100.0; 
    float sat = 0.8;
    float bright = 1.0; 
    vec3 hsb = vec3(hue, sat, bright); 
    vec3 col = l * hsb2rgb(hsb) * u;
	gl_FragColor = vec4(col, 1.0);
}

