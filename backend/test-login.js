async function testLogin() {
  const payload = {
    email: 'michealjohnsonraj@gmail.com',
    password: 'Micheal@13'
  };

  try {
    console.log('Attempting login with:', payload);
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Login successful! Token received:', data.token ? 'YES' : 'NO');
    } else {
      console.error('Login failed:', data.error);
    }
  } catch (err) {
    console.error('Network error. Is the backend running on port 5000?', err.message);
  }
}

testLogin();
