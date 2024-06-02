function mapControllerCore(kakaoObject) {
    this.kakao = kakaoObject;
    this.map;
    this.circle;
    this.markers = [];
    this.infowindows = [];
    this.selected_entps = [];
    this.selectedNames = [];
    this.ps = new this.kakao.maps.services.Places();

    this.kakaoSearchKeyword = function (keyword) {
        var apiKey = "***REMOVED***";
        var url = "https://dapi.kakao.com/v2/local/search/keyword.json";
        var params = "?query=" + keyword;

        return fetch(url + params, {
            method: "GET",
            headers: {
                'Authorization': 'KakaoAK ' + apiKey
            }
        })
        .then((res) => res.json());
    }

    this.drawMap = function (tagId) {
        var mapContainer = document.getElementById(tagId), // 지도를 표시할 div 
            mapOption = {
                center: new this.kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
                level: 3 // 지도의 확대 레벨
            };  

        // 지도를 생성합니다    
        this.map = new this.kakao.maps.Map(mapContainer, mapOption); 
        this.circle = new this.kakao.maps.Circle({
                        map: this.map,
                        center : this.map.getCenter(),
                        radius: 1,
                        strokeWeight: 2,
                        strokeColor: '#FF00FF',
                        strokeOpacity: 0,
                        strokeStyle: 'dashed',
                        fillColor: '#00EEEE',
                        fillOpacity: 0
                    });
        this.map.setBounds(this.circle.getBounds());
    }

    this.setCenterBySearchKeyword = function (keyword, radius, entpsCode, entpsCoord) {
        this.destroyMarkers();
        var base = this;
        this.ps.keywordSearch(keyword, function(datas, status, pr) {
            if (status === base.kakao.maps.services.Status.OK) {
                base.map.setCenter(new base.kakao.maps.LatLng(datas[0].y, datas[0].x));
                base.map.setLevel(4);
                base.circle.setMap(null);
                base.circle = new base.kakao.maps.Circle({
                    map: base.map,
                    center : base.map.getCenter(),
                    radius: radius,
                    strokeWeight: 2,
                    strokeColor: '#FF00FF',
                    strokeOpacity: 0.8,
                    strokeStyle: 'dashed',
                    fillColor: '#FF00FF',
                    fillOpacity: 0.1 
                });
                base.map.setBounds(base.circle.getBounds());
                var center = base.map.getCenter();
                for (var i = 0; i < entpsCode.length; i++) {
                    try {
                        var target = new base.kakao.maps.LatLng(entpsCoord[i].Ma, entpsCoord[i].La);
                        var code = entpsCode[i][0];
                        if (base.getDistancebyLatLng(center, target) <= radius) {
                            base.displayMarker(target, entpsCode[i][1], code);
                        }
                    } catch {}
                }
            }
        })

    }

    this.destroyMarkers = function () {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        for (var i = 0; i < this.infowindows.length; i++) {
            this.infowindows[i].close();
        }
        this.selectedNames = [];
        this.selected_entps = [];
        this.infowindows = [];
        this.markers = [];
    }

    this.displayMarker = function (position, title, code) {
        var marker = new this.kakao.maps.Marker({
            map: this.map,
            position: position
        });
        var infowindow = new this.kakao.maps.InfoWindow({
            map: this.map,
            position: position,
            zIndex: 1
        });
        this.selected_entps.push(code);
        this.selectedNames.push(title);
        infowindow.setContent('<div>' + title + '</div>');
        infowindow.open(this.map, marker);
        this.infowindows.push(infowindow);
        this.markers.push(marker);
    }

    this.getDistancebyKeyWord = function (keyword1, keyword2) {
        var pts = [];
        this.ps.keywordSearch(keyword1, function(datas, status, pr) {
            if (status === this.kakao.maps.services.Status.OK) {
                pts.push(new this.kakao.maps.LatLng(datas[0].y, datas[0].x));
                if (pts.length == 2) {
                    var bounds = new this.kakao.maps.LatLngBounds();
                    bounds.extend(pts[0]);
                    bounds.extend(pts[1]);
                    this.map.setBounds(bounds);      
                    this.displayMarker(pts[0], 1);
                    this.displayMarker(pts[1], 2);
                }
            }
        })

        this.ps.keywordSearch(keyword2, function(datas, status, pr) {
            if (status === this.kakao.maps.services.Status.OK) {
                pts.push(new this.kakao.maps.LatLng(datas[0].y, datas[0].x));
                if (pts.length == 2) {
                    this.displayMarker(pts[0], 1);
                    this.displayMarker(pts[1], 2);
                    bounds.extend(pts[0]);
                    bounds.extend(pts[1]);
                    this.map.setBounds(bounds);      
                }
            }
        })
    }

    this.getDistancebyLatLng = function (LatLng1, LatLng2) {
        function deg2rad(deg) {
            return deg * (Math.PI/180)
        }

        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(LatLng2.getLat() - LatLng1.getLat());  // deg2rad below
        var dLon = deg2rad(LatLng2.getLng() - LatLng1.getLng());
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(LatLng1.getLat())) * Math.cos(deg2rad(LatLng2.getLat())) * Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c * 1000; // Distance in meter
        return d; 
    }
}