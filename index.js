function degreesToQuaternion([x, y, z]) {
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
  
function quaternionToDegrees([a, b, c, d]) {
    return [
	Math.atan2(2 * (a * b + c * d), 1 - 2 * (b * b + c * c)) * 180 / Math.PI,
	Math.asin(Math.max(-1, Math.min(1, 2 * (a * c - d * b)))) * 180 / Math.PI,
	Math.atan2(2 * (a * d + b * c), 1 - 2 * (c * c + d * d)) * 180 / Math.PI
    ];
}

function degreesToNvector([longitude, latitude, azithumal]) {
    return [
	Math.cos(latitude * Math.PI / 180) * Math.cos(longitude * Math.PI / 180),
	Math.cos(latitude * Math.PI / 180) * Math.sin(longitude * Math.PI / 180),
	Math.sin(latitude * Math.PI / 180)
    ];
}

function nVectorToDegrees([x, y, z]) {
    return [
	Math.atan2(y, x) * 180 / Math.PI,
	Math.atan2(z, Math.hypot(x, y)) * 180 / Math.PI
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
		
	var qT = [
	    q0[0] + q1[0] * t,
	    q0[1] + q1[1] * t,
	    q0[2] + q1[2] * t,
	    q0[3] + q1[3] * t
	];
		
	var f = Math.hypot(qT[0], qT[1], qT[2], qT[3]);
		
	qT = qT.map(v => {return v / f;});
		
	return qT;
    }
	
    var θ = Math.acos(Math.max(-1, Math.min(1, d))),
	
	q1 = q1.map((v, i) => {return v -= q0[i] * d;});
	
    var p = Math.hypot(q1[0], q1[1], q1[2], q1[3]);
	
    q1 = q1.map(v => {return v / p;});
	
    var θt = θ * t,
	s = Math.sin(θt),
	c = Math.cos(θt);
		
    return [
	q0[0] * c + q1[0] * s,
	q0[1] * c + q1[1] * s,
	q0[2] * c + q1[2] * s,
	q0[3] * c + q1[3] * s	
    ];
}

function geometricSlerp(v0, v1, _t) {
    var t = _t ? _t : 1,
        d = dot(v0, v1);
	
    var Ω = Math.acos(Math.max(-1, Math.min(1, d)));
	
    var p0 = Math.sin(Ω * (1 - t)),
	p1 = Math.sin(Ω * t),
	s = Math.sin(Ω);
	
    var x = v0[0] * p0 / s + v1[0] * p1 / s,
	y = v0[1] * p0 / s + v1[1] * p1 / s,
	z = v0[2] * p0 / s + v1[2] * p1 / s;
	
    return [
	x, 
	y, 
	z
    ]
}

function interpolate(v0, v1, _t) {
    var t = _t ? _t : 1,
        d = dot(v0, v1);
	
    var Ω = Math.acos(Math.max(-1, Math.min(1, d))) * t / 2,
	s = Math.sin(Ω),
	c = Math.cos(Ω),
	x = cross(v0, v1),
	y = Math.sqrt(dot(x, x));
	
    // if undefined, return identity quaternion	
    if (!y) return [1, 0, 0, 0];
	
    return [
	c, 
	x[2] / y * s,
	-x[1] / y * s,
	x[0] / y * s
    ]
}
  
function dot(v0, v1) {
    var sum = 0;
    for (var i = 0; i <= 2; i++) {
	sum += v0[i] * v1[i];
    }
    return sum;
}

function cross(v0, v1) {
    return [
        v0[1] * v1[2] - v0[2] * v1[1],
        v0[2] * v1[0] - v0[0] * v1[2],
        v0[0] * v1[1] - v0[1] * v1[0]	
    ]
}

function product(q0, q1) {
    return [
	q0[0] * q1[0] - q0[1] * q1[1] - q0[2] * q1[2] - q0[3] * q1[3],
    	q0[0] * q1[1] + q0[1] * q1[0] + q0[2] * q1[3] - q0[3] * q1[2],
    	q0[0] * q1[2] - q0[1] * q1[3] + q0[2] * q1[0] + q0[3] * q1[1],
    	q0[0] * q1[3] + q0[1] * q1[2] - q0[2] * q1[1] + q0[3] * q1[0]		
    ]
}
