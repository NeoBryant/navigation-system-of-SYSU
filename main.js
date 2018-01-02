window.onload = function () {
    //button返回主页
    $('button').bind('click', function (event) {
        location.assign('http://localhost:8000/index.html');
    });
}

//MWalk.search()函数内部调用，避免代码重复性
function searchInnerWalk(roads, result, map) {
    for (var i in result.routes[0].steps) {
        for (var j in result.routes[0].steps[i].path) {
            roads.push([result.routes[0].steps[i].path[j].getLng(), result.routes[0].steps[i].path[j].getLat()]);
        }
    }
    // 绘制轨迹
    var polyline = new AMap.Polyline({
        map: map,
        path: roads,
        strokeColor: "#F00",  //线颜色
        strokeOpacity: 1,     //线透明度
        strokeWeight: 2,      //线宽
        strokeStyle: "solid"  //线样式
    });
    map.setFitView(); 
}

//MDrive.search()函数内部调用，避免代码重复性
function searchInnerDrive(roads, result, map) {
    for (var i in result.routes[0].steps) {
        for (var j in result.routes[0].steps[i].path) {
            roads.push([result.routes[0].steps[i].path[j].getLng(), result.routes[0].steps[i].path[j].getLat()]);
        }
    }
    // 绘制轨迹
    var polyline = new AMap.Polyline({
        map: map,
        path: roads,
        strokeColor: "#F68100",  //线颜色
        strokeOpacity: 1,     //线透明度
        strokeWeight: 2,      //线宽
        strokeStyle: "solid"  //线样式
    });
    map.setFitView(); 
}

//顶点对象类
function Vertex(lng, lat, name) {
    this.Lng = lng;   //顶点经度
    this.Lat = lat;   //顶点纬度
    this.Name = name; //顶点名字

    this.getLng = function(){return this.Lng;};
    this.getLat = function(){return this.Lat;};  
    this.getName = function(){return this.Name;};  
 
}

