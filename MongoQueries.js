//Defining variables
var jsonG

var triangles = [];
var TerrainInformation = [];

var Units = [];
var UnitsInformation = [];
var NumberOfUnits;
var UnitColors = [];

var UtilitiesCoordinates = [];
var UtilitiesIndices = [];
var UtilitiesInformation = [];
var NumberOfUtilities;
var UtilityColors = [];

var firstProjection = '+proj=longlat +datum=WGS84 +no_defs';
var secondProjection = "+proj=tmerc +lat_0=0 +lon_0=21 +k=0.9999 +x_0=7500000 +y_0=0 +ellps=bessel +units=m +no_defs";

var csgUnits = [];

//Reading Units data from the database
var url = "http://osgl.grf.bg.ac.rs/mongo_rest/3DCadastre/BuildingUnits/";
$.ajax({url: url,
        type: 'GET',
        dataType: 'jsonp',
        cache: false,
        jsonp: 'jsonp',
        crossDomain: 'true',
        success: function(data){
		NumberOfUnits = Object.keys(data.rows).length;
		for (i = 0; i < Object.keys(data.rows).length; i++) { 
		var coordinates = JSON.stringify(data.rows[i].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.Building.consistsOfBuildingPart.Unit.consistsOfStructuralComponent[0].Floor.representedByMultiSurface.MultiSurface.surfaceMember.CompositeSurface.surfaceMember.Polygon.exterior.LinearRing.posList.__text)
		var coordinates2 = JSON.stringify(data.rows[i].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.Building.consistsOfBuildingPart.Unit.consistsOfStructuralComponent[5].Ceiling.representedByMultiSurface.MultiSurface.surfaceMember.CompositeSurface.surfaceMember.Polygon.exterior.LinearRing.posList.__text)
		var res = coordinates.replace('"', "").split(" ")
		var res2 = coordinates2.replace('"', "").split(" ")
		
		var x = []
		x.push(res[0])
		x.push(res[3])
		x.push(res[6])
		x.push(res[9])
		
		var Xmin = Math.min.apply(Math, x);
		var Xmax = Math.max.apply(Math, x);
		
		var y = []
		y.push(res[1])
		y.push(res[4])
		y.push(res[7])
		y.push(res[10])
		
		var Ymin = Math.min.apply(Math, y);
		var Ymax = Math.max.apply(Math, y);
		
		var z = []
		z.push(res[2])
		z.push(res2[2])
		
		var Zmin = Math.min.apply(Math, z);
		var Zmax = Math.max.apply(Math, z);
		
		var origin = proj4(firstProjection,secondProjection,[originLong, originLat]);
		
		var UnitOrigin = proj4(secondProjection, firstProjection,[origin[0]+Xmin+(Xmax-Xmin)/2,origin[1]+Ymin+(Ymax-Ymin)/2]);
		
		var Unit = []
		Unit.push(UnitOrigin[0])
		Unit.push(UnitOrigin[1])
		Unit.push(Zmin)
		
		Unit.push(Xmax-Xmin)
		Unit.push(Ymax-Ymin)
		Unit.push(Zmax-Zmin)
		
		Units.push(Unit)
		
		var UnitInformation = [];
		//Flat number
		UnitInformation.push(JSON.stringify(data.rows[i].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.Building.consistsOfBuildingPart.Unit.lpo.LegalPropertyObject.address.Address._flatNumber))
		//Property ID
		UnitInformation.push(JSON.stringify(data.rows[i].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.Building.consistsOfBuildingPart.Unit.lpo.LegalPropertyObject.address.Address._propertyNumber))
		//Street name
		UnitInformation.push(JSON.stringify(data.rows[i].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.Building.consistsOfBuildingPart.Unit.lpo.LegalPropertyObject.address.Address._streetName))
		//Owner
		UnitInformation.push(JSON.stringify(data.rows[i].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.Building.consistsOfBuildingPart.Unit.lpo.LegalPropertyObject.proprietor.InterestHolder._pName))
		//Owner type
		UnitInformation.push(JSON.stringify(data.rows[i].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.Building.consistsOfBuildingPart.Unit.lpo.LegalPropertyObject.proprietor.InterestHolder._type))
		//Usage
		UnitInformation.push(JSON.stringify(data.rows[i].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.Building.consistsOfBuildingPart.Unit._landUse))
		
		UnitsInformation.push(UnitInformation)
		
		//Preparing objects for csg.js library
		var UnitModel = {
		"vertices": [[Number(res[0]),Number(res[1]),Number(res[2])],[Number(res[3]),Number(res[4]),Number(res[5])],[Number(res[6]),Number(res[7]),Number(res[8])],[Number(res[9]),Number(res[10]),Number(res[11])], 
					 [Number(res2[0]),Number(res2[1]),Number(res2[2])],[Number(res2[3]),Number(res2[4]),Number(res2[5])],[Number(res2[6]),Number(res2[7]),Number(res2[8])],[Number(res2[9]),Number(res2[10]),Number(res2[11])]],
		"triangles": [[1,2,3,0],[0,4,5,1],[1,5,6,2],[3,2,6,7],[0,3,7,4],[4,7,6,5]],
		"bufferPointers" : [[Number(res[0])-Xmin,Number(res[1])-Ymin,Number(res[2])-Zmin],[Number(res[3]-Xmin),Number(res[4]-Ymin),Number(res[5])-Zmin],[Number(res[6]-Xmin),Number(res[7]-Ymin),Number(res[8])-Zmin],[Number(res[9]-Xmin),Number(res[10]-Ymin),Number(res[11])-Zmin], 
					 [Number(res2[0])-Xmin,Number(res2[1])-Ymin,Number(res2[2])-Zmin],[Number(res2[3])-Xmin,Number(res2[4])-Ymin,Number(res2[5])-Zmin],[Number(res2[6])-Xmin,Number(res2[7])-Ymin,Number(res2[8])-Zmin],[Number(res2[9])-Xmin,Number(res2[10])-Ymin,Number(res2[11])-Zmin]],
		};
		
		$.each(UnitModel.bufferPointers, function(k,v) {
			if (v[0] == 0) {v[0] = -1} else {v[0] = 1}
			if (v[1] == 0) {v[1] = -1} else {v[1] = 1}
			if (v[2] == 0) {v[2] = -1} else {v[2] = 1}
		})
		
		csgUnits.push(UnitModel)
		}		
		}});
		
		
