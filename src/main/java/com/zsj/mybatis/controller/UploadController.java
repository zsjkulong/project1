package com.zsj.mybatis.controller;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.zsj.mybatis.service.BatchImportServiceImpl;

@Controller
public class UploadController {

	@Autowired
	BatchImportServiceImpl batch;
	// @Autowired
	// RestTemplate restTemplate;

	@RequestMapping(value = "/upload")
	// @ResponseBody
	public String upload(@RequestParam("file") MultipartFile file, Model model) {
		if (file.isEmpty()) {
			// return "文件为空";
		}
		// RestTemplate restTemplate = new RestTemplate();
		// 获取文件名
		String fileName = file.getOriginalFilename();
		// logger.info("上传的文件名为：" + fileName);
		// 获取文件的后缀名
		String suffixName = fileName.substring(fileName.lastIndexOf("."));

		// String firstName = fileName.substring(0, fileName.lastIndexOf("."));
		// logger.info("上传的后缀名为：" + suffixName);
		// 文件上传后的路径
		String filePath = "C://test//";
		// 解决中文问题，liunx下中文路径，图片显示问题
		// fileName = UUID.randomUUID() + suffixName;

		// String uploadFileName = firstName +suffixName;
		// System.out.println("filename:" + uploadFileName);

		File dest = new File(filePath + fileName);
		// 检测是否存在目录
		if (!dest.getParentFile().exists()) {
			dest.getParentFile().mkdirs();
		}
		try {
			file.transferTo(dest);
			batch.batchImport(dest);

			// MultiValueMap<String, String> requestEntity = new
			// LinkedMultiValueMap<>();
			// requestEntity.add("file", dest.getAbsolutePath());
			// restTemplate.postForObject("http://localhost:8080/download",
			// requestEntity,
			// String.class);

		} catch (IllegalStateException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		// model.addAttribute("file", dest.getAbsolutePath());

		return "redirect:download?file=" + URLEncoder.encode(dest.getAbsolutePath());
		// return "download";
	}

	// 文件下载
	@RequestMapping(value = "/download", produces = "text/plain;charset=UTF-8")
	public void downloadFile(HttpServletRequest request, HttpServletResponse response,
			@RequestParam("file") String fileName) {
		if (fileName != null) {
			// 当前是从该工程的WEB-INF//File//下获取文件(该目录可以在下面一行代码配置)然后下载到C:\\users\\downloads即本机的默认下载的目录
			// String realPath =
			// request.getServletContext().getRealPath("//WEB-INF//");
			// String realPath = "D://test//";
			File file = new File(fileName);
			if (file.exists()) {
				response.setHeader("content-type", "application/octet-stream");
				response.setContentType("application/octet-stream");
				try {
					String fileres = file.getName().substring(0,file.getName().lastIndexOf(".")) + "_结果"
							+ file.getName().substring(file.getName().lastIndexOf("."), file.getName().length());
					response.setHeader("Content-Disposition",
							"attachment;filename=" + URLEncoder.encode(fileres, "UTF-8"));
				} catch (UnsupportedEncodingException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				byte[] buffer = new byte[1024];
				FileInputStream fis = null;
				BufferedInputStream bis = null;
				try {
					fis = new FileInputStream(file);
					bis = new BufferedInputStream(fis);
					OutputStream os = response.getOutputStream();
					int i = bis.read(buffer);
					while (i != -1) {
						os.write(buffer, 0, i);
						i = bis.read(buffer);
					}

				} catch (Exception e) {
					e.printStackTrace();
				} finally {
					if (bis != null) {
						try {
							bis.close();
						} catch (IOException e) {
							e.printStackTrace();
						}
					}
					if (fis != null) {
						try {
							fis.close();
						} catch (IOException e) {
							e.printStackTrace();
						}
					}
					file.delete();
				}
			}
		}
	}

}
