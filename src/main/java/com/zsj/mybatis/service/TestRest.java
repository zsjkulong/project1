package com.zsj.mybatis.service;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

import org.apache.poi.ss.usermodel.Row;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

@Service
public class TestRest {

	private static Map<String, String> tokenCache = new HashMap<String, String>();
	private static final Logger logger = LoggerFactory.getLogger(TestRest.class);

	// 应用编码
	@Value("${clientid}")
	private String vUserId = "P_MZKJ_DALIBAO20190325";
//	life_free_network_new

	// 密码（申请应用时生成的）
//	private String vUserPassword = "2f3F4WnJ";
	
	@Value("${userpassword}")
	private String vUserPassword ="123456";

	// 获取tooken地址(生产地址见文档最后)
	@Value("${pinganurl}")
	private String openUrl = "http://api.pingan.com.cn/open";

	// esg转发地址(生产地址见文档最后)
	@Value("${pinganoauthurl}")
	private String oauthUrl = "http://api.pingan.com.cn/oauth/oauth2/";

	private static Map<String, String> codeMap = new HashMap<String, String>();

	static {
		codeMap.put("01" + "001", "解析报文出错");
		codeMap.put("02" + "001", "传入的产品编码在平安产品库中校验不存在");
		codeMap.put("02" + "002", "姓名传入了空");
		codeMap.put("02" + "003", "姓名超过最大长度");
		codeMap.put("02" + "004", "姓名包含空格，校验出错");
		codeMap.put("02" + "005", "性别为空");
		codeMap.put("02" + "006", "性别校验出错，格式不对（男M，女F）");
		codeMap.put("02" + "007", "出生日期为空");
		codeMap.put("02" + "008", "出生日期格式不正确");
		codeMap.put("02" + "013", "手机号为空");
		codeMap.put("02" + "014", "手机号格式不正确");
		codeMap.put("02" + "015", "媒体来源为空");
		codeMap.put("02" + "016", "媒体来源超过最大长度");
		codeMap.put("02" + "017", "保险起期为空");
		codeMap.put("02" + "018", "保险起期格式不正确");
		codeMap.put("02" + "019", "保险起期小于当前日期");
		codeMap.put("03" + "001", "匹配产品信息出错，需查看传的媒体来源是否正确");
		codeMap.put("07" + "001", "产品信息校验通过，承保失败");
		codeMap.put("08" + "001", "名单信息在黑名单中，不符合投保要求");
		codeMap.put("08" + "002", "该手机号在一年之内已领取免费险");
		codeMap.put("09" + "001", "平安系统出错，可联系平安开发查看该错误类型");
		codeMap.put("10" + "001", "平安系统出错，可联系平安开发查看该错误类型");
		codeMap.put("02" + "038", "出生日期大于今天");
		codeMap.put("02" + "039", "年龄不在0-100之间");
		codeMap.put("02" + "037", "供应商名称不能为空");
		codeMap.put("02" + "025", "供应商名称超过最大长度");
		codeMap.put("02" + "026", "供应商类别不能为空");
		codeMap.put("02" + "027", "供应商类型超过最大长度");
		codeMap.put("02" + "028", "区分是测保还是赠险不能为空");
		codeMap.put("02" + "032", "值不为”1”或”2”");
		codeMap.put("02" + "030", "赠险领取客户的访问IP不能为空");
		codeMap.put("02" + "031", "赠险领取客户的访问IP格式不正确");
		codeMap.put("11" + "14", "赠险量超过每月/每日最多限制数（前端返回的）具体见邵云需求：邵云_PA18_赠险获客增加可用名单量控制");
		codeMap.put("11" + "011", "媒体来源不在白名单内，请联系业务申请白名单");
		codeMap.put("11" + "013", "媒体来源在后台管理系统没有配置，或者每天赠险名单量达到上限");
		codeMap.put("11" + "012", "黑名单校验未通过");
		codeMap.put("02" + "040", "客户收入格式不对");
		codeMap.put("02" + "041", "获客媒体格式不对");
		codeMap.put("02" + "042", "赠险名称或测保产品名称格式不对");
		codeMap.put("02" + "043", "金额格式不对");
		codeMap.put("02" + "044", "客户职业格式不对");
	}