//Reading Terrain data from the database
var url = "http://osgl.grf.bg.ac.rs/mongo_rest/3DCadastre/Terrain/";		
$.ajax({url: url,
        type: 'GET',
        dataType: 'jsonp',
        cache: false,
        jsonp: 'jsonp',
        crossDomain: 'true',
        success: function(data){
			
		for (i = 0; i < Object.keys(data.rows[0].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.Terrain.terrainSource.TIN.tinSource.TriangulatedSurface.trianglePatches.Triangle).length; i++) { 
						
		var coordinates = JSON.stringify(data.rows[0].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.Terrain.terrainSource.TIN.tinSource.TriangulatedSurface.trianglePatches.Triangle[i].exterior.LinearRing.posList.__text)
		
		var res = coordinates.replace('"', "").split(" ")
		var origin = proj4(firstProjection,secondProjection,[originLong, originLat]);

		var p1 = proj4(secondProjection, firstProjection,[origin[0]+Number(res[0]),origin[1]+Number(res[1])]);
		var p2 = proj4(secondProjection, firstProjection,[origin[0]+Number(res[3]),origin[1]+Number(res[4])]);
		var p3 = proj4(secondProjection, firstProjection,[origin[0]+Number(res[6]),origin[1]+Number(res[7])]);
		
		triangles.push(p1[0]);
		triangles.push(p1[1]);
		triangles.push(Number(res[2]));
		triangles.push(p2[0]);
		triangles.push(p2[1]);
		triangles.push(Number(res[5]));
		triangles.push(p3[0]);
		triangles.push(p3[1]);
		triangles.push(Number(res[8]));
		
		//Terrain information
		//Lower corner
		var coordinates = JSON.stringify(data.rows[0].UrabnCadastralModel.boundedBy.Envelope.lowerCorner.__text)
		var res = coordinates.replace('"', "").split(" ")
		
		var LowerCorner = proj4(secondProjection, firstProjection,[origin[0]+Number(res[0]),origin[1]+Number(res[1])]);
		
		TerrainInformation.push(LowerCorner[0].toFixed(5));
		TerrainInformation.push(LowerCorner[1].toFixed(5));
		
		//Upper corner
		var coordinates = JSON.stringify(data.rows[0].UrabnCadastralModel.boundedBy.Envelope.upperCorner.__text)
		var res = coordinates.replace('"', "").split(" ")
		
		var UpperCorner = proj4(secondProjection, firstProjection,[origin[0]+Number(res[0]),origin[1]+Number(res[1])]);
		
		TerrainInformation.push(UpperCorner[0].toFixed(5));
		TerrainInformation.push(UpperCorner[1].toFixed(5));
			}
		}});
		