//图对象类：步行
function GraphWalk() {
    this.maxWeight = 9999999;
    this.DefaultVertices = 14;              //默认顶点数量
    this.VerticesList = [];        //顶点列表
    this.Edge = [[0,317,173,340,0,0,0,0,0,0,0,0,0,0],
                 [317,0,0,129,361,349,465,0,0,0,0,0,0,0],
                 [173,0,0,360,0,0,0,0,0,0,0,0,0,0],
                 [340,129,360,0,332,0,0,0,0,0,447,0,0,0],
                 [0,361,0,332,0,375,0,0,0,236,0,0,0,0],
                 [0,349,0,0,375,0,286,0,0,0,0,0,0,0],
                 [0,317,0,0,0,286,0,74,0,0,0,0,0,0],
                 [0,0,0,0,0,0,74,0,114,0,0,0,0,0],
                 [0,0,0,0,0,0,0,114,0,346,0,777,0,0],
                 [0,0,0,0,236,0,0,0,346,0,216,0,327,0],
                 [0,0,0,447,0,0,0,0,0,216,0,0,0,0],
                 [0,0,0,0,0,0,0,0,777,0,0,0,286,329],
                 [0,0,0,0,0,0,0,0,0,327,0,286,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,329,0,0]]; //邻接矩阵

    //得到两点的边的权重
    this.getWeight = function( v1, v2 ) {
        return ( v1!=-1 && v2!=-2 ) ? Edge[v1][v2] : 0;
    };

    //设置顶点信息: 14个点
    this.VerticesList[0] = new Vertex(113.391639,23.070964,"北门");
    this.VerticesList[1] = new Vertex(113.391115,23.06863,"行政楼");
    this.VerticesList[2] = new Vertex(113.392639,23.071338,"北学院楼");
    this.VerticesList[3] = new Vertex(113.392403,23.068614,"公教楼");
    this.VerticesList[4] = new Vertex(113.391888,23.066215,"图书馆");
    this.VerticesList[5] = new Vertex(113.389774,23.066325,"南学院楼");
    this.VerticesList[6] = new Vertex(113.387698,23.066038,"北实验楼");
    this.VerticesList[7] = new Vertex(113.388133,23.06551,"南实验楼");
    this.VerticesList[8] = new Vertex(113.388851,23.064952,"假草");
    this.VerticesList[9] = new Vertex(113.391686,23.064576,"体育馆");
    this.VerticesList[10] = new Vertex(113.392864,23.065505,"真草");
    this.VerticesList[11] = new Vertex(113.391303,23.060312,"食堂");
    this.VerticesList[12] = new Vertex(113.391368,23.062706,"gogo新天地");
    this.VerticesList[13] = new Vertex(113.391727,23.057761,"南门");


    //最短路径
    this.shortestPath = function( begin, end, map ) {
        
        var distance = [], prev = [], arrived = [];

        for ( var i = 0; i < this.DefaultVertices; ++i ) {
            distance[i] = this.Edge[begin][i];
            arrived[i] = false;

            if ( distance[i] !== 0 ) {
                prev[i] = begin;
            } else {
                distance[i] = this.maxWeight;
                prev[i] = -1;
            }
        }

        distance[begin] = 0;
        arrived[begin] = true;

        for ( i = 0; i < this.DefaultVertices; ++i ) {

            var minIdx = begin, min = this.maxWeight;
            for ( var j = 0; j < this.DefaultVertices; ++j ) {
                if ( !arrived[j] && distance[j] < min ) {
                    min = distance[j];
                    minIdx = j;
                }
            }

            arrived[minIdx] = true;
            if ( minIdx === end ) {
                break;
            }

            for ( j = 0; j < this.DefaultVertices; ++j ) {

                var tempWeight = this.Edge[minIdx][j];
                if ( !arrived[j] && tempWeight !== 0 ) {
                    if ( tempWeight + min < distance[j] ) {
                        distance[j] = tempWeight + min;
                        prev[j] = minIdx;
                    }
                }

            }

        }

        var res = [];
        res.push( end );

        var previousIdx = prev[end];
        while ( previousIdx !== begin ) {
            res.push( previousIdx );
            previousIdx = prev[ previousIdx ];
        }

        res.push( begin );
        res.reverse();


        var sumWeight = 0;
        for ( i = 0; res[i] != end; ++i ) {

            var s = [this.VerticesList[res[i]].getLng(), this.VerticesList[res[i]].getLat()];
            var e = [this.VerticesList[res[i+1]].getLng(),this.VerticesList[res[i+1]].getLat()];
            AMap.service(["AMap.Walking"], function() {
                var roads = []; //存储要画的线路的点
                var MWalk = new AMap.Walking({
                    map: map,
                    panel: "panel"
                }); //构造路线导航类 

                //步行导航
                MWalk.search(s, e, function(status, result){
                    searchInnerWalk(roads, result, map);         
                    clear();
                });
            });
            sumWeight += this.Edge[res[i]][res[i+1]];
        }
        var marker;
        var icon = new AMap.Icon({
            image: 'https://vdata.amap.com/icons/b18/1/2.png',
            size: new AMap.Size(24, 24)
        });
        marker = new AMap.Marker({
            icon: icon,
            position: [this.VerticesList[end].getLng(), this.VerticesList[end].getLat()],
            offset: new AMap.Pixel(-12,-12),
            zIndex: 101,
            title: "目的地:"+this.VerticesList[res[0]].getName(),
            map: map
        });


        for ( i = 0; res[i] != end; ++i ) {
            marker = new AMap.Marker({
                position: [this.VerticesList[res[i]].getLng(), this.VerticesList[res[i]].getLat()],
                offset: new AMap.Pixel(-11,-25),
                zIndex: 101,
                title: this.VerticesList[res[i]].getName(),
                //content: this.VerticesList[res[i]].getName(),
                map: map
            }); 

        }
        
        return sumWeight;
    };
}


