package com.zsj.mybatis.controller;

import java.util.HashMap;
import java.util.List;

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

	

	@RequestMapping("/save")
	public void save(@RequestParam(value="username",required=false) String username,@RequestParam(value="telphone",required=false) String telphone,@RequestParam(value="sex",required=false) String sex,@RequestParam(value="bday",required=false) String bday,@RequestParam(value="email",required=false) String email) {
		Demo demo = new Demo(); 
		demo.setBday(bday);
		demo.setSex(sex);
		demo.setTelphone(telphone);
		demo.setUsername(username);
		demo.setEmail(email);
		demoService.save(demo);
	}
	
	@RequestMapping("/select")
	public List<Demo> select(@RequestParam(value="name",required=false) String name) {
		// PageHelper.startPage(2,1);
		Demo demo = new Demo();
		demo.setUsername(name);
		return demoService.select(demo);
	}
	
	@RequestMapping("/login")  
  public String login(HashMap<String,Object> map){  
     return "/login";  
  }  
	
	
//	@RequestMapping("/save0")  
//    public Demo save0(){  
//       Demo demo = new Demo();  
//       demo.setName("张三save0");  
//       demoService.save0(demo);  
//       return demo;  
//    }  
}
