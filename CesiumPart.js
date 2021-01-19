
Cesium.BingMapsApi.defaultKey = 'AoKvoTho-p2UUwNXqMyWT-2U_xQD-d5iZZV6IWW9AFFSO_rNXflf5eQcNbribKxX';

var viewer = new Cesium.Viewer('cesiumContainer',{ skyBox : false, geocoder : false
, animation : false, timeline: false, homeButton: false, sceneModePicker: false, selectionIndicator: false, navigationHelpButton: false, baseLayerPicker: false
    });
	
/////////////////////////    TERRAIN     //////////////////////////////
var mypositions = Cesium.Cartesian3.fromDegreesArrayHeights(triangles);
var numPositions = mypositions.length;

var pos = new Float64Array(numPositions * 3);
var normals = new Float32Array(numPositions * 3);
for (var i = 0; i < numPositions; ++i) {
  pos[i * 3] = mypositions[i].x;
  pos[i * 3 + 1] = mypositions[i].y;
  pos[i * 3 + 2] = mypositions[i].z;
  normals[i * 3] = 1;
  normals[i * 3 + 1] = 0;
  normals[i * 3 + 2] = 0;
}

var geometry = new Cesium.Geometry({
vertexFormat : Cesium.VertexFormat.ALL,
  attributes: {
    position: new Cesium.GeometryAttribute({
      componentDatatype: Cesium.ComponentDatatype.DOUBLE, // not FLOAT
      componentsPerAttribute: 3,
      values: pos
    }),
    normal: new Cesium.GeometryAttribute({
      componentDatatype: Cesium.ComponentDatatype.FLOAT,
      componentsPerAttribute: 3,
      values: normals
    })

  },


  indices: new Uint32Array(Array.apply(null, {length: (numPositions)}).map(Number.call, Number)),
  primitiveType: Cesium.PrimitiveType.TRIANGLES,
  boundingSphere: Cesium.BoundingSphere.fromVertices(pos)
});
Cesium.GeometryPipeline.computeNormal(geometry);

var myInstance = new Cesium.GeometryInstance({
  geometry: geometry,
  attributes: {
    color: new Cesium.ColorGeometryInstanceAttribute(0.0039215697906911,
          0.7333329916000366,
          0,
          1)
  },
  show: new Cesium.ShowGeometryInstanceAttribute(true),
  id : 'Digital Terrain Model|| Type: TIN<br> Lower corner: '.concat(TerrainInformation[0], ', ', TerrainInformation[1],  '<br> Upper corner: ', TerrainInformation[2], ', ', TerrainInformation[3])
});

var TIN = viewer.scene.primitives.add(new Cesium.Primitive({
  geometryInstances: [myInstance],
  asynchronous: false,
  appearance: new Cesium.PerInstanceColorAppearance({
    closed: true,
    translucent: false
  })
  }));
///////////////////////    TERRAIN END     ////////////////////////////


