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

    const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          "First Name": name.split(" ")[0],
          "Last Name": name.split(" ").slice(1).join(" ") || "",
          "Email": email,
          "Phone Number": phone,
          "Years Dancing": level,
          "Role": role,
          "Course(s) of interest": courses
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return { statusCode: 500, body: JSON.stringify({ error: err }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
