const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5004
const fs = require("fs");
const multer = require("multer");
var Jimp = require('jimp');

const charMap = {
  "32":" ",
  "33":"!",
  "34":"\"",
  "35":"#",
  "36":"$",
  "37":"%",
  "38":"&",
  "39":"'",
  "40":"(",
  "41":")",
  "42":"*",
  "43":"+",
  "44":",",
  "45":"-",
  "46":".",
  "47":"/",
  "48":"0",
  "49":"1",
  "50":"2",
  "51":"3",
  "52":"4",
  "53":"5",
  "54":"6",
  "55":"7",
  "56":"8",
  "57":"9",
  "58":":",
  "59":";",
  "60":"<",
  "61":"=",
  "62":">",
  "63":"?",
  "64":"@",
  "65":"A",
  "66":"B",
  "67":"C",
  "68":"D",
  "69":"E",
  "70":"F",
  "71":"G",
  "72":"H",
  "73":"I",
  "74":"J",
  "75":"K",
  "76":"L",
  "77":"M",
  "78":"N",
  "79":"O",
  "80":"P",
  "81":"Q",
  "82":"R",
  "83":"S",
  "84":"T",
  "85":"U",
  "86":"V",
  "87":"W",
  "88":"X",
  "89":"Y",
  "90":"Z",
  "91":"[",
  "92":"\\",
  "93":"]",
  "94":"^",
  "95":"_",
  "96":"`",
  "97":"a",
  "98":"b",
  "99":"c",
  "100":"d",
  "101":"e",
  "102":"f",
  "103":"g",
  "104":"h",
  "105":"i",
  "106":"j",
  "107":"k",
  "108":"l",
  "109":"m",
  "110":"n",
  "111":"o",
  "112":"p",
  "113":"q",
  "114":"r",
  "115":"s",
  "116":"t",
  "117":"u",
  "118":"v",
  "119":"w",
  "120":"x",
  "121":"y",
  "122":"z",
  "123":"{",
  "124":"|",
  "125":"}",
  "126":"~",
  "128":"Ç",
  "129":"ü",
  "130":"é",
  "131":"â",
  "132":"ä",
  "133":"à",
  "134":"å",
  "135":"ç",
  "136":"ê",
  "137":"ë",
  "138":"è",
  "139":"ï",
  "140":"î",
  "141":"ì",
  "142":"Ä",
  "143":"Å",
  "144":"É",
  "145":"æ",
  "146":"Æ",
  "147":"ô",
  "148":"ö",
  "149":"ò",
  "150":"û",
  "151":"ù",
  "152":"ÿ",
  "153":"Ö",
  "154":"Ü",
  "155":"ø",
  "156":"£",
  "157":"Ø",
  "158":"×",
  "159":"ƒ",
  "160":"á",
  "161":"í",
  "162":"ó",
  "163":"ú",
  "164":"ñ",
  "165":"Ñ",
  "166":"ª",
  "167":"º",
  "168":"¿",
  "169":"®",
  "170":"¬",
  "171":"½",
  "172":"¼",
  "173":"¡",
  "174":"«",
  "175":"»",
  "176":"░",
  "177":"▒",
  "178":"▓",
  "179":"│",
  "180":"┤",
  "181":"Á",
  "182":"Â",
  "183":"À",
  "184":"©",
  "185":"╣",
  "186":"║",
  "187":"╗",
  "188":"╝",
  "189":"¢",
  "190":"¥",
  "191":"┐",
  "192":"└",
  "193":"┴",
  "194":"┬",
  "195":"├",
  "196":"─",
  "197":"┼",
  "198":"ã",
  "199":"Ã",
  "200":"╚",
  "201":"╔",
  "202":"╩",
  "203":"╦",
  "204":"╠",
  "205":"═",
  "206":"╬",
  "207":"¤",
  "208":"ð",
  "209":"Ð",
  "210":"Ê",
  "211":"Ë",
  "212":"È",
  "213":"ı",
  "214":"Í",
  "215":"Î",
  "216":"Ï",
  "217":"┘",
  "218":"┌",
  "219":"█",
  "220":"▄",
  "221":"¦",
  "222":"Ì",
  "223":"▀",
  "224":"Ó",
  "225":"ß",
  "226":"Ô",
  "227":"Ò",
  "228":"õ",
  "229":"Õ",
  "230":"µ",
  "231":"þ",
  "232":"Þ",
  "233":"Ú",
  "234":"Û",
  "235":"Ù",
  "236":"ý",
  "237":"Ý",
  "238":"¯",
  "239":"´",
  "240":"≡",
  "241":"±",
  "242":"‗",
  "243":"¾",
  "244":"¶",
  "245":"§",
  "246":"÷",
  "247":"¸",
  "248":"°",
  "249":"¨",
  "250":"·",
  "251":"¹",
  "252":"³",
  "253":"²",
  "254":"■"
}
  
