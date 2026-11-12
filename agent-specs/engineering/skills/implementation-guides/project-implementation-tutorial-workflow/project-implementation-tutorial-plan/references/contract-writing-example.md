# Concise Contract Documents

Use the following density when writing data and API contracts:

- **Tables:** one purpose sentence, a field table, then constraints and indexes.
- **Endpoints:** method/path, one purpose sentence, request fields and necessary
  request/response examples. Define shared auth, envelopes, pagination and errors
  once for the document; retain any endpoint-specific differences.
- **Extra prose:** only business rules that the tables and examples cannot
  express, such as state transitions, version increments or atomic writes.

Do not restate each field or example in paragraphs, or append generic
architecture explanations, recommendations, checklists or closing summaries.
Preserve required rules and failure semantics; brevity is not missing content.
These fictional excerpts show presentation, not prescribed fields or protocols.

## Table Example

### 正式资质：`organ_qualification`

保存企业的一条正式资质。

| 字段名 | 类型 | 可空 | 作用 |
| --- | --- | --- | --- |
| `id` | bigint | 否 | 主键，自增 |
| `org_id` | char(32) | 否 | 所属企业 ID |
| `name` | varchar(255) | 否 | 资质名称 |
| `grade` | varchar(100) | 是 | 资质评级，未评级时为空 |

约束和索引：

```text
PRIMARY KEY (id)
FOREIGN KEY (org_id) REFERENCES organ(org_id)
INDEX (org_id, id)
```

## API Example

### 新增资质

`POST /api/user/qualifications/create`

在指定企业下创建一条资质；沿用公共认证，要求该企业写权限。

| 请求字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `org_id` | string | 是 | 所属企业 ID |
| `name` | string | 是 | 去除首尾空格后非空，最长255字符 |
| `grade` | string / null | 是 | 最长100字符，未评级传 null |

请求示例：

```json
{
  "org_id": "org-001",
  "name": "建筑工程施工总承包",
  "grade": null
}
```

返回示例（沿用本例项目的公共响应封装）：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "qualification_id": "501"
  }
}
```

失败沿用公共错误约定：无企业访问权按资源不存在处理，有读取权但无写入权返回权限错误；字段不合法返回输入错误。
