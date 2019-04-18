
package io.github.source.consul.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class DemoController {


    @RequestMapping(value = "/")
    @ResponseBody
    public String index() {
        return "hello world";
    }

}