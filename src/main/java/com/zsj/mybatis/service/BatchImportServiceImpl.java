package com.zsj.mybatis.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

@Component
public class BatchImportServiceImpl {
	String[] keys = { "name", "sex", "birth", "mobile", "mediaSource", "productCode", "policyBeginTime", "supplierName",
			"supplierType", "disTestOrfree", "customerIp", "supplierIp", "userAgent" };

	String userAgent[] = { " Mozilla/5.0 (Windows NT 10.0; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0",
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
			"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36 OPR/46.0.2597.57 Opera/9.27 (Windows NT 5.2; U; zh-cn)",
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063",
			"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; InfoPath.3; rv:11.0) like Gecko",
			"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)",
			"Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0",
			"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)",
			"Mozilla/5.0 (iPhone; CPU iPhone OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B206 Safari/7534.48.3"};

	public String batchImport(String fileName) {
		File uploadfile = new File(fileName);
		// 创建一个目录 （它的路径名由当前 File 对象指定，包括任一必须的父路径。）
		// 新建一个文件
		// File tempFile = new File("d:\\test\\" + new Date().getTime() +
		// ".xlsx");
		// 初始化输入流
		InputStream is = null;
		try {
			// 将上传的文件写入新建的文件中

			// 根据新建的文件实例化输入流
			is = new FileInputStream(uploadfile);

			// 根据版本选择创建Workbook的方式
			Workbook wb = null;
			// 根据文件名判断文件是2003版本还是2007版本
			if (ExcelImportUtils.isExcel2007(fileName)) {
				wb = new XSSFWorkbook(is);
			} else {
				wb = new HSSFWorkbook(is);
			}
			// 根据excel里面的内容读取知识库信息
			readExcelValue(wb);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (is != null) {
				try {
					is.close();
				} catch (IOException e) {
					is = null;
					e.printStackTrace();
				}
			}
		}
		return "导入出错！请检查数据格式！";

	}

	/**
	 * 解析Excel里面的数据
	 * 
	 * @param wb
	 * @return
	 */
	private void readExcelValue(Workbook workbook) {

		// 获取所有的工作表的的数量
		int numOfSheet = workbook.getNumberOfSheets();

		Map map = new HashMap();

		// 遍历这个这些表
		for (int i = 0; i < numOfSheet; i++) {
			// 获取一个sheet也就是一个工作簿
			Sheet sheet = workbook.getSheetAt(i);
			int lastRowNum = sheet.getLastRowNum();
			// 从第一行开始第一行一般是标题
			for (int j = 1; j <= lastRowNum; j++) {
				Row row = sheet.getRow(j);
				for (int n = 0; n < 10; n++) {
					getValueFromExcelEachRow(row, n, keys[n], map);
				}
				putSupplierIp(map);
				putCustomerIp(map);
				putCustomeruserAgent(map);
			}
		}

	}

	private void putCustomeruserAgent(Map map) {
		map.put("userAgent", "");
	}

	private void getValueFromExcelEachRow(Row row, int index, String key, Map map) {
		if (row.getCell(index) != null) {
			row.getCell(index).setCellType(Cell.CELL_TYPE_STRING);
			String value = row.getCell(index).getStringCellValue();
			map.put(key, value);
		}
	}

	private void putSupplierIp(Map map) {
		map.put("supplierIp", "114.67.239.5");
	}

	private void putCustomerIp(Map map) {
		map.put("customerIp", "114.67.239.5");
	}
}
