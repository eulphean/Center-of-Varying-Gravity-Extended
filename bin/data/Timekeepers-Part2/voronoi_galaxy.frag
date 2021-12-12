// #version 120

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265359

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

mat2 m = mat2( 0.444,  1.312, -1.280,  0.400); 

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

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.0, 0.0, 0.0);
    vec3 colA = vec3(0.502, 0.3451, 0.5725);
    vec3 colB = vec3(0.9843, 1.0, 0.0275); 

    // Scale
    st *= 10. + sin(u_time * 0.01) * 5.0;

	vec2 translate = vec2(sin(u_time*0.1), cos(u_time*0.1));
    st += translate;
    st -= vec2(0.5);
    // rotate the space
    st = rotate2d(sin(u_time* 0.001)*PI) * st;
    //move it back to the original place
    st += vec2(0.5);


    // Tile the space
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float m_dist = 10.;  // minimum distance
    vec2 m_point;        // minimum point

    for (int j=-1; j<=1; j++ ) {
        for (int i=-1; i<=1; i++ ) {
            vec2 neighbor = vec2(float(i),float(j));
            vec2 point = random2(i_st + neighbor);
            point = 0.5 + 0.5*sin(u_time*0.5 + 6.2831*point);
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);

            if( dist < m_dist ) {
                m_dist = dist;
                m_point = point;
            }
        }
    }
    
    float f = fbm4(m_point + pattern(st)) * abs(sin(u_time * 0.01));
    f = fbm4(i_st * f * noise(st) * abs(cos(u_time * 0.01))) * 1.5;
    color = color + m_dist * f; 
    color.r = f+ m_dist * sin(u_time* 0.05); 
    color.g = color.g + cos(u_time * 0.05) * m_dist * f;
    color.b = color.b + sin(u_time * 0.05) * m_dist * f;

    colA.r = colA.r + sin(u_time * 0.01) * 0.45; 
    colA.g = colA.g + cos(u_time * 0.01) * 0.35; 
    colA.b = colA.b + atan(u_time * 0.01) * 0.78; 

    colB.r = colB.r + sin(u_time * 0.2) * 0.35; 
    colB.g = colB.g + cos(u_time * 0.2) * 0.4; 
    colB.b = colB.b + atan(u_time * 0.2) * 0.76; 

    color += mix(colA, color, m_dist);
    color *= mix(color, colB, f);

    // Slap the grid on top. 
    // vec3 c = vec3(rand(i_st + abs(cos(u_time) * 0.0000003)) * 0.8);
    // color = mix(c, color, 0.6); 

    // Draw cell center
    color += 1.-step(.01, m_dist);

    gl_FragColor = vec4(color,1.0);
}
