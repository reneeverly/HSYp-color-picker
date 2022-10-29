
/* Polyfill Cpp
*/
function fabs(val) {
   return Math.abs(val)
}
function fmod(numer, denom) {
   return numer%denom
}

/*
 *  SPDX-FileCopyrightText: 2005 Boudewijn Rempt <boud@valdyas.org>
 *  SPDX-FileCopyrightText: 2014 Wolthera van Hövell <griffinvalley@gmail.com>
 *
 *  SPDX-License-Identifier: LGPL-2.1-or-later
 */
function HSYToRGB(h, s, y, R, G, B) {
//This function takes H, S and Y values, which are converted to rgb.
//Those are then used to create a qcolor.
    var hue = 0.0;
    var sat = 0.0;
    var luma = 0.0;
    if (h>1.0 || h<0.0){hue=fmod(h, 1.0);} else {hue=h;}
    if (s<0.0){sat=0.0;} else {sat=s;}
    //if (y>1.0){luma=1.0;}
    if (y<0.0){luma=0.0;}
    else {luma=y;}
    
    var segment = 0.166667;//1/6;
    var r=0.0;
    var g=0.0;
    var b=0.0;
//weights for rgb to Y'(Luma), these are the same weights used in color space maths and the desaturate.
//This is not luminance or luminosity, it just quacks like it.
    //qreal R=0.299;
    //qreal G=0.587;
    //qreal B=0.114;
//The intermediary variables for the weighted HSL forumala, based on the HSL in KoColorConversions.
    var max_sat, m, fract, luma_a, chroma, x;
    if (hue >= 0.0 && hue < (segment) ) {
            //need to treat this as a weighted hsl thingy.
            //so first things first, at which luma is the maximum saturation for this hue?
            //between R and G+R (yellow)
        max_sat = R + ( G*(hue*6) );	
        if (luma<=max_sat){luma_a = (luma/max_sat)*0.5; chroma=sat*2*luma_a;}
        else {luma_a = ((luma-max_sat)/(1-max_sat)*0.5)+0.5; chroma=sat*(2-2*luma_a);}

        fract = hue*6.0;
        x = (1-fabs(fmod(fract,2)-1))*chroma;
        r = chroma; g=x; b=0;
        m = luma-( (R*r)+(B*b)+(G*g) );
        r += m; g += m; b += m;
    } else if (hue >= (segment) && hue < (2.0*segment) ) {
        max_sat = (G+R) - (R*(hue-segment)*6);

        if (luma<max_sat) {
            luma_a = (luma/max_sat)*0.5; chroma=sat*(2*luma_a);
        } else {
            luma_a = ((luma-max_sat)/(1-max_sat)*0.5)+0.5; chroma=sat*(2-2*luma_a);
        }

        fract = hue*6.0;
        x = (1-fabs(fmod(fract,2)-1) )*chroma;
        r = x; g=chroma; b=0;
        m = luma-( (R*r)+(B*b)+(G*g) );
        r += m; g += m; b += m;
    } else if (hue >= (2.0*segment) && hue < (3.0*segment) ) {
        max_sat = G + (B*(hue-2.0*segment)*6);
        if (luma<max_sat) { 
            luma_a = (luma/max_sat)*0.5; chroma=sat*(2*luma_a);
        } else {
            luma_a = ((luma-max_sat)/(1-max_sat)*0.5)+0.5; chroma=sat*(2-2*luma_a);
        }
        fract = hue*6.0;
        x = (1-fabs(fmod(fract,2)-1) )*chroma;
        r = 0; g=chroma; b=x;
        m = luma-( (R*r)+(B*b)+(G*g) );
        r += m; g += m; b += m;
    } else if (hue >= (3.0*segment) && hue < (4.0*segment) ) {
        max_sat = (G+B) - (G*(hue-3.0*segment)*6);	
        if (luma<max_sat){
            luma_a = (luma/max_sat)*0.5; chroma=sat*(2*luma_a);
        } else {
            luma_a = ((luma-max_sat)/(1-max_sat)*0.5)+0.5; chroma=sat*(2-2*luma_a);
        }

        fract = hue*6.0;
        x = (1-fabs(fmod(fract,2)-1) )*chroma;
        r = 0; g=x; b=chroma;
        m = luma-( (R*r)+(B*b)+(G*g) );
        r += m; g += m; b += m;
    } else if (hue >= (4.0*segment) && hue < (5*segment) ) {
        max_sat = B + (R*((hue-4.0*segment)*6));	
        if (luma<max_sat) {
            luma_a = (luma/max_sat)*0.5; chroma=sat*(2*luma_a);
        } else {
            luma_a = ((luma-max_sat)/(1-max_sat)*0.5)+0.5; chroma=sat*(2-2*luma_a);
        }
        fract = hue*6.0;
        x = (1-fabs(fmod(fract,2)-1) )*chroma;
        r = x; g=0; b=chroma;
        m = luma-( (R*r)+(B*b)+(G*g) );
        r += m; g += m; b += m;
    } else if (hue >= (5.0*segment) && hue <= 1.0) {
        max_sat = (B+R) - (B*(hue-5.0*segment)*6);	
        if (luma<max_sat){
            luma_a = (luma/max_sat)*0.5; chroma=sat*(2*luma_a);
        } else {
            luma_a = ((luma-max_sat)/(1-max_sat)*0.5)+0.5; chroma=sat*(2-2*luma_a);
        }
        fract = hue*6.0;
        x = (1-fabs(fmod(fract,2)-1) )*chroma;
        r = chroma; g=0; b=x;
        m = luma-( (R*r)+(B*b)+(G*g) );
        r += m; g += m; b += m;
    } else {
        r=0.0;
        g=0.0;
        b=0.0;
    }

    //dbgPigment<<"red: "<<r<<", green: "<<g<<", blue: "<<b;
    //if (r>1.0){r=1.0;}
    //if (g>1.0){g=1.0;}
    //if (b>1.0){b=1.0;}
    //don't limit upwards due to floating point.
    if (r<0.0){r=0.0;}
    if (g<0.0){g=0.0;}
    if (b<0.0){b=0.0;}

    //*red=r;
    //*green=g;
    //*blue=b;
   return [r, g, b]
}
