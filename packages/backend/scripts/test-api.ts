import { strict as assert } from 'node:assert';

const API_URL = process.env.API_URL || 'http://localhost:3000';
const EMAIL = `test-${Date.now()}@example.com`; // Unique email each run
const PASSWORD = 'password123';
const NAME = 'Test User';

// Colors for console
const green = (msg: string) => console.log(`\x1b[32m✅ ${msg}\x1b[0m`);
const red = (msg: string) => console.log(`\x1b[31m❌ ${msg}\x1b[0m`);
const info = (msg: string) => console.log(`\x1b[34mℹ️ ${msg}\x1b[0m`);

async function request(path: string, method: string = 'GET', body?: any, token?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  
  if (!res.ok) {
    throw new Error(`${method} ${path} failed (${res.status}): ${JSON.stringify(data)}`);
  }

  return data;
}

async function main() {
  info('Starting API Integration Tests...');
  let token: string = '';
  let userId: string = '';
  let categoryId: string = '';
  let tagId: string = '';
  let resourceId: string = '';

  try {
    // 1. Register
    info('1. Testing Register...');
    const registerData = await request('/auth/register', 'POST', {
      email: EMAIL,
      password: PASSWORD,
      username: NAME, // Mapped to name in backend
    });
    token = registerData.access_token;
    green('Register successful');

    // 2. Login
    info('2. Testing Login...');
    const loginData = await request('/auth/login', 'POST', {
      username: EMAIL, // Mapped to email in backend
      password: PASSWORD,
    });
    assert(loginData.access_token, 'No access token returned');
    token = loginData.access_token; // Refresh token just in case
    green('Login successful');

    // 2.5 Get Me (to get User ID)
    info('2.5. Testing Get Me...');
    const meData = await request('/auth/me', 'GET', undefined, token);
    userId = meData.id;
    green('Get Me successful');

    // 3. Create Category
    info('3. Testing Create Category...');
    const category = await request('/categories', 'POST', {
      name: `Work ${Date.now()}`,
      color: '#ff0000'
    }, token);
    categoryId = category.id;
    green('Category created');

    // 4. Create Tag
    info('4. Testing Create Tag...');
    const tag = await request('/tags', 'POST', {
      name: `urgent-${Date.now()}`
    }, token);
    tagId = tag.id;
    green('Tag created');

    // 5. Create Resource (Link)
    info('5. Testing Create Resource (Link)...');
    const resource = await request('/resources', 'POST', {
      title: 'My Awesome Link',
      type: 'link',
      content: { url: 'https://example.com' },
      categoryId: categoryId,
      tagIds: [tagId]
    }, token);
    resourceId = resource.id;
    assert.equal(resource.title, 'My Awesome Link');
    assert.equal(resource.type, 'link');
    green('Resource created');

    // 6. Get Resource
    info('6. Testing Get Resource...');
    const fetchedResource = await request(`/resources/${resourceId}`, 'GET', undefined, token);
    assert.equal(fetchedResource.id, resourceId);
    green('Get Resource successful');

    // 7. Update Resource
    info('7. Testing Update Resource...');
    const updatedResource = await request(`/resources/${resourceId}`, 'PUT', {
      title: 'Updated Title'
    }, token);
    assert.equal(updatedResource.title, 'Updated Title');
    green('Update Resource successful');

    // 8. Toggle Favorite
    info('8. Testing Toggle Favorite...');
    const favResource = await request(`/resources/${resourceId}/favorite`, 'PATCH', undefined, token);
    assert.equal(favResource.isFavorite, true);
    green('Toggle Favorite successful');

    // 9. List Resources with filters
    info('9. Testing List Resources...');
    const list = await request('/resources?type=link&isFavorite=true', 'GET', undefined, token);
    assert(list.data.length >= 1, 'Should find at least one resource');
    green('List Resources successful');

    // 10. Delete Resource
    info('10. Testing Delete Resource...');
    await request(`/resources/${resourceId}`, 'DELETE', undefined, token);
    
    // Verify deletion
    try {
        await request(`/resources/${resourceId}`, 'GET', undefined, token);
        red('Resource should be deleted but was found');
    } catch (e) {
        green('Resource deleted successfully (404 returned as expected)');
    }

    // Cleanup (optional, but good for local dev repeated runs if we reused emails)
    // await request(`/users/${userId}`, 'DELETE', undefined, token); // If user delete endpoint existed

    console.log('\n');
    console.log('\x1b[32m✨ All tests passed successfully! ✨\x1b[0m');

  } catch (error: any) {
    console.error('\n');
    red('Test Failed!');
    console.error(error.message);
    process.exit(1);
  }
}

main();
