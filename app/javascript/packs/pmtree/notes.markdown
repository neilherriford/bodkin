# node types
## black
    contain a hash of objects
## gray
    partitioned?
## white
    empty


┌──────────────┬──────────────┐   NW
│ NW           │           NE │    Point A
│              │              │    Edge AB
│         A    │           C ┏●
│          ●   │           ┏━┛│   NE
│         ┏┛   │         ┏━┛  │     Point C
│         ┃    │       ┏━┛    │     Edge BC
│        ┏┛    │     ┏━┛      │
├────────╋─────┼───┳━┻────────┤   SE
│       ┏┛     │ ┏━┛          │     Edge BC
│       ┃     ┏╋━┛            │
│      ┏┛  ┏━━┛│              │   SW
│      ┃┏━━┛   │              │     Point B
│   B ●┻┛      │              │     Edge BC
│              │              │     Edge BA
│ SW           │           SE │
└──────────────┴──────────────┘





# glossary
## q-edge
    a line segment (q == quadrent).  may be only part of the segment, not containing its verticies
## PM*
how strict the partitioning is

## PM1
most strict
### black nodes
EITHER
    at most 1 vertex
    1+ non intersecting q-edges
OR
    exactly 1 q-edge



## PM2
### black nodes
at most 1 vertex
one or more q-edges which share a common endpoint

## PM3
least strict
### black nodes
contain at MOST one endpoint
no limit on qedges
q edges are not allowed to intersect

if a point exists on a border, insert it into at most 4 sub nodes

┌─┬─┐   e.g. this point belongs to NW, NE, SW, SE
├─●─┤
└─┴─┘

Ownership
   N
 ┏───┐
W┃   │E
 ┗━━━┛
   S

