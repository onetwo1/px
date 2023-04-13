

function dateScrambler() {
    var startDate = +new Date();
    return xor(b64(startDate), 10);
}

function dateArray(scrambledTime, e, n) {
  // t = scrambled start time
  // e = length of T which should maybe be 4? idk
  // n = F['cu']
  var g = xor(b64(n), 10)
  console.log(g, scrambledTime, e)
  var x = []
  var B = -1
  for (var y = 0; y < scrambledTime['length']; y++) {
    var b = Math['floor'](y / g['length'] + 1),
      Q = y >= g['length'] ? y % g['length'] : y,
      w = g['charCodeAt'](Q) * g['charCodeAt'](b);
    w > B && (B = w);
  }
  for (var F = 0; scrambledTime['length'] > F; F++) {
    var S = Math['floor'](F / g['length']) + 1,
      A = F % g['length'],
      T = g['charCodeAt'](A) * g['charCodeAt'](S);
    for (T >= e && (T = Qs(T, 0, B, 0, e - 1)); -1 !== x['indexOf'](T);) T += 1;
    x['push'](T);
  }
  var R = x['sort'](function (t, e) {
    return scrambledTime - e;
  });
  return R;
}

Qs = function (t, e, n, r, a) {
  return Math.floor((t - e) / (n - e) * (a - r) + r);
};

function payload(scrambledTime, encodedT, dateArray) {
  var charsToInsert = "";
  var index = 0;
  var splitTime = scrambledTime.split("");
  for (var i = 0; i < scrambledTime.length; i++) {
    charsToInsert += encodedT.substring(index, dateArray[i] - i - 1) + splitTime[i];
    index = dateArray[i] - i - 1;
  }
  return charsToInsert + encodedT.substring(index);
}

function removeChars(payload, dateArray) {
  dateArray.sort((a, b) => b - a);
  var removedChars = [];
  // Loop through the array of indices and remove the characters at each index
  for (let i = 0; i < dateArray.length; i++) {
    payload = payload.split('');
    var char = payload.splice(dateArray[i] -1, 1);
    removedChars.unshift(char[0]);
    payload = payload.join('');
  }
  console.log(removedChars.join(""))
  // Return the modified string
  return {payload: payload, date: atob(xor(removedChars.join(""), 10)) + " or " + removedChars.join("")};

}

function addChars(str, substring, indices) {
  indices.sort((a,b) => a - b);
  console.log(str, substring, indices)
  var newStr = "";
  var startIndex = 0;
  var strArr = str.split("");
  for (var i = 0; i < indices.length; i++) {
    newStr += substring.substring(startIndex, indices[i] - i - 1) + strArr[i];
    startIndex = indices[i] - i - 1;
  } 
  return newStr + substring.substring(startIndex);
}


function xor(t, e) {
  for (var n = "", r = 0; r < t.length; r++) n += String.fromCharCode(e ^ t.charCodeAt(r));
  return n;
}

function b64(s) {
  return btoa(s);
}

function payloadReverse() {
  const payload = document.getElementById("payload").value
  const uuid = document.getElementById("uuid").value;
  var dd = dateArray('DDDDDDDDDDDDDDDDDDDD', payload.length - 20, uuid)
  console.log(dd);
  const data = document.getElementById("data")
  const date = document.getElementById("date")
  var newPayload = removeChars(payload, dd);
  console.log(newPayload);
  var decodedPayload = (xor(atob(newPayload.payload), 50));
  console.log(decodedPayload.length);
  data.innerHTML = JSON.stringify(JSON.parse(decodedPayload),null, 4);
  date.innerHTML = newPayload.date;
}

function payloadEncode() {
  var fingerprint = document.getElementById("fingerprint").value
  fingerprint = (JSON.stringify(JSON.parse(fingerprint)));
  console.log(fingerprint.length)
  const uuid = document.getElementById("uuide").value;
  var startTime = document.getElementById("startTime").value;
  startTime = xor(btoa(startTime), 10);
  const data = document.getElementById("data_e")
  var encodedPayload = (btoa(xor((fingerprint), 50)));
  var dd = dateArray(startTime, encodedPayload.length, uuid)
  var newPayload = addChars(startTime, encodedPayload, dd);
  console.log(newPayload)
  data.innerHTML = newPayload;
}