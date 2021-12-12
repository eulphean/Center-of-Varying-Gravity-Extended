#version 120

#ifdef GL_ES

precision mediump float;

#endif

// ------------------------------------------------------- //
// INNER SITE OF MY EXISTENCE.
// ------------------------------------------------------- //
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_position; 

// ------------------------------------------------------- //
// MOTION
// ------------------------------------------------------- //
mat2 m = mat2( 0.444,  1.312, -1.280,  0.400); // Original
// mat2 m = mat2(0.78, 1.10, -0.5,  0.65); 
// mat2 m = mat2( 0.15,  2.5, -0.2,  0.1); 
// mat2 m = mat2(1.78, 0.35, 0.5, 0.1); 
// mat2 m = mat2(0.25, -0.45, 0.67, 2.5); 
// Change these values when the eye closes. 

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
  const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
  return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm4( vec2 p )
{
    float f = 0.0;
    f += 0.5000*noise( p ); p = m*p*2.044;
    f += 0.2500*noise( p ); p = m*p*2.022;
    f += 0.1250*noise( p ); p = m*p*2.082;
    f += 0.0625*noise( p );
    return f/0.9375;
}

float pattern(in vec2 p) {
    vec2 q = vec2(0.0, 0.0);
    q.x = fbm4(p + vec2(0.142*u_time,0.096*u_time)); 
    q.y = fbm4(p + vec2(0.150,0.0300)); 
    return fbm4(p + 4.0*q); 
}


// Interleaving colors. 
vec3 col = vec3(0.1569, 0.1176, 0.1686); 
vec3 colA = vec3(0.9255, 0.098, 1.0); // Fuscia
vec3 colB = vec3(0.1882, 0.0667, 0.0902); // Amaranth
vec3 colC = vec3(1.0, 0.7529, 0.1216); // Mustard Yellow
vec3 colD = vec3(1.0, 0.5333, 0.0); // Peach

// Initial value. 
float patternSeed = 0.5; 
// ------------------------------------------------------- //
// BEGIN.
// ------------------------------------------------------- //
void main(void)
{    
	vec2 st = gl_FragCoord.xy / u_resolution.xy; 
	float factor = (u_resolution.x/u_resolution.y); 

	// Screen
	vec2 p = -1.0 + 2.0 * st; // Remap the space between -1 and 1. 
	p.x *= factor; // Remap x-space based on the factor.

    // Center point. 
    vec2 cPos = vec2(0, 0.0);
    
    // Distance field of the current position
	float d = distance(cPos, p); 

	// Animate upper and lower eyelid. 
	float lowerLid = step(-2.0 + cos(u_time*0.10)*2.05, p.x); 
	vec3 l = vec3(lowerLid); 
	float upperLid = step(-1.0 + cos(u_time*0.10)*2.05, 1.0-p.x);
	vec3 u = vec3(upperLid); 

    st = st * 100.0 - abs(atan(u_time * 0.1) * 10.0);
    vec2 lines = fract(st);

    patternSeed = clamp(rand(p + lowerLid / upperLid), -10.0, 10.0);
    float fCal = fbm4(10.0*(p-cPos) + u_time * 0.2);
    
    colB.r = colB.r + fCal * d * 0.2; 
    colB.g = colB.g + fCal * d * 0.3; 
    colB.b = colB.b + fCal * d * 0.4; 
    
    colC.r = colC.r + sin(u_time*0.1) * d * 0.6; 
    colC.g = colC.g + cos(u_time*0.2) * d * 0.6; 
    colC.b = colC.b + sin(u_time*0.3) * d * 0.6; 
    
    colD.r = colD.r + atan(u_time*0.1) * d * 1.0; 
    colD.g = colD.g + atan(u_time*0.2) * d * 0.6; 
    colD.b = colD.b + atan(u_time*0.3) * d * 0.4;     


    float A = pattern(atan(p) * 20.0);
    vec2 B = atan(p) * sin(u_time * 0.1) * -1.0;
    float v = 1.0 + abs(cos(u_time * 0.1) / sin(u_time * 0.1)) * 1.0;
    vec2 C = tan(p) / v; 
    float f1 = fbm4(A + B);

    col = mix(col, colA, smoothstep(patternSeed/10.0, 0.8, f1));
    col = mix(col, colB, smoothstep(patternSeed/10.0, 0.9, f1));
    col = mix(col, colC, smoothstep(patternSeed/5.0, 1.2, f1));
    col = mix(col, colD, smoothstep(patternSeed/5.0, 2.0, f1));

    //float r = rand(tile + abs(cos(u_time) * 0.0000003)) * 0.5; 
    lines.x = lines.x + cos(u_time * 0.5) * 0.5;
    vec3 c = vec3(lines.x, lines.x, 0.5);
    col = mix(c, col, 0.6); 

	gl_FragColor = vec4(col,1.0);
}