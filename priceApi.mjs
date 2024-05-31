function priceApiCore() {
    this.apiKey = '***REMOVED***';
    this.baseUrl = 'http://seangchoimyot.kro.kr:4444/';
    this.getProductInfo = async function (prodId) {
        var endpoint = 'getProductInfoSvc.do'

        var reqUrl = this.baseUrl + endpoint;
        var params = "?";
        params += 'serviceKey=' + this.apiKey;
        if (prodId != null) params += "&goodId=" + prodId;

        return fetch(reqUrl + params)
        .then((res) => res.text())
        .then((txt) => new DOMParser().parseFromString(txt, 'application/xml'))
        .then((xml) => xml.getElementsByTagName('item'));
    }

    this.getEntpInfo = async function (entpId) {
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
}