//Reading Utilities data from the database		
var url = "http://osgl.grf.bg.ac.rs/mongo_rest/3DCadastre/Utilities/";		
$.ajax({url: url,
        type: 'GET',
        dataType: 'jsonp',
        cache: false,
        jsonp: 'jsonp',
        crossDomain: 'true',
        success: function(data){
			
		NumberOfUtilities = Object.keys(data.rows).length;

		for (i = 0; i < Object.keys(data.rows).length; i++) { 
		
		var UtilityCoordinates = [];
		var UtilityIndices = [];
			
		for (j = 0; j < Object.keys(data.rows[i].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.UtilityNetwork.NetworkComponent.representedByMultiSurface.MultiSurface.surfaceMember.CompositeSurface.surfaceMember).length; j++) { 
						
		var coordinates = JSON.stringify(data.rows[i].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.UtilityNetwork.NetworkComponent.representedByMultiSurface.MultiSurface.surfaceMember.CompositeSurface.surfaceMember[j].Polygon.exterior.LinearRing.posList.__text)
		var res = coordinates.replace('"', "").split(" ")
		var origin = proj4(firstProjection,secondProjection,[originLong, originLat]);

		var p1 = proj4(secondProjection, firstProjection,[origin[0]+Number(res[0]),origin[1]+Number(res[1])]);
		var p2 = proj4(secondProjection, firstProjection,[origin[0]+Number(res[3]),origin[1]+Number(res[4])]);
		var p3 = proj4(secondProjection, firstProjection,[origin[0]+Number(res[6]),origin[1]+Number(res[7])]);
		var p4 = proj4(secondProjection, firstProjection,[origin[0]+Number(res[9]),origin[1]+Number(res[10])]);
		
		UtilityCoordinates.push(p1[0]);
		UtilityCoordinates.push(p1[1]);
		UtilityCoordinates.push(Number(res[2]));
		UtilityCoordinates.push(p2[0]);
		UtilityCoordinates.push(p2[1]);
		UtilityCoordinates.push(Number(res[5]));
		UtilityCoordinates.push(p3[0]);
		UtilityCoordinates.push(p3[1]);
		UtilityCoordinates.push(Number(res[8]));
		UtilityCoordinates.push(p4[0]);
		UtilityCoordinates.push(p4[1]);
		UtilityCoordinates.push(Number(res[11]));
		
		UtilityIndices.push(j*4+0)
		UtilityIndices.push(j*4+1)
		UtilityIndices.push(j*4+2)
		UtilityIndices.push(j*4+3)
		UtilityIndices.push(j*4+0)
		UtilityIndices.push(j*4+2)
				
			}
			
		//Utility information
		var UtilityInformation = [];
		
		UtilityInformation.push(JSON.stringify(data.rows[i].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.UtilityNetwork["_gml:id"]))
		UtilityInformation.push(JSON.stringify(data.rows[i].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.UtilityNetwork._constructionYear))
		UtilityInformation.push(JSON.stringify(data.rows[i].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.UtilityNetwork._networkHeightBelowGround))
		UtilityInformation.push(JSON.stringify(data.rows[i].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.UtilityNetwork.NetworkComponent._material))
		UtilityInformation.push(JSON.stringify(data.rows[i].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.UtilityNetwork.NetworkComponent._length))
		UtilityInformation.push(JSON.stringify(data.rows[i].UrabnCadastralModel.physicalModel.UrbanModel.physicalObjectMember.UtilityNetwork.NetworkComponent._width))
		
		UtilitiesCoordinates.push(UtilityCoordinates);
		UtilitiesIndices.push(UtilityIndices);
		UtilitiesInformation.push(UtilityInformation);
			}
		}});

//Defining colours for the units and utilities
UnitColors.push("#66c2a5");
UnitColors.push("#fc8d62");
UnitColors.push("#8da0cb");
UnitColors.push("#ffd92f");
UnitColors.push("#a6d854");
UnitColors.push("#e78ac3");
UnitColors.push("#fc8d62");
UnitColors.push("#ffd92f");

UtilityColors.push("#FF0000");
UtilityColors.push("#FF0000");
UtilityColors.push("#0000FF");
UtilityColors.push("#0000FF");


