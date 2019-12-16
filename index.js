function toQuaternion([x, y, z]) {
    x *= Math.PI / 360,
    y *= Math.PI / 360,
    z *= Math.PI / 360;
    	
    var sX = Math.sin(x), cX = Math.cos(x),
	sY = Math.sin(y), cY = Math.cos(y),
    	sZ = Math.sin(z), cZ = Math.cos(z);
    	
    return [
	cX * cY * cZ + sX * sY * sZ,
	sX * cY * cZ - cX * sY * sZ,
	cX * sY * cZ + sX * cY * sZ,
	cX * cY * sZ - sX * sY * cZ
    ];
}
  
function toDegrees([a, b, c, d]) {
    return [
	Math.atan2(2 * (a * b + c * d), 1 - 2 * (b * b + c * c)) * 180 / Math.PI,
	Math.asin(Math.max(-1, Math.min(1, 2 * (a * c - d * b)))) * 180 / Math.PI,
	Math.atan2(2 * (a * d + b * c), 1 - 2 * (c * c + d * d)) * 180 / Math.PI
    ];
}
  
function slerp(q0, q1, _t) {
    var t = _t ? _t : 1,
	
	d = dot(q0, q1);
	
    if (d < 0) {
	    q1 = q1.map(v => {return v *= -1;});
    }
	
    if (d > 0.9995) {
	q1 = q1.map((v, i) => {return v -= q0[i];})
		
	var vt = [
	    q0[0] + q1[0] * t,
	    q0[1] + q1[1] * t,
	    q0[2] + q1[2] * t,
	    q0[3] + q1[3] * t
	];
		
	var f = Math.hypot(vt[0], vt[1], vt[2], vt[3]);
		
	vt = vt.map(v => {return v / f;});
		
	return vt;
    }
	
    var a = Math.acos(Math.max(-1, Math.min(1, d))),
	
	q1 = q1.map((v, i) => {return v -= q0[i] * d;});
	
    var p = Math.hypot(q1[0], q1[1], q1[2], q1[3]);
	
    q1 = q1.map(v => {return v / p;});
	
    var at = a * t,
	s = Math.sin(at),
	c = Math.cos(at);
		
    return [
	q0[0] * c + q1[0] * s,
	q0[1] * c + q1[1] * s,
	q0[2] * c + q1[2] * s,
	q0[3] * c + q1[3] * s	
    ];
}
  
function dot(q0, q1) {
    return q0[0] * q1[0] + q0[1] * q1[1] + q0[2] * q1[2] + q0[3] * q1[3];
}

function product(q0, q1) {
    return [
	q0[0] * q1[0] - q0[1] * q1[1] - q0[2] * q1[2] - q0[3] * q1[3],
    	q0[0] * q1[1] + q0[1] * q1[0] + q0[2] * q1[3] - q0[3] * q1[2],
    	q0[0] * q1[2] - q0[1] * q1[3] + q0[2] * q1[0] + q0[3] * q1[1],
    	q0[0] * q1[3] + q0[1] * q1[2] - q0[2] * q1[1] + q0[3] * q1[0]		
    ]
}
