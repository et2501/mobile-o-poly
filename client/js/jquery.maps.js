(function(e){"use strict";var t={init:function(t){var n=e.extend({deviceWidth:480,showMarker:true},t),r={},i=[];var s=e(this);n.imgURI="http://maps.googleapis.com/maps/api/staticmap?";r.center="Brussels Belgium";r.zoom="5";r.size=screen.width+"x"+480;r.scale=window.devicePixelRatio?window.devicePixelRatio:1;r.maptype="roadmap";r.sensor=false;n.settings=r;if(e(this).attr("data-center")){n.settings.center=e(this).attr("data-center").replace(/ /gi,"+")}if(e(this).attr("data-zoom")){n.settings.zoom=parseInt(e(this).attr("data-zoom"))}if(e(this).attr("data-maptype")){n.settings.zoom=e(this).attr("data-maptype")}if(n.showMarker){i.push({label:"A",position:r.center})}n.markers=i;e(this).data("options",n);if(screen.width<n.deviceWidth){e(this).mobileGmap("showImage")}else{e(this).mobileGmap("showMap")}},showMap:function(){var t=e(this).data("options"),n=new google.maps.Geocoder,r=new google.maps.LatLng(-34.397,150.644),i={},s=e(this).get(0);n.geocode({address:t.settings.center.replace(/\+/gi," ")},function(e,n){if(n==google.maps.GeocoderStatus.OK){i={zoom:parseInt(t.settings.zoom,10),center:e[0].geometry.location,mapTypeId:t.settings.maptype};var r=new google.maps.Map(s,i);var o=new google.maps.Marker({map:r,position:e[0].geometry.location})}})},showImage:function(){var t=[],n=new Image,r=document.createElement("a"),i=e(this).data("options"),s=0,o=[];for(var u in i.settings){t.push(u+"="+i.settings[u])}if(i.markers.length){var a=[];for(;s<i.markers.length;s++){a=[];for(var f in i.markers[s]){if(f=="position"){a.push(i.markers[s][f])}else{a.push(f+":"+i.markers[s][f])}}o.push("&markers="+a.join("%7C"))}}n.src=i.imgURI+t.join("&")+o.join("");r.href="http://maps.google.com/maps?q="+i.settings.center;r.appendChild(n);e(this).empty().append(r)}};e.fn.mobileGmap=function(n){if(t[n]){return t[n].apply(this,Array.prototype.slice.call(arguments,1))}else if(typeof n==="object"||!n){return t.init.apply(this,arguments)}else{e.error("Method "+n+" does not exist on jQuery.mobileGmap")}}})(this.jQuery)