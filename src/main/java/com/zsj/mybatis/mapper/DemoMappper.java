package com.zsj.mybatis.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.UpdateProvider;

import com.zsj.mybatis.DemoSqlProvider;
import com.zsj.mybatis.bean.Demo;

public interface DemoMappper {
//	@Select("select *from Demo where name = #{name}")
//    public List<Demo> likeName(String name);
   
//    @Select("select *from Demo where id = #{id}")
//    public Demo getById(long id);
//   
//    @Select("select name from Demo where id = #{id}")
//    public String getNameById(long id);
    
    @Insert("insert into master.dbo.[user] (username,telphone,sex,bday,email) values(#{username},#{telphone},#{sex},#{bday},#{email})")  
    @Options(keyProperty="id",keyColumn="id",useGeneratedKeys=true)  
    public long save(Demo demo);  
    
//    @Select(
//    		"  SELECT count(1) from master.dbo.[user]  where username=#{username} and telphone=#{telphone}"
//    		)
    public List<Demo> select(Demo demo);
    
    
//    @SelectProvider(type=DemoSqlProvider.class,method="select5")  
//    public List<Demo> select5(Demo demo);  
//    
//    
//    @InsertProvider(type=DemoSqlProvider.class,method="save3")  
//    @Options(keyProperty="id",keyColumn="id",useGeneratedKeys=true)  
//    public void save3(Demo demo);  
//    
//    
//    @UpdateProvider(type=DemoSqlProvider.class,method="update2")  
//    public int update2(Demo demo);  
//    
//    
//    @UpdateProvider(type=DemoSqlProvider.class,method="delete2")  
//    public int delete2(int id);  
    
    
//    public void save0(Demo demo);
}