	// @RequestMapping(value = "/testFree/getTestData", method = {
	// RequestMethod.POST, RequestMethod.GET })
	// @ResponseBody
	public String test(Map map) {
		// JSONObject result = JSON.parseObject(invoke());
		JSONObject result;
		try {
			if (tokenCache.size() == 0) {
				getAccessToken();
			}
			result = JSONObject.parseObject(invoke(map));
			logger.info("result:" + result);

			// String code = result.getString("ret");
			//
			// if ("13002".equals(code) || "13012".equals(code)) {
			//
			// String body = invoke(map);
			// return body;
			// }
			// result = JSONObject.parseObject(
			// "{
			// \"ret\":\"0\",\"msg\":\"\",\"requestId\":\"1467018633163\",\"data\":{\"errMsg\":\"idTypeisnull\",\"errCode\":\"005\",\"resultCode\":\"02\"}}");

			// result = JSONObject.parseObject(
			// "{
			// \"ret\":\"0\",\"msg\":\"\",\"requestId\":\"1466998590645\",\"data\":{\"requestId\":\"363B3A04C23549CBE05400144F269649\",\"errMsg\":\"ok\",\"errCode\":null,\"resultCode\":\"0\",\"policyNo\":\"P420000001882201\"}}");
			Map res = (Map) result.get("data");
			String code = (String) res.get("resultCode");
			String policyNo = null;
			String errCode = null;
			String errMsg = (String) res.get("errMsg");
			if ("0".equals(code)) {
				policyNo = (String) res.get("policyNo");
			} else if (!"0".equals(code) && code != null) {
				errCode = (String) res.get("errCode");

				errMsg = (String) res.get("errMsg");
			}
			if (map.get("disTestOrfree").equals("1")) {
				if (StringUtils.isEmpty(policyNo)) {
					map.put("errMsg", codeMap.get(code + errCode) == null ? errMsg : codeMap.get(code + errCode));
				} else {
					map.put("errMsg", "0");
				}
			} else {
				if (StringUtils.isEmpty(policyNo)) {
					map.put("errMsg", codeMap.get(code + errCode) == null ? errMsg : codeMap.get(code + errCode));
				} else {
					map.put("errMsg", "ok");
					map.put("policyNo", policyNo);
				}
			}

			return result.toString();

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// map.clear();
		return "";

	}

	private String invoke(Map map) throws IOException {
		RestTemplate restTemplate = new RestTemplate();
		StringBuffer url = new StringBuffer();
		url.append(this.openUrl + "/appsvr/life/donateNew");
		url.append("?access_token=" + tokenCache.get("token"));
		url.append("&request_id=" + System.currentTimeMillis());
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
		headers.set("Accept", "application/json;charset=UTF-8");
		// Map<String, Object> map = new HashMap<String, Object>();
		Map<String, String> map2 = new HashMap<String, String>();
		map2.put("suiteName", "XQ");
		map2.put("exTranCode", "100954");
		map.put("reqHeader", map2);
		// map.put("name", "օɽɽ");
		// map.put("sex", "M");
		// map.put("birth", "1986-07-10");
		// map.put("idType", "");
		// map.put("idNo", "");
		// map.put("cityCode", "3301");
		// map.put("mobile", "13162172345");
		// map.put("mediaSource", "WY001");
		// map.put("comeFrom", "3");
		// map.put("activeCode", "3");
		// map.put("productCode", "PA000000CXSF-JSWY-01");
		// map.put("policyBeginTime", "2016-07-09");
		// map.put("flightNo", "");
		// map.put("flightTime", "");
		// map.put("remark", "wangyi");
		// map.put("insurerConAddress", "wangyi");
		// map.put("answerOne", "wangyi");
		// map.put("answerTwo", "wangyi");
		// map.put("childrenBirth", "1980-01-01");
		// map.put("childrenName", "wangyi");
		// map.put("childrenSex", "F");
		// map.put("comeFrom", "wangyi");
		// map.put("customerActive", "wangyi");
		// map.put("customerType", "wangyi");
		// map.put("email", "wangyi@qq.com");
		// map.put("insuranceAwareness", "wangyi");
		// map.put("isCarOwner", "Y");
		// map.put("isPinganCustomer", "Y");
		// map.put("questionOne", "wangyi");
		// map.put("questionTwo", "wangyi");
		// map.put("supplierName", "wangyi");
		// map.put("supplierType", "wangyi");
		String reqPara = JSON.toJSONString(map);

		HttpEntity<byte[]> requestEntity = new HttpEntity<byte[]>(reqPara.getBytes("UTF-8"), headers);

		ResponseEntity<String> exchange = restTemplate.exchange(url.toString(), HttpMethod.POST, requestEntity,
				String.class);

		return exchange.getBody();

	}

	private void getAccessToken() {
		RestTemplate restTemplate = new RestTemplate();
		StringBuffer url = new StringBuffer();
		url.append(this.oauthUrl + "/access_token");
		url.append("?client_id=" + this.vUserId);
		url.append("&grant_type=client_credentials");
		url.append("&client_secret=" + this.vUserPassword);
		logger.info("getAccessToken()+" + url);
		String tokenResult = restTemplate.getForObject(url.toString(), String.class);
		if (tokenResult == null || "".equals(tokenResult)) {
			return;
		}
		logger.info("get new token INFO:" + tokenResult);
		JSONObject result;
		String token = "";
		try {
			result = JSONObject.parseObject(tokenResult);
			if (result.getString("data") == null) {

				return;
			} else {
				token = result.getJSONObject("data").getString("access_token");
				this.tokenCache.put("token", token);
			}

		} catch (Exception e) {

		}
	}
}