//图对象类：驾车
function GraphDrive() {
    this.maxWeight = 9999999;
    this.DefaultVertices = 14;              //默认顶点数量
    this.VerticesList = [];        //顶点列表
    this.Edge = [[0,390,576,528,0,0,0,0,0,0,0,0,2330,2390],
                 [390,0,0,664,334,0,402,0,0,0,0,0,0,0],
                 [576,0,0,302,0,0,0,0,0,0,0,0,0,0],
                 [528,664,302,0,0,0,0,0,0,0,437,0,0,0],
                 [0,334,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,215,215,0,0,0,0,0,0],
                 [0,402,0,0,0,215,0,140,0,0,0,0,0,0],
                 [0,0,0,0,0,215,140,0,114,0,0,0,0,0],
                 [0,0,0,0,0,0,0,114,0,165,0,0,1220,1920],
                 [0,0,0,0,0,0,0,0,165,0,218,0,0,0],
                 [0,0,0,437,0,0,0,0,0,218,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,744,0],
                 [2050,0,0,0,0,0,0,0,2370,0,0,247,0,0],
                 [2570,0,0,0,0,0,0,0,1920,0,0,585,0,0]]; //邻接矩阵

    //得到两点的边的权重
    this.getWeight = function( v1, v2 ) {
        return ( v1!=-1 && v2!=-2 ) ? Edge[v1][v2] : 0;
    };

    //设置顶点信息: 14个点
    this.VerticesList[0] = new Vertex(113.391639,23.070964,"北门");
    this.VerticesList[1] = new Vertex(113.391115,23.06863,"行政楼");
    this.VerticesList[2] = new Vertex(113.393855,23.070584,"北学院楼");
    this.VerticesList[3] = new Vertex(113.393903,23.068259,"公教楼");
    this.VerticesList[4] = new Vertex(113.391596,23.066182,"图书馆");
    this.VerticesList[5] = new Vertex(113.389774,23.066325,"南学院楼");
    this.VerticesList[6] = new Vertex(113.388174,23.066443,"北实验楼");
    this.VerticesList[7] = new Vertex(113.388133,23.06551,"南实验楼");
    this.VerticesList[8] = new Vertex(113.388851,23.064952,"假草");
    this.VerticesList[9] = new Vertex(113.391686,23.064576,"体育馆");
    this.VerticesList[10] = new Vertex(113.392864,23.065505,"真草");
    this.VerticesList[11] = new Vertex(113.391585,23.060466,"食堂");
    this.VerticesList[12] = new Vertex(113.391368,23.062706,"gogo新天地");
    this.VerticesList[13] = new Vertex(113.392025,23.057495,"南门");


    //最短路径
    this.shortestPath = function( begin, end, map ) {
        
        var distance = [], prev = [], arrived = [];
        for ( var i = 0; i < this.DefaultVertices; ++i ) {
            distance[i] = this.Edge[begin][i];
            arrived[i] = false;

            if ( distance[i] !== 0 ) {
                prev[i] = begin;
            } else {
                distance[i] = this.maxWeight;
                prev[i] = -1;
            }
        }

        distance[begin] = 0;
        arrived[begin] = true;

        for ( i = 0; i < this.DefaultVertices; ++i ) {

            var minIdx = begin, min = this.maxWeight;
            for ( var j = 0; j < this.DefaultVertices; ++j ) {
                if ( !arrived[j] && distance[j] < min ) {
                    min = distance[j];
                    minIdx = j;
                }
            }

            arrived[minIdx] = true;
            if ( minIdx === end ) {
                break;
            }

            for ( j = 0; j < this.DefaultVertices; ++j ) {

                var tempWeight = this.Edge[minIdx][j];
                if ( !arrived[j] && tempWeight !== 0 ) {
                    if ( tempWeight + min < distance[j] ) {
                        distance[j] = tempWeight + min;
                        prev[j] = minIdx;
                    }
                }

            }

        }

        var res = [];
        res.push( end );

        var previousIdx = prev[end];
        while ( previousIdx !== begin ) {
            res.push( previousIdx );
            previousIdx = prev[ previousIdx ];
        }

        res.push( begin );
        res.reverse();

        var sumWeight = 0;
        for ( i = 0; res[i] != end; ++i ) {

            var s = [this.VerticesList[res[i]].getLng(), this.VerticesList[res[i]].getLat()];
            var e = [this.VerticesList[res[i+1]].getLng(),this.VerticesList[res[i+1]].getLat()];
            AMap.service(["AMap.Driving"], function() {
                var roads = []; //存储要画的线路的点
                var MDrive = new AMap.Driving({
                    map: map,
                    panel: "panel"
                }); //构造路线导航类 

                //步行导航
                MDrive.search(s, e, function(status, result){
                    searchInnerDrive(roads, result, map);       
                    MDrive.clear();
                });
            });
            sumWeight += this.Edge[res[i]][res[i+1]];
        }
        var marker;
        var icon = new AMap.Icon({
            image: 'https://vdata.amap.com/icons/b18/1/2.png',
            size: new AMap.Size(24, 24)
        });
        marker = new AMap.Marker({
            icon: icon,
            position: [this.VerticesList[end].getLng(), this.VerticesList[end].getLat()],
            offset: new AMap.Pixel(-12,-12),
            zIndex: 101,
            title: "目的地:"+this.VerticesList[res[0]].getName(),
            map: map
        });

        for ( i = 0; res[i] != end; ++i ) {
            marker = new AMap.Marker({
                position: [this.VerticesList[res[i]].getLng(), this.VerticesList[res[i]].getLat()],
                offset: new AMap.Pixel(-11,-25),
                zIndex: 101,
                title: this.VerticesList[res[i]].getName(),
                //content: this.VerticesList[res[i]].getName(),
                map: map
            }); 

        }

        return sumWeight;
    };
}


//主函数
var main = function(flag, v1, v2) {
    if (flag == 0) {
        mainWalk(v1, v2);
    } else {
        mainDrive(v1, v2);
    }
};


//主函数，步行
var mainWalk = function(v1, v2) {
    var graph = new GraphWalk();

    //基本地图加载
    var map = new AMap.Map("mapContainer", {
        resizeEnable: true,
        center: [113.3909,23.067445],//地图中心点
        zoom: 15 //地图显示的缩放级别
    });
    graph.shortestPath(v1, v2, map);

};

//主函数，驾车
var mainDrive = function(v1, v2) {
    var graph = new GraphDrive();

    //基本地图加载
    var map = new AMap.Map("mapContainer", {
        resizeEnable: true,
        center: [113.3909,23.067445],//地图中心点
        zoom: 15 //地图显示的缩放级别
    });
    graph.shortestPath(v1, v2, map);
};