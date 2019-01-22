package com.zsj.mybatis.controller;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.zsj.mybatis.bean.Demo;
import com.zsj.mybatis.service.DemoService;

@RestController
public class DemoController {
	@Autowired
	private DemoService demoService;

	private HashMap<String, Integer> ipMap = new HashMap<String, Integer>();
	
	private HashMap<String,String> smsCode = new HashMap<String, String>();
	
	@RequestMapping("/save")
	public Map save(@RequestParam(value = "username", required = false) String username,
			@RequestParam(value = "telphone", required = false) String telphone,
			@RequestParam(value = "sex", required = false) String sex,
			@RequestParam(value = "bday", required = false) String bday,
			@RequestParam(value = "email", required = false) String email, HttpServletRequest request) {
		
		Map result = new HashMap();
		if(this.smsCode.get(telphone)==null){
			result.put("ecode", "3");
		} else if(this.smsCode.get(telphone)!=null){
			String codeTime = this.smsCode.get(telphone);
			String sp[] = codeTime.split("@");
			long ec = System.currentTimeMillis() - Long.valueOf(sp[1]);
			if(ec>5*60*1000){
				result.put("ecode", "4");
				this.smsCode.remove(telphone);
			}else{
				if(!sp[0].equals(email)){
					result.put("ecode", "3");
				}
			}
		}
		
		if(result.size()>0){
			return result;
		}
		
		Demo demo = new Demo();
		demo.setBday(bday);
		demo.setSex(sex);
		demo.setTelphone(telphone);
		demo.setUsername(username);
		demo.setEmail(email);
		List<Demo> list = demoService.select(demo);
		// String ip = getRemoteHost(request);
		// System.out.println(ip);

		/*
		 * if(ipMap.get(ip)!=null){ if(ipMap.get(ip)>=5){ result.put("ecode",
		 * "4015"); return result; } ipMap.put(ip, ipMap.get(ip)+1); } else {
		 * ipMap.put(ip, 1); }
		 */

		if (list != null && list.size() > 0) {
			result.put("ecode", "2");
		} else {
			demoService.save(demo);
			result.put("ecode", "0");
		}
		demo = null;
		return result;

	}

	@RequestMapping("/smsCode")
	public Map smsCode(@RequestParam(value = "user_phone", required = true) String user_phone) {
		Map result = new HashMap();
		Demo demo = new Demo();
		demo.setTelphone(user_phone);
		
		String code = getSmsCode();
		long time = System.currentTimeMillis();
		String codeTime = code+"@"+time;
		smsCode.put(user_phone, codeTime);
		
		

		List<Demo> list = demoService.select(demo);
		if (list != null && list.size() > 0) {
			result.put("ecode", "2");
		} else {
			sendPostRequest(user_phone,code);
			result.put("ecode", "0");
		}
		return result;
	}

	@RequestMapping("/select")
	public List<Demo> select(@RequestParam(value = "name", required = false) String name) {
		// PageHelper.startPage(2,1);
		Demo demo = new Demo();
		demo.setUsername(name);
		return demoService.select(demo);
	}

	// @RequestMapping("/login")
	// public String login(HashMap<String, Object> map) {
	// return "/login";
	// }

	// @RequestMapping("/save0")
	// public Demo save0(){
	// Demo demo = new Demo();
	// demo.setName("张三save0");
	// demoService.save0(demo);
	// return demo;
	// }
	public String getSmsCode() {
		String[] beforeShuffle = new String[] { "1", "2", "3", "4", "5", "6", "7", "8", "9" };
		List list = Arrays.asList(beforeShuffle);
		Collections.shuffle(list);
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < list.size(); i++) {
			sb.append(list.get(i));
		}
		String afterShuffle = sb.toString();
		String result = afterShuffle.substring(5, 9);
		System.out.print(result);

		return result;
	}

	public static String sendPostRequest(String phone,String code){
		
		String authorizeUrl = "http://120.79.149.129:7799/sms.aspx";

	    MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
	    params.add("userid", "1469");
	    params.add("account", "chenchen");
	    params.add("password", "123456");
	    params.add("mobile", phone.trim());
	    String asdf = "【中国平安】手机动态码:"+code+",有效期5分钟";
	    params.add("content", asdf);
	    params.add("sendTime", null);
	    params.add("action", "send");
	    params.add("extno", "");
	    
	    

		
		
        RestTemplate client = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        HttpMethod method = HttpMethod.POST;
        // 以表单的方式提交
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        //将请求头部和参数合成一个请求
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);
        //执行HTTP请求，将返回的结构使用ResultVO类格式化
        ResponseEntity<String> response = client.exchange(authorizeUrl, method, requestEntity, String.class);
        System.out.println(response.getBody());
        return response.getBody();
    }

	public String getRemoteHost(javax.servlet.http.HttpServletRequest request) {
		String ip = request.getHeader("x-forwarded-for");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}
		return ip.equals("0:0:0:0:0:0:0:1") ? "127.0.0.1" : ip;
	}
}
