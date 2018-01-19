package com.zsj.mybatis.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zsj.mybatis.bean.Demo;
import com.zsj.mybatis.service.DemoService;

@RestController
public class DemoController {
	@Autowired
	private DemoService demoService;
	
	private HashMap<String,Integer> ipMap = new HashMap<String,Integer>();

	@RequestMapping("/save")
	public Map save(
			@RequestParam(value = "username", required = false) String username,
			@RequestParam(value = "telphone", required = false) String telphone,
			@RequestParam(value = "sex", required = false) String sex,
			@RequestParam(value = "bday", required = false) String bday,
			@RequestParam(value = "email", required = false) String email,HttpServletRequest request) {
		Map result = new HashMap();
		Demo demo = new Demo();
		demo.setBday(bday);
		demo.setSex(sex);
		demo.setTelphone(telphone);
		demo.setUsername(username);
		demo.setEmail(email);
		List<Demo> list = demoService.select(demo);
//		String ip = getRemoteHost(request);
//		System.out.println(ip);
		
		/*if(ipMap.get(ip)!=null){
			if(ipMap.get(ip)>=5){
				result.put("ecode", "4015");
				return result;
			}
			ipMap.put(ip, ipMap.get(ip)+1);
		} else {
			ipMap.put(ip, 1);
		}*/
		
		if(list!=null && list.size()>0){
			result.put("ecode", "2");
		} else {
			demoService.save(demo);
			result.put("ecode", "0");
		}
		demo = null;
		return result;
		
		
	}

	@RequestMapping("/smsCode")
	public Map smsCode(@RequestParam(value = "user_phone", required = true) String user_phone){
		Map result = new HashMap();
		Demo demo = new Demo();
		demo.setTelphone(user_phone);
		
		
		List<Demo> list =demoService.select(demo);
		if(list!=null && list.size()>0){
			result.put("ecode", "2");
		} else {
			//TODO  调用短信接口。
			result.put("ecode", "0");
		}
		return result;
	}
	
	@RequestMapping("/select")
	public List<Demo> select(
			@RequestParam(value = "name", required = false) String name) {
		// PageHelper.startPage(2,1);
		Demo demo = new Demo();
		demo.setUsername(name);
		return demoService.select(demo);
	}

//	@RequestMapping("/login")
//	public String login(HashMap<String, Object> map) {
//		return "/login";
//	}

	// @RequestMapping("/save0")
	// public Demo save0(){
	// Demo demo = new Demo();
	// demo.setName("张三save0");
	// demoService.save0(demo);
	// return demo;
	// }
	
	public String getRemoteHost(javax.servlet.http.HttpServletRequest request){
	    String ip = request.getHeader("x-forwarded-for");
	    if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)){
	        ip = request.getHeader("Proxy-Client-IP");
	    }
	    if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)){
	        ip = request.getHeader("WL-Proxy-Client-IP");
	    }
	    if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)){
	        ip = request.getRemoteAddr();
	    }
	    return ip.equals("0:0:0:0:0:0:0:1")?"127.0.0.1":ip;
	}
}
