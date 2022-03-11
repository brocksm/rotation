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
  
function quaternionToDegrees([q0, q1, q2, q3]) {
    return [
	Math.atan2(2 * (q0 * q1 + q2 * q3), 1 - 2 * (q1 * q1 + q2 * q2)) * 180 / Math.PI,
	Math.asin(Math.max(-1, Math.min(1, 2 * (q0 * q2 - q3 * q1)))) * 180 / Math.PI,
	Math.atan2(2 * (q0 * q3 + q1 * q2), 1 - 2 * (q2 * q2 + q3 * q3)) * 180 / Math.PI
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
	q1 = q1.map(v => {return v *= -1;}),
	d = -d;
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

function magnitude(v) {
    return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);	
}

function dot(v0, v1) {
    var sum = 0;
    for (var i = 0; i < v0.length; i++) {
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

// adapted from: https://github.com/chrisveness/geodesy/blob/master/latlon-nvector-spherical.js#L201
function bearingTo(p0, p1) {
    if (p0.length = 2) p0.push(0);
    if (p1.length = 2) p1.push(0);
    console.log("p0: " + p0);
    console.log("p1: "+ p1);	
    const v0 = degreesToNvector(p0);
    const v1 = degreesToNvector(p1);
    const N = [0, 0, 1]; // n-vector representing north pole

    const c1 = cross(v0, v1); // great circle through p1 & p2
    const c2 = cross(v0, N);  // great circle through p1 & north pole
    console.log("c1: " + c1);
    console.log("c2: " + c2);
    const θ = angleTo(c1, c2, v0); // bearing is (signed) angle between c1 & c2
    console.log("θ: " θ);	

    return wrap360((θ*180/Math.PI)); // normalise to range 0..360°
}

// adapted from: https://github.com/chrisveness/geodesy/blob/master/vector3d.js#L179
function angleTo(v0, v1, n=undefined) {
    const sign = n==undefined || dot(cross(v0, v1), n) >= 0 ? 1 : -1;
    const sinθ = magnitude(cross(v0, v1)) * sign;
    const cosθ = dot(v0, v1);

    return Math.atan2(sinθ, cosθ);
}

// adapted from: https://github.com/chrisveness/geodesy/blob/49a500cb8857e6c274b6449067464c1cd89686a8/dms.js#L330
function wrap360(degrees) {
    if (0 <= degrees && degrees < 360) return degrees;
 
    const x = degrees, a = 180, p = 360;
    return (((2*a*x/p)%p)+p)%p;
}
