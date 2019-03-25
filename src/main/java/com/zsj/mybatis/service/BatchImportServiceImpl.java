package com.zsj.mybatis.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;

@Component
public class BatchImportServiceImpl {

	@Autowired
	TestRest testRest;

	@Value("${key}")
	String key;

	String[] keys = { "name", "sex", "birth", "mobile", "cityName", "mediaSource", "productCode", "policyBeginTime",
			"supplierName", "supplierType", "disTestOrfree" };

	HashMap<String, String> map = new HashMap<String, String>();

	HashMap<String, String> rateMap = new HashMap<String, String>();

	int i;

	String userAgent[] = { " Mozilla/5.0 (Windows NT 10.0; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0",
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
			"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36 OPR/46.0.2597.57 Opera/9.27 (Windows NT 5.2; U; zh-cn)",
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063",
			"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; InfoPath.3; rv:11.0) like Gecko",
			"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)",
			"Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0",
			"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)",
			"Mozilla/5.0 (iPhone; CPU iPhone OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B206 Safari/7534.48.3" };

	String income[] = { "200101", "200102", "200103", "200104", "200105", "200106", "200107", "200108" };

	String caServingMedia[] = { "300101", "300102", "300103", "300103", "300104", "300105", "300201", "300202",
			"300203", "300204", "300205", "300206", "300207", "300208", "300209", "300210", "300211", "300212",
			"300213", "300214", "300215", "300216", "300217", "300218", "300219", "300301", "300302", "300303",
			"300304", "300305", "300306", "300307", "300308", "300309", "300310", "300311", "300312", "300313",
			"300314", "300315", "300316", "300317", "300318", "300319", "300320", "300321", "300322", "300323",
			"300324", "300325", "300401", "300402", "300403", "300404", "300405", "300406", "300407", "300408",
			"300409", "300410", "300411", "300412", "300413", "300414", "300415", "300416", "300417", "300418",
			"300419", "300420", "300421", "300422", "300423", "300424", "300425", "300426", "300427", "300428",
			"300429", "300430", "300431", "300432", "300501", "300502", "300503", "300504", "300505", "300601",
			"300602", "300603", "300604", "300605", "300606", "300607", "300608", "300609", "300610", "300611",
			"300612", "300613", "300614", "300615", "300616", "300617", "300618", "300619", "300620", "300621",
			"300622", "300623", "300624", "300625", "300626", "300627", "300701", "300702", "300703", "300704",
			"300705", "300706", "300707", "300708", "300709", "300710", "300711", "300712", "300801", "300802",
			"300803", "300804", "300805", "300806", "300807", "300808", "300809", "300810", "300811", "300812",
			"300901", "300902", "300903", "300904", "300905", "300906", "300907", "300908", "300909", "300910",
			"300911", "301001", "301002", "301003", "301004", "301005", "301006", "301007", "301008", "301009",
			"301010", "301101", "301102", "301103", "301104", "301105", "301106", "301107", "301201", "301202",
			"301203", "301301", "301302", "301303", "301304", "301305", "301306", "301307", "301401", "301402",
			"301403", "301404", "301405", "301406", "301501", "301502", "301503", "301504", "301505", "301506",
			"301507", "301508", "301509" };

	String caProductName[] = { "400101", "400102", "400103", "400104", "400201", "400202", "400203", "400204", "400205",
			"400206" };

	String caAsset[] = { "500101", "500102", "500103", "500104", "500105", "500301", "500302", "500303", "500304",
			"500305", "500306" };

	String caOccupation[] = { "600101", "600102", "600103", "600104", "600105", "600106", "600107", "600108" };

