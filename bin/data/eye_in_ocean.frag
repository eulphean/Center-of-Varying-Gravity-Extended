
#version 120

#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

// ------------------------------------------------------- //
// MOTION
// ------------------------------------------------------- //
mat2 m = mat2( 0.8,  0.6, -0.6,  0.6 );

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

float fbm( vec2 p )
{
	float f = 0.0;
	f += 0.50000*noise( p ); p = m*p*2.02;
	f += 0.25000*noise( p ); p = m*p*2.03;
	f += 0.12500*noise( p ); p = m*p*2.01;
	f += 0.06250*noise( p ); p = m*p*2.04;
	f += 0.03125*noise( p );
	return f/0.984375;
}

// ------------------------------------------------------- //
// BEGIN.
// ------------------------------------------------------- //
void main(void)
{    
	vec2 q = gl_FragCoord.xy / u_resolution.xy;
	float factor = (u_resolution.x/u_resolution.y); 
	vec2 p = 2.0 * q - 1.0; 
	p.x *= factor; // Remap x-space based on the factor.
	float noiseA = 1. + noise(p); 
	float noiseB = 1. - noise(p); 
	float pace = 0.05;
	vec2 translate = vec2(sin(u_time*pace + noiseA), cos(u_time*pace + noiseB));
	p += translate * (0.2 + (noiseA - noiseB)); 

	vec2 m = vec2(0, 0); // Current position. 

	float rad_pupil = 0.3 + 0.12 * sin(0.125 * u_time);
	
	vec2 ctr1 = 0.55 * m;
	vec2 ctr2 = 0.40 * m;
	vec2 ctr3 = 0.03 * m;
	
	float r1 = length(p-ctr1);
	float r2 = length(p-ctr2);
	float r3 = length(p-ctr3);

	// EXTERIOR.
	vec3 col = vec3(0.102, 0.7059, 0.8275);
	vec3 iris1, iris2;
	iris1.x = 0.2 + 0.3*fbm(2.3*p + vec2(u_time*0.3, u_time*0.5));
	iris1.y = 0.3 + 0.4*fbm(4.3*p + vec2(u_time*0.1, u_time*0.2));
	iris1.z = 0.2 + 0.4*fbm(1.3*p + vec2(u_time*0.3, u_time*0.3));
	iris2.x = 0.9 + 0.2*fbm(1.7*p + vec2(u_time*0.2, u_time*0.3));
	iris2.y = 0.4 + 0.4*fbm(3.1*p + vec2(u_time*0.3, u_time*0.4));
	iris2.z = 0.0 + 0.4*fbm(2.3*p + vec2(u_time*0.1, u_time*0.2));
	float fCal = fbm(5.0*(p-ctr2) + u_time * 0.2);
	col = mix(col, iris1, fCal);
	col = mix(col, iris2, smoothstep(0.9,0.2, (r1+r2)/5.0));
           
	// Streaks 
	float a = atan(abs(p.y-ctr1.y), p.x-ctr1.x);
	fCal = fbm(0.01 + p * u_time * 0.2); 
	a += 0.05*fCal;
	fCal = fbm(vec2(20.0*a,6.0*r2)); 
	float f = smoothstep(0.3, 1.0, fCal);
	col = mix(col, vec3(0.8314, 0.8275, 0.8275), f);
    
	// Final blend. 
	fCal = fbm(vec2(20.0*a,15.0*((r1+r3)/2.0)));
	f = smoothstep(0.4, 0.9, fCal);
	col *= 1.0-0.5*f;
	col *= 1.0-0.1*smoothstep( 0.6,0.8, r1 );	
	col = mix(col, vec3(0.11765, 0.12549, 0.13333), smoothstep(rad_pupil, rad_pupil-0.3, r1) );
	
	gl_FragColor = vec4(col,1.0);
}