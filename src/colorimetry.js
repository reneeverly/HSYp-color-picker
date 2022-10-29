/*
 * Official Standards Referenced:
 *
 * ITU-R BT.2020-2 
 * https://www.itu.int/rec/R-REC-BT.2020-2-201510-I/en
 * ITU-R BT.709-6 Standard 
 * https://www.itu.int/rec/R-REC-BT.709-6-201506-I/en
 * ITU-R BT.601-7 Standard 
 * https://www.itu.int/rec/R-REC-BT.601-7-201103-I/en
 *
 * Other Documents Referenced:
 * Haeberli, P. 1993. Matrix Operations for Image Processing. Technical Report. Silicon Graphics Inc.
 * https://web.archive.org/web/20030218100831/http://www.sgi.com/grafica/matrix/index.html
 */

// ITU-R BT.2020-2: Page 4: Table 4
let a = 1.0993
let b = 0.0181
function delinearize(E) {
   if (E < b) {
      return 4.500 * E
   }
   return a * Math.pow(E, 0.45) - (a - 1)
}

// ITU-R BT.709-6: Page 3: Table 1
/*
function delinearize(L) {
   if (L < 0.018) {
      return 4.500 * L
   }
   return 1.099 * Math.pow(L, 0.45) - 0.099
}
*/

var luma = {
   // ITU-R BT.2020-2: Page 4: Table 4
   r2020: {R: 0.2627, G: 0.6780, B: 0.0593},
   // ITU-R BT.709-6: Page 4: Table 3
   r709: {R: 0.2126, G: 0.7152, B: 0.0722},
   // ITU-R BT.601-7: Page 2: Section 2.5.1
   r601: {R: 0.299, G: 0.587, B: 0.114},
   smpte240m: {R: 0.212, G: 0.701, B: 0.087},
   // Haeberli: Converting to Luminance
   sgi: {R: 0.3086, G: 0.6094, B: 0.0820}
}