	public String batchImport(File uploadfile) {
		// File uploadfile = new File(fileName);
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
			if (ExcelImportUtils.isExcel2007(uploadfile.getName())) {
				wb = new XSSFWorkbook(is);
			} else {
				wb = new HSSFWorkbook(is);
			}
			// 根据excel里面的内容读取知识库信息
			readExcelValue(wb, uploadfile.getAbsolutePath());
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
	private void readExcelValue(Workbook workbook, String filePathName) {

		this.keys = this.key.split(",");

		// 获取所有的工作表的的数量
		int numOfSheet = workbook.getNumberOfSheets();

		Map map = new HashMap();
		int lastCellIndex = 14;
		// 遍历这个这些表
		for (int i = 0; i < 1; i++) {
			// 获取一个sheet也就是一个工作簿
			Sheet sheet = workbook.getSheetAt(i);
			int lastRowNum = sheet.getLastRowNum();
			Row row = sheet.getRow(0);
			Cell newNameCell = row.createCell(row.getLastCellNum(), Cell.CELL_TYPE_STRING);
			newNameCell.setCellValue("供应商ip");
			newNameCell = row.createCell(row.getLastCellNum(), Cell.CELL_TYPE_STRING);
			newNameCell.setCellValue("客户端ip");
			newNameCell = row.createCell(row.getLastCellNum(), Cell.CELL_TYPE_STRING);
			newNameCell.setCellValue("保单号");
			newNameCell = row.createCell(row.getLastCellNum(), Cell.CELL_TYPE_STRING);
			newNameCell.setCellValue("平安返回错误信息");
			newNameCell = row.createCell(row.getLastCellNum(), Cell.CELL_TYPE_STRING);
			newNameCell.setCellValue("客户端浏览器");
			for (int j = 1; j <= lastRowNum; j++) {

				if (j % 10 == 0) {
					this.rateMap.put(filePathName.substring(filePathName.lastIndexOf("\\"), filePathName.length())
							.replace("\\", ""), String.valueOf((((float) j / (float) lastRowNum) * 100)));
				}

				if (j == lastRowNum) {
					this.rateMap.put(filePathName.substring(filePathName.lastIndexOf("\\"), filePathName.length())
							.replace("\\", ""), "100");
				}

				row = sheet.getRow(j);
				for (int n = 0; n < keys.length; n++) {
					getValueFromExcelEachRow(row, n, keys[n], map);
				}
				putSupplierIp(map, row);
				putCustomerIp(map, row);
				putCustomeruserAgent(map, row);
				putcaGuestTime(map, row);
				testRest.test(map);
				// map.put("policyNo", "test");
				// map.put("errMsg","eoo");

				newNameCell = row.createCell(row.getLastCellNum(), Cell.CELL_TYPE_STRING);
				newNameCell.setCellValue((String) map.get("policyNo"));

				newNameCell = row.createCell(row.getLastCellNum(), Cell.CELL_TYPE_STRING);
				newNameCell.setCellValue((String) map.get("errMsg"));

				newNameCell = row.createCell(row.getLastCellNum(), Cell.CELL_TYPE_STRING);
				newNameCell.setCellValue((String) map.get("userAgent"));

			}
		}

		try {
			FileOutputStream excelFileOutPutStream = new FileOutputStream(filePathName);
			workbook.write(excelFileOutPutStream);
			excelFileOutPutStream.flush();
			excelFileOutPutStream.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	private void putCustomeruserAgent(Map map, Row row) {
		Random ran = new Random();
		int index = ran.nextInt(this.userAgent.length);
		map.put("userAgent", this.userAgent[index]);

	}

	private void putcaGuestTime(Map map, Row row) {
		map.put("caGuestTime", System.currentTimeMillis());
		map.put("caIncome", "200106");
		map.put("caServingMedia", "300202");
		map.put("caProductName", "400202");
		map.put("caAsset", "500103");
		map.put("caOccupation", "600104");

	}

	private void getValueFromExcelEachRow(Row row, int index, String key, Map map) {
		row.getCell(index).setCellType(Cell.CELL_TYPE_STRING);
		String value = row.getCell(index).getStringCellValue();
		map.put(key, value);
	}

	private void putSupplierIp(Map map, Row row) {
		map.put("supplierIp", "114.67.239.5");

		Cell newNameCell = row.createCell(row.getLastCellNum(), Cell.CELL_TYPE_STRING);
		newNameCell.setCellValue((String) map.get("supplierIp"));
	}

	private void putCustomerIp(Map map, Row row) {
		String ip = ramdomIp();
		map.put("customerIp", ip);

		Cell newNameCell = row.createCell(row.getLastCellNum(), Cell.CELL_TYPE_STRING);
		newNameCell.setCellValue((String) map.get("customerIp"));
	}

	private String ramdomIp() {
		try {
			Random random = new Random();
			if (map.size() == 0) {
				File file = ResourceUtils.getFile("classpath:templates/ip.txt");
				BufferedReader reder = null;
				try {
					reder = new BufferedReader(new FileReader(file));
					String s = null;
					int len = 0;
					while ((s = reder.readLine()) != null) {
						i = len++;
						String[] ipminmax = s.trim().split("-");
						String ipnode[] = ipminmax[1].split("\\.");
						String ip3 = ipnode[2];
						String ip4 = ipnode[3];
						map.put(i + "_3_max", ip3);
						map.put(i + "_4_max", ip4);
						map.put(i + "_min", ipminmax[0]);
						ipnode = ipminmax[0].split("\\.");
						ip3 = ipnode[2];
						ip4 = ipnode[3];
						map.put(i + "_3_min", ip3);
						map.put(i + "_4_min", ip4);
					}

				} catch (Exception e) {
					e.printStackTrace();
				} finally {
					try {
						reder.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
			String iprank = String.valueOf(random.nextInt(i + 1));

			String realip3 = String.valueOf(random.nextInt(Integer.valueOf((String) map.get(iprank + "_3_max"))));
			String realip4 = String.valueOf(random.nextInt(Integer.valueOf((String) map.get(iprank + "_4_max"))));
			String min = map.get(iprank + "_min");
			// min = ;
			return min.replace("." + map.get(iprank + "_3_min") + ".", "." + realip3 + ".")
					.replace("." + map.get(iprank + "_4_min"), "." + realip4);

		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return "";
	}

	public String getFileRate(String fileName) {
		if (rateMap.get(fileName) == null) {
			return "rate:over";
		}

		if (rateMap.get(fileName).equals("100")) {
			this.rateMap.remove(fileName);
			return "rate:over";
		} else {
			return "rate:" + rateMap.get(fileName);
		}

	}
}
