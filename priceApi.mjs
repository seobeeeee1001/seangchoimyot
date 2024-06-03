function priceApiCore() {
    function sleep(ms) {
        const wakeUpTime = Date.now() + ms;
        while (Date.now() < wakeUpTime) {}
      }

    this.apiKey = '***REMOVED***';
    // this.apiKey = '***REMOVED***';
    this.baseUrl = 'http://seangchoimyot.kro.kr:2222/';
    this.getProductInfo = async function (prodId) {
        sleep(35);
        var endpoint = 'getProductInfoSvc.do'

        var reqUrl = this.baseUrl + endpoint;
        var params = "?";
        params += 'serviceKey=' + encodeURIComponent(this.apiKey);
        if (prodId != null) params += "&goodId=" + prodId;

        return fetch(reqUrl + params)
        .then((res) => res.text())
        .then((txt) => new DOMParser().parseFromString(txt, 'application/xml'))
        .then((xml) => xml.getElementsByTagName('item'));
    }

    this.getEntpInfo = async function (entpId) {
        sleep(35);
        var endpoint = 'getStoreInfoSvc.do'
        var reqUrl = this.baseUrl + endpoint;
        var params = "?";
        params += 'serviceKey=' + this.apiKey;
        if (entpId != null) params += "&entpId=" + entpId;

        return fetch(reqUrl + params)
        .then((res) => res.text())
        .then((txt) => new DOMParser().parseFromString(txt, 'application/xml'))
        .then((xml) => xml.getElementsByTagName('iros.openapi.service.vo.entpInfoVO'));
    }

    this.getProductPriceInfo = async function (goodInspectDay, goodId, entpId) {
        sleep(35);
        var endpoint = 'getProductPriceInfoSvc.do'

        var reqUrl = this.baseUrl + endpoint;
        var params = "?";
        params += 'serviceKey=' + this.apiKey;
        if (goodInspectDay != null) params += "&goodInspectDay=" + goodInspectDay;
        if (entpId != null) params += "&entpId=" + entpId;
        if (goodId != null) params += "&goodId=" + goodId;

        return fetch(reqUrl + params)
        .then((res) => res.text())
        .then((txt) => new DOMParser().parseFromString(txt, 'application/xml'))
        .then((xml) => xml.getElementsByTagName('iros.openapi.service.vo.goodPriceVO'));
    }

    this.getRecentProductPrice = async function (goodId, entpId) {
        var targetdate = new Date();
        for (var i = 0; i < 60; i++) {
            var year = targetdate.getFullYear();
            var month = targetdate.getMonth() + 1;
            if (month < 10) {
                month = "0" + month.toString();
            }
            var date = targetdate.getDate().toString();
            if (date < 10) {
                date = "0" + date.toString();
            }
            var dateString = year + month + date;
            var ret = await this.getProductPriceInfo(dateString, goodId, entpId);
            if (ret.length > 0) {
                return Number(ret[0].getElementsByTagName('goodPrice')[0].textContent);
            } else {
                targetdate.setDate(targetdate.getDate() - 1);
            }
        }
    }
}