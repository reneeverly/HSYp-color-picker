/* Author: R. W. Sonntag
 */

var can = document.getElementById('color-tile')

function maketile() {
   let l_luma = {R: luma[lumaselect.value].R, G: luma[lumaselect.value].G, B: luma[lumaselect.value].B}
   tred.innerText = l_luma.R
   tgreen.innerText = l_luma.G
   tblue.innerText = l_luma.B

   let y = lumaval.value / 255.0
   let swapsy = swapcon.checked
   if (swapsy) {lumavallab.innerHTML = 'Saturation:<br>'} else {lumavallab.innerHTML = 'y\':<br>'}

   let shape = shaper.value

   var ctx = can.getContext('2d', {colorSpace: "srgb"})
   var tri

   var newimage = ctx.createImageData(can.width, can.height)
   var newctx = newimage.data

   for (var h = 0; h < 255; h += 0.25) {
      for (var s = 0; s < 255; s++) {
         tri = HSYToRGB(h/255.0, (swapsy ? y : s/255.0), (swapsy? s/255.0 : y), l_luma.R, l_luma.G, l_luma.B)
         let roundedX, roundedY
         if (shape === 'square') {
            roundedX = Math.round(h)
            roundedY = Math.round(s)
         } else {
            roundedX = Math.floor(s / 2.0 * Math.cos(2.0 * 3.141592653589 * (h / 255.0))) + 128
            roundedY = Math.floor(s / 2.0 * Math.sin(2.0 * 3.141592653589 * (h / 255.0))) + 128
         }
         let index = 4 * (can.width * roundedY + roundedX)
         newctx[index + 0] = Math.round(delinearize(tri[0])*255)
         newctx[index + 1] = Math.round(delinearize(tri[1])*255)
         newctx[index + 2] = Math.round(delinearize(tri[2])*255)
         newctx[index + 3] = 255
      }
   }

   ctx.putImageData(newimage, 0, 0)
}

function getPickedColor(canv, eve) {
   let rect = canv.getBoundingClientRect()
   let x = eve.clientX - rect.left
   let y = eve.clientY - rect.top

   let _y = lumaval.value / 255.0
   let swapsy = swapcon.checked

   let l_luma = {R: luma[lumaselect.value].R, G: luma[lumaselect.value].G, B: luma[lumaselect.value].B}
   let res
   if (shaper.value == 'circle') {
      x = (x - 128) * 2
      y = (y - 128) * 2
      console.log(x, y)
      let arctangent = Math.atan(y / x)

      /* Convert arctan regions into position accurate positive numbers */
      if (x < 0) {
         arctangent += 3.141592653589
      } else if (y < 0) {
         arctangent += 2 * 3.141592653589
      }

      res = HSYToRGB(((arctangent / 2.0) / 3.141592653589), Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / 255.0, lumaval.value / 255.0, l_luma.R, l_luma.G, l_luma.B)
   } else if (shaper.value == 'square') {
      res = HSYToRGB(x/255.0, (swapsy ? _y : y/255.0), (swapsy ? y/255.0 : _y), l_luma.R, l_luma.G, l_luma.B)
   }
   console.log(res)
   // Don't forget to delinearize!
   document.body.style.background = 'rgb(' + Math.round(delinearize(res[0])*255) + ',' + Math.round(delinearize(res[1])*255) + ',' + Math.round(delinearize(res[2])*255) + ')'
   coldump.innerText = document.body.style.background
}

can.addEventListener('mousedown', function(e) { getPickedColor(can, e) })
