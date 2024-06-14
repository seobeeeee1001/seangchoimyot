import psycopg2
import requests
import xml.etree.ElementTree as ET
from datetime import date
from privateDatas import SERVICE_KEY, dbConnectionInfo
class dbController:
    def __init__(self):
        self.SERVICE_KEY = SERVICE_KEY  # 서비스 키 정의
        self.db = psycopg2.connect(
            host=dbConnectionInfo.host,
            dbname=dbConnectionInfo.dbname,
            user=dbConnectionInfo.user,
            password=dbConnectionInfo.password,
            port=5432
        )
        self.cursor = self.db.cursor()

    def execute(self, sql):
        self.cursor.execute(sql)
        ret = self.cursor.fetchall()
        return ret

    def commit(self):
        self.db.commit()
    
    def convertDate2Str(dt: date):
        return dt.strftime("%Y-%m-%d")

    def getPriceData(self, startDay, endDay, entpId, goodId):
        self.cursor.execute(f'''
            select * from prices where 
            (조사일 between '{startDay}' and '{endDay}')
            and goodId = {goodId}
            and entpId = {entpId}
            order by 조사일 desc
        ''')
        res = self.cursor.fetchall()
        res = [[x[0].strftime("%Y-%m-%d"), x[1], x[2], x[3]] for x in res]
        return res

    def getExternalPriceData(self, goodInspectDay, entpId):
        url = f"http://openapi.price.go.kr/openApiImpl/ProductPriceInfoService/getProductPriceInfoSvc.do"
        params = {
            'goodInspectDay': goodInspectDay,
            'entpId': entpId,
            'ServiceKey': self.SERVICE_KEY
        }
        response = requests.get(url, params=params)
        if response.status_code == 200:
            xml_root = ET.fromstring(response.content)
            prices = []
            for item in xml_root.findall('.//iros.openapi.service.vo.goodPriceVO'):
                goodprice = item.find('goodPrice').text
                entpId = item.find('entpId').text
                goodId = item.find('goodId').text
                prices.append([goodprice, goodId, entpId])
            return prices
        else:
            raise Exception(f"API request failed with status code {response.status_code}")

    def updatePriceData(self, goodInspectDay, entpId):
        try:
            prices = self.getExternalPriceData(goodInspectDay, entpId)
            for goodprice, goodId, entpId in prices:
                # 데이터 삽입
                self.cursor.execute('''
                    INSERT INTO public.prices (조사일, 판매가격, goodid, entpid)
                    VALUES (%s, %s, %s, %s)
                ''', (str(goodInspectDay), goodprice, goodId, entpId))
            self.commit()
            return "Data updated successfully"
        except Exception as e:
            return str(e)

    def getAllGoodsData(self):
        try:
            self.cursor.execute('SELECT * FROM public.goods')
            res = self.cursor.fetchall()
            goods_data = []
            for row in res:
                good = {
                    'goodid': row[0],
                    'goodnm': row[1],
                    'cat1': row[2],
                    'cat2': row[3],
                    'cat3': row[4],
                    'imagepath': row[5]
                }
                goods_data.append(good)
            return goods_data
        except Exception as e:
            return str(e)

    def getAllEntpsData(self):
        try:
            self.cursor.execute('SELECT * FROM public.entps')
            res = self.cursor.fetchall()
            datas = []
            for row in res:
                entp = {
                    'entpid': row[0],
                    'entpnm': row[1]
                }
                datas.append(entp)
            return datas
        except Exception as e:
            return str(e)