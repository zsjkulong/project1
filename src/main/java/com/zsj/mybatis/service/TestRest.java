package com.zsj.mybatis.service;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

@Controller
public class TestRest {

	private static Map<String, String> tokenCache = new HashMap<String, String>();
	private static final Logger logger = LoggerFactory.getLogger(TestRest.class);

	// 应用编码
	private String vUserId = "PA_TEST";

	// 密码（申请应用时生成的）
	private String vUserPassword = "123456";

	// 获取tooken地址(生产地址见文档最后)
	private String openUrl = "http://test-api.pingan.com.cn:20080/oauth/oauth2/access_token";

	// esg转发地址(生产地址见文档最后)
	private String oauthUrl = "http://test-api.pingan.com.cn:20080/open";

	static {
		tokenCache.put("token", "test1");
	}

	@RequestMapping(value = "/testFree/getTestData", method = { RequestMethod.POST, RequestMethod.GET })
	@ResponseBody
	public String test() {
		// JSONObject result = JSON.parseObject(invoke());
		JSONObject result;
		try {

			result = JSONObject.parseObject(invoke());
			String code = result.getString("ret");

			if ("13002".equals(code) || "13012".equals(code)) {
				getAccessToken();
				String body = invoke();
				return body;
			}

			return result.toString();

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return "";

	}

	private String invoke() throws IOException {
		RestTemplate restTemplate = new RestTemplate();
		StringBuffer url = new StringBuffer();
		url.append(this.openUrl + "appsvr/life/donate");
		url.append("?access_token=" + tokenCache.get("token"));
		url.append("&request_id=" + System.currentTimeMillis());
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
		headers.set("Accept", "application/json;charset=UTF-8");
		Map<String, Object> map = new HashMap<String, Object>();
		Map<String, String> map2 = new HashMap<String, String>();
		map2.put("suiteName", "XQ");
		map2.put("exTranCode", "100954");
		map.put("reqHeader", map2);
		map.put("name", "օɽɽ");
		map.put("sex", "M");
		map.put("birth", "1986-07-10");
		map.put("idType", "");
		map.put("idNo", "");
		map.put("cityCode", "3301");
		map.put("mobile", "13162172345");
		map.put("mediaSource", "WY001");
		map.put("comeFrom", "3");
		map.put("activeCode", "3");
		map.put("productCode", "PA000000CXSF-JSWY-01");
		map.put("policyBeginTime", "2016-07-09");
		map.put("flightNo", "");
		map.put("flightTime", "");
		map.put("remark", "wangyi");
		map.put("insurerConAddress", "wangyi");
		map.put("answerOne", "wangyi");
		map.put("answerTwo", "wangyi");
		map.put("childrenBirth", "1980-01-01");
		map.put("childrenName", "wangyi");
		map.put("childrenSex", "F");
		map.put("comeFrom", "wangyi");
		map.put("customerActive", "wangyi");
		map.put("customerType", "wangyi");
		map.put("email", "wangyi@qq.com");
		map.put("insuranceAwareness", "wangyi");
		map.put("isCarOwner", "Y");
		map.put("isPinganCustomer", "Y");
		map.put("questionOne", "wangyi");
		map.put("questionTwo", "wangyi");
		map.put("supplierName", "wangyi");
		map.put("supplierType", "wangyi");
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
			}

		} catch (Exception e) {

		}
	}
}