//////////////////////        UNITS       ////////////////////////////
  var Owners=[];
  var UnitsNames=[];
  
  for (i = 0; i < NumberOfUnits; i++) { 
  var Box = viewer.entities.add({
    name : "Unit ".concat(String(i+1)),
	description: 'Flat Number: '.concat(UnitsInformation[i][0].replace(/"/gi," "), '<br> Property ID: ', UnitsInformation[i][1].replace(/"/gi," "), ' <br>Street Name: ',UnitsInformation[i][2].replace(/"/gi," "),'<br> Owner:', UnitsInformation[i][3].replace(/"/gi," "),'<br> Type: ', UnitsInformation[i][4].replace(/"/gi," "), '<br> Area: ', Math.round(Units[i][3]*Units[i][4]), ' m2 <br> Usage: ', UnitsInformation[i][5].replace(/"/gi," ")),
    position: Cesium.Cartesian3.fromDegrees(Units[i][0], Units[i][1], Units[i][2]+Units[i][5]/2),
	id: i,
    box : {
        dimensions : new Cesium.Cartesian3(Units[i][3], Units[i][4], Units[i][5]),
        material : Cesium.Color.fromCssColorString(UnitColors[i]),
        outline : false,
        outlineColor : Cesium.Color.BLACK
    }
});

 Owners.push(UnitsInformation[i][3].replace(/"/gi," "));
 UnitsNames.push("Unit ".concat(i+1))
}

//Function for sorting and deleting duplicates from Owner array
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
} 

var OwnersUnique = uniq(Owners);

var sel = document.getElementById('OwnerList');
var fragment = document.createDocumentFragment();

OwnersUnique.forEach(function(OwnersUnique, index) {
    var opt = document.createElement('option');
    opt.innerHTML = OwnersUnique;
    opt.value = OwnersUnique;
    fragment.appendChild(opt);
});

sel.appendChild(fragment);

//NeighbourUnits selection list
var sel = document.getElementById('NeighbourUnits');
var fragment = document.createDocumentFragment();

UnitsNames.forEach(function(UnitsNames, index) {
    var opt = document.createElement('option');
    opt.innerHTML = UnitsNames;
    opt.value = UnitsNames;
    fragment.appendChild(opt);
});
sel.appendChild(fragment);
////////////////////        UNITS END       //////////////////////////


///////////////////////     UTILITIES      ////////////////////////////
var j;
 for (j = 0; j < NumberOfUtilities; j++) { 
var mypositions = Cesium.Cartesian3.fromDegreesArrayHeights(UtilitiesCoordinates[j]);
var numPositions = mypositions.length;

var pos = new Float64Array(numPositions * 3);
var normals = new Float32Array(numPositions * 3);
for (var i = 0; i < numPositions; ++i) {
  pos[i * 3] = mypositions[i].x;
  pos[i * 3 + 1] = mypositions[i].y;
  pos[i * 3 + 2] = mypositions[i].z;
  normals[i * 3] = 1;
  normals[i * 3 + 1] = 0;
  normals[i * 3 + 2] = 0;
}

var geometry = new Cesium.Geometry({
vertexFormat : Cesium.VertexFormat.ALL,
  attributes: {
    position: new Cesium.GeometryAttribute({
      componentDatatype: Cesium.ComponentDatatype.DOUBLE, // not FLOAT
      componentsPerAttribute: 3,
      values: pos
    }),
    normal: new Cesium.GeometryAttribute({
      componentDatatype: Cesium.ComponentDatatype.FLOAT,
      componentsPerAttribute: 3,
      values: normals
    })

  },

 indices: new Uint32Array(UtilitiesIndices[j]),
  primitiveType: Cesium.PrimitiveType.TRIANGLES,
  boundingSphere: Cesium.BoundingSphere.fromVertices(pos)
});
Cesium.GeometryPipeline.computeNormal(geometry);

var myInstance = new Cesium.GeometryInstance({
  geometry: geometry,
  attributes: {
    color: new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(UtilityColors[j]))
  },
  show: new Cesium.ShowGeometryInstanceAttribute(true),
  id : UtilitiesInformation[j][0].replace(/"/gi," ").concat( '|| Construction Year : ', UtilitiesInformation[j][1].replace(/"/gi," ") , '<br> Below ground: ',UtilitiesInformation[j][2].replace(/"/gi," "),'<br> Material: ', UtilitiesInformation[j][3].replace(/"/gi," "),'<br> Length',UtilitiesInformation[j][4].replace(/"/gi," ") ,'<br> Length', UtilitiesInformation[j][5].replace(/"/gi," "))
});

var TIN = viewer.scene.primitives.add(new Cesium.Primitive({
  geometryInstances: [myInstance],
  asynchronous: false,
  appearance: new Cesium.PerInstanceColorAppearance({
    closed: true,
    translucent: false
  })
  }));
  }
 /////////////////////     UTILITIES END      ////////////////////////// 
 
//Setting initial zoom
viewer.zoomTo(viewer.entities, new Cesium.HeadingPitchRange(1, -0.8, 200));
  
  
/////////////////////   SHOW INFO ON CLICK     /////////////////////////
viewer.canvas.addEventListener('click', function(e){
    var mousePosition = new Cesium.Cartesian2(e.clientX, e.clientY);
	try {
	var result = viewer.scene.pick(mousePosition).id
	}
	catch(err) {
	var result
	}

if (typeof result === 'string' || result instanceof String & result != null)	
{	
var res = result.split("||")
var entity = new Cesium.Entity('Infobox');
entity.name = res[0]
entity.description = {
    getValue : function() {
        return res[1];
    }
};
viewer.selectedEntity = entity;
}		
}, false);
///////////////////   SHOW INFO ON CLICK END     ///////////////////////
 

