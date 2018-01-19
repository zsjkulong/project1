package com.zsj.mybatis.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zsj.mybatis.bean.Demo;
import com.zsj.mybatis.mapper.DemoMappper;

@Service
public class DemoService {
    @Autowired
    private DemoMappper demoMappper;
   
//    public List<Demo> likeName(String name){
//        return demoMappper.likeName(name);
//    }
    
    public void save(Demo demo){
    	demoMappper.save(demo);
    }
    
    public List<Demo> select(Demo demo){
    	return demoMappper.select(demo);
    }
//    @Transactional 
//    public void save0(Demo demo){
//    	demoMappper.save0(demo);  
//    }
}
