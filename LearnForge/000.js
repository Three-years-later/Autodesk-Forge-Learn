// { “property”:”value” [, “property”:”value”, ...] } 
// or use named preset objects: 
// BubbleNode.MODEL_NODE { “role”:”3d”, “type”:”geometry” } 
// BubbleNode.GEOMETRY_SVF_NODE { “role”:”graphics”, “mime”: “application/autodesk-svf” } 
// BubbleNode.SHEET_NODE { “role”:”2d”, “type”:”geometry” } 
// BubbleNode.LEAFLET_NODE { “role”:”leaflet” } 
// BubbleNode.IMAGE_NODE { “role”:”image” } 
// BubbleNode.GEOMETRY_F2D_NODE { “role”:”graphics”, “mime”: “application/autodesk-f2d” } 
// BubbleNode.VIEWABLE_NODE { “role”:”viewable” } 
// BubbleNode.AEC_MODEL_DATA { “role”:”Autodesk.AEC.ModelData”}

var singleProps = myBubbleNode.search({
    "type": "geometry"
});
var multiProps = myBubbleNode.search({
    "role": "3 d",
    "type": "geometry"
});
var presetProps = myBubbleNode.search(myBubbleNode.SHEET_NODE);