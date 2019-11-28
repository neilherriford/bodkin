class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const QUADRENT_TYPE = {
    WHITE: 0,
    GRAY: 1,
    BLACK: 2
};

class P1QuadrentValidator {
    shouldSplit(quadrent, segment) {
        if(quadrent.point === null) {
            return quadrent.qedges.length === 0;
        }

        if(segment.start === quadrent.point || segment.end === quadrent.point) {
            return false;
        }
        return true;
    }
}




/*
1) At most one vertex can lie in a leaf node - in which case the leaf node will
   contain all the q-edges incident on that vertex - this means that the two end
   points of a line segment must be in different leaf nodes
2) If a leaf node contains a vertex, it contains no q-edges from line segments
   NOT incident on that vertex
3) If a leaf node does not contain a vertex, it contains at most one q-edge
4) Leaf nodes are maximal - i.e., if a grey node has four sons that are leaves,
   those leaves could not be merged into a valid leaf.


 */