/////////////   SETTING SELECTION COLOR ON MOUSEOVER    ///////////////
var originColor;
var previousPickedObject;

var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function(movement) {

var selectedEntityId
try {
    selectedEntityId = viewer.selectedEntity.id;
	 } catch(err) {
    selectedEntityId = "";
}

    var pickedObject = viewer.scene.pick(movement.endPosition);
	
    if (pickedObject && selectedEntityId != "InfoboxBasedOnQueries") {

			if (previousPickedObject && previousPickedObject.primitive.isDestroyed() == false) {
			 var attributesPrevious = previousPickedObject.primitive.getGeometryInstanceAttributes(previousPickedObject.id);
			 attributesPrevious.color = originColor;		 
			}
			
			previousPickedObject = pickedObject;
			
			var attributes = pickedObject.primitive.getGeometryInstanceAttributes(pickedObject.id);
			originColor = attributes.color;

			attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.CYAN.withAlpha(0.5));
    } else  {
	if (previousPickedObject) {
			 var attributesPrevious = previousPickedObject.primitive.getGeometryInstanceAttributes(previousPickedObject.id);
			 attributesPrevious.color = originColor;
			}    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
///////////   SETTING SELECTION COLOR ON MOUSEOVER END    /////////////


//Variables for queries
	var indices = [];
	var selectedUnitsColors = [];
	var queryExecured;
	
	
/////////////////       SELECT BY OWNER NAME        ///////////////////
function selectByOwnerName() {

	viewer.selectedEntity = undefined
	
	//Mark that query is executed	
	queryExecured = 1
	
	var OwnersList = [];
	for (i = 0; i < NumberOfUnits; i++) { 
	OwnersList.push(UnitsInformation[i][3].replace(/"/gi,""));
	}

	var e = document.getElementById("OwnerList");
	var selectedOwnerName = e.options[e.selectedIndex].text;
	
	indices = [];
	selectedUnitsColors = [];
	var idx = OwnersList.indexOf(selectedOwnerName);
	while (idx != -1) {
	indices.push(idx);
	idx = OwnersList.indexOf(selectedOwnerName, idx + 1);
	}

	//Creating string that contains properties information
	var StringInfo = "";
	  for (i = 0; i < indices.length; i++) {
		  StringInfo = StringInfo.concat("Unit ",String(indices[i]+1),'<br>Flat Number: ',UnitsInformation[indices[i]][0].replace(/"/gi," "), '<br> Property ID: ', UnitsInformation[indices[i]][1].replace(/"/gi," "), ' <br>Street Name: ',UnitsInformation[indices[i]][2].replace(/"/gi," "),'<br> Type: ', UnitsInformation[indices[i]][4].replace(/"/gi," "), '<br> Area: ', Math.round(Units[indices[i]][3]*Units[indices[i]][4]), ' m2  <br> Usage: ', UnitsInformation[i][5].replace(/"/gi," "), '<br><br>')
		  var e = viewer.entities.getById(indices[i])
			selectedUnitsColors.push(e.box.material)
			e.box.material = Cesium.Color.CYAN.withAlpha(0.5)
	  
	  }
	  
	  var entity = new Cesium.Entity({id : "InfoboxBasedOnQueries"});
		entity.name = selectedOwnerName.concat(" properties")
		entity.description = StringInfo;
        viewer.selectedEntity = entity;
}
/////////////////     SELECT BY OWNER NAME END      ///////////////////


//Add event listener for select buttons
document.getElementById("OwnerNameSelect").addEventListener("click", selectByOwnerName, false);
document.getElementById("IDSelect").addEventListener("click", selectByPropertyID, false);
document.getElementById("NeighbourUnitsSelect").addEventListener("click", selectUnitNeighbour, false);
document.getElementById("IntersectionCheck").addEventListener("click", checkIntersection, false);

/////////////////       SELECT BY PROPERTY ID        //////////////////
function selectByPropertyID() {

	viewer.selectedEntity = undefined
	
	//Mark that query is executed	
	queryExecured = 1;
	
	var PropertyIDList = [];
	for (i = 0; i < NumberOfUnits; i++) { 
	PropertyIDList.push(UnitsInformation[i][1].replace(/"/gi,""));
	}

	var e = document.getElementById("InputedID");
	var selectedPropertyID = e.value;
	
	indices = [];
	selectedUnitsColors = [];
	var idx = PropertyIDList.indexOf(selectedPropertyID);
	while (idx != -1) {
	indices.push(idx);
	idx = PropertyIDList.indexOf(selectedPropertyID, idx + 1);
	}

	//Creating string that contains properties information
	var StringInfo
	if (indices.length == 0) {StringInfo = 'There is no "'.concat(selectedPropertyID,'" property ID in the database.');} else {StringInfo = "";}

	  for (i = 0; i < indices.length; i++) {
		  StringInfo = StringInfo.concat("Unit ",String(indices[i]+1),'<br>Flat Number: ',UnitsInformation[indices[i]][0].replace(/"/gi," "), '<br> Owner: ', UnitsInformation[indices[i]][3].replace(/"/gi," "), ' <br>Street Name: ',UnitsInformation[indices[i]][2].replace(/"/gi," "),'<br> Type: ', UnitsInformation[indices[i]][4].replace(/"/gi," "), '<br> Area: ', Math.round(Units[indices[i]][3]*Units[indices[i]][4]), ' m2  <br> Usage: ', UnitsInformation[i][5].replace(/"/gi," "), '<br><br>')
		  var e = viewer.entities.getById(indices[i])
			selectedUnitsColors.push(e.box.material)
			e.box.material = Cesium.Color.CYAN.withAlpha(0.5)
	  
	  }
	  
	  var entity = new Cesium.Entity({id : "InfoboxBasedOnQueries"});
		entity.name = "Property ID: ".concat(selectedPropertyID)
		entity.description = StringInfo;
        viewer.selectedEntity = entity;
}
////////////////       SELECT BY PROPERTY ID END       ////////////////


////////////     CHECK IF QUERY IS ALREADY EXECUTED     ///////////////
 Cesium.knockout.getObservable(viewer, '_selectedEntity').subscribe(function(entity) {
		var EntityId
		
		try {
		EntityId = entity.id;
		} catch(err) {
		EntityId = "";
		}
		
        if (queryExecured == 1 && EntityId != "InfoboxBasedOnQueries") {
		for (i = 0; i < indices.length; i++) {
			var e = viewer.entities.getById(indices[i])
			e.box.material = selectedUnitsColors[i]
        }
		queryExecured == 0
		}
});
//////////     CHECK IF QUERY IS ALREADY EXECUTED END     /////////////


////////////     SELECT UNIT Neighbour     ///////////////

function selectUnitNeighbour() { 

	viewer.selectedEntity = undefined
	
	//Mark that query is executed	
	queryExecured = 1
	
	var e = document.getElementById("NeighbourUnits");
	var selectedUnitIndex = e.selectedIndex
	
	var neighbourUnitsIndex = [];
	selectedUnitsColors = [];
	indices = [];

	var selectedUnit = CSG.fromPolygons(csgUnits[selectedUnitIndex].triangles.map(function(tri) {
	return new CSG.Polygon(tri.map(function(i) {
    return new CSG.Vertex(csgUnits[selectedUnitIndex].vertices[i], [0,0,1]);
	}));}));
	//Creating buffer unit with tolerance 0.001
	var BufferedUnit = {"vertices": [],"triangles": []};
	for (i = 0; i < csgUnits[selectedUnitIndex].vertices.length; i++) { 
	var trangle = [];
	var tolerance = 0.01;
	trangle.push(csgUnits[selectedUnitIndex].vertices[i][0] + csgUnits[selectedUnitIndex].vertices[i][0]*csgUnits[selectedUnitIndex].bufferPointers[i][0]*tolerance/Math.abs(csgUnits[selectedUnitIndex].vertices[i][0]))
	trangle.push(csgUnits[selectedUnitIndex].vertices[i][1] + csgUnits[selectedUnitIndex].vertices[i][1]*csgUnits[selectedUnitIndex].bufferPointers[i][1]*tolerance/Math.abs(csgUnits[selectedUnitIndex].vertices[i][1]))
	if (csgUnits[selectedUnitIndex].vertices[i][2] != 0) {
	trangle.push(csgUnits[selectedUnitIndex].vertices[i][2] + csgUnits[selectedUnitIndex].vertices[i][2]*csgUnits[selectedUnitIndex].bufferPointers[i][2]*tolerance/Math.abs(csgUnits[selectedUnitIndex].vertices[i][2]))
	} else {
	trangle.push(csgUnits[selectedUnitIndex].vertices[i][2] + tolerance*csgUnits[selectedUnitIndex].bufferPointers[i][2])
	}
	BufferedUnit.vertices.push(trangle)
	}
	BufferedUnit.triangles = csgUnits[selectedUnitIndex].triangles
	
	var BufferSelectedUnit = CSG.fromPolygons(BufferedUnit.triangles.map(function(tri) {
	return new CSG.Polygon(tri.map(function(i) {
    return new CSG.Vertex(BufferedUnit.vertices[i], [0,0,1]);
	}));}));
	
	
	for (j = 0; j < NumberOfUnits; j++) {
		
	if (j != selectedUnitIndex) {
	
	var Unit = CSG.fromPolygons(csgUnits[j].triangles.map(function(tri) {
	return new CSG.Polygon(tri.map(function(i) {
    return new CSG.Vertex(csgUnits[j].vertices[i], [0,0,1]);
	}));}));
	
	var Intersect = selectedUnit.intersect(Unit)
	var IntersectWithBuffer = BufferSelectedUnit.intersect(Unit)
	
	if (Intersect.polygons.length == 0 && IntersectWithBuffer.polygons.length > 0)
	{
	neighbourUnitsIndex.push(j)	
	}

	}}
	
	//
	
	var StringInfo = "";
	  for (i = 0; i < neighbourUnitsIndex.length; i++) {
		  StringInfo = StringInfo.concat("Unit ",String(neighbourUnitsIndex[i]+1),'<br>Flat Number: ',UnitsInformation[neighbourUnitsIndex[i]][0].replace(/"/gi," "), '<br> Property ID: ', UnitsInformation[neighbourUnitsIndex[i]][1].replace(/"/gi," "), '<br> Area: ', Math.round(Units[neighbourUnitsIndex[i]][3]*Units[neighbourUnitsIndex[i]][4]), ' m2  <br><br>')
		  var e = viewer.entities.getById(neighbourUnitsIndex[i])
			selectedUnitsColors.push(e.box.material)
			indices.push(neighbourUnitsIndex[i]);
			e.box.material = Cesium.Color.CYAN.withAlpha(0.5)
	  
	  }
	  
	  var entity = new Cesium.Entity({id : "InfoboxBasedOnQueries"});
		entity.name = "Neighbour units of unit ".concat(selectedUnitIndex+1)
		entity.description = StringInfo;
        viewer.selectedEntity = entity;
		

}
////////////     SELECT UNIT Neighbour END     /////////////

////////////     CHECK UNIT INTERSECTION     ///////////////
function checkIntersection () {
	
	viewer.selectedEntity = undefined
	
	//Mark that query is executed	
	queryExecured = 1
	
	var IntersectedUnits = [];
	
	for (j = 0; j < NumberOfUnits; j++) {
		
	var FirstUnit = CSG.fromPolygons(csgUnits[j].triangles.map(function(tri) {
	return new CSG.Polygon(tri.map(function(i) {
    return new CSG.Vertex(csgUnits[j].vertices[i], [0,0,1]);
	}));}));
	
	var n;
	for (n = j+1; n < NumberOfUnits; n++) {
		
	var SecondUnit = CSG.fromPolygons(csgUnits[n].triangles.map(function(tri) {
	return new CSG.Polygon(tri.map(function(i) {
    return new CSG.Vertex(csgUnits[n].vertices[i], [0,0,1]);
	}));}));
	
	var Intersection = FirstUnit.intersect(SecondUnit)
	//console.log(Intersection)
	
	if (Intersection.polygons.length > 0)
	{
	IntersectedUnits.push("Unit ".concat(j+1," intersects unit ", n+1,"."))
	}
	
	}
	}
	
	if (IntersectedUnits.length == 0) {IntersectedUnits.push("There is no intersection between building units.")}
	
	var StringInfo = "";
	  for (i = 0; i < IntersectedUnits.length; i++) {
		  StringInfo = StringInfo.concat(IntersectedUnits[i], "<br>")
		  }
		  
	var entity = new Cesium.Entity({id : "InfoboxBasedOnQueries"});
	entity.name = "Building units intersection"
	entity.description = StringInfo;
    viewer.selectedEntity = entity;
}
///////////     CHECK UNIT INTERSECTION END     //////////////