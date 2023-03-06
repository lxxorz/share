# 使用SonarQube进行代码质量检测

---
layout: statement
---
<p class="text-2xl">自动code review工具</p>

<!--SonarQube的定位是一个自动code review的工具，它可以评估我们的代码的质量  -->

---
layout: statement
---

<p class="text-2xl">帮助写出更干净的代码</p>
<!-- SonarQube提倡写干净的代码，所谓的干净的代码就是指可读性高、易于维护和可重用的代码,它可以保证每次新增的代码都是干净，并且通过一些的指标来衡量干净的程度 -->

---
layout: statement
---

### 工作流

1. 提交新的代码
2. 分析代码
3. 决定是否合并到git仓库中

重点针对**新提交的代码**
[![Quality gate](http://192.168.0.7:9000/api/project_badges/quality_gate?project=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde&token=sqb_6ebf17a39c15b882a1d143f7fd214672d40555cd)](http://192.168.0.7:9000/dashboard?id=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde)

---
layout: two-cols
---

### 衡量代码的质量

[![Bugs](http://192.168.0.7:9000/api/project_badges/measure?project=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde&metric=bugs&token=sqb_6ebf17a39c15b882a1d143f7fd214672d40555cd)](http://192.168.0.7:9000/dashboard?id=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde)

[![Code Smells](http://192.168.0.7:9000/api/project_badges/measure?project=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde&metric=code_smells&token=sqb_6ebf17a39c15b882a1d143f7fd214672d40555cd)](http://192.168.0.7:9000/dashboard?id=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde)

[![Coverage](http://192.168.0.7:9000/api/project_badges/measure?project=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde&metric=coverage&token=sqb_6ebf17a39c15b882a1d143f7fd214672d40555cd)](http://192.168.0.7:9000/dashboard?id=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde)

[![Duplicated Lines (%)](http://192.168.0.7:9000/api/project_badges/measure?project=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde&metric=duplicated_lines_density&token=sqb_6ebf17a39c15b882a1d143f7fd214672d40555cd)](http://192.168.0.7:9000/dashboard?id=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde)

[![Lines of Code](http://192.168.0.7:9000/api/project_badges/measure?project=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde&metric=ncloc&token=sqb_6ebf17a39c15b882a1d143f7fd214672d40555cd)](http://192.168.0.7:9000/dashboard?id=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde)

::right::

[![Maintainability Rating](http://192.168.0.7:9000/api/project_badges/measure?project=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde&metric=sqale_rating&token=sqb_6ebf17a39c15b882a1d143f7fd214672d40555cd)](http://192.168.0.7:9000/dashboard?id=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde)

[![Quality Gate Status](http://192.168.0.7:9000/api/project_badges/measure?project=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde&metric=alert_status&token=sqb_6ebf17a39c15b882a1d143f7fd214672d40555cd)](http://192.168.0.7:9000/dashboard?id=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde)

[![Reliability Rating](http://192.168.0.7:9000/api/project_badges/measure?project=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde&metric=reliability_rating&token=sqb_6ebf17a39c15b882a1d143f7fd214672d40555cd)](http://192.168.0.7:9000/dashboard?id=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde)

[![Security Hotspots](http://192.168.0.7:9000/api/project_badges/measure?project=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde&metric=security_hotspots&token=sqb_6ebf17a39c15b882a1d143f7fd214672d40555cd)](http://192.168.0.7:9000/dashboard?id=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde)

[![Technical Debt](http://192.168.0.7:9000/api/project_badges/measure?project=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde&metric=sqale_index&token=sqb_6ebf17a39c15b882a1d143f7fd214672d40555cd)](http://192.168.0.7:9000/dashboard?id=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde)

[![Vulnerabilities](http://192.168.0.7:9000/api/project_badges/measure?project=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde&metric=vulnerabilities&token=sqb_6ebf17a39c15b882a1d143f7fd214672d40555cd)](http://192.168.0.7:9000/dashboard?id=moon9sky_generalsystemfe_AYYwDkM0gYnAI6NWlEde)

<!-- sonarqube提供了一系列的指标来衡量代码的质量，如图所示，是通用系统的一些相关的指标，包括了已知的bug数量，代码当中不当的地方，覆盖率，重复的行数，可维护性，可靠性，安全性等维度 -->

---
layout: statement
---

SonarQube 包括两种复杂度模型来衡量代码

---
layout: two-cols
---

### 圈复杂度

圈复杂度是根据控制流计算的，
当出现分支的时候，复杂度就会增加

::right::

### 认知复杂度

认知复杂度是Sonar的独有的复杂度模型，将圈复杂度的先例与人类评估相结合。它产生的方法复杂度分数与开发人员感知到的可维护性非常相符 其计算方法在[认知复杂度的白皮书中](https://www.sonarsource.com/resources/cognitive-complexity/)

---

### 开发文档
1. https://docs.sonarqube.org/latest/user-guide/metric-definitions/
