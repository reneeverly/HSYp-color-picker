/* Author: R. W. Sonntag
 */

var can = document.getElementById('color-tile')


function maketile() {
   var l_luma = {R: luma[lumaselect.value].R, G: luma[lumaselect.value].G, B: luma[lumaselect.value].B}
   tred.innerText = l_luma.R
   tgreen.innerText = l_luma.G
   tblue.innerText = l_luma.B

   var ctrl_var = lumaval.value / 255.0
   var swapsy = swapcon.value
   if (swapsy == 'h') {lumavallab.innerHTML = 'Hue:<br>'} else if (swapsy == 's') { lumavallab.innerHTML = 'Saturation:<br>'} else {lumavallab.innerHTML = 'y\':<br>'}

   var shape = shaper.value

   var ctx = can.getContext('2d', {colorSpace: "srgb"})
   var tri

   var newimage = ctx.createImageData(can.width, can.height)
   var newctx = newimage.data

   for (var plot_x = 0; plot_x < 255; plot_x += 0.25) { // old h
      for (var plot_y = 0; plot_y < 255; plot_y++) { // old s
			if (swapsy == 'h') {
	         tri = HSYToRGB(ctrl_var, plot_x/255.0, plot_y/255.0, l_luma.R, l_luma.G, l_luma.B)
			} else if (swapsy == 's') {
	         tri = HSYToRGB(plot_x/255.0, ctrl_var, plot_y/255.0, l_luma.R, l_luma.G, l_luma.B)
			} else {
	         tri = HSYToRGB(plot_x/255.0, plot_y/255.0, ctrl_var, l_luma.R, l_luma.G, l_luma.B)
			}
         var roundedX, roundedY
         if (shape === 'square') {
            roundedX = Math.round(plot_x)
            roundedY = Math.round(plot_y)
         } else {
            roundedX = Math.floor(plot_y / 2.0 * Math.cos(2.0 * 3.141592653589 * (plot_x / 255.0))) + 128
            roundedY = Math.floor(plot_y / 2.0 * Math.sin(2.0 * 3.141592653589 * (plot_x / 255.0))) + 128
         }
         var index = 4 * (can.width * roundedY + roundedX)
         newctx[index + 0] = Math.round(delinearize(tri[0])*255)
         newctx[index + 1] = Math.round(delinearize(tri[1])*255)
         newctx[index + 2] = Math.round(delinearize(tri[2])*255)
         newctx[index + 3] = 255
      }
   }

   ctx.putImageData(newimage, 0, 0)
}

function getPickedColor(canv, eve) {
   var rect = canv.getBoundingClientRect()
   var x = eve.clientX - rect.left
   var y = eve.clientY - rect.top

   var _y = lumaval.value / 255.0
   var swapsy = swapcon.value

   var l_luma = {R: luma[lumaselect.value].R, G: luma[lumaselect.value].G, B: luma[lumaselect.value].B}
   var res
   if (shaper.value == 'circle') {
      x = (x - 128) * 2
      y = (y - 128) * 2
      console.log(x, y)
      var arctangent = Math.atan(y / x)

      /* Convert arctan regions into position accurate positive numbers */
      if (x < 0) {
         arctangent += 3.141592653589
      } else if (y < 0) {
         arctangent += 2 * 3.141592653589
      }

		if (swapsy == 'h') {
      	res = HSYToRGB(lumaval.value / 255.0, ((arctangent / 2.0) / 3.141592653589), Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / 255.0, l_luma.R, l_luma.G, l_luma.B)
		} else if (swapsy == 's') {
     	 	res = HSYToRGB(((arctangent / 2.0) / 3.141592653589), lumaval.value / 255.0, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / 255.0, l_luma.R, l_luma.G, l_luma.B)
		} else {
     	 	res = HSYToRGB(((arctangent / 2.0) / 3.141592653589), Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / 255.0, lumaval.value / 255.0, l_luma.R, l_luma.G, l_luma.B)
		}
   } else if (shaper.value == 'square') {
		if (swapsy == 'h') {
      	res = HSYToRGB(_y, x/255.0, y/255.0, l_luma.R, l_luma.G, l_luma.B)
		} else if (swapsy == 's') {
      	res = HSYToRGB(x/255.0, _y, y/255.0, l_luma.R, l_luma.G, l_luma.B)
		} else {
      	res = HSYToRGB(x/255.0, y/255.0, _y, l_luma.R, l_luma.G, l_luma.B)
		}
   }
   console.log(res)
   // Don't forget to delinearize!
   document.body.style.background = 'rgb(' + Math.round(delinearize(res[0])*255) + ',' + Math.round(delinearize(res[1])*255) + ',' + Math.round(delinearize(res[2])*255) + ')'
   coldump.innerText = document.body.style.background
}

can.addEventListener('mousedown', function(e) { getPickedColor(can, e) })

// FF12 polyfill for IDs as identifiers
var windowids = document.querySelectorAll('*[id]')
for (var i = 0; i < windowids.length; i++) {
	window[windowids[i].id] = windowids[i]
}
