function maketile(y) {
   let l_luma = {R: luma[lumaselect.value].R, G: luma[lumaselect.value].G, B: luma[lumaselect.value].B}
   tred.innerText = l_luma.R
   tgreen.innerText = l_luma.G
   tblue.innerText = l_luma.B
   

   var ctx = document.getElementById('color-tile').getContext('2d')
   var tri
   for (var h = 0; h < 255; h++) {
      for (var s = 0; s < 255; s++) {
         tri = HSYToRGB(h/255.0, s/255.0, y, l_luma.R, l_luma.G, l_luma.B)
         ctx.fillStyle = 'rgb(' + delinearize(tri[0])*255.0 + ',' + delinearize(tri[1])*255.0 + ',' + delinearize(tri[2])*255.0 + ')'
         ctx.fillRect(h, s, 1, 1)
      }
   }
}
