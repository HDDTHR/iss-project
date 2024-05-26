const randomPrime = (bits) => {
  const min = bigInt.one.shiftLeft(bits - 1);
  const max = bigInt.one.shiftLeft(bits).prev();

  while (true) {
    let p = bigInt.randBetween(min, max);
    if (p.isProbablePrime(256)) {
      return p;
    }
  }
};

const getGenerationObject = (keysize) => {
  const e = bigInt(65537);
  let p;
  let q;
  let totient;

  do {
    p = randomPrime(keysize / 2);
    q = randomPrime(keysize / 2);
    totient = bigInt.lcm(p.prev(), q.prev());
  } while (
    bigInt.gcd(e, totient).notEquals(1) ||
    p
      .minus(q)
      .abs()
      .shiftRight(keysize / 2 - 100)
      .isZero()
  );

  const result =  {
    p,
    q,
    e,
    n: p.multiply(q),
    d: e.modInv(totient),
  };

  console.log(result)

  return result;
};

const generate = (p, q) => {
  const e = bigInt(65537);
  const totient = bigInt.lcm(p.prev(), q.prev());

  // Calculate private exponent d
  const d = e.modInv(totient);

  return {
    e,
    n: p.multiply(q),
    d,
  };
};

const encrypt = (encodedMsg, e, n) => {
  return bigInt(encodedMsg).modPow(e, n);
};

const decrypt = (encryptedMsg, d, n) => {
  return bigInt(encryptedMsg).modPow(d, n);
};

const encodeString = (str) => {
  const codes = str
    .split("")
    .map((i) => i.charCodeAt())
    .join("");

  return bigInt(codes);
};

const decodeString = (code) => {
  const stringified = code.toString();
  let string = "";

  for (let i = 0; i < stringified.length; i += 2) {
    let num = Number(stringified.substr(i, 2));

    if (num <= 30) {
      string += String.fromCharCode(Number(stringified.substr(i, 3)));
      i++;
    } else {
      string += String.fromCharCode(num);
    }
  }

  return string;
};

const rsa = (msg, n, d, e, dec) => dec ? decodeString(decrypt(msg, d, n)) : encrypt(encodeString(msg), e, n);