package com.zsj.mybatis;

import org.apache.ibatis.jdbc.SQL;

import com.zsj.mybatis.bean.Demo;

public class DemoSqlProvider {
	 /** 
     * 查询语句. 
     * @param demo 
     * @return 
     */  
    public String select5(Demo demo){  
       StringBuffer sql = new StringBuffer("select *from demo where 1=1 ");  
       if(demo.getUsername() != null){  
           sql.append(" and name=#{name}");  
       }  
//       if(demo.getEmail() != null){  
//           sql.append(" and email=#{email}");  
//       }  
       return sql.toString();  
    }  
    
    
    public String select6(final Demo demo){  
        return new SQL(){{  
            SELECT("id,name,email");  
            FROM("demo");  
            if(demo.getUsername() != null){  
               WHERE("name=#{name}");  
            }  
//            if(demo.getEmail() != null){  
//               WHERE("email=#{email}");  
//            }  
        }}.toString();  
     }  
    
    
//    public String save3(final Demo demo){  
//        return new SQL(){{  
//            INSERT_INTO("demo");  
//            //多个写法. 
////            VALUES("name","#{name}");
////            INTO_COLUMNS("name","email");  
////            INTO_VALUES("#{name}","#{email}");  
//             
//            //条件写法.  
//          if(demo.getName() != null){  
//             VALUES("name","#{name}");  
//          }  
////          if(demo.getEmail() != null){  
////             VALUES("email","#{email}");  
////          }  
//             
//        }}.toString();  
//     }  
//    
//    public String update2(final Demo demo){  
//        return new SQL(){{  
//            UPDATE("demo");  
//         
//            //条件写法.  
//            if(demo.getName() != null){  
//               SET("name=#{name}");  
//            }  
////            if(demo.getEmail() != null){  
////               SET("email=#{email}");  
////            }  
//            WHERE("id=#{id}");  
//        }}.toString();  
//     }  
    
    
    /** 
     * @param demo 
     * @return 
     */  
    public String delete2(){  
       return new SQL(){{  
           DELETE_FROM("demo");  
           WHERE("id=#{id}");  
       }}.toString();  
    }  
}
