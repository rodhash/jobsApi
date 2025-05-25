# vars.env

# Previous: ~/repos/coding/Node/JSmilga/sec6/task-manager/api.hurl

# ---- sec9
# Current: ~/repos/coding/Node/JSmilga/sec9/jobsApi/api.hurl

# POST {{AUTH}}/register
#
# POST http://localhost:3000/api/v1/auth/register
#
# GET http://localhost:3000/api/v1/jobs/
#
# POST http://localhost:3000/api/v1/jobs/


# --------
# John
# --------
# John - Register User
POST {{AUTH}}/register
Content-Type: application/json
{
  "name": "John",
  "email": "john@gmail.com",
  "password": "secret"
}

# John - Login only
POST {{AUTH}}/login
Content-Type: application/json
{
  "email": "john@gmail.com",
  "password": "secret"
}


# John - Login + Save token
POST {{AUTH}}/login
Content-Type: application/json
{
  "email": "john@gmail.com",
  "password": "secret"
}
HTTP 200
[Captures]
JohnToken: jsonpath "$.token"

# John - Create a Job
POST {{JOBS}}
Authorization: Bearer {{JohnToken}}
Content-Type: application/json
{
  "company": "kyy",
  "position": "testing xss protection"
}



# John - Create a malicious Job
POST {{JOBS}}
Authorization: Bearer {{JohnToken}}
Content-Type: application/json
{
  "company": "<script>alert('XSS_boooooy!');</script>",
  "position": "testing xss protection"
}


# John - Get all jobs
GET {{JOBS}}
Authorization: Bearer {{JohnToken}}


# John - Get a single job
GET {{JOBS}}/683332774d54fd35c3ea6f0b
Authorization: Bearer {{JohnToken}}
# Authorization: Bearer {{AnnToken}}


# John - Update a job
PATCH {{JOBS}}/68323c7764372a6e1068e022
Authorization: Bearer {{JohnToken}}
{
  "company": "foobarbaz",
  "position": "full stack"
}


# John - Delete a job
DELETE {{JOBS}}/683331ee82a232ebbae651a6
Authorization: Bearer {{JohnToken}}




# --------
# Ann
# --------
# Ann - Register User
POST {{AUTH}}/register
Content-Type: application/json
{
  "name": "Ann",
  "email": "ann@gmail.com",
  "password": "secret"
}


# Ann - Login only
POST {{AUTH}}/login
Content-Type: application/json
{
  "email": "ann@gmail.com",
  "password": "secret"
}


# Ann - Login + Save token
POST {{AUTH}}/login
Content-Type: application/json
{
  "email": "ann@gmail.com",
  "password": "secret"
}
HTTP 200
[Captures]
AnnToken: jsonpath "$.token"


# Ann - Get all jobs
GET {{JOBS}}
Authorization: Bearer {{AnnToken}}


