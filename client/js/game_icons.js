//icons
	  //player Icon, this is yourself
	  var playerIcon = L.icon({
		  iconUrl: './assets/images/karte_ich.png',
		  //shadowUrl: './assets/images/player_shadow.png',
		  iconSize:     [26, 24], // size of the icon
		 // shadowSize:   [35, 30], // size of the shadow
		  iconAnchor:   [13, 24], // point of the icon which will correspond to marker's location
		  //shadowAnchor: [8, 29],  // the same for the shadow
		  popupAnchor:  [-0, -20] // point from which the popup should open relative to the iconAnchor
		});
		//playerIcon, this is everyone else
		var playerIconEveryone = L.icon({
		  iconUrl: './assets/images/karte_spieler.png',
		  //shadowUrl: './assets/images/player_shadow.png',
		  iconSize:     [26, 24], // size of the icon
		  //shadowSize:   [35, 30], // size of the shadow
		  iconAnchor:   [13, 24], // point of the icon which will correspond to marker's location
		  //shadowAnchor: [8, 29],  // the same for the shadow
		  popupAnchor:  [-0, -20] // point from which the popup should open relative to the iconAnchor
		});
		
		/////////////////////////////////////////
		//BuildingIcon, this are unsold Buildings
		var buildingIcon=L.icon({
		iconUrl: './assets/images/building.png',
		  shadowUrl: './assets/images/building_shadow.png',
		  iconSize:     [20, 24], // size of the icon
		  shadowSize:   [35, 30], // size of the shadow
		  iconAnchor:   [10, 24], // point of the icon which will correspond to marker's location
		  shadowAnchor: [10, 29],  // the same for the shadow
		  popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
		});
		
		/////////////////////////////////////////
		//BuildingIcon for your Building, lvl 0
		var buildingIconI0=L.icon({
		iconUrl: './assets/images/karte_i_gebaeude.png',
		//shadowUrl: './assets/images/building_shadow.png',
		iconSize:     [82, 101], // size of the icon
		//shadowSize:   [35, 30], // size of the shadow
		iconAnchor:   [41, 68], // point of the icon which will correspond to marker's location
		//shadowAnchor: [10, 29],  // the same for the shadow
		popupAnchor:  [0, -50] // point from which the popup should open relative to the iconAnchor
		});
		
		//BuildingIcon for your Building, lvl 1
		var buildingIconI1=L.icon({
		iconUrl: './assets/images/karte_i_gebaeude1.png',
		//shadowUrl: './assets/images/building_shadow.png',
		iconSize:     [82, 101], // size of the icon
		//shadowSize:   [35, 30], // size of the shadow
		iconAnchor:   [41, 68], // point of the icon which will correspond to marker's location
		//shadowAnchor: [10, 29],  // the same for the shadow
		popupAnchor:  [0, -65] // point from which the popup should open relative to the iconAnchor
		});
		
		//BuildingIcon for your Building, lvl 2
		var buildingIconI2=L.icon({
		iconUrl: './assets/images/karte_i_gebaeude2.png',
		//shadowUrl: './assets/images/building_shadow.png',
		iconSize:     [82, 101], // size of the icon
		//shadowSize:   [35, 30], // size of the shadow
		iconAnchor:   [41, 68], // point of the icon which will correspond to marker's location
		//shadowAnchor: [10, 29],  // the same for the shadow
		popupAnchor:  [0, -65] // point from which the popup should open relative to the iconAnchor
		});
		
		//BuildingIcon for your Building, lvl 3
		var buildingIconI3=L.icon({
		iconUrl: './assets/images/karte_i_gebaeude3.png',
		//shadowUrl: './assets/images/building_shadow.png',
		iconSize:     [82, 101], // size of the icon
		//shadowSize:   [35, 30], // size of the shadow
		iconAnchor:   [41, 68], // point of the icon which will correspond to marker's location
		//shadowAnchor: [10, 29],  // the same for the shadow
		popupAnchor:  [0, -65] // point from which the popup should open relative to the iconAnchor
		});
		
		//BuildingIcon for your Building, lvl 4
		var buildingIconI4=L.icon({
		iconUrl: './assets/images/karte_i_gebaeude4.png',
		//shadowUrl: './assets/images/building_shadow.png',
		iconSize:     [82, 101], // size of the icon
		//shadowSize:   [35, 30], // size of the shadow
		iconAnchor:   [41, 68], // point of the icon which will correspond to marker's location
		//shadowAnchor: [10, 29],  // the same for the shadow
		popupAnchor:  [0, -65] // point from which the popup should open relative to the iconAnchor
		});
		
		//////////////////////////////////////////////
		//BuildingIcon for someone else's Building, lvl 0
		var buildingIconE0=L.icon({
		iconUrl: './assets/images/karte_gebaeude.png',
		//shadowUrl: './assets/images/building_shadow.png',
		iconSize:     [82, 101], // size of the icon
		//shadowSize:   [35, 30], // size of the shadow
		iconAnchor:   [41, 68], // point of the icon which will correspond to marker's location
		//shadowAnchor: [10, 29],  // the same for the shadow
		popupAnchor:  [0, -65] // point from which the popup should open relative to the iconAnchor
		});
		
		//BuildingIcon for someone else's Building, lvl 1
		var buildingIconE1=L.icon({
		iconUrl: './assets/images/karte_gebaeude1.png',
		//shadowUrl: './assets/images/building_shadow.png',
		iconSize:     [82, 101], // size of the icon
		//shadowSize:   [35, 30], // size of the shadow
		iconAnchor:   [41, 68], // point of the icon which will correspond to marker's location
		//shadowAnchor: [10, 29],  // the same for the shadow
		popupAnchor:  [0, -65] // point from which the popup should open relative to the iconAnchor
		});
		
		//BuildingIcon for someone else's Building, lvl 2
		var buildingIconE2=L.icon({
		iconUrl: './assets/images/karte_gebaeude2.png',
		//shadowUrl: './assets/images/building_shadow.png',
		iconSize:     [82, 101], // size of the icon
		//shadowSize:   [35, 30], // size of the shadow
		iconAnchor:   [41, 68], // point of the icon which will correspond to marker's location
		//shadowAnchor: [10, 29],  // the same for the shadow
		popupAnchor:  [0, -65] // point from which the popup should open relative to the iconAnchor
		});
		
		//BuildingIcon for someone else's Building, lvl 3
		var buildingIconE3=L.icon({
		iconUrl: './assets/images/karte_gebaeude3.png',
		//shadowUrl: './assets/images/building_shadow.png',
		iconSize:     [82, 101], // size of the icon
		//shadowSize:   [35, 30], // size of the shadow
		iconAnchor:   [41, 68], // point of the icon which will correspond to marker's location
		//shadowAnchor: [10, 29],  // the same for the shadow
		popupAnchor:  [0, -65] // point from which the popup should open relative to the iconAnchor
		});
		
		//BuildingIcon for someone else's Building, lvl 4
		var buildingIconE4=L.icon({
		iconUrl: './assets/images/karte_gebaeude4.png',
		//shadowUrl: './assets/images/building_shadow.png',
		iconSize:     [82, 101], // size of the icon
		//shadowSize:   [35, 30], // size of the shadow
		iconAnchor:   [41, 68], // point of the icon which will correspond to marker's location
		//shadowAnchor: [10, 29],  // the same for the shadow
		popupAnchor:  [0, -65] // point from which the popup should open relative to the iconAnchor
		});