// sortedCharMap = sortedCharMap.filter((item, index) => index > 3 && index % 50 === 1);

let res = {};
let max = 198.4399382947562;
let min = 145.8033418319515;
// Object.keys(map).forEach((key) => {
//   map[key] = ((map[key] - min) / (max - min)) * 255;
//   console.log(`"${key}":${map[key]},`);
// });

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

var maxIntensity = 0;
var minIntensity = 1000;

const upload = multer({
  dest: __dirname
});

// box-drawings-single-vertical-line-character-ascii-code-179.png
// box-drawings-single-vertical-line-character-ascii-code-179.png
// box-drawings-single-horizontal-line-character-ascii-code-196.png
// Jimp.read("./raw/box-drawings-single-vertical-line-character-ascii-code-179.png")
//             .then(image => {
//               getPatchHOG(0, 0, image, 100);
//             }
// )

// Loop over char images
// fs.readdir("./raw/", function(err, items) {
//   for (var i=0; i<items.length; i++) {
//     let fName = items[i];
//     Jimp.read(`./raw/${items[i]}`).then(image => {
//       let gsImage = toGreyScaleImageArray(image, 10);
//       let gx = toGxImageArray(gsImage, false);
//       let gy = toGyImageArray(gsImage, false);
//       let hog = getPatchHOG(gx, gy, true);
//       let key = parseCharCode(fName);
//       for (let k = 0; k < sortedCharMap.length; k++) {
//         if (sortedCharMap[k][0] == key) {
//           sortedCharMap[k].push(hog);
//         }
//       }
//     });
//   }
// });

// Jimp.read("./raw/slash-forward-slash-fraction-bar-division-ascii-code-47.png")
//             .then(image => {
//               let gsImage = toGreyScaleImageArray(image, 10);
//               let gx = toGxImageArray(gsImage, false);
//               let gy = toGyImageArray(gsImage, false);
//               // let gxPrint = toCharImage(gx);
//               // let gyPrint = toCharImage(gy);

//               // getPatchHOG(0, 0, image, 100);
//               // console.log(gxPrint);
//               // console.log(gyPrint);

//               let hog = getPatchHOG(gx, gy);
//               console.log(hog);

//             }
// )

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
  })
  .post('/compose', 
    upload.single("file"), (req, res) => {
      const tempPath = req.file.path;
      const targetPath = path.join(__dirname, "./tmp/upload.png");
      if (true) {
        fs.rename(tempPath, targetPath, err => {
          if (err) return handleError(err, res);
          Jimp.read("./tmp/upload.png")
            .then(image => {
              image.resize(image.bitmap.width*2, image.bitmap.height)
                .write('./tmp/resized.png'); // save

              Jimp.read("./tmp/resized.png").then(image => {
                fs.readFile('./sorted.json', 'utf8', (err, data) => {
                  if (err){
                    console.log(err);
                  } else {
                  let sortedCharMap = JSON.parse(data);
  
                  let res_L = 200;
                  let patchL = Math.floor(image.bitmap.width/res_L);
                  let gsImage = toGreyScaleImageArray(image, patchL);
                  let gsImageFullRes = toGreyScaleImageArray(image, 1);
  
                  let gx = toGxImageArray(gsImageFullRes, false, 1);
                  let gy = toGyImageArray(gsImageFullRes, false, 1);
                  
                  let hogMatrix = [];
                  for (let i = 0; i < gsImage.length; i++) {
                    hogMatrix.push([]);
                    for (let j = 0; j < gsImage[0].length; j++) {
                      let x0 = i * patchL;
                      let y0 = j * patchL;
                      hogMatrix[i].push(getPatchHOG(gx, gy, x0, y0, patchL, true));
                    }
                  }
                  console.log("Finished feature extraction");
                  let result = toCharImage(gsImage, hogMatrix, sortedCharMap);
                  console.log(result);
                  res.status(200)
                  .contentType("text/plain")
                  .end(result);
                }});
              });
            })
            .catch(err => {
              console.error(err);
            })
        });
      } else {
        fs.unlink(tempPath, err => {
          if (err) return handleError(err, res);

          res
            .status(403)
            .contentType("text/plain")
            .end("Only .png files are allowed!");
        });
      }
  }
  )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

function toGreyScale(data) {
  return data.r*0.3+data.g*0.59+data.b*0.11;
}

function toGreyScaleImageArray(image, patchL) {
  let res = [];
  let row = 0;
  for (let i = 0; i < image.bitmap.height; i += patchL) {
    res[row] = [];
    for (let j = 0; j < image.bitmap.width; j += patchL) {
      res[row].push(getPatchIntensity(image, i, j, patchL));
    }
    row++;
  }
  return res;
}

function toCharImage(gsImage, hogMatrix, sortedCharMap) {
  let result = "";
  for (let i = 0; i < gsImage.length; i++) {
    let line = "";
    for (let j = 0; j < gsImage[0].length; j++) {
      line += toCharPixel(gsImage[i][j], hogMatrix[i][j], sortedCharMap, maxIntensity, minIntensity);
    }
    line += "\n";
    result += line;
    console.log(`done row ${i}`)
  }
  return result;
}

function toCharPixel(intensity, hog, sortedCharMap, maxI=255, minI=0) {
  // sortedCharMap = sortedCharMap.filter((item) => {
  //   return intensity >= item[1]-40 && intensity <= item[1]+40;
  // });
  let res = toCharPixelByHog(hog, sortedCharMap);
  let res2 = toCharPixelByIntensity(intensity, sortedCharMap);
  if (res.err < 0.3) {
    return res.char;
  } else {
    return res2.char;
  }

  // if (res.err < 0.5) {
  //   return res.char;
  // } else {
  //   console.log(`${maxI}, ${minI}`);
  //   let step = (maxI-minI)/(sortedCharMap.length);
  //   if (intensity >= 240) {
  //     return " ";
  //   }
  //   let ind = Math.min(Math.floor((intensity-minI)/step), sortedCharMap.length-1);
  //   return charMap[sortedCharMap[ind][0]];
  // }
}

function getPatchIntensity(image, x, y, step) {
  let sum = 0;
  for (let i = x; i < x+step; i++) {
    for (let j = y; j < y+step; j++) {
      sum += toGreyScale(Jimp.intToRGBA(image.getPixelColor(j,i)));
    }
  }
  let res = sum/(step*step);
  if (res > maxIntensity) {
    maxIntensity = res;
  }
  if (res < minIntensity) {
    minIntensity = res;
  }
  return res;
}

function getPatchHOG(gxImage, gyImage, x0, y0, patchL, norm=true) {
  let binSize = 10;
  let hist = new Array(binSize).fill(0);
  let gap = 180/binSize;

  for (let i = x0; i < Math.min(x0 + patchL, gxImage.length - 1); i++) {
    for (let j = y0; j < Math.min(y0 + patchL, gxImage[0].length - 1); j++) {
      let gx = gxImage[i][j];
      let gy = gyImage[i][j];
      if (gx == 0 && gy == 0) {
        continue;
      }
      if (gx == 0) {
        gx = 0.0000001;
      }
      let orientation = Math.atan(gy/gx) * 180 / Math.PI;
      let binInd = Math.min(Math.floor((orientation + 90) / gap), binSize-1);
      hist[binInd]++;
    }
  }

  if (norm) {
    let sum = Math.max(hist.reduce((a,b) => a + b, 0), 1);
    for (let k = 0; k < hist.length; k++) {
      hist[k] = (hist[k] / sum).toPrecision(2);
    }
  }
  return hist;
}

function toGxImageArray(gsImage, scale, patchL) {
  let res = [];
  let row = 0;
  for (let i = 0; i < gsImage.length - 1; i+=patchL) {
    res[row] = [];
    for (let j = 0; j < gsImage[0].length - 1; j+=patchL) {
      let gx = gsImage[i][j+1] - gsImage[i][j];
      gx = scale? gx/2 + 128 : gx;
      res[row].push(gx);
    }
    row++;
  }
  return res;
}

function toGyImageArray(gsImage, scale, patchL) {
  let res = [];
  let row = 0;
  for (let i = 0; i < gsImage.length - 1; i+=patchL) {
    res[row] = [];
    for (let j = 0; j < gsImage[0].length - 1; j+=patchL) {
      let gy = gsImage[i+1][j] - gsImage[i][j];
      gy = scale? gy/2 + 128 : gy;
      res[row].push(gy);
    }
    row++;
  }
  return res;
}

function toCharPixelByHog(hist, sortedCharMap) {
  let err = 1000;
  let res = "";
  for (let i = 0; i < sortedCharMap.length; i++) {
    let e = hogDistance(hist, sortedCharMap[i][2]);
    if (e <= err) {
      err = e;
      res = charMap[sortedCharMap[i][0]];
    }
  }
  return {char: res, err: err};
}

function toCharPixelByIntensity(intensity, sortedCharMap) {
  let err = 1000;
  let res = "";
  for (let i = 0; i < sortedCharMap.length; i++) {
    let e = Math.abs(intensity - sortedCharMap[i][1]);
    if (e <= err) {
      err = e;
      res = charMap[sortedCharMap[i][0]];
    }
  }
  return {char: res, err: err};
}

function hogDistance(hist1, hist2) {
  let err = 0;
  for (let i = 0; i < hist1.length; i++) {
    err += Math.abs(hist1[i] - hist2[i]);
  }
  return err;
}

function printShape(matrix) {
  console.log(`(${matrix.length},${matrix[0].length})`);
}

function parseCharCode(fileName) {
  let tmp1 = fileName.split("-");
  let tmp2 = tmp1[tmp1.length-1];
  return tmp2.split(".")[0];
}
