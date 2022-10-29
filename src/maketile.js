var opt = 1

function maketile() {
   let one = performance.now()

   let l_luma = {R: luma[lumaselect.value].R, G: luma[lumaselect.value].G, B: luma[lumaselect.value].B}
   tred.innerText = l_luma.R
   tgreen.innerText = l_luma.G
   tblue.innerText = l_luma.B

   let y = lumaval.value / 255.0

   let shape = shaper.value

   var can = document.getElementById('color-tile')
   var ctx = can.getContext('2d')
   var tri

   var newimage = ctx.createImageData(can.width, can.height)
   var newctx = newimage.data

   for (var h = 0; h < 255; h += 0.25) {
      for (var s = 0; s < 255; s++) {
         tri = HSYToRGB(h/255.0, s/255.0, y, l_luma.R, l_luma.G, l_luma.B)
         let roundedX, roundedY
         if (shape === 'square') {
            roundedX = Math.round(h)
            roundedY = Math.round(s)
         } else {
            roundedX = Math.floor(s / 2.0 * Math.cos(2.0 * 3.141592653589 * (h / 255.0))) + 128
            roundedY = Math.floor(s / 2.0 * Math.sin(2.0 * 3.141592653589 * (h / 255.0))) + 128
         }
         let index = 4 * (can.width * roundedY + roundedX)
         newctx[index + 0] = delinearize(tri[0])*255
         newctx[index + 1] = delinearize(tri[1])*255
         newctx[index + 2] = delinearize(tri[2])*255
         newctx[index + 3] = 255
      }
   }

   ctx.putImageData(newimage, 0, 0)
   console.log(performance.now()-one)
}
