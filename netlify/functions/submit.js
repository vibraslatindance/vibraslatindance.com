const https = require('https');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = 'appd1EijhJ4hdfrwF';
  const tableId = 'tblJsdXUHzXdzmYq6';

  try {
    const data = JSON.parse(event.body);
    const { name, email, phone, level, role, courses } = data;

    const payload = JSON.stringify({
      fields: {
        "First Name": name.split(" ")[0],
        "Last Name": name.split(" ").slice(1).join(" ") || "",
        "Email": email,
        "Phone Number": phone,
        "Years Dancing": level,
        "Role": role,
        "Course(s) of interest": courses
      }
    });

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.airtable.com',
        path: `/v0/${baseId}/${tableId}`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body }));
      });

      req.on('error', reject);
      req.write(payload);
      req.end();
    });

    if (result.status !== 200 && result.status !== 201) {
      return { statusCode: 500, body: JSON.stringify({ error: result.